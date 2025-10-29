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
        const { channelId, apiKey, playlistId } = await req.json();

        if (!apiKey) {
            throw new Error('YouTube API key is required');
        }

        if (!channelId && !playlistId) {
            throw new Error('Either YouTube channel ID or playlist ID is required');
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
                sync_type: 'youtube',
                status: 'in_progress'
            })
        });

        const logData = await logResponse.json();
        const logId = logData[0]?.id;

        let videos = [];

        if (playlistId) {
            // Fetch videos from specific playlist
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
            
            const playlistResponse = await fetch(playlistUrl);
            
            if (!playlistResponse.ok) {
                const errorText = await playlistResponse.text();
                throw new Error(`YouTube API error: ${errorText}`);
            }

            const playlistData = await playlistResponse.json();
            
            // Get video details for duration
            const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
            const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
            
            const detailsResponse = await fetch(videoDetailsUrl);
            const detailsData = await detailsResponse.json();
            
            videos = detailsData.items || [];
        } else if (channelId) {
            // First get the uploads playlist ID
            const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
            
            const channelResponse = await fetch(channelUrl);
            
            if (!channelResponse.ok) {
                const errorText = await channelResponse.text();
                throw new Error(`YouTube API error: ${errorText}`);
            }

            const channelData = await channelResponse.json();
            const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

            if (!uploadsPlaylistId) {
                throw new Error('Could not find uploads playlist for channel');
            }

            // Fetch videos from uploads playlist
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;
            
            const playlistResponse = await fetch(playlistUrl);
            const playlistData = await playlistResponse.json();
            
            // Get video details
            const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
            const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
            
            const detailsResponse = await fetch(videoDetailsUrl);
            const detailsData = await detailsResponse.json();
            
            videos = detailsData.items || [];
        }

        // Insert or update videos in database
        const syncedItems = [];
        for (const video of videos) {
            const videoId = video.id;
            const snippet = video.snippet;
            const contentDetails = video.contentDetails;
            const statistics = video.statistics;

            // Check if video already exists
            const checkResponse = await fetch(
                `${supabaseUrl}/rest/v1/videography?youtube_id=eq.${videoId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                    }
                }
            );

            const existingVideos = await checkResponse.json();

            const videoData = {
                title: snippet.title,
                description: snippet.description,
                thumbnail_url: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
                published_at: snippet.publishedAt,
                duration: contentDetails.duration,
                view_count: parseInt(statistics?.viewCount || '0'),
                category: 'general'
            };

            if (existingVideos.length > 0) {
                // Update existing video
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/videography?youtube_id=eq.${videoId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(videoData)
                    }
                );

                if (updateResponse.ok) {
                    syncedItems.push(await updateResponse.json());
                }
            } else {
                // Insert new video
                const insertResponse = await fetch(`${supabaseUrl}/rest/v1/videography`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        youtube_id: videoId,
                        ...videoData
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
                message: 'YouTube sync completed successfully',
                itemsSynced: syncedItems.length,
                totalVideos: videos.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('YouTube sync error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'YOUTUBE_SYNC_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
