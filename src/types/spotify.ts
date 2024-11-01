export interface SpotifyStatistics {
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
  advanced_statistics: {
    danceability: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    energy: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    valence: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    acousticness: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    instrumentalness: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    liveness: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    speechiness: { mean: number; median: number; std_dev: number; skewness: number; kurtosis: number };
    correlations: Record<string, number>;
  };
  sentiment_analysis: Array<{ name: string; sentiment: number }>;
  genre_analysis: {
    top_genres: [string, number][];
    genre_diversity: number;
    genre_distribution: Record<string, number>;
  };
}

export interface SpotifyData {
  statistics: SpotifyStatistics;
  recommendations: never[];
}