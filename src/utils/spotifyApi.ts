import { SpotifyData } from '../types/spotify';

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw new Error('Failed to authenticate with Spotify');
  }
}

async function getPlaylistId(url: string): Promise<string> {
  const matches = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (!matches) throw new Error('Invalid Spotify playlist URL');
  return matches[1];
}

async function fetchWithRetry(url: string, token: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 429) { // Rate limit
          const retryAfter = response.headers.get('Retry-After');
          await new Promise(resolve => setTimeout(resolve, (parseInt(retryAfter || '1') + 1) * 1000));
          continue;
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}

async function fetchPlaylistTracks(token: string, playlistId: string) {
  const tracks: any[] = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  while (url) {
    const data = await fetchWithRetry(url, token);
    if (!data.items) break;
    tracks.push(...data.items);
    url = data.next;
  }

  return tracks;
}

async function fetchPlaylistDetails(token: string, playlistId: string) {
  return await fetchWithRetry(`https://api.spotify.com/v1/playlists/${playlistId}`, token);
}

async function fetchAudioFeatures(token: string, trackIds: string[]) {
  const features: any[] = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    const chunk = trackIds.slice(i, i + 100);
    const data = await fetchWithRetry(
      `https://api.spotify.com/v1/audio-features?ids=${chunk.join(',')}`,
      token
    );
    if (data.audio_features) {
      features.push(...data.audio_features);
    }
  }
  return features;
}

async function fetchArtists(token: string, artistIds: string[]) {
  const artists: any[] = [];
  const uniqueIds = [...new Set(artistIds)];
  
  for (let i = 0; i < uniqueIds.length; i += 50) {
    const chunk = uniqueIds.slice(i, i + 50);
    const data = await fetchWithRetry(
      `https://api.spotify.com/v1/artists?ids=${chunk.join(',')}`,
      token
    );
    if (data.artists) {
      artists.push(...data.artists);
    }
  }
  return artists;
}

function calculateStatistics(tracks: any[], audioFeatures: any[], playlistDetails: any, artists: any[]): SpotifyData {
  const validTracks = tracks.filter(t => t.track && !t.track.is_local);
  const numTracks = validTracks.length;
  
  if (numTracks === 0) {
    throw new Error('No valid tracks found in playlist');
  }

  const popularityValues = validTracks.map(t => t.track.popularity);
  const releaseYears = validTracks.map(t => parseInt(t.track.album.release_date.split('-')[0]));
  
  const popularityRanges = {
    "(-0.001, 20.0]": 0,
    "(20.0, 40.0]": 0,
    "(40.0, 60.0]": 0,
    "(60.0, 80.0]": 0,
    "(80.0, 100.0]": 0
  };

  popularityValues.forEach(p => {
    if (p <= 20) popularityRanges["(-0.001, 20.0]"]++;
    else if (p <= 40) popularityRanges["(20.0, 40.0]"]++;
    else if (p <= 60) popularityRanges["(40.0, 60.0]"]++;
    else if (p <= 80) popularityRanges["(60.0, 80.0]"]++;
    else popularityRanges["(80.0, 100.0]"]++;
  });

  const yearRanges = {
    "(1969.999, 1980.0]": 0,
    "(1980.0, 1990.0]": 0,
    "(1990.0, 2000.0]": 0,
    "(2000.0, 2010.0]": 0,
    "(2010.0, 2020.0]": 0,
    "(2020.0, 2030.0]": 0
  };

  releaseYears.forEach(y => {
    if (y <= 1980) yearRanges["(1969.999, 1980.0]"]++;
    else if (y <= 1990) yearRanges["(1980.0, 1990.0]"]++;
    else if (y <= 2000) yearRanges["(1990.0, 2000.0]"]++;
    else if (y <= 2010) yearRanges["(2000.0, 2010.0]"]++;
    else if (y <= 2020) yearRanges["(2010.0, 2020.0]"]++;
    else yearRanges["(2020.0, 2030.0]"]++;
  });

  const uniqueArtists = new Set(validTracks.flatMap(t => t.track.artists.map((a: any) => a.id))).size;
  const explicitTracks = validTracks.filter(t => t.track.explicit).length;

  const sortedByPopularity = [...validTracks].sort((a, b) => b.track.popularity - a.track.popularity);
  const mostPopular = sortedByPopularity.slice(0, 5).map(t => [t.track.name, t.track.popularity]);
  const leastPopular = sortedByPopularity.slice(-5).reverse().map(t => [t.track.name, t.track.popularity]);

  const validFeatures = audioFeatures.filter(f => f);
  const averageFeatures = validFeatures.reduce((acc, f) => ({
    danceability: acc.danceability + (f.danceability || 0),
    energy: acc.energy + (f.energy || 0),
    valence: acc.valence + (f.valence || 0),
    acousticness: acc.acousticness + (f.acousticness || 0),
    instrumentalness: acc.instrumentalness + (f.instrumentalness || 0),
    liveness: acc.liveness + (f.liveness || 0),
    speechiness: acc.speechiness + (f.speechiness || 0)
  }), {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    speechiness: 0
  });

  Object.keys(averageFeatures).forEach(key => {
    averageFeatures[key as keyof typeof averageFeatures] /= validFeatures.length;
  });

  // Calculate genre analysis using the artists data
  const genreAnalysis = calculateGenreAnalysis(artists);

  return {
    statistics: {
      num_tracks: numTracks,
      average_popularity: popularityValues.reduce((a, b) => a + b, 0) / numTracks,
      total_duration_minutes: validTracks.reduce((acc, t) => acc + t.track.duration_ms / 60000, 0),
      average_release_year: releaseYears.reduce((a, b) => a + b, 0) / numTracks,
      unique_artists_count: uniqueArtists,
      explicit_tracks_count: explicitTracks,
      popularity_distribution: popularityRanges,
      release_year_distribution: yearRanges,
      most_popular_tracks: mostPopular,
      least_popular_tracks: leastPopular,
      followers: playlistDetails.followers.total,
      average_danceability: averageFeatures.danceability,
      average_energy: averageFeatures.energy,
      average_valence: averageFeatures.valence,
      average_acousticness: averageFeatures.acousticness,
      average_instrumentalness: averageFeatures.instrumentalness,
      average_liveness: averageFeatures.liveness,
      average_speechiness: averageFeatures.speechiness,
      advanced_statistics: calculateAdvancedStatistics(validFeatures),
      sentiment_analysis: validTracks.map(t => ({
        name: t.track.name,
        sentiment: 0
      })),
      genre_analysis: genreAnalysis
    },
    recommendations: []
  };
}

