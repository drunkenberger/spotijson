import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Statistics {
  num_tracks: number;
  average_popularity: number;
  total_duration_minutes: number;
  average_release_year: number;
  unique_artists_count: number;
  explicit_tracks_count: number;
  popularity_distribution: Record<string, number>;
  release_year_distribution: Record<string, number>;
  most_popular_tracks: [string, number][];
  least_popular_tracks: [string, number][];
  followers: number;
  average_danceability: number;
  average_energy: number;
  average_valence: number;
  average_acousticness: number;
  average_instrumentalness: number;
  average_liveness: number;
  average_speechiness: number;
}

interface StatisticsDisplayProps {
  stats: Statistics;
}

function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const mainStats = [
    { name: 'Total Tracks', value: stats.num_tracks },
    { name: 'Avg. Popularity', value: stats.average_popularity.toFixed(2) },
    { name: 'Duration (min)', value: stats.total_duration_minutes.toFixed(2) },
    { name: 'Avg. Year', value: stats.average_release_year.toFixed(2) },
    { name: 'Unique Artists', value: stats.unique_artists_count },
    { name: 'Explicit Tracks', value: stats.explicit_tracks_count },
    { name: 'Followers', value: stats.followers.toLocaleString() },
    { name: 'Danceability', value: stats.average_danceability.toFixed(3) },
    { name: 'Energy', value: stats.average_energy.toFixed(3) },
    { name: 'Valence', value: stats.average_valence.toFixed(3) }
  ];

  const popularityData = Object.entries(stats.popularity_distribution).map(([range, count]) => ({
    name: range,
    value: count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {mainStats.map(({ name, value }) => (
          <div key={name} className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">{name}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Most Popular Tracks</h3>
          <div className="space-y-2">
            {stats.most_popular_tracks.map(([name, popularity], index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700/30 p-2 rounded">
                <span>{name}</span>
                <span className="text-spotify-green">{popularity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Popularity Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#1DB954" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatisticsDisplay;