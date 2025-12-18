import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiKey } from "react-icons/fi";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import loginPage from "../assets/loginPage.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Provide a fallback or handle securely
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(0);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 2) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setGeneratedOtp(data.otp);

      // Send Email via EmailJS
      const templateParams = {
        to_email: email,
        to_name: data.name || "User",
        otp: data.otp,
        message: `Your OTP for password reset is: ${data.otp}`,
      };

      try {
        // If the user has configured .env for these, we could use them:
        if (import.meta.env.VITE_EMAILJS_SERVICE_ID) {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
        } else {
          toast.info("EmailJS keys missing. OTP logged to console.");
        }

        toast.success("OTP sent to your email");
        setStep(2);
        setResendTimer(60); // 1 minute
        setOtpExpiryTimer(300); // 5 minutes
      } catch (emailError) {
        console.error("EmailJS Error:", emailError);
        toast.error("Failed to send email. Check console for details.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpInput = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("OTP verified successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-300">
      {/* IMAGE SIDE */}
      <div className="relative w-full md:w-1/2 h-72 md:h-auto">
        <img
          src={loginPage}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wide">
              Productivity Tracker
            </h1>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm transition"
            >
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight max-w-md">
              Recover access to your account
            </h2>
          </div>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="flex-1 dark:bg-slate-800 sm:px-10 flex justify-center items-center bg-[#e2595960]">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
          {step === 1 && (
            <form onSubmit={sendOtp} className="fade-in">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Forgot Password
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Enter your email to receive an OTP.
              </p>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtpInput} className="fade-in">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Enter OTP
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                We sent a code to{" "}
                <span className="font-semibold text-red-500">{email}</span>
              </p>

              <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300 text-center">
                OTP valid for:{" "}
                <span className="font-bold">
                  {Math.floor(otpExpiryTimer / 60)}:
                  {(otpExpiryTimer % 60).toString().padStart(2, "0")}
                </span>
              </div>

              <div className="relative">
                <FiKey className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none transition-all tracking-widest text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otpExpiryTimer === 0}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Did not receive OTP?
                </p>
                {resendTimer > 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Resend in{" "}
                    <span className="font-semibold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="mt-1 text-red-500 hover:underline font-semibold text-sm disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm"
              >
                Change Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetUserPassword} className="fade-in">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Reset Password
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create a new secure password.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
