import React, { useContext, useState, useMemo } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { FaUserPlus, FaSpinner, FaCheck } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { UserContext } from "../../../context/user/UserContext";
import { useAddTeamMember } from "../../../hooks/projects/members/useAddTeamMember";

const AddTeamMemberModal = ({ isOpen, onClose }) => {
  const { isDark } = useContext(ThemeContext);
  const { project } = useContext(ProjectContext);
  const { users, loading: loadingUsers } = useContext(UserContext);
  const { addTeamMember, loading: adding } = useAddTeamMember();

  const [searchTerm, setSearchTerm] = useState("");
  const [addingUserId, setAddingUserId] = useState(null); // Track which user is being added

  // Flatten current team members IDs for easy checking
  const currentMemberIds = useMemo(() => {
    if (!project) return new Set();
    const managers = project.managingUserId?.map(m => m._id) || [];
    const team = project.teamMembers?.map(m => m._id) || [];
    const combined = [...managers, ...team, project.projectStartedBy?._id].filter(Boolean);
    return new Set(combined);
  }, [project]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch =
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
  }, [users, searchTerm]);

  if (!isOpen) return null;

  const handleAddUser = async (user) => {
    try {
      setAddingUserId(user._id);
      await addTeamMember(project._id, user._id);
      // We don't close the modal immediately so user can add more members
    } catch (error) {
      // Error handled in hook/logged
    } finally {
      setAddingUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Add Team Members
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
          <div className={`flex items-center px-4 py-2 rounded-lg border ${
            isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <AiOutlineSearch className={`w-5 h-5 mr-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}/>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent outline-none ${
                isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* User List */}
        <div className="h-96 overflow-y-auto p-2">
          {loadingUsers ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-blue-500 w-8 h-8" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={`text-center py-10 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              No users found matching "{searchTerm}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => {
                const isMember = currentMemberIds.has(user._id);
                const isAddingThisUser = addingUserId === user._id;

                return (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        isDark ? "bg-blue-600" : "bg-blue-500"
                      }`}>
                        {user.avatar ? (
                          <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user.firstName?.[0] || user.email?.[0] || "?").toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {isMember ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        isDark ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-600"
                      }`}>
                        <FaCheck className="w-3 h-3" /> Member
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddUser(user)}
                        disabled={adding || isAddingThisUser}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                          isDark 
                            ? "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-800 disabled:text-gray-400" 
                            : "bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:bg-gray-100 disabled:text-gray-400"
                        }`}
                      >
                        {isAddingThisUser ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                        {isAddingThisUser ? "Adding..." : "Add"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
