import React from "react";

const Manuscripts: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Manuscripts</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search manuscripts..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Submitted</option>
                <option>In Review</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              + New Manuscript
            </button>
          </div>

          {/* Manuscripts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-medium text-gray-800">AI in Healthcare</h4>
                <p className="text-sm text-gray-500">Submitted: Jan 15, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                In Review
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-medium text-gray-800">Quantum Computing</h4>
                <p className="text-sm text-gray-500">Submitted: Jan 10, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                Accepted
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-medium text-gray-800">Neural Networks</h4>
                <p className="text-sm text-gray-500">Submitted: Jan 5, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manuscripts;