function calculateAdvancedStatistics(features: any[]) {
  const featureNames = ['danceability', 'energy', 'valence', 'acousticness', 'instrumentalness', 'liveness', 'speechiness'];
  
  const stats: any = {};
  featureNames.forEach(feature => {
    const values = features.map(f => f[feature]).filter(v => v !== undefined);
    stats[feature] = calculateFeatureStats(values);
  });

  stats.correlations = calculateCorrelations(features, featureNames);
  return stats;
}

function calculateFeatureStats(values: number[]) {
  if (values.length === 0) return { mean: 0, median: 0, std_dev: 0, skewness: 0, kurtosis: 0 };

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(values.length / 2)];
  
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const std_dev = Math.sqrt(variance);

  const skewness = calculateSkewness(values, mean, std_dev);
  const kurtosis = calculateKurtosis(values, mean, std_dev);

  return { mean, median, std_dev, skewness, kurtosis };
}

function calculateSkewness(values: number[], mean: number, stdDev: number) {
  if (stdDev === 0) return 0;
  const n = values.length;
  const m3 = values.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
  return m3 / Math.pow(stdDev, 3);
}

function calculateKurtosis(values: number[], mean: number, stdDev: number) {
  if (stdDev === 0) return 0;
  const n = values.length;
  const m4 = values.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n;
  return m4 / Math.pow(stdDev, 4) - 3;
}

function calculateCorrelations(features: any[], featureNames: string[]) {
  const correlations: Record<string, number> = {};
  
  for (let i = 0; i < featureNames.length; i++) {
    for (let j = i + 1; j < featureNames.length; j++) {
      const feature1 = featureNames[i];
      const feature2 = featureNames[j];
      const correlation = calculateCorrelation(
        features.map(f => f[feature1]),
        features.map(f => f[feature2])
      );
      correlations[`${feature1}_${feature2}`] = correlation;
    }
  }

  return correlations;
}

function calculateCorrelation(x: number[], y: number[]) {
  const validPairs = x.map((val, i) => [val, y[i]])
    .filter(([a, b]) => a !== undefined && b !== undefined);
  
  if (validPairs.length === 0) return 0;
  
  const [xValues, yValues] = validPairs.reduce(
    ([xs, ys], [x, y]) => [[...xs, x], [...ys, y]],
    [[] as number[], [] as number[]]
  );

  const n = xValues.length;
  const sum_x = xValues.reduce((a, b) => a + b, 0);
  const sum_y = yValues.reduce((a, b) => a + b, 0);
  const sum_xy = xValues.reduce((acc, _, i) => acc + xValues[i] * yValues[i], 0);
  const sum_x2 = xValues.reduce((acc, val) => acc + val * val, 0);
  const sum_y2 = yValues.reduce((acc, val) => acc + val * val, 0);

  const numerator = n * sum_xy - sum_x * sum_y;
  const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function calculateGenreAnalysis(artists: any[]) {
  const genres = artists.flatMap(artist => artist.genres || []);
  
  const genreCounts = genres.reduce((acc: Record<string, number>, genre: string) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) as [string, number][];

  const totalGenres = genres.length || 1;
  const genreDistribution = Object.fromEntries(
    Object.entries(genreCounts).map(([genre, count]) => [genre, count / totalGenres])
  );

  return {
    top_genres: sortedGenres,
    genre_diversity: Object.keys(genreCounts).length / totalGenres,
    genre_distribution: genreDistribution
  };
}

export async function fetchSpotifyData(clientId: string, clientSecret: string, playlistUrl: string): Promise<SpotifyData> {
  try {
    const token = await getAccessToken(clientId, clientSecret);
    const playlistId = await getPlaylistId(playlistUrl);
    
    const [tracks, playlistDetails] = await Promise.all([
      fetchPlaylistTracks(token, playlistId),
      fetchPlaylistDetails(token, playlistId)
    ]);

    const validTracks = tracks.filter(t => t.track && !t.track.is_local);
    const trackIds = validTracks.map(t => t.track.id);
    const artistIds = [...new Set(validTracks.flatMap(t => t.track.artists.map((a: any) => a.id)))];
    
    const [audioFeatures, artists] = await Promise.all([
      fetchAudioFeatures(token, trackIds),
      fetchArtists(token, artistIds)
    ]);
    
    return calculateStatistics(tracks, audioFeatures, playlistDetails, artists);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch Spotify data');
  }
}