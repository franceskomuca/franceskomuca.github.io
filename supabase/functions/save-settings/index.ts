Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { googleDriveApiKey, googleDriveFolderId, youtubeApiKey, youtubeChannelId, youtubePlaylistId } = await req.json();

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Simple encryption using base64 (in production, use proper encryption)
        const encryptValue = (value: string) => {
            return btoa(value);
        };

        const settings = [];

        // Save Google Drive settings if provided
        if (googleDriveApiKey) {
            settings.push({
                key: 'google_drive_api_key',
                value: encryptValue(googleDriveApiKey)
            });
        }
        if (googleDriveFolderId) {
            settings.push({
                key: 'google_drive_folder_id',
                value: encryptValue(googleDriveFolderId)
            });
        }

        // Save YouTube settings if provided
        if (youtubeApiKey) {
            settings.push({
                key: 'youtube_api_key',
                value: encryptValue(youtubeApiKey)
            });
        }
        if (youtubeChannelId) {
            settings.push({
                key: 'youtube_channel_id',
                value: encryptValue(youtubeChannelId)
            });
        }
        if (youtubePlaylistId) {
            settings.push({
                key: 'youtube_playlist_id',
                value: encryptValue(youtubePlaylistId)
            });
        }

        // Upsert each setting
        for (const setting of settings) {
            // Check if setting exists
            const checkResponse = await fetch(
                `${supabaseUrl}/rest/v1/sync_settings?setting_key=eq.${setting.key}`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                    }
                }
            );

            const existingSettings = await checkResponse.json();

            if (existingSettings.length > 0) {
                // Update existing setting
                await fetch(
                    `${supabaseUrl}/rest/v1/sync_settings?setting_key=eq.${setting.key}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            setting_value: setting.value,
                            updated_at: new Date().toISOString()
                        })
                    }
                );
            } else {
                // Insert new setting
                await fetch(`${supabaseUrl}/rest/v1/sync_settings`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        setting_key: setting.key,
                        setting_value: setting.value,
                        is_encrypted: true
                    })
                });
            }
        }

        return new Response(JSON.stringify({
            data: {
                message: 'Settings saved successfully',
                settingsCount: settings.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Save settings error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'SAVE_SETTINGS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
