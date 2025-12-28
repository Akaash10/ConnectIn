import { useState } from "react";
import "./Login.css";
import { VALIDATION_LIMITS, STORAGE_KEYS } from "../../../constants/appConstants";

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login = ({ onSwitchToRegister, onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return "Email is required";
    }
    if (!VALIDATION_LIMITS.EMAIL_PATTERN.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      const error = validateEmail(value);
      setErrors({ ...errors, email: error });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      const error = validatePassword(value);
      setErrors({ ...errors, password: error });
    }
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setErrors({ ...errors, email: error });
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setErrors({ ...errors, password: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any valid credentials
      // In production, this would validate against backend
      const currentUser = {
        id: Date.now(),
        name: "John Doe",
        email: email,
        headline: "Professional",
        location: "",
        bio: "",
        avatarUrl: null,
        profileViews: 0,
        connections: 0,
        roles: ["General"]
      };

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

      setIsSubmitting(false);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Cin</div>
          <h1>Sign in</h1>
          <p>Stay updated on your professional world</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className={`form-input ${errors.email ? "error" : ""}`}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder="Password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <p>
            New to ConnectIn?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={onSwitchToRegister}
            >
              Join now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
