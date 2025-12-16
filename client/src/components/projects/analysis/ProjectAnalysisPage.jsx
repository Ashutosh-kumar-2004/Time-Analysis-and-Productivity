import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useProjectAnalysisContext } from "../../../context/analysis/ProjectAnalysisContext";
import { ThemeContext } from "../../../context/ThemeContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ProjectAnalysisPage = () => {
  const { projectID: projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { loading, error, analysisData } = useProjectAnalysisContext();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="text-center">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    Go Back
                </button>
            </div>
        </div>
     );
  }
  
  const { statusDistribution, priorityDistribution, memberWorkload, taskEfficiency } = analysisData || {};

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <button
          onClick={() => navigate(`/project-details/${projectId}`)}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft /> Back to Project
        </button>

        <header>
          <h1 className="text-3xl font-bold mb-2">Project Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400">Insights and visualization of project performance.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className={`p-6 rounded-xl shadow-sm border min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                {statusDistribution?.length > 0 && (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            {/* Priority Distribution */}
            <div className={`p-6 rounded-xl shadow-sm border min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Task Priority Breakdown</h3>
                {priorityDistribution?.length > 0 && (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityDistribution} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} horizontal={false} />
                             <XAxis type="number" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                             <YAxis dataKey="name" type="category" stroke={isDark ? "#9ca3af" : "#4b5563"} width={80} />
                             <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                             />
                             <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {priorityDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            {/* Member Workload */}
            <div className={`p-6 rounded-xl shadow-sm border md:col-span-2 min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Team Workload (Tasks Assigned)</h3>
                {memberWorkload?.length > 0 ? (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={memberWorkload}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                            />
                            <Legend />
                            <Bar dataKey="Tasks" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                ) : <p className="text-gray-500">No member activity recorded.</p>}
            </div>

            {/* Task Efficiency */}
            <div className={`p-6 rounded-xl shadow-sm border md:col-span-2 min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Time Efficiency (Top Active Tasks)</h3>
                {taskEfficiency?.length > 0 ? (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={taskEfficiency}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                            />
                            <Legend />
                            <Bar dataKey="Estimated Hours" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Logged Hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                ) : <p className="text-gray-500">Not enough data for efficiency analysis.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisPage;
