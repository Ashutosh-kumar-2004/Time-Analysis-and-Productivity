import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const motivationalQuotes = [
  "Discipline is choosing what you want most over what you want now.",
  "Nobody cares how hard it is—results are the only proof.",
  "If it was easy, everyone would be ahead of you.",
  "You don’t need motivation. You need consistency.",
  "Your future is being built by what you do today, not tomorrow.",
  "Comfort is expensive—it costs you your potential.",
  "Study while others sleep. Win while others wish.",
  "Excuses don’t pass exams. Effort does.",
  "Every hour you waste is an hour someone else uses to beat you.",
  "Pain of study lasts a moment. Regret lasts years.",
  "Talent without work is nothing. Work without excuses is everything.",
  "You are not tired—you’re just undisciplined.",
  "Grades don’t lie. They reflect habits.",
  "Dreams demand sacrifice. Pay the price or stay average.",
  "Hard days are the entrance fee to a strong future.",
  "Stop waiting for motivation. Start acting like a professional.",
  "Your competition is studying right now.",
  "You can rest later. Earn it first.",
  "Focus is a decision. Make it.",
  "No shortcuts. No mercy. Just work.",
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
        <Quote size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between min-h-40">
        <div className="flex items-center gap-2 mb-4 opacity-80">
          <Quote size={20} className="fill-current" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Quote of the Day
          </span>
        </div>

        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed font-serif">
          "{quote}"
        </blockquote>

        <div className="mt-4 h-1 w-12 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default MotivationalQuote;
