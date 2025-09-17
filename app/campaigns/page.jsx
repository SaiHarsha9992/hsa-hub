'use client'; // This is a client component for state and interactivity

import { useEffect, useState } from 'react';

// --- Helper Components ---
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5";
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
  };
  const dotStyles = {
    active: 'bg-green-500',
    draft: 'bg-yellow-500',
    expired: 'bg-red-500',
  };
  return (
    <span className={`${baseClasses} ${statusStyles[status.toLowerCase()]}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyles[status.toLowerCase()]}`}></span>
      {status}
    </span>
  );
};

const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
  </svg>
);



const newCampaignTemplate = {
  campaignID: '', name: '', description: '', startDate: '', endDate: '', discountType: 'percentage', discountValue: 0, status: 'Draft'
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]); // Start with an empty array
  const [selectedCampaign, setSelectedCampaign] = useState(newCampaignTemplate);

  // NEW: Function to fetch campaigns from the API
  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();
      setCampaigns(data);
      // If there's a selected campaign, find its updated version, otherwise select the first one or a new template
      const currentSelection = data.find(c => c.campaignID === selectedCampaign.campaignID) || data[0] || newCampaignTemplate;
      setSelectedCampaign(currentSelection);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  // NEW: useEffect to load data when the component mounts
  useEffect(() => {
    fetchCampaigns();
  }, []); // The empty array [] means this runs only once on component load

  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
  };
  
  const handleNewCampaign = () => {
    setSelectedCampaign(newCampaignTemplate);
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedCampaign(prev => ({ ...prev, [name]: value }));
  };

  // UPDATED: handleSave now sends data to the API
  const handleSave = async (e) => {
    e.preventDefault();
    
    const isUpdating = !!selectedCampaign.campaignID;
    const method = isUpdating ? 'PUT' : 'POST';
    const url = isUpdating ? `/api/campaigns/${selectedCampaign.campaignID}` : '/api/campaigns';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCampaign),
      });

      if (!response.ok) {
        throw new Error('Failed to save campaign');
      }

      alert('Campaign saved successfully!');
      fetchCampaigns(); // Refresh the list from the DB after saving
    } catch (error) {
      console.error(error);
      alert('Error saving campaign.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar for Navigation */}
          <aside className="w-full md:w-1/4">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">CAMPAIGNS</h2>
            <ul className="space-y-2">
              {campaigns.map(campaign => (
                <li key={campaign.campaignID}>
                  <button
                    onClick={() => handleSelectCampaign(campaign)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCampaign.campaignID === campaign.campaignID ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {campaign.name}
                  </button>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleNewCampaign}
              className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Create New Campaign
            </button>
          </aside>

          {/* Right Main Content Area */}
          <main className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Campaign Management</h1>
            </div>
            
            {/* Campaign Edit/Create Form */}
            <form onSubmit={handleSave} className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Campaign Name</label>
                    <input type="text" name="name" id="name" value={selectedCampaign.name} onChange={handleFormChange} className="w-full input-style" required />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <input type="text" name="description" id="description" value={selectedCampaign.description} onChange={handleFormChange} className="w-full input-style" />
                </div>
                 <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                    <input type="date" name="startDate" id="startDate" value={selectedCampaign.startDate} onChange={handleFormChange} className="w-full input-style" required />
                </div>
                 <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                    <input type="date" name="endDate" id="endDate" value={selectedCampaign.endDate} onChange={handleFormChange} className="w-full input-style" required />
                </div>
                 <div>
                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-600 mb-1">Discount Type</label>
                    <select name="discountType" id="discountType" value={selectedCampaign.discountType} onChange={handleFormChange} className="w-full input-style" required>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed ($)</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="discountValue" className="block text-sm font-medium text-gray-600 mb-1">Discount Value</label>
                    <input type="number" name="discountValue" id="discountValue" value={selectedCampaign.discountValue} onChange={handleFormChange} className="w-full input-style" required />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select name="status" id="status" value={selectedCampaign.status} onChange={handleFormChange} className="w-full input-style" required>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Save Campaign
                </button>
              </div>
            </form>

            {/* Existing Campaigns Table */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Campaigns</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="p-3 text-sm font-semibold text-gray-500">Campaign Name</th>
                      <th className="p-3 text-sm font-semibold text-gray-500">Start Date</th>
                      <th className="p-3 text-sm font-semibold text-gray-500">End Date</th>
                      <th className="p-3 text-sm font-semibold text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(campaign => (
                      <tr key={campaign.campaignID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{campaign.name}</td>
                        <td className="p-3 text-gray-700">{campaign.startDate}</td>
                        <td className="p-3 text-gray-700">{campaign.endDate}</td>
                        <td className="p-3"><StatusBadge status={campaign.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}