Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

        // Parse query parameters
        const url = new URL(req.url);
        const contentType = url.searchParams.get('type') || 'all'; // 'photography', 'videography', or 'all'
        const featured = url.searchParams.get('featured') === 'true';
        const limit = parseInt(url.searchParams.get('limit') || '50');

        let photography = [];
        let videography = [];

        // Fetch photography if requested
        if (contentType === 'all' || contentType === 'photography') {
            let photoQuery = `${supabaseUrl}/rest/v1/photography?order=created_at.desc&limit=${limit}`;
            
            if (featured) {
                photoQuery += '&is_featured=eq.true';
            }

            const photoResponse = await fetch(photoQuery, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            });

            if (photoResponse.ok) {
                photography = await photoResponse.json();
            }
        }

        // Fetch videography if requested
        if (contentType === 'all' || contentType === 'videography') {
            const videoQuery = `${supabaseUrl}/rest/v1/videography?order=published_at.desc&limit=${limit}`;

            const videoResponse = await fetch(videoQuery, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            });

            if (videoResponse.ok) {
                videography = await videoResponse.json();
            }
        }

        return new Response(JSON.stringify({
            data: {
                photography,
                videography,
                counts: {
                    photography: photography.length,
                    videography: videography.length,
                    total: photography.length + videography.length
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get content error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'GET_CONTENT_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
