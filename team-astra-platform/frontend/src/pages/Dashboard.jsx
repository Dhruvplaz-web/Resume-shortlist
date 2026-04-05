import { useState, useEffect } from 'react';
import { Users, Target, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getCandidates } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    excellentCount: 0,
    avgExperience: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recharts specific colors for dark mode
  const COLORS = ['#10b981', '#fbbf24', '#ef4444']; // Emerald (Excellent), Amber (Good), Red (Moderate)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCandidates();
        
        if (data.length > 0) {
          // 1. Calculate Top-level Stats
          const total = data.length;
          const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / total);
          const excellentCount = data.filter(c => c.status.toLowerCase() === 'excellent').length;
          const avgExperience = Math.round(data.reduce((acc, curr) => acc + curr.experience, 0) / total);

          setStats({ total, avgScore, excellentCount, avgExperience });

          // 2. Format Data for the Bar Chart (Scores by Candidate)
          // We'll just show the top 5 candidates by score so the chart doesn't get crowded
          const sortedForChart = [...data].sort((a, b) => b.score - a.score).slice(0, 5);
          setChartData(sortedForChart.map(c => ({
            name: c.name.split(' ')[0], // Just first name
            Score: c.score,
            Skill: c.skillMatch
          })));

          // 3. Format Data for the Pie Chart (Status Distribution)
          const statusCounts = data.reduce((acc, curr) => {
            const status = curr.status.charAt(0).toUpperCase() + curr.status.slice(1);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          
          setPieData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Reusable Stat Card Component
  const StatCard = ({ title, value, icon: Icon, subtitle, colorClass }) => (
    <div className="bg-[#222222] p-6 rounded-xl border border-[#333333] flex items-center gap-4">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white leading-none mb-1">{value}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto text-white pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Platform Overview</h1>
        <p className="text-gray-400 text-sm">High-level analytics and AI processing metrics.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-gray-500">Loading Analytics...</div>
      ) : stats.total === 0 ? (
        <div className="bg-[#222222] border border-[#333333] rounded-xl p-12 text-center text-gray-400">
          No data available. Upload some resumes to populate the dashboard!
        </div>
      ) : (
        <>
          {/* Top Stat Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Processed" 
              value={stats.total} 
              icon={Users} 
              colorClass="bg-blue-500/10 text-blue-400" 
              subtitle="All candidates"
            />
            <StatCard 
              title="Avg. Match Score" 
              value={`${stats.avgScore}%`} 
              icon={Target} 
              colorClass="bg-purple-500/10 text-purple-400" 
              subtitle="Across all profiles"
            />
            <StatCard 
              title="Top Tier Candidates" 
              value={stats.excellentCount} 
              icon={Award} 
              colorClass="bg-emerald-500/10 text-emerald-400" 
              subtitle="Ranked 'Excellent'"
            />
            <StatCard 
              title="Avg. Exp. Match" 
              value={`${stats.avgExperience}%`} 
              icon={TrendingUp} 
              colorClass="bg-amber-500/10 text-amber-400" 
              subtitle="Based on JD requirements"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar Chart - Top Candidates */}
            <div className="lg:col-span-2 bg-[#222222] p-6 rounded-xl border border-[#333333]">
              <h3 className="text-lg font-bold mb-6">Top Candidates Breakdown</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} />
                    <YAxis stroke="#888" tick={{fill: '#888'}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="Score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Overall Score" />
                    <Bar dataKey="Skill" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Skill Match" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Status Distribution */}
            <div className="bg-[#222222] p-6 rounded-xl border border-[#333333] flex flex-col">
              <h3 className="text-lg font-bold mb-2">Quality Distribution</h3>
              <p className="text-xs text-gray-400 mb-6">AI-assigned status across pipeline</p>
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="flex justify-center gap-4 mt-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Excellent</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Good</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Moderate</div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}