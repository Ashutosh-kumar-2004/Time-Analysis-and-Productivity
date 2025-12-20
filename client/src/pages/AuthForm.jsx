import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useLogin from "../hooks/auth/useLogin";
import useSignup from "../hooks/auth/useSignup";
import useGoogleLogin from "../hooks/auth/useGoogleLogin";
import { toast } from "react-toastify";

export default function AuthForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup State
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const { login, loading: loginLoading } = useLogin();
  const { signup, loading: signupLoading } = useSignup();
  const { googleLogin, loading: googleLoading } = useGoogleLogin();

  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
  }, [location.pathname]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    const res = await login({ email: loginEmail, password: loginPassword });
    if (res) {
      navigate("/dashboard");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupUsername || !signupEmail || !signupPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    // Mapping Username to firstName, leaving lastName empty as per new UI constraints
    const res = await signup({
      firstName: signupUsername,
      lastName: "",
      email: signupEmail,
      password: signupPassword,
    });

    if (res) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    await googleLogin();
    // Navigate is handled by context or we might need to manually do it if googleLogin doesn't.
    // useGoogleLogin usually updates context.
    navigate("/dashboard");
  };

  const toggleMode = (mode) => {
    setIsSignup(mode);
    const path = mode ? "/signup" : "/login";
    window.history.pushState(null, "", path); // Optional: change URL without reload
  };

  return (
    <div className="app-container">
      <div className={`auth-wrapper ${isSignup ? "toggled" : ""}`}>
        {/* Background shapes */}
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* LOGIN FORM */}
        <div className="credentials-panel signin">
          <form className="auth-form-content" onSubmit={handleLoginSubmit}>
            <h2 className="slide-element">Login</h2>

            <div className="field-wrapper slide-element">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label>Email</label>
              <FaEnvelope className="input-icon" />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <label>Password</label>
              <FaLock className="input-icon" />
            </div>

            <div
              className="forgot-password-link slide-element"
              style={{ width: "100%", textAlign: "right", marginTop: "10px" }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="slide-element" style={{ marginTop: "15px" }}>
              <button className="submit-button" disabled={loginLoading}>
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="divider slide-element">
              <span>or</span>
            </div>

            <div className="slide-element">
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <FcGoogle /> Sign in with Google
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Don't have an account? <br />
                <button type="button" onClick={() => toggleMode(true)}>
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* SIGNUP FORM */}
        <div className="credentials-panel signup">
          <form className="auth-form-content" onSubmit={handleSignupSubmit}>
            <h2 className="slide-element">Register</h2>

            <div className="field-wrapper slide-element">
              <input
                type="text"
                required
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
              />
              <label>Username</label>
              <FaUser className="input-icon" />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <label>Email</label>
              <FaEnvelope className="input-icon" />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <label>Password</label>
              <FaLock className="input-icon" />
            </div>

            <div className="slide-element" style={{ marginTop: "25px" }}>
              <button className="submit-button" disabled={signupLoading}>
                {signupLoading ? "Registering..." : "Register"}
              </button>
            </div>

            <div className="divider slide-element">
              <span>or</span>
            </div>

            <div className="slide-element">
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <FcGoogle /> Sign up with Google
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Already have an account? <br />
                <button type="button" onClick={() => toggleMode(false)}>
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Text - Login */}
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* Welcome Text - Signup */}
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>
    </div>
  );
}
