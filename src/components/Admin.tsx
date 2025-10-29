import React, { useState } from 'react';
import { Upload, Video, RefreshCw, Settings, CheckCircle, XCircle, Loader2, Key, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SyncResult {
  success: boolean;
  message: string;
  itemsSynced?: number;
}

const Admin = () => {
  // Google Drive sync state
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [folderId, setFolderId] = useState('');
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleResult, setGoogleResult] = useState<SyncResult | null>(null);

  // YouTube sync state
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [channelId, setChannelId] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [youtubeSyncing, setYoutubeSyncing] = useState(false);
  const [youtubeResult, setYoutubeResult] = useState<SyncResult | null>(null);

  // Settings save state
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsResult, setSettingsResult] = useState<SyncResult | null>(null);

  // Handle save settings for automated sync
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!googleApiKey && !youtubeApiKey) {
      setSettingsResult({
        success: false,
        message: 'Please provide at least one API key to save'
      });
      return;
    }

    setSavingSettings(true);
    setSettingsResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('save-settings', {
        body: {
          googleDriveApiKey: googleApiKey || undefined,
          googleDriveFolderId: folderId || undefined,
          youtubeApiKey: youtubeApiKey || undefined,
          youtubeChannelId: channelId || undefined,
          youtubePlaylistId: playlistId || undefined
        }
      });

      if (error) {
        throw error;
      }

      const responseData = data?.data || data;
      
      setSettingsResult({
        success: true,
        message: responseData.message || 'Settings saved successfully. Automated syncs are now enabled!',
        itemsSynced: responseData.settingsCount
      });

    } catch (error: any) {
      console.error('Save settings error:', error);
      setSettingsResult({
        success: false,
        message: error.message || 'Failed to save settings. Please try again.'
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Google Drive sync (immediate)
  const handleGoogleDriveSync = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!googleApiKey || !folderId) {
      setGoogleResult({
        success: false,
        message: 'Please provide both API key and folder ID'
      });
      return;
    }

    setGoogleSyncing(true);
    setGoogleResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('sync-google-drive', {
        body: {
          apiKey: googleApiKey,
          folderId: folderId
        }
      });

      if (error) {
        throw error;
      }

      const responseData = data?.data || data;
      
      setGoogleResult({
        success: true,
        message: responseData.message || 'Sync completed successfully',
        itemsSynced: responseData.itemsSynced
      });

    } catch (error: any) {
      console.error('Google Drive sync error:', error);
      setGoogleResult({
        success: false,
        message: error.message || 'Sync failed. Please check your credentials and try again.'
      });
    } finally {
      setGoogleSyncing(false);
    }
  };

  // Handle YouTube sync (immediate)
  const handleYouTubeSync = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeApiKey || (!channelId && !playlistId)) {
      setYoutubeResult({
        success: false,
        message: 'Please provide API key and either channel ID or playlist ID'
      });
      return;
    }

    setYoutubeSyncing(true);
    setYoutubeResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('sync-youtube', {
        body: {
          apiKey: youtubeApiKey,
          channelId: channelId || undefined,
          playlistId: playlistId || undefined
        }
      });

      if (error) {
        throw error;
      }

      const responseData = data?.data || data;
      
      setYoutubeResult({
        success: true,
        message: responseData.message || 'Sync completed successfully',
        itemsSynced: responseData.itemsSynced
      });

    } catch (error: any) {
      console.error('YouTube sync error:', error);
      setYoutubeResult({
        success: false,
        message: error.message || 'Sync failed. Please check your credentials and try again.'
      });
    } finally {
      setYoutubeSyncing(false);
    }
  };

  return (
    <section id="admin" className="py-24 lg:py-32 bg-background-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Settings className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Content Management
          </h2>
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
            Sync your photography and videography content from Google Drive and YouTube
          </p>
        </div>

        {/* Save Settings for Automated Sync */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-primary-500 p-3 rounded-lg">
              <Save className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-neutral-900">
                Automated Sync Settings
              </h3>
              <p className="text-neutral-700 mt-1">
                Save your API credentials once for automatic daily syncing at 2 AM (photos) and 3 AM (videos) UTC
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Save All Credentials</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Enter your API keys and IDs below, then click "Save & Enable Auto-Sync" to store them securely. 
                The system will automatically sync your content daily.
              </p>
              <button
                type="submit"
                disabled={savingSettings || (!googleApiKey && !youtubeApiKey)}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save & Enable Auto-Sync
                  </>
                )}
              </button>

              {/* Result message */}
              {settingsResult && (
                <div className={`p-4 rounded-lg flex items-start ${
                  settingsResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {settingsResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{settingsResult.message}</p>
                    {settingsResult.success && (
                      <p className="text-sm mt-1">
                        Cron jobs are active. Next sync: 2 AM UTC (photos), 3 AM UTC (videos)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Drive Sync Card */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 ml-4">
                Google Drive Photos
              </h3>
            </div>

            <form onSubmit={handleGoogleDriveSync} className="space-y-6">
              <div>
                <label htmlFor="google-api-key" className="block text-sm font-medium text-neutral-700 mb-2">
                  Google Drive API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="google-api-key"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="Enter your Google Drive API key"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={googleSyncing}
                  />
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Get your API key from Google Cloud Console
                </p>
              </div>

              <div>
                <label htmlFor="folder-id" className="block text-sm font-medium text-neutral-700 mb-2">
                  Google Drive Folder ID
                </label>
                <input
                  type="text"
                  id="folder-id"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  placeholder="Enter folder ID from Drive URL"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={googleSyncing}
                />
                <p className="text-sm text-neutral-500 mt-1">
                  Found in the folder URL after /folders/
                </p>
              </div>

              <button
                type="submit"
                disabled={googleSyncing}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {googleSyncing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Sync Now
                  </>
                )}
              </button>

              {/* Result message */}
              {googleResult && (
                <div className={`p-4 rounded-lg flex items-start ${
                  googleResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {googleResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{googleResult.message}</p>
                    {googleResult.itemsSynced !== undefined && (
                      <p className="text-sm mt-1">Items synced: {googleResult.itemsSynced}</p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* YouTube Sync Card */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 ml-4">
                YouTube Videos
              </h3>
            </div>

            <form onSubmit={handleYouTubeSync} className="space-y-6">
              <div>
                <label htmlFor="youtube-api-key" className="block text-sm font-medium text-neutral-700 mb-2">
                  YouTube API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="youtube-api-key"
                    value={youtubeApiKey}
                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                    placeholder="Enter your YouTube API key"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={youtubeSyncing}
                  />
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Get your API key from Google Cloud Console
                </p>
              </div>

              <div>
                <label htmlFor="channel-id" className="block text-sm font-medium text-neutral-700 mb-2">
                  YouTube Channel ID (Optional)
                </label>
                <input
                  type="text"
                  id="channel-id"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Enter channel ID"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={youtubeSyncing}
                />
              </div>

              <div>
                <label htmlFor="playlist-id" className="block text-sm font-medium text-neutral-700 mb-2">
                  YouTube Playlist ID (Optional)
                </label>
                <input
                  type="text"
                  id="playlist-id"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  placeholder="Enter playlist ID"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={youtubeSyncing}
                />
                <p className="text-sm text-neutral-500 mt-1">
                  Provide either channel ID or playlist ID
                </p>
              </div>

              <button
                type="submit"
                disabled={youtubeSyncing}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {youtubeSyncing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Sync Now
                  </>
                )}
              </button>

              {/* Result message */}
              {youtubeResult && (
                <div className={`p-4 rounded-lg flex items-start ${
                  youtubeResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {youtubeResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{youtubeResult.message}</p>
                    {youtubeResult.itemsSynced !== undefined && (
                      <p className="text-sm mt-1">Items synced: {youtubeResult.itemsSynced}</p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h4 className="text-xl font-bold text-neutral-900 mb-4">Setup Instructions</h4>
          <div className="space-y-4 text-neutral-700">
            <div>
              <h5 className="font-semibold mb-2">Option 1: Automated Sync (Recommended)</h5>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Enter all your API credentials in the form fields above</li>
                <li>Click "Save & Enable Auto-Sync" to store them securely</li>
                <li>Content will automatically sync daily at 2 AM (photos) and 3 AM (videos) UTC</li>
                <li>You can also click "Sync Now" buttons for immediate syncing</li>
              </ol>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Option 2: Manual Sync Only</h5>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Enter your API credentials when you want to sync</li>
                <li>Click "Sync Now" to manually trigger a sync</li>
                <li>You'll need to enter credentials each time</li>
              </ol>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Google Drive Setup:</h5>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to Google Cloud Console</li>
                <li>Enable Google Drive API</li>
                <li>Create API credentials (API Key)</li>
                <li>Share your Drive folder publicly or with the service account</li>
                <li>Copy the folder ID from the URL</li>
              </ol>
            </div>
            <div>
              <h5 className="font-semibold mb-2">YouTube Setup:</h5>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to Google Cloud Console</li>
                <li>Enable YouTube Data API v3</li>
                <li>Create API credentials (API Key)</li>
                <li>Find your channel ID in YouTube Studio settings</li>
                <li>Or use a specific playlist ID to sync videos</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
