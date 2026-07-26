import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Manuscripts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const manuscripts = [
    {
      id: 1,
      title: "AI in Healthcare",
      submitted: "Jan 15, 2024",
      status: "In Review",
      statusColor: "info",
      authors: "John Doe, Jane Smith",
    },
    {
      id: 2,
      title: "Quantum Computing",
      submitted: "Jan 10, 2024",
      status: "Accepted",
      statusColor: "success",
      authors: "Alice Johnson, Bob Wilson",
    },
    {
      id: 3,
      title: "Neural Networks",
      submitted: "Jan 5, 2024",
      status: "Pending",
      statusColor: "warning",
      authors: "Carol White, David Brown",
    },
  ];

  const statusClasses = {
    info: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
    success:
      "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    danger: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400",
  };

  const filteredManuscripts = manuscripts.filter((m) => {
    const matchesSearch = m.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Manuscripts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your research manuscripts
          </p>
        </div>
        <button className="btn-primary px-5 flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>New Manuscript</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search manuscripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Status</option>
              <option value="In Review">In Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button className="btn-secondary px-3.5 flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manuscripts List */}
      <div className="space-y-3">
        {filteredManuscripts.map((manuscript) => (
          <div key={manuscript.id} className="card card-hover p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
                    <DocumentTextIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {manuscript.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {manuscript.authors} • Submitted: {manuscript.submitted}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`badge ${statusClasses[manuscript.statusColor as keyof typeof statusClasses]}`}
                >
                  {manuscript.status}
                </span>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors duration-150">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors duration-150">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredManuscripts.length === 0 && (
          <div className="card p-10 text-center">
            <DocumentTextIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              No manuscripts found
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manuscripts;
