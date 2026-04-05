import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Upload from './pages/Upload'; 
import Candidates from './pages/Candidates'; 
import Dashboard from './pages/Dashboard'; // <-- We are now importing the REAL Dashboard!

// Profile Page Placeholder (Still dark mode)
const Profile = () => (
  <div className="max-w-3xl text-white">
    <h1 className="text-2xl font-bold mb-6">User Profile</h1>
    <div className="bg-[#222222] p-8 rounded-xl border border-[#333333] shadow-sm">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center text-gray-400 text-3xl font-bold">AU</div>
        <div>
          <h2 className="text-xl font-bold">Admin User</h2>
          <p className="text-gray-400">admin@teamastra.ai</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">Profile management, billing, and API keys will be configured here.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;