import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Added githubUrl and linkedinUrl as optional parameters
export const uploadCandidate = async (resumeFile, jobDescription, githubUrl = '', linkedinUrl = '') => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description', jobDescription);
  
  // Safely append the URLs if the user provided them
  if (githubUrl) formData.append('github_url', githubUrl);
  if (linkedinUrl) formData.append('linkedin_url', linkedinUrl);

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
// ... existing uploadCandidate function ...

export const getCandidates = async () => {
  try {
    const response = await apiClient.get('/candidates');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }
};