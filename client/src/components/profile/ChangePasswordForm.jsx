import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import {useTheme} from "../../context/ThemeContext.jsx"

export default function ChangePasswordForm() {
  const { isDark } = useTheme();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setShow] = useState(false);

  const requirements = {
    length: newPass.length >= 8,
    upper: /[A-Z]/.test(newPass),
    lower: /[a-z]/.test(newPass),
    number: /[0-9]/.test(newPass),
    special: /[^A-Za-z0-9]/.test(newPass),
  };

  const strength = Object.values(requirements).filter(Boolean).length;

  const strengthColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-600",
  ];

  const passwordsMatch = newPass === confirmPass && newPass.length > 0;
  const isFormValid = passwordsMatch && strength >= 4 && currentPass.length > 0;

  const themeClasses = {
    background: isDark ? 'bg-[#323232]' : 'bg-white',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      muted: isDark ? 'text-gray-400' : 'text-gray-500'
    },
    input: isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500'
  };

  return (
    <div className={`rounded-2xl shadow-lg p-8 border ${themeClasses.background} ${themeClasses.border}`}>
      <div className="flex items-center mb-2">
        <FiLock className={`text-2xl mr-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <h2 className={`text-2xl font-semibold ${themeClasses.text.primary}`}>
          Change Password
        </h2>
      </div>

      <p className={`mb-6 ${themeClasses.text.secondary}`}>
        Update your password to keep your account secure.
      </p>

      {/* Current Password */}
      <div className="mb-6">
        <label className={`block font-semibold mb-3 ${themeClasses.text.primary}`}>
          Current Password *
        </label>
        <input
          type="password"
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          className={`w-full px-4 py-4 border rounded-xl outline-none transition-colors ${themeClasses.input}`}
          placeholder="Enter current password"
        />
      </div>

      {/* New Password */}
      <div className="mb-6">
        <label className={`block font-semibold mb-3 ${themeClasses.text.primary}`}>
          New Password *
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={`w-full px-4 py-4 pr-12 border rounded-xl outline-none transition-colors ${themeClasses.input}`}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted} hover:text-red-500 transition-colors`}
          >
            {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label className={`block font-semibold mb-3 ${themeClasses.text.primary}`}>
          Confirm Password *
        </label>
        <input
          type={show ? "text" : "password"}
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className={`w-full px-4 py-4 border rounded-xl outline-none transition-colors ${
            themeClasses.input
          } ${
            confirmPass.length > 0
              ? passwordsMatch
                ? "border-green-500 ring-1 ring-green-500"
                : "border-red-500 ring-1 ring-red-500"
              : ""
          }`}
          placeholder="Re-enter new password"
        />
        {confirmPass.length > 0 && (
          <p
            className={`text-sm mt-2 font-medium ${
              passwordsMatch ? "text-green-600" : "text-red-500"
            }`}
          >
            {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}
      </div>

      {/* Password Strength */}
      <div className="mb-6">
        <p className={`font-semibold mb-3 ${themeClasses.text.primary}`}>
          Password Strength:
        </p>
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-xl transition-all duration-300 ${
                i <= strength ? strengthColors[strength] : isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
        
        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className={`flex items-center text-sm ${
            requirements.length ? "text-green-600" : themeClasses.text.muted
          }`}>
            <span className="mr-2">{requirements.length ? "✓" : "○"}</span>
            Minimum 8 characters
          </div>
          <div className={`flex items-center text-sm ${
            requirements.upper && requirements.lower ? "text-green-600" : themeClasses.text.muted
          }`}>
            <span className="mr-2">{requirements.upper && requirements.lower ? "✓" : "○"}</span>
            Upper & lowercase letters
          </div>
          <div className={`flex items-center text-sm ${
            requirements.number ? "text-green-600" : themeClasses.text.muted
          }`}>
            <span className="mr-2">{requirements.number ? "✓" : "○"}</span>
            At least one number
          </div>
          <div className={`flex items-center text-sm ${
            requirements.special ? "text-green-600" : themeClasses.text.muted
          }`}>
            <span className="mr-2">{requirements.special ? "✓" : "○"}</span>
            Special character
          </div>
        </div>
      </div>

      {/* Update Button */}
      <button
        disabled={!isFormValid}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
          isFormValid
            ? "bg-red-500 text-white hover:bg-red-600 shadow-lg transform hover:scale-105"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Update Password
      </button>
    </div>
  );
}