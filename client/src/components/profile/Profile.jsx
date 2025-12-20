import React, { useState, useEffect, useRef } from "react";
import { useProfile } from "../../hooks/profile/useProfile";
import ProfileShimmer from "../profile/ProfileShimmer";
import useProfileUpload from "../../hooks/profile/useProfileUpload";
import SecurityTab from "./SecurityTab";
import {
  FiUser,
  FiTarget,
  FiShield,
  FiUpload,
  FiSave,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const TAB_LIST = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "password", label: "Password", icon: FiShield },
];

export default function SettingsPage() {
  const { data: profileData, loading, updateProfile } = useProfile();
  const {
    uploadProfilePic,
    loading: uploading,
    error: uploadError,
    removeProfilePic,
  } = useProfileUpload();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.user);
      setPhoto(profileData.user.avatar || null);
    }
  }, [profileData]);

  if (loading || !profile) {
    return <ProfileShimmer />;
  }

  const updateField = (field, value) => {
    if (field === "email") return;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phone,
      bio: profile.bio,
    };

    setEditing(false);
    updateProfile(payload);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPhoto(previewUrl);

    // Upload to backend using custom hook
    const uploadedUrl = await uploadProfilePic(file);
    if (uploadedUrl) {
      setPhoto(uploadedUrl); // Use the actual uploaded URL
    } else {
      setPhoto(profileData?.avatar || null);
      URL.revokeObjectURL(previewUrl); // Clean up the preview URL
    }
  };

  const handleRemovePhoto = async () => {
    const success = await removeProfilePic();
    if (success) {
      setPhoto("");
    }
  };

  return (
    <>
      <div className="min-h-[85vh] bg-[#f0f5fa] dark:bg-[#1B1A19] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Header */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-blue-100/80 dark:bg-gray-700 border-4 border-red-500/20 flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img
                    src={photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl sm:text-3xl md:text-4xl text-[#597FE7] dark:text-[#597FE7]" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="text-lg sm:text-xl md:text-2xl font-semibold">
                {profile.fullName}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {profile.email}
              </div>

              {/* Action Buttons - USING useRef APPROACH */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                  accept="image/*"
                  disabled={!editing || uploading}
                />
                <button
                  type="button"
                  onClick={handleFileClick}
                  disabled={!editing || uploading}
                  className={`inline-flex items-center px-3 py-2 rounded-lg border text-xs sm:text-sm transition shrink-0 ${
                    !editing || uploading
                      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-white border-[#4E80EE] dark:bg-[#4E80EE] dark:border-blue-500 hover:bg-blue-700 hover:border-blue-700"
                  }`}
                >
                  <FiUpload className="mr-1 sm:mr-2" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>

                {photo && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={!editing || uploading}
                    className={`px-3 py-2 rounded-lg border text-xs sm:text-sm transition shrink-0 ${
                      !editing || uploading
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-red-500 border-gray-200 dark:border-red-600 hover:bg-red-600"
                    }`}
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploadError && (
                <p className="text-red-500 text-xs mt-2">{uploadError}</p>
              )}
            </div>
            {/* Stats */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FiCalendar />
                <span className="whitespace-nowrap">
                  Joined {profile.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-1 shadow-sm">
            <ul className="flex flex-col sm:flex-row">
              {TAB_LIST.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <li key={t.id} className="flex-1">
                    <button
                      onClick={() => setActiveTab(t.id)}
                      className={`group w-full flex items-center justify-center gap-2 py-3 px-2 sm:px-3 md:px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[#4E80EE] text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`${
                          active
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                        } shrink-0 transition-colors`}
                        size={20}
                      />
                      <span className="sm:block">{t.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content Area */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            {/* Header & Buttons */}
            {activeTab !== "password" && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold capitalize">
                  {activeTab}
                </h2>
              </div>
            )}

            {activeTab === "password" && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize">
                  {activeTab}
                </h2>
              </div>
            )}

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          First Name
                        </label>
                        <input
                          value={profile.firstName}
                          onChange={(e) =>
                            updateField("firstName", e.target.value)
                          }
                          disabled={!editing}
                          className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 
                 dark:text-white dark:border-gray-600 
                 disabled:opacity-70 disabled:cursor-not-allowed
                 transition-colors"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Last Name
                        </label>
                        <input
                          value={profile.lastName}
                          onChange={(e) =>
                            updateField("lastName", e.target.value)
                          }
                          disabled={!editing}
                          className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 
                 dark:text-white dark:border-gray-600 
                 disabled:opacity-70 disabled:cursor-not-allowed 
                 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone
                      </label>
                      <input
                        value={profile.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Bio
                      </label>
                      <textarea
                        rows="4"
                        value={profile.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email
                      </label>
                      <input
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {/* Save and Edit button */}
                  <div className="flex items-center justify-center sm:justify-end lg:justify-end lg:col-span-2 gap-3">
                    <button
                      disabled={!editing}
                      onClick={saveProfile}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        editing
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiSave />
                      Save
                    </button>

                    <button
                      onClick={() => setEditing((s) => !s)}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {editing ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>
              )}

              {/* Productivity Tab */}
              {activeTab === "productivity" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Daily Goal (hrs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={profile.dailyGoal}
                      onChange={(e) =>
                        updateField("dailyGoal", parseInt(e.target.value || 0))
                      }
                      disabled={!editing}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Weekly Goal (hrs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="168"
                      value={profile.weeklyGoal}
                      onChange={(e) =>
                        updateField("weeklyGoal", parseInt(e.target.value || 0))
                      }
                      disabled={!editing}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
