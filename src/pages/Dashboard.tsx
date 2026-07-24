import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">
            Total Manuscripts
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
          <span className="text-sm text-green-600">↑ 12% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">In Review</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
          <span className="text-sm text-blue-600">3 new this week</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Accepted</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          <span className="text-sm text-green-600">↑ 5% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Citations</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
          <span className="text-sm text-green-600">↑ 23% from last month</span>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Submissions Overview
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <span className="text-gray-500">Chart Component Here</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  New submission
                </p>
                <p className="text-xs text-gray-500">
                  "AI in Healthcare" - 2 hours ago
                </p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Submitted
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Review completed
                </p>
                <p className="text-xs text-gray-500">
                  "Quantum Computing" - 5 hours ago
                </p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                Accepted
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">New comment</p>
                <p className="text-xs text-gray-500">
                  "Neural Networks" - 1 day ago
                </p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
