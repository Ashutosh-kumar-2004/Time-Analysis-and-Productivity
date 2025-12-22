import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Galaxy from "./Galaxy";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-[#030014] overflow-hidden flex items-center justify-center">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          starSpeed={0.5}
          density={1.5}
          glowIntensity={0.5}
          mouseInteraction={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-[150px] md:text-[200px] leading-none font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse select-none filter drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
          Time Slot Not Found
        </h2>

        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed drop-shadow-md">
          It seems you've wandered into a timeline that doesn't exist. Let's get
          you back to tracking your productivity.
        </p>

        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium text-lg">Return to Focus</span>
        </button>
      </div>

      {/* Overlay Gradient for better text readability if needed */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-[#030014]/50 pointer-events-none" />
    </div>
  );
};

export default NotFound;
