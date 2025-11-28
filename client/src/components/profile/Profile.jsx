// SettingsPage.jsx
import React, { useState } from "react";
import {
  FiUser,
  FiTarget,
  FiShield,
  FiUpload,
  FiSave,
  FiMail,
  FiPhone,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import SecurityTab from "./SecurityTab";

const TAB_LIST = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "productivity", label: "Productivity", icon: FiTarget },
  { id: "password", label: "Password", icon: FiShield },
];

const defaultProfile = {
  fullName: "Alex Thompson",
  email: "alex.thompson@productivitytracker.com",
  phone: "+1 (555) 123-4567",
  role: "Working Professional",
  bio: "Passionate about productivity and continuous improvement. Always looking for new ways to optimize workflow and achieve better results through smart time management and focused work sessions.",
  dailyGoal: 8,
  weeklyGoal: 40,
  defaultCategory: "Work",
  joinDate: "January 15, 2024",
  hoursTracked: 342,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);

  // Input handlers
  const updateField = (field, value) => {
    if (field === "email") return;
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setPhoto(ev.target.result);
    r.readAsDataURL(f);
  };

  const removePhoto = () => setPhoto(null);

  const saveProfile = () => {
    setEditing(false);
    console.log("Saved profile:", profile);
  };

  // Check if current tab should show edit/save buttons
  const shouldShowEditButtons = activeTab !== "password";

  return (
    <div className="min-h-[85vh] bg-[#f0f5fa] dark:bg-[#1B1A19] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Profile Image */}
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
                <div className="text-lg sm:text-xl md:text-2xl font-semibold wrap-break-word">
                  {profile.fullName}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1 wrap-break-word">
                  {profile.email}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <label className="inline-flex items-center px-3 py-2 rounded-lg bg-white border border-[#4E80EE] dark:bg-[#4E80EE] dark:border-blue-500 text-xs sm:text-sm cursor-pointer hover:bg-blue-700 hover:border-blue-700 transition shrink-0">
                    <FiUpload className="mr-1 sm:mr-2" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFile}
                      accept="image/*"
                    />
                    Upload Photo
                  </label>

                  {photo && (
                    <button
                      onClick={removePhoto}
                      className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-red-500 border border-gray-200 dark:border-red-600 text-xs sm:text-sm hover:bg-red-600 transition shrink-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <FiCalendar className="shrink-0" />
                    <span className="whitespace-nowrap">Joined {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <FiClock className="shrink-0" />
                    <span className="font-semibold text-[#597FE7] dark:text-red-400 whitespace-nowrap">
                      {profile.hoursTracked} hours tracked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
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
            {/* Icon - Always visible with responsive sizing */}
            <Icon 
              className={`${
                active 
                  ? "text-white" 
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
              } shrink-0 transition-colors`} 
              size={20} 
            />
            
            {/* Text - Responsive behavior */}
            <span className="hidden sm:block">{t.label}</span>
            
            {/* Mobile tooltip/text fallback */}
            <div className="sm:hidden">
              {/* Full text on very small screens in tooltip style */}
              <span className="sr-only">{t.label}</span>
              <span className="text-xs font-medium block sm:hidden">
                {t.label === 'Profile' ? 'Prof' : 
                 t.label === 'Productivity' ? 'Work' : 
                 t.label === 'Password' ? 'Sec' : t.label}
              </span>
            </div>
          </button>
        </li>
      );
    })}
  </ul>
</nav>

          {/* Content Area */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            {/* Tab Header */}
            {shouldShowEditButtons && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold capitalize text-center sm:text-left">
                  {activeTab}
                </h2>
                <div className="flex items-center justify-center sm:justify-end gap-3">
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

            {!shouldShowEditButtons && (
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
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Full name
                      </label>
                      <input
                        value={profile.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      />
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
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Role
                      </label>
                      <select
                        value={profile.role}
                        onChange={(e) => updateField("role", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      >
                        <option>Working Professional</option>
                        <option>Student</option>
                        <option>Freelancer</option>
                        <option>Entrepreneur</option>
                        <option>Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Default category
                      </label>
                      <select
                        value={profile.defaultCategory}
                        onChange={(e) => updateField("defaultCategory", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      >
                        <option>Work</option>
                        <option>Study</option>
                        <option>Exercise</option>
                        <option>Personal</option>
                        <option>Creative</option>
                      </select>
                    </div>
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
                      onChange={(e) => updateField("dailyGoal", parseInt(e.target.value || 0))}
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
                      onChange={(e) => updateField("weeklyGoal", parseInt(e.target.value || 0))}
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
    </div>
  );
}