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
        // Get Supabase credentials
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Simple decryption using base64
        const decryptValue = (value: string) => {
            return atob(value);
        };

        // Fetch API key from settings
        const apiKeyResponse = await fetch(
            `${supabaseUrl}/rest/v1/sync_settings?setting_key=eq.google_drive_api_key`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            }
        );

        const apiKeyData = await apiKeyResponse.json();
        if (!apiKeyData || apiKeyData.length === 0) {
            throw new Error('Google Drive API key not configured');
        }

        const apiKey = decryptValue(apiKeyData[0].setting_value);

        // Fetch folder ID from settings
        const folderIdResponse = await fetch(
            `${supabaseUrl}/rest/v1/sync_settings?setting_key=eq.google_drive_folder_id`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            }
        );

        const folderIdData = await folderIdResponse.json();
        if (!folderIdData || folderIdData.length === 0) {
            throw new Error('Google Drive folder ID not configured');
        }

        const folderId = decryptValue(folderIdData[0].setting_value);

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
                sync_type: 'google_drive_cron',
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
                message: 'Google Drive cron sync completed successfully',
                itemsSynced: syncedItems.length,
                totalFiles: files.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Google Drive cron sync error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'GOOGLE_DRIVE_CRON_SYNC_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
