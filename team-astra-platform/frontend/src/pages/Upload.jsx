import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { uploadCandidate } from '../services/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and paste a job description.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadCandidate(file, jobDescription, githubUrl, linkedinUrl);
      console.log("Backend says:", response);
      setUploadSuccess(true);
    } catch (error) {
      alert("Failed to analyze candidate. Check the console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Upload Resume & Job Description</h1>
        <p className="text-gray-400 text-sm">Upload candidate resumes and provide job requirements for AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: File Upload */}
        <div className="bg-[#222222] p-6 rounded-xl border border-[#333333]">
          <h2 className="text-sm font-bold mb-4">Resume Upload</h2>
          
          <div className="border-2 border-dashed border-[#444444] rounded-xl p-12 flex flex-col items-center justify-center bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors cursor-pointer relative min-h-[300px]">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex flex-col items-center text-blue-400">
                <FileText className="w-12 h-12 mb-4" />
                <span className="font-semibold">{file.name}</span>
                <span className="text-xs text-gray-400 mt-2">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-center">
                <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-blue-400" />
                </div>
                <span className="font-semibold text-white mb-1">Drop your resume here</span>
                <span className="text-sm mb-6">or click to browse</span>
                <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Choose File</span>
                <span className="text-xs mt-4 text-[#777777]">PDF only, max 10MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: JD & Socials */}
        <div className="flex flex-col gap-6">
          
          {/* Job Description Box */}
          <div className="bg-[#222222] p-6 rounded-xl border border-[#333333] flex-1 flex flex-col">
            <h2 className="text-sm font-bold mb-4">Job Description</h2>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here...&#10;&#10;Include:&#10;- Required skills&#10;- Experience level&#10;- Responsibilities"
              className="flex-1 w-full bg-[#2d2d2d] border border-[#444444] rounded-lg p-4 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none min-h-[150px]"
            ></textarea>
            
            {/* New Profile Link Fields */}
            <h2 className="text-sm font-bold mt-6 mb-3">External Profiles (Optional)</h2>
            <div className="space-y-3">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input 
                  type="url" 
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="GitHub URL"
                  className="w-full bg-[#2d2d2d] border border-[#444444] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input 
                  type="url" 
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full bg-[#2d2d2d] border border-[#444444] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button matching your mockup */}
          <button 
            onClick={handleAnalyze}
            disabled={isUploading || !file || !jobDescription}
            className={`w-full py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              isUploading ? 'bg-blue-400/50 cursor-not-allowed' : 
              uploadSuccess ? 'bg-green-600 hover:bg-green-500' :
              'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
            } disabled:opacity-50`}
          >
            {isUploading ? 'Analyzing Document...' : 
             uploadSuccess ? <><CheckCircle className="w-5 h-5" /> Analysis Complete!</> : 
             'Analyze with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}