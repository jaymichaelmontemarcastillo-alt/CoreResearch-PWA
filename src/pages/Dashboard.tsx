import React from "react";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Proposals",
      value: "0",
      change: "+0",
      trend: "up",
      icon: DocumentTextIcon,
      color: "primary",
    },
    {
      title: "Manuscripts",
      value: "0",
      change: "+0",
      trend: "up",
      icon: ClockIcon,
      color: "blue",
    },
    {
      title: "Notifications",
      value: "0",
      change: "+0",
      trend: "up",
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      title: "Upcoming",
      value: "0",
      change: "+0",
      trend: "up",
      icon: AcademicCapIcon,
      color: "purple",
    },
  ];

  const recentActivity = [
    {
      title: "Manuscript under panel review",
      description: "Chapter 2 - Enhancing LLM Retrieval",
      time: "2 hours ago",
      status: "In Review",
      statusColor: "info",
    },
    {
      title: "Proposal submitted",
      description: "Hybrid Graph-Vector Embeddings",
      time: "5 hours ago",
      status: "Submitted",
      statusColor: "success",
    },
    {
      title: "AI Adviser match found",
      description: "Dr. Sarah Johnson - Computer Science",
      time: "1 day ago",
      status: "Matched",
      statusColor: "warning",
    },
  ];

  const colorClasses = {
    primary:
      "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  const statusClasses = {
    info: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
    success:
      "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  };

  return (
    <div className="space-y-5">
      {/* Welcome Section */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Good morning, Student 👋
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Your manuscript is currently under panel review for Chapter 2.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Doctoral Candidate
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-dark-600"></span>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Computer Science
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.title} className="card card-hover p-3.5">
            <div className="flex items-center justify-between">
              <div
                className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-2.5">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Research Pipeline & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Research Pipeline */}
        <div className="card p-4 lg:col-span-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
            Research Pipeline
          </h3>
          <div className="space-y-2">
            {[
              "Proposal",
              "Lit Review",
              "Methodology",
              "Data",
              "Analysis",
              "Defense",
            ].map((stage, index) => (
              <div key={stage} className="flex items-center gap-2.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${index === 2 ? "bg-primary-500" : "bg-gray-300 dark:bg-dark-600"}`}
                ></div>
                <span
                  className={`text-xs ${index === 2 ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {stage}
                </span>
                {index === 2 && (
                  <span className="ml-auto text-[10px] font-medium text-primary-600 dark:text-primary-400">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Manuscript */}
        <div className="card p-4 lg:col-span-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
            Current Manuscript
          </h3>
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
            Enhancing LLM Retrieval with Hybrid Graph-Vector Embeddings
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Last edited: 2 days ago</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-dark-600"></span>
            <span className="text-primary-600 dark:text-primary-400 font-medium">
              68% complete
            </span>
          </div>
          <div className="mt-2 w-full h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <div className="w-[68%] h-full bg-primary-500 rounded-full"></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Recent Activity
            </h3>
            <button className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-2.5">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {activity.description}
                  </p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </span>
                </div>
                <span
                  className={`badge text-[10px] ${statusClasses[activity.statusColor as keyof typeof statusClasses]}`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
