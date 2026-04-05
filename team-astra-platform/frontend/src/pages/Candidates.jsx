import { useState, useEffect } from 'react';
import { Search, User, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getCandidates } from '../services/api';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when the page loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCandidates();
        // Sort by highest score first
        const sortedData = data.sort((a, b) => b.score - a.score);
        setCandidates(sortedData);
      } catch (error) {
        console.error("Error loading candidates");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper to color-code the scores
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-amber-400';
    return 'text-red-400';
  };

  // Helper to render status badges
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Excellent</span>;
      case 'good':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Good</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-semibold flex items-center gap-1 w-max"><ShieldAlert className="w-3 h-3" /> Moderate</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Candidate Database</h1>
          <p className="text-gray-400 text-sm">Review AI-scored applicants and their verification status.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            className="bg-[#222222] border border-[#333333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none w-64 text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* The Data Table */}
      <div className="bg-[#222222] border border-[#333333] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-[#1a1a1a] border-b border-[#333333]">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold text-center">AI Match Score</th>
                <th className="px-6 py-4 font-semibold text-center">Skill Fit</th>
                <th className="px-6 py-4 font-semibold text-center">Experience</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading AI Data...</td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No candidates processed yet. Head to the Upload tab!</td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-[#333333] hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-gray-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{candidate.name}</div>
                          <div className="text-xs text-gray-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xl font-black ${getScoreColor(candidate.score)}`}>{candidate.score}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">{candidate.skillMatch}%</td>
                    <td className="px-6 py-4 text-center text-gray-400">{candidate.experience}%</td>
                    <td className="px-6 py-4">{renderStatusBadge(candidate.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">View Profile</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}