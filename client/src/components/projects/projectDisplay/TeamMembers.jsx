import { useContext, useState } from "react";
import { FaTrash, FaUndo, FaUserPlus, FaUserSlash } from "react-icons/fa";
import { ProjectContext } from "../../../context/project/ProjectContext";
import ViewAllMembersModal from "./ViewAllMembersModal";
import { useSuspendMember } from "../../../hooks/projects/membersActions/useSuspendMember";
import { useRevokeMember } from "../../../hooks/projects/membersActions/useRevokeMember";

const MAX_VISIBLE = 4; //currently for the ui checking i have kept it as 1 later i will make it 4

const TeamMembers = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [showAllModal, setShowAllModal] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const { project,setProject } = useContext(ProjectContext);
  const {
    suspendMember,
    loading: suspending,
    error: suspendError,
  } = useSuspendMember();
  const { revokeMember } = useRevokeMember();
  const activeMembers = project.teamMembers || [];
  const suspendedMembers = project.suspendedMembers || [];
  const currentUserId = project.currentUserId;

  const isManager = project.managingUserId?.some(
    (user) => user._id === currentUserId
  );

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleSuspend = async (memberId) => {
    try {
      await suspendMember(memberId);
      setConfirmData(null); // close confirmation modal
    } catch (err) {
      console.error("Failed to suspend member:", err);
    }
  };

  const handleRemove = (id) => console.log("Remove:", id);

  const handleRevoke = async (memberId) => {
  try {
    await revokeMember(memberId); 
    setConfirmData(null); 
  } catch (err) {
    console.error("Failed to revoke member:", err);
  }
};


  const openConfirm = (type, memberId) => {
    setConfirmData({ type, memberId });
  };

  const confirmAction = () => {
    if (!confirmData) return;

    const { type, memberId } = confirmData;

    if (type === "suspend") handleSuspend(memberId);
    if (type === "remove") handleRemove(memberId);
    if (type === "revoke") handleRevoke(memberId);

    setConfirmData(null);
  };

  /* ---------------- MEMBER CARD ---------------- */
  const MemberCard = ({ member, type, showActions = true }) => {
    const isSelf = member._id === currentUserId;

    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <img
          src={
            member.avatar ||
            `https://ui-avatars.com/api/?name=${member.firstName}&background=random`
          }
          alt={member.firstName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {member.firstName} {member.lastName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {member.email}
          </p>
        </div>

        {/* MANAGER ACTIONS (LIST ONLY, NOT MODAL) */}
        {showActions && isManager && (
          <div className="flex gap-2">
            {type === "active" && (
              <>
                <button
                  onClick={() => openConfirm("suspend", member._id)}
                  className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-md"
                >
                  <FaUserSlash />
                </button>

                <button
                  disabled={isSelf}
                  onClick={() => openConfirm("remove", member._id)}
                  className={`p-2 rounded-md ${
                    isSelf
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  }`}
                  title={isSelf ? "You cannot remove yourself" : "Remove"}
                >
                  <FaTrash />
                </button>
              </>
            )}

            {type === "suspended" && (
              <button
                onClick={() => openConfirm("revoke", member._id)}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md"
              >
                <FaUndo />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ---------------- MEMBERS TO SHOW ---------------- */
  const visibleActive = activeMembers.slice(0, MAX_VISIBLE);
  const visibleSuspended = suspendedMembers.slice(0, MAX_VISIBLE);

  const showViewAll =
    (activeTab === "active" && activeMembers.length > MAX_VISIBLE) ||
    (activeTab === "suspended" && suspendedMembers.length > MAX_VISIBLE);

  /* ---------------- UI ---------------- */
  return (
    <>
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
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Active ({activeMembers.length})
          </button>

          <button
            onClick={() => setActiveTab("suspended")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "suspended"
                ? "text-yellow-600 border-b-2 border-yellow-600"
                : "text-gray-500"
            }`}
          >
            Suspended ({suspendedMembers.length})
          </button>
        </div>

        {/* Preview Members */}
        <div className="space-y-3">
          {activeTab === "active" &&
            visibleActive.map((m) => (
              <MemberCard key={m._id} member={m} type="active" showActions />
            ))}

          {activeTab === "suspended" &&
            visibleSuspended.map((m) => (
              <MemberCard key={m._id} member={m} type="suspended" showActions />
            ))}
        </div>

        {/* View All → everyone */}
        {showViewAll && (
          <button
            onClick={() => setShowAllModal(true)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            View All Members
          </button>
        )}

        {/* Add Member → manager only */}
        {isManager && (
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg">
            <FaUserPlus /> Add Member
          </button>
        )}
      </div>

      {/* VIEW ALL MODAL (READ-ONLY) */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Project Members
            </h3>

            {(activeTab === "active" ? activeMembers : suspendedMembers).map(
              (m) => (
                <MemberCard
                  key={m._id}
                  member={m}
                  type={activeTab}
                  showActions={false} // 🔐 IMPORTANT
                />
              )
            )}

            <button
              onClick={() => setShowAllModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmData && isManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmData(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <ViewAllMembersModal
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        members={activeMembers}
        suspendedMembers={suspendedMembers}
        activeTab={activeTab}
        isManager={isManager}
        currentUserId={currentUserId}
        onSuspend={(id) => openConfirm("suspend", id)}
        onRemove={(id) => openConfirm("remove", id)}
        onRevoke={(id) => openConfirm("revoke", id)}
        onAddMember={() => console.log("Open add member modal")}
      />
    </>
  );
};

export default TeamMembers;
