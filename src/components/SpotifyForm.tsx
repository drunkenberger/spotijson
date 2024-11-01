import React, { useState } from 'react';
import { Loader2, Info } from 'lucide-react';

interface SpotifyFormProps {
  onSubmit: (clientId: string, clientSecret: string, spotifyUrl: string) => void;
  loading: boolean;
}

function SpotifyForm({ onSubmit, loading }: SpotifyFormProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(clientId, clientSecret, spotifyUrl);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-spotify-green mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium mb-2">How to get your Spotify credentials:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-spotify-green hover:underline">Spotify Developer Dashboard</a></li>
              <li>Log in with your Spotify account</li>
              <li>Click "Create app"</li>
              <li>Fill in the app name and description</li>
              <li>Copy the "Client ID" and "Client Secret" from your app's settings</li>
            </ol>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-300">
            Client ID
          </label>
          <input
            type="text"
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-white focus:border-spotify-green focus:ring-spotify-green"
            required
          />
        </div>

        <div>
          <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-300">
            Client Secret
          </label>
          <input
            type="password"
            id="clientSecret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-white focus:border-spotify-green focus:ring-spotify-green"
            required
          />
        </div>

        <div>
          <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-300">
            Spotify Playlist URL
          </label>
          <input
            type="url"
            id="spotifyUrl"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-white focus:border-spotify-green focus:ring-spotify-green"
            placeholder="https://open.spotify.com/playlist/..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-spotify-green hover:bg-spotify-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </form>
    </div>
  );
}

export default SpotifyForm;