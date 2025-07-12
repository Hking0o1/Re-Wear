import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Package, Users, BarChart3, Trash2 } from 'lucide-react';
import { mockClothingItems } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

interface AdminPageProps {
  onPageChange: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  if (!user?.isAdmin) {
    onPageChange('home');
    return null;
  }

  const pendingItems = mockClothingItems.filter(item => item.approvalStatus === 'pending');
  const approvedItems = mockClothingItems.filter(item => item.approvalStatus === 'approved');
  const rejectedItems = mockClothingItems.filter(item => item.approvalStatus === 'rejected');

  const handleApprove = (itemId: string) => {
    alert(`Item ${itemId} approved!`);
    // In a real app, this would update the item status
  };

  const handleReject = (itemId: string) => {
    alert(`Item ${itemId} rejected!`);
    // In a real app, this would update the item status
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      alert(`Item ${itemId} deleted!`);
      // In a real app, this would delete the item
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage listings and oversee platform activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingItems.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved Items
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {approvedItems.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    1,256
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Swaps
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    2,847
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending Review', count: pendingItems.length },
                { id: 'approved', label: 'Approved', count: approvedItems.length },
                { id: 'rejected', label: 'Rejected', count: rejectedItems.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-6">
                {pendingItems.length > 0 ? (
                  pendingItems.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>{item.category} • {item.size}</span>
                            <span>{item.condition}</span>
                            <span>{item.pointValue} points</span>
                            <span>By {item.uploaderName}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending items</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All items have been reviewed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div className="space-y-6">
                {approvedItems.length > 0 ? (
                  approvedItems.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>{item.category} • {item.size}</span>
                            <span>{item.condition}</span>
                            <span>{item.pointValue} points</span>
                            <span>By {item.uploaderName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">Approved</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No approved items</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Approved items will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rejected' && (
              <div className="space-y-6">
                {rejectedItems.length > 0 ? (
                  rejectedItems.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6 opacity-60">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>{item.category} • {item.size}</span>
                            <span>{item.condition}</span>
                            <span>{item.pointValue} points</span>
                            <span>By {item.uploaderName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">Rejected</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected items</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Rejected items will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;