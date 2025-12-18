import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import loginPage from "../assets/loginPage.png";
import { getRandomQuote } from "../constants";
import useSignup from "../hooks/auth/useSignup";
import useGoogleLogin from "../hooks/auth/useGoogleLogin";

const SignUp = () => {
  const [quote, setQuote] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const { signup, loading } = useSignup();
  const { googleLogin, loading: googleLoading } = useGoogleLogin();

  useEffect(() => {
    let quote = getRandomQuote();
    setQuote(quote);
    const interval = setInterval(() => {
      quote = getRandomQuote();
      setQuote(quote);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ firstName, lastName, email, password });
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
            <h1 className="text-2xl font-bold tracking-wide">TimeFlow</h1>
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm transition"
            >
              <FiArrowLeft /> Back to website
            </Link>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight max-w-md">
              {quote}
            </h2>
          </div>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="flex-1 dark:bg-slate-800 sm:px-10 flex justify-center items-center bg-[#e2595960]">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name (optional)"
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none"
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-transparent focus:border-red-400 outline-none"
            />

            <label className="flex items-center gap-2 mt-4 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-red-600"
              />
              I agree to the{" "}
              <Link to="#" className="text-red-500 hover:underline">
                Terms & Conditions
              </Link>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Signing up..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Or register with
            </div>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <div className="mt-4 w-full">
            <button
              onClick={googleLogin}
              disabled={googleLoading}
              className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition dark:text-white cursor-pointer disabled:opacity-50"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
