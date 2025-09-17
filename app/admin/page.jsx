'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProductModal from '../components/ProductModal';
import Image from 'next/image';
import ProductSelector from '../components/ProductSelector';

const ADMIN_EMAILS = [
  "gaduharsha72@gmail.com",
  "admin2@example.com",
  "admin3@example.com"
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login
        router.push("/login");
      } else if (ADMIN_EMAILS.includes(user.email)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    }
  }, [user, loading, router]);

  // Loading or unauthorized state
  if (loading) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-4">You do not have permission to access this page.</p>
      </div>
    );
  }

  // Authorized admin view
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Management
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campaign Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'campaigns' && <CampaignsManager />}
        </div>
      </div>
    </div>
  );
}



// ===================================================================================
// ===== 2. PRODUCTS MANAGEMENT COMPONENT (previously products/page.jsx)
// ===================================================================================
function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (sku) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`/api/products/${sku}`, { method: "DELETE" });
        fetchProducts();
      } catch (error) {
        alert("Error deleting product.");
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    if (!editingProduct) {
      const productNameForSku = productData.productName.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const uniquePart = Date.now().toString().slice(-4);
      productData.sku = `${productNameForSku.substring(0, 8)}-${uniquePart}`;
    }

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products/${editingProduct.sku}` : '/api/products';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to save product');
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      alert(`Error saving product: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
        <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-500">SKU</th>
              <th className="p-4 text-sm font-semibold text-gray-500">Product Name</th>
              <th className="p-4 text-sm font-semibold text-gray-500">Price</th>
              <th className="p-4 text-sm font-semibold text-gray-500">Image</th>
              <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.sku} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-700">{product.sku}</td>
                <td className="p-4 font-medium text-gray-900">{product.productName}</td>
                <td className="p-4 text-gray-700">₹{product.price}</td>
                <td className="p-4">
                  <Image src={product.imageUrl || 'https://via.placeholder.com/48'} alt={product.productName} width={48} height={48} className="rounded-md object-cover"/>
                </td>
                <td className="p-4 flex items-center gap-4">
                  <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteProduct(product.sku)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} product={editingProduct} />
    </div>
  );
}


// ===================================================================================
// ===== 3. CAMPAIGNS MANAGEMENT COMPONENT (previously campaigns/page.jsx)
// ===================================================================================

const newCampaignTemplate = {
  campaignID: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  discountType: 'percentage',
  discountValue: 0,
  status: 'Draft',
  products: [] // <-- new: array of product SKUs
};




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

function CampaignsManager() {
  const [campaigns, setCampaigns] = useState([]); // Start with an empty array
  const [selectedCampaign, setSelectedCampaign] = useState(newCampaignTemplate);
    const [allProducts, setAllProducts] = useState([]);
const fetchProducts = async () => {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    setAllProducts(data);
  } catch (err) {
    console.error('Failed to fetch products', err);
  }
};

    useEffect(() => {
  fetchProducts();
}, []);

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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Products in Campaign</label>
              <ProductSelector
  allProducts={allProducts} // your fetched products
  selectedProducts={selectedCampaign.products || []}
  setSelectedProducts={(products) => setSelectedCampaign(prev => ({ ...prev, products }))}
/>

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
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Note: The CampaignsManager component is simplified for brevity. You would copy the full component.