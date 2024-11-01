import React from 'react';

interface Recommendation {
  name: string;
  artist: string;
}

interface RecommendationsTableProps {
  recommendations: Recommendation[];
}

function RecommendationsTable({ recommendations }: RecommendationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Track
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Artist
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {recommendations.map((rec, index) => (
            <tr key={index} className="hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm">{rec.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{rec.artist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecommendationsTable;