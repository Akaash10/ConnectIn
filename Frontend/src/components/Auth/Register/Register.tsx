import { useState } from "react";
import "./Register.css";
import { VALIDATION_LIMITS, PASSWORD_PATTERNS } from "../../../constants/appConstants";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (userData: any) => void;
}

const Register = ({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (value: string): string | undefined => {
    if (!value) {
      return "Name is required";
    }
    if (value.length < VALIDATION_LIMITS.NAME_MIN_LENGTH) {
      return `Name must be at least ${VALIDATION_LIMITS.NAME_MIN_LENGTH} characters`;
    }
    if (value.length > VALIDATION_LIMITS.NAME_MAX_LENGTH) {
      return `Name must be less than ${VALIDATION_LIMITS.NAME_MAX_LENGTH} characters`;
    }
    return undefined;
  };

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
    if (value.length < VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} characters`;
    }
    if (!PASSWORD_PATTERNS.HAS_LOWERCASE.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!PASSWORD_PATTERNS.HAS_UPPERCASE.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!PASSWORD_PATTERNS.HAS_NUMBER.test(value)) {
      return "Password must contain at least one number";
    }
    return undefined;
  };

  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== formData.password) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      let error: string | undefined;
      switch (field) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(value);
          break;
      }
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: string) => {
    let error: string | undefined;
    const value = formData[field as keyof typeof formData];

    switch (field) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value);
        break;
    }

    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: formData.name,
        email: formData.email,
        id: Date.now()
      };

      setIsSubmitting(false);
      onRegisterSuccess(userData);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo">Cin</div>
          <h1>Make the most of your professional life</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? "error" : ""}`}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className={`form-input ${errors.email ? "error" : ""}`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password (8+ characters with uppercase, lowercase, and number)
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <p className="terms-text">
            By clicking Agree & Join, you agree to the ConnectIn User Agreement,
            Privacy Policy, and Cookie Policy.
          </p>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Agree & Join"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <p>
            Already on ConnectIn?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
