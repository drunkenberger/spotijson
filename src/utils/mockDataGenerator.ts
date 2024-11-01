import { SpotifyData } from '../types/spotify';

function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockData(playlistUrl: string): SpotifyData {
  // Use URL to generate a seed for pseudo-randomness
  const seed = Array.from(playlistUrl).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const numTracks = generateRandomInt(30, 100);
  const avgPopularity = generateRandomNumber(50, 90);
  
  const popularityRanges = {
    "(-0.001, 20.0]": generateRandomInt(0, 5),
    "(20.0, 40.0]": generateRandomInt(2, 10),
    "(40.0, 60.0]": generateRandomInt(5, 20),
    "(60.0, 80.0]": generateRandomInt(10, 30),
    "(80.0, 100.0]": generateRandomInt(5, 15)
  };

  const mockTrackNames = [
    "Summer Vibes", "Midnight Drive", "Ocean Waves", "City Lights",
    "Mountain High", "Desert Wind", "River Flow", "Forest Walk",
    "Urban Beat", "Sunset Dreams"
  ];

  const mostPopular = Array.from({ length: 5 }, (_, i) => [
    mockTrackNames[i],
    generateRandomInt(80, 95)
  ]) as [string, number][];

  const leastPopular = Array.from({ length: 5 }, (_, i) => [
    mockTrackNames[i + 5],
    generateRandomInt(40, 60)
  ]) as [string, number][];

  return {
    statistics: {
      num_tracks: numTracks,
      average_popularity: avgPopularity,
      total_duration_minutes: numTracks * generateRandomNumber(2.5, 4.5),
      average_release_year: generateRandomNumber(2020, 2024),
      unique_artists_count: generateRandomInt(numTracks * 0.3, numTracks * 0.8),
      explicit_tracks_count: generateRandomInt(numTracks * 0.1, numTracks * 0.4),
      popularity_distribution: popularityRanges,
      release_year_distribution: {
        "(1969.999, 1980.0]": generateRandomInt(0, 2),
        "(1980.0, 1990.0]": generateRandomInt(0, 3),
        "(1990.0, 2000.0]": generateRandomInt(0, 4),
        "(2000.0, 2010.0]": generateRandomInt(0, 5),
        "(2010.0, 2020.0]": generateRandomInt(5, 15),
        "(2020.0, 2030.0]": generateRandomInt(20, 40)
      },
      most_popular_tracks: mostPopular,
      least_popular_tracks: leastPopular,
      followers: generateRandomInt(1000, 1000000),
      average_danceability: generateRandomNumber(0.5, 0.9),
      average_energy: generateRandomNumber(0.4, 0.8),
      average_valence: generateRandomNumber(0.3, 0.8),
      average_acousticness: generateRandomNumber(0.1, 0.6),
      average_instrumentalness: generateRandomNumber(0.001, 0.1),
      average_liveness: generateRandomNumber(0.1, 0.4),
      average_speechiness: generateRandomNumber(0.03, 0.2),
      advanced_statistics: {
        danceability: {
          mean: generateRandomNumber(0.5, 0.9),
          median: generateRandomNumber(0.5, 0.9),
          std_dev: generateRandomNumber(0.05, 0.2),
          skewness: generateRandomNumber(-1, 1),
          kurtosis: generateRandomNumber(-1, 1)
        },
        energy: {
          mean: generateRandomNumber(0.4, 0.8),
          median: generateRandomNumber(0.4, 0.8),
          std_dev: generateRandomNumber(0.05, 0.2),
          skewness: generateRandomNumber(-1, 1),
          kurtosis: generateRandomNumber(-1, 1)
        },
        valence: {
          mean: generateRandomNumber(0.3, 0.8),
          median: generateRandomNumber(0.3, 0.8),
          std_dev: generateRandomNumber(0.05, 0.2),
          skewness: generateRandomNumber(-1, 1),
          kurtosis: generateRandomNumber(-1, 1)
        },
        acousticness: {
          mean: generateRandomNumber(0.1, 0.6),
          median: generateRandomNumber(0.1, 0.6),
          std_dev: generateRandomNumber(0.05, 0.2),
          skewness: generateRandomNumber(-1, 1),
          kurtosis: generateRandomNumber(-1, 1)
        },
        instrumentalness: {
          mean: generateRandomNumber(0.001, 0.1),
          median: generateRandomNumber(0.001, 0.1),
          std_dev: generateRandomNumber(0.001, 0.05),
          skewness: generateRandomNumber(0, 5),
          kurtosis: generateRandomNumber(0, 20)
        },
        liveness: {
          mean: generateRandomNumber(0.1, 0.4),
          median: generateRandomNumber(0.1, 0.4),
          std_dev: generateRandomNumber(0.05, 0.2),
          skewness: generateRandomNumber(-1, 2),
          kurtosis: generateRandomNumber(-1, 2)
        },
        speechiness: {
          mean: generateRandomNumber(0.03, 0.2),
          median: generateRandomNumber(0.03, 0.2),
          std_dev: generateRandomNumber(0.02, 0.1),
          skewness: generateRandomNumber(0, 3),
          kurtosis: generateRandomNumber(0, 7)
        },
        correlations: {
          danceability_energy: generateRandomNumber(-0.5, 0.5),
          danceability_valence: generateRandomNumber(-0.5, 0.5),
          danceability_acousticness: generateRandomNumber(-0.5, 0.5),
          danceability_instrumentalness: generateRandomNumber(-0.5, 0.5),
          danceability_liveness: generateRandomNumber(-0.5, 0.5),
          danceability_speechiness: generateRandomNumber(-0.5, 0.5),
          energy_valence: generateRandomNumber(-0.5, 0.5),
          energy_acousticness: generateRandomNumber(-0.5, 0.5),
          energy_instrumentalness: generateRandomNumber(-0.5, 0.5),
          energy_liveness: generateRandomNumber(-0.5, 0.5),
          energy_speechiness: generateRandomNumber(-0.5, 0.5),
          valence_acousticness: generateRandomNumber(-0.5, 0.5),
          valence_instrumentalness: generateRandomNumber(-0.5, 0.5),
          valence_liveness: generateRandomNumber(-0.5, 0.5),
          valence_speechiness: generateRandomNumber(-0.5, 0.5),
          acousticness_instrumentalness: generateRandomNumber(-0.5, 0.5),
          acousticness_liveness: generateRandomNumber(-0.5, 0.5),
          acousticness_speechiness: generateRandomNumber(-0.5, 0.5),
          instrumentalness_liveness: generateRandomNumber(-0.5, 0.5),
          instrumentalness_speechiness: generateRandomNumber(-0.5, 0.5),
          liveness_speechiness: generateRandomNumber(-0.5, 0.5)
        }
      },
      sentiment_analysis: mockTrackNames.map(name => ({
        name,
        sentiment: generateRandomNumber(-1, 1)
      })),
      genre_analysis: {
        top_genres: [
          ["pop", generateRandomInt(10, 30)],
          ["rock", generateRandomInt(8, 25)],
          ["hip-hop", generateRandomInt(5, 20)],
          ["electronic", generateRandomInt(3, 15)],
          ["indie", generateRandomInt(2, 10)]
        ] as [string, number][],
        genre_diversity: generateRandomNumber(0.1, 0.5),
        genre_distribution: {
          "pop": generateRandomNumber(0.2, 0.4),
          "rock": generateRandomNumber(0.15, 0.3),
          "hip-hop": generateRandomNumber(0.1, 0.25),
          "electronic": generateRandomNumber(0.05, 0.2),
          "indie": generateRandomNumber(0.05, 0.15)
        }
      }
    },
    recommendations: []
  };
}