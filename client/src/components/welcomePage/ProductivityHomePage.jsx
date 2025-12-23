import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  YAxis,
} from "recharts";
import {
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Shield,
  Calendar,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Play,
  Target,
  Bell,
  FileText,
  Filter,
  Activity,
  Award,
  Sparkles,
  LineChart,
  Target as TargetIcon,
  Brain,
  Rocket,
  Timer,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";

const ProductivityHomepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating animation for elements
  const floatingElements = [
    { top: "15%", left: "10%", delay: "0s", size: "w-16 h-16" },
    { top: "25%", right: "15%", delay: "1s", size: "w-12 h-12" },
    { bottom: "30%", left: "20%", delay: "2s", size: "w-20 h-20" },
    { bottom: "20%", right: "25%", delay: "0.5s", size: "w-14 h-14" },
  ];

  const features = [
    {
      icon: Clock,
      title: "Smart Time Tracking",
      description:
        "Track your time with precision using our intuitive timer. Start, pause, and log your activities effortlessly.",
      gradient: "from-blue-500 to-cyan-500",
      details: [
        "One-click timer",
        "Manual time entry",
        "Activity categorization",
      ],
    },
    {
      icon: BarChart3,
      title: "Personal Analytics",
      description:
        "Comprehensive productivity insights with beautiful charts. Understand your work patterns and optimize your time.",
      gradient: "from-purple-500 to-pink-500",
      details: ["Real-time dashboards", "Trend analysis", "Custom reports"],
    },
    {
      icon: Target,
      title: "Goal Management",
      description:
        "Set daily and weekly goals. Track your progress and stay motivated with achievement tracking.",
      gradient: "from-green-500 to-emerald-500",
      details: [
        "Daily check-ins",
        "Progress tracking",
        "Milestone celebrations",
      ],
    },
  ];

  const stats = [
    {
      number: "Daily",
      label: "Time Tracking",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      number: "Smart",
      label: "Work Analysis",
      icon: Target,
      color: "text-green-400",
    },
    {
      number: "Focused",
      label: "Productivity Insights",
      icon: Users,
      color: "text-purple-400",
    },
    {
      number: "Visual",
      label: "Analytics Dashboard",
      icon: Award,
      color: "text-yellow-400",
    },
  ];

  const projectFeatures = [
    {
      icon: Zap,
      title: "Instant Insights",
      desc: "Real-time productivity analytics",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      desc: "Monitor your daily and weekly goals",
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      desc: "Export your data anytime",
    },
    {
      icon: Filter,
      title: "Advanced Filters",
      desc: "Custom date range analysis",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Your data is always protected",
    },
    {
      icon: Activity,
      title: "Live Dashboard",
      desc: "Track progress in real-time",
    },
  ];

  const testimonials = [
    {
      text: "This app has completely transformed how I manage my time. The analytics are incredibly insightful!",
      author: "Sarah Johnson",
      role: "Freelance Designer",
      rating: 5,
    },
    {
      text: "The best time tracking tool I've used. Simple, powerful, and beautifully designed.",
      author: "Michael Chen",
      role: "Software Developer",
      rating: 5,
    },
    {
      text: "Finally, a productivity tracker that actually helps me be more productive. Love the daily check-in feature!",
      author: "Emily Rodriguez",
      role: "Project Manager",
      rating: 5,
    },
  ];

  const focusData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 4.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 4.5 },
    { day: "Sat", hours: 1.5 },
    { day: "Sun", hours: 2.0 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-b border-slate-800"
            : "bg-transparent"
        }`}
      >
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-fadeIn">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-slate-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#showcase"
                className="block text-slate-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Showcase
              </a>
              <a
                href="#testimonials"
                className="block text-slate-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <a
                href="/login"
                className="block text-slate-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/login"
                className="block w-full text-center px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-purple-950/30 to-blue-950/30"></div>

          {/* Animated grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px),
                                linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          {/* Floating elements */}
          {floatingElements.map((el, i) => (
            <div
              key={i}
              className={`absolute ${el.size} rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 animate-float`}
              style={{
                top: el.top,
                left: el.left,
                right: el.right,
                bottom: el.bottom,
                animationDelay: el.delay,
              }}
            ></div>
          ))}

          {/* Pulsing orbs */}
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse-glow"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse-glow"></div>

          {/* Particle effects */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 3}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            {/* Animated tag */}
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm animate-fadeIn group hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-medium">
                Data-Driven Productivity • Actionable Time Insights
              </span>
            </div>

            {/* Main headline with enhanced gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-fadeIn">
              <span className="relative">
                <span className="relative z-10 bg-linear-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient-shift">
                  Master Your Time,
                </span>
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 -z-10"></div>
              </span>
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-white">
                <span className="relative">
                  Boost Your Productivity
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fadeIn">
              The ultimate productivity platform. Track, analyze, and optimize
              your workflow with intelligent insights and beautiful
              visualizations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn">
              <a
                href="/login"
                className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium text-lg transition-all hover:shadow-xl hover:shadow-blue-500/50 flex items-center space-x-2 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Get Started</span>
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </a>
              {/* <button className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg font-medium text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center space-x-2 backdrop-blur-sm">
                <Play className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>Watch Demo</span>
              </button> */}
              <a
                href="https://www.youtube.com/watch?v=9-d7LaWaafU"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg font-medium text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center space-x-2 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Stats with icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto animate-fadeIn">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-slate-800 to-slate-900 mb-3 group-hover:from-blue-900/30 group-hover:to-purple-900/30 transition-all border border-slate-700 group-hover:border-blue-500/50">
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Dashboard Preview */}
          <div className="relative animate-fadeIn">
            <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group hover:scale-[1.02]">
              {/* Dashboard header */}
              <div className="bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-lg">
                      Live Productivity Dashboard
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-slate-400">
                      <Timer className="w-4 h-4" />
                      <span>
                        {time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm p-8">
                <div className="space-y-8">
                  {/* Action buttons with glow */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button className="group relative bg-linear-to-r from-green-500/10 to-emerald-600/10 hover:from-green-600/20 hover:to-emerald-700/20 p-6 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2 border border-green-500/30 hover:border-green-400/50">
                      <div className="absolute inset-0 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <span className="text-2xl group-hover:scale-125 transition-transform">
                        +
                      </span>
                      <span className="text-green-400">Add Task</span>
                    </button>
                    <button className="group relative bg-linear-to-r from-blue-500/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-700/20 p-6 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2 border border-blue-500/30 hover:border-blue-400/50">
                      <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400">Daily Check-in</span>
                    </button>
                    <button className="group relative bg-linear-to-r from-orange-500/10 to-amber-600/10 hover:from-orange-600/20 hover:to-amber-700/20 p-6 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2 border border-orange-500/30 hover:border-orange-400/50">
                      <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-amber-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <Clock className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400">Log Time</span>
                    </button>
                  </div>

                  {/* Stats and charts grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity Card */}
                    <div className="relative bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group">
                      <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <span>Recent Activity</span>
                          </h3>
                          <button className="text-blue-400 text-sm hover:text-blue-300 transition flex items-center space-x-1">
                            <span>View All</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {[
                            {
                              icon: TargetIcon,
                              activity: "Completed: Project Review",
                              time: "2 hours ago",
                              color: "text-green-400",
                            },
                            {
                              icon: Brain,
                              activity: "Focus Session: 2h 15m",
                              time: "4 hours ago",
                              color: "text-blue-400",
                            },
                            {
                              icon: LineChart,
                              activity: "Analytics Report Generated",
                              time: "6 hours ago",
                              color: "text-purple-400",
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg ${item.color.replace(
                                    "text",
                                    "bg"
                                  )}/10`}
                                >
                                  <item.icon
                                    className={`w-4 h-4 ${item.color}`}
                                  />
                                </div>
                                <span className="text-sm">{item.activity}</span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {item.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Focus Trends Card */}
                    <div className="relative bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group">
                      <div className="absolute -inset-1 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative">
                        <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                          <TrendingUpIcon className="w-5 h-5 text-purple-400" />
                          <span>Focus Trends</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={focusData}
                                margin={{
                                  top: 0,
                                  right: 0,
                                  left: -20,
                                  bottom: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="focusGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                  </linearGradient>
                                </defs>
                                <XAxis
                                  dataKey="day"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                                  dy={10}
                                />
                                <YAxis hide={true} domain={[0, 5]} />
                                <Tooltip
                                  cursor={{ fill: "#334155", opacity: 0.2 }}
                                  contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "#f8fafc",
                                  }}
                                  formatter={(value) => [
                                    `${value} hrs`,
                                    "Focus Time",
                                  ]}
                                />
                                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                  {focusData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill="url(#focusGradient)"
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productivity Score */}
                  <div className="relative bg-linear-to-r from-blue-500/10 to-purple-500/10 backdrop-blur rounded-2xl p-6 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">
                          Today's Productivity Score
                        </h4>
                        <p className="text-sm text-slate-400">
                          Based on your focus time and task completion
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          87%
                        </div>
                        <div className="text-sm text-green-400 flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>+12% from yesterday</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-1000"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges around dashboard */}
            <div
              className="absolute -top-3 -left-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium animate-float"
              style={{ animationDelay: "1s" }}
            >
              🚀 Live Preview
            </div>
            <div
              className="absolute -bottom-3 -right-3 bg-linear-to-r from-green-600 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium animate-float"
              style={{ animationDelay: "2s" }}
            >
              ⚡ Real-time Data
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your code remains the same... */}
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Stay Productive
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to help you work smarter, not harder
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2 text-sm text-slate-400"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectFeatures.map((item, i) => (
              <div
                key={i}
                className="flex items-start space-x-4 p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition border border-slate-700/50"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductivityHomepage;
