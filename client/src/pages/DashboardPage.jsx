import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Icons (can be moved to a shared components/Icons.jsx file)
const DocumentPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>;

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const userId = localStorage.getItem('userId'); // Or get from currentUser if populated fully

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">Welcome to Your Dashboard!</h2>
      {currentUser && <p className="text-gray-600 mb-1">Logged in as: {currentUser.email}</p>}
      {userId && <p className="text-xs text-gray-500 mb-8">User ID (for reference): {userId}</p>}
      
      <p className="text-gray-700 mb-8">
        This is your personal space to manage your maternity benefit grievances. 
        You can file a new complaint or track the status of previously submitted ones.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          to="/new-complaint" 
          className="block bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <div className="flex items-center text-indigo-600 mb-3">
            <DocumentPlusIcon />
            <h3 className="text-xl font-semibold ml-3">File a New Complaint</h3>
          </div>
          <p className="text-gray-700 text-sm">
            If you're facing issues with your maternity benefits, start here to submit the details of your grievance.
          </p>
        </Link>
        <Link 
          to="/complaints"
          className="block bg-pink-50 p-6 rounded-lg hover:bg-pink-100 transition-colors cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        >
          <div className="flex items-center text-pink-600 mb-3">
            <ListBulletIcon />
            <h3 className="text-xl font-semibold ml-3">View My Complaints</h3>
          </div>
          <p className="text-gray-700 text-sm">
            Track the status of your submitted complaints and review the information you've provided.
          </p>
        </Link>
      </div>

      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Important Information & Next Steps</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>Ensure all information provided in your complaints is accurate and truthful to the best of your knowledge.</li>
          <li>Keep digital or physical copies of all relevant documents (e.g., employment contract, communications with HR/manager, medical certificates, leave applications).</li>
          <li>After submitting a complaint, a legal notice will be prepared based on the details you provide and sent to your organization.</li>
          <li>You will be updated on the status of your complaint, including when the notice is sent.</li>
          <li>Familiarize yourself with the key provisions of the Maternity Benefit Act, 2017, to understand your rights better.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;