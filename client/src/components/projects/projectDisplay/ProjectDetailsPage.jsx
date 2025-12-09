import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProject } from "../../../redux/projects/projectSlice";
import { useTheme } from "../../../context/ThemeContext";
import {
  FaArrowLeft,
  FaEdit,
  FaTimes,
  FaCheck,
  FaTrash,
  FaUserPlus,
  FaUserCheck,
  FaUserMinus,
  FaUserClock,
  FaPlus,
  FaTasks,
} from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";
import { formatDateTime } from "../../../constants";

const ProjectDetailsPage = () => {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  // Selector for projects
  const selectProjects = createSelector(
    (state) => state.project,
    (projectSlice) => projectSlice.projects || []
  );

  const projects = useSelector(selectProjects);
  const loading = useSelector((state) => state.project.loading);

  const project = projects.find((p) => p._id === projectID);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});
  const [activeTab, setActiveTab] = useState("active"); // active, suspended, removed, invited
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  // Initialize edited project & comments
  useEffect(() => {
    if (!project) return;

    setEditedProject({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Started",
      priority: project.priority || "medium",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      tags: project.tags || [],
    });

    setComments(project.comments || []);
  }, [project]);

  // Shimmer while loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handleSaveChanges = () => {
    dispatch(updateProject({ id: project._id, data: editedProject }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject({ ...project });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: comments.length + 1,
      author: "You",
      role: "Viewer",
      avatar:
        "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLikeComment = (id) => {
    setComments(
      comments.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const handleMemberAction = (memberId, action) => {
    // This would dispatch an action to update member status
    console.log(`${action} member ${memberId}`);
    // dispatch(updateProjectMember({ projectId: project._id, memberId, action }));
  };

  const handleCreateTask = () => {
    // This would dispatch an action to create a task
    console.log("Create task:", newTask);
    // dispatch(createTask({ projectId: project._id, task: newTask }));
    setShowTaskModal(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "started":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "in progress":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const progress =
    project.startDate && project.endDate
      ? Math.min(
          100,
          Math.max(
            0,
            ((new Date() - new Date(project.startDate)) /
              (new Date(project.endDate) - new Date(project.startDate))) *
              100
          )
        )
      : 0;

  // Get active members (excluding suspended/removed)
  const activeMembers = project.teamMembers || [];
  const suspendedMembers = project.suspendedMembers || [];
  const removedMembers = project.removedMembers || [];
  const invitedMembers = project.invitedMembers || [];

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-950" : "bg-blue-900"
      } transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-gray-900 dark:text-gray-100"
        >
          <FaArrowLeft />
          <span className="text-gray-900 dark:text-gray-100">
            Back to Projects
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.name}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          name: e.target.value,
                        })
                      }
                      className="w-full text-2xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-3 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                      {project.name}
                    </h1>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status || "Started"}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                        project.priority
                      )}`}
                    >
                      {project.priority || "Medium"} Priority
                    </span>

                    {/* Created Date */}
                    <span className="text-gray-700 dark:text-gray-300">
                      Created{" "}
                      {project.createdAt
                        ? formatDateTime(project.createdAt)
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {isEditing ? (
                    <>
                      <FaTimes /> Cancel Edit
                    </>
                  ) : (
                    <>
                      <FaEdit /> Edit Project
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Description
                </h2>
                {isEditing ? (
                  <textarea
                    value={editedProject.description}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        description: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">
                    {project.description || "No description provided"}
                  </p>
                )}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 dark:text-white">
                    Project Progress
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <FaCheck /> Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Task Management Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tasks
                </h2>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <FaPlus /> Create Task
                </button>
              </div>

              {/* Task List - Will be populated from API */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaTasks className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet. Create your first task!</p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              {/* Add Comment */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Comments
                </h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${
                      newComment.trim()
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                  >
                    <div className="flex gap-3 items-start">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {c.author}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {c.role} • {c.timestamp}
                            </span>
                          </div>
                          {c.author === "You" && (
                            <button
                              onClick={() =>
                                setComments(
                                  comments.filter((x) => x.id !== c.id)
                                )
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {c.content}
                        </p>
                        <button
                          onClick={() => handleLikeComment(c.id)}
                          className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {c.liked ? "❤️" : "🤍"} {c.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Project Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project Manager
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.projectStartedBy
                      ? `${project.projectStartedBy.firstName} ${project.projectStartedBy.lastName}`
                      : "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.startDate
                      ? formatDateTime(project.startDate)
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.endDate
                      ? formatDateTime(project.endDate)
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.totalDuration
                      ? `${Math.floor(project.totalDuration / 60)} hours`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.tasks?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Management */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Team Members
              </h2>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "active"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Active ({activeMembers.length})
                </button>
                <button
                  onClick={() => setActiveTab("suspended")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "suspended"
                      ? "text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Suspended ({suspendedMembers.length})
                </button>
                <button
                  onClick={() => setActiveTab("invited")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "invited"
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Invited ({invitedMembers.length})
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeTab === "active" &&
                  activeMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "suspend")
                          }
                          className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded"
                          title="Suspend"
                        >
                          <FaUserClock />
                        </button>
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "remove")
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Remove"
                        >
                          <FaUserMinus />
                        </button>
                      </div>
                    </div>
                  ))}

                {activeTab === "suspended" &&
                  suspendedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "reactivate")
                          }
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                          title="Reactivate"
                        >
                          <FaUserCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "remove")
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Remove"
                        >
                          <FaUserMinus />
                        </button>
                      </div>
                    </div>
                  ))}

                {activeTab === "invited" &&
                  invitedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "accept")
                          }
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                          title="Accept"
                        >
                          <FaUserCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleMemberAction(member._id, "reject")
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Reject"
                        >
                          <FaUserMinus />
                        </button>
                      </div>
                    </div>
                  ))}

                {activeTab === "active" && activeMembers.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No active members
                  </p>
                )}
                {activeTab === "suspended" && suspendedMembers.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No suspended members
                  </p>
                )}
                {activeTab === "invited" && invitedMembers.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No invited members
                  </p>
                )}
              </div>

              {/* Add Member Button */}
              <button className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                <FaUserPlus /> Invite Member
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400">
                  📊 Generate Progress Report
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-green-700 dark:text-green-400">
                  📧 Email Team Update
                </button>
                <button className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-red-700 dark:text-red-400">
                  🗑️ Archive Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create New Task
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select a team member</option>
                  {activeMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim()}
                className={`px-4 py-2 text-white rounded-lg ${
                  newTask.title.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;