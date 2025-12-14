import { useState } from "react";
import {
  FaTrash,
  FaUndo,
  FaUserPlus,
  FaUserSlash,
  FaSearch,
} from "react-icons/fa";

const ViewAllMembersModal = ({
  isOpen,
  onClose,
  members = [],
  suspendedMembers = [],
  activeTab,
  isManager,
  currentUserId,
  onSuspend,
  onRemove,
  onRevoke,
  onAddMember,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const list = activeTab === "active" ? members : suspendedMembers;

  const filtered = list.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
        {/* HEADER */}
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {activeTab === "active" ? "Active Members" : "Suspended Members"}
          </h3>
          <button onClick={onClose} className="text-white">
            ✕
          </button>
        </div>

        {/* MANAGER CONTROLS */}
        {isManager && (
          <div className="p-4 flex gap-3 border-b dark:border-gray-700">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <button
              onClick={onAddMember}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FaUserPlus /> Add
            </button>
          </div>
        )}

        {/* MEMBER LIST */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          {filtered.map((member) => {
            const isSelf = member._id === currentUserId;
            const isManagerCard = member.isManager;

            return (
              <div
                key={member._id}
                className={`flex items-center gap-3 p-3 rounded-lg border
                  ${
                    isManagerCard
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
              >
                <img
                  src={
                    member.avatar ||
                    `https://ui-avatars.com/api/?name=${member.firstName}`
                  }
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>

                {/* MANAGER ACTIONS */}
                {isManager && (
                  <div className="flex gap-2">
                    {activeTab === "active" && (
                      <>
                        <button
                          onClick={() => onSuspend(member._id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                        >
                          <FaUserSlash />
                        </button>

                        <button
                          disabled={isSelf}
                          onClick={() => onRemove(member._id)}
                          title={
                            isSelf ? "You cannot remove yourself" : "Remove"
                          }
                          className={`p-2 rounded
                            ${
                              isSelf
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:bg-red-100"
                            }`}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

                    {activeTab === "suspended" && (
                      <button
                        onClick={() => onRevoke(member._id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                      >
                        <FaUndo />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-red-500 rounded-lg text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllMembersModal;
