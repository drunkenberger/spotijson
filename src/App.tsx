import React, { useState } from 'react';
import { Music2, Lock, LineChart, Download } from 'lucide-react';
import SpotifyForm from './components/SpotifyForm';
import StatisticsDisplay from './components/StatisticsDisplay';
import { SpotifyData } from './types/spotify';
import { fetchSpotifyData } from './utils/spotifyApi';

function App() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SpotifyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (clientId: string, clientSecret: string, spotifyUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSpotifyData(clientId, clientSecret, spotifyUrl);
      setStats(data);
    } catch (err) {
      console.error('Error analyzing Spotify data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    }
    setLoading(false);
  };

  const handleExportJSON = () => {
    if (!stats) return;
    
    const dataStr = JSON.stringify(stats, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spotify-statistics.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music2 className="w-8 h-8 text-spotify-green" />
              <div>
                <h1 className="text-3xl font-bold">Spoti Json Generator by My Amigx Lab</h1>
                <p className="mt-2 text-gray-400">
                  Generate data from a Spotify link that you can process and analyze using the Guru View.
                </p>
              </div>
            </div>
            <img 
              src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/QmajjohQ8u7g7XgZ99zRZuZ3bD8KVLyfeBDvAhwtnPv9sp" 
              alt="My Amigx Lab Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-spotify-green" />
              <h2 className="text-xl font-semibold">Credentials & URL</h2>
            </div>
            <SpotifyForm onSubmit={handleAnalyze} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-200">
                {error}
              </div>
            )}
          </div>

          {stats && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-spotify-green" />
                  <h2 className="text-xl font-semibold">Statistics</h2>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center space-x-2 px-4 py-2 bg-spotify-green rounded-md hover:bg-spotify-green/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Your Data</span>
                </button>
              </div>
              <StatisticsDisplay stats={stats.statistics} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;