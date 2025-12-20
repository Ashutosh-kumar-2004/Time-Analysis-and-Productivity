import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 animate-pulse">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <button
        onClick={() => navigate("/")}
        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#1a1f2e] text-white rounded-xl hover:bg-[#252b3b] transition-all duration-300 border border-gray-800 hover:border-gray-700 shadow-lg hover:shadow-blue-500/10"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Home</span>
      </button>
    </div>
  );
};

export default NotFound;
