Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { folderId, apiKey } = await req.json();

        if (!apiKey) {
            throw new Error('Google Drive API key is required');
        }

        if (!folderId) {
            throw new Error('Google Drive folder ID is required');
        }

        // Get Supabase credentials
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Log sync start
        const logResponse = await fetch(`${supabaseUrl}/rest/v1/content_sync_log`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                sync_type: 'google_drive',
                status: 'in_progress'
            })
        });

        const logData = await logResponse.json();
        const logId = logData[0]?.id;

        // Fetch files from Google Drive
        const driveUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,thumbnailLink,webViewLink,createdTime,mimeType,size)&pageSize=100`;
        
        const driveResponse = await fetch(driveUrl);
        
        if (!driveResponse.ok) {
            const errorText = await driveResponse.text();
            throw new Error(`Google Drive API error: ${errorText}`);
        }

        const driveData = await driveResponse.json();
        const files = driveData.files || [];

        // Insert or update photos in database
        const syncedItems = [];
        for (const file of files) {
            // Check if photo already exists
            const checkResponse = await fetch(
                `${supabaseUrl}/rest/v1/photography?file_id=eq.${file.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                    }
                }
            );

            const existingPhotos = await checkResponse.json();

            if (existingPhotos.length > 0) {
                // Update existing photo
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/photography?file_id=eq.${file.id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            title: file.name,
                            thumbnail_url: file.thumbnailLink,
                            drive_url: file.webViewLink,
                            metadata: {
                                mimeType: file.mimeType,
                                size: file.size,
                                createdTime: file.createdTime
                            }
                        })
                    }
                );

                if (updateResponse.ok) {
                    syncedItems.push(await updateResponse.json());
                }
            } else {
                // Insert new photo
                const insertResponse = await fetch(`${supabaseUrl}/rest/v1/photography`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        file_id: file.id,
                        title: file.name,
                        thumbnail_url: file.thumbnailLink,
                        drive_url: file.webViewLink,
                        category: 'general',
                        metadata: {
                            mimeType: file.mimeType,
                            size: file.size,
                            createdTime: file.createdTime
                        }
                    })
                });

                if (insertResponse.ok) {
                    syncedItems.push(await insertResponse.json());
                }
            }
        }

        // Update sync log
        if (logId) {
            await fetch(`${supabaseUrl}/rest/v1/content_sync_log?id=eq.${logId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'completed',
                    items_synced: syncedItems.length,
                    last_sync: new Date().toISOString()
                })
            });
        }

        return new Response(JSON.stringify({
            data: {
                message: 'Google Drive sync completed successfully',
                itemsSynced: syncedItems.length,
                totalFiles: files.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Google Drive sync error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'GOOGLE_DRIVE_SYNC_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
