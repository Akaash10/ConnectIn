import { useState, useRef, useEffect } from "react";
import "../Login/Login.css";
import "./CompleteProfile.css";
import api from "../../../api/api";
import { TRADE_CATEGORIES, VALIDATION_LIMITS, STORAGE_KEYS } from "../../../constants/appConstants";
import { showNotification } from "../../Notification/Notification";

interface CompleteProfileProps {
  userData: any;
  onComplete: () => void;
}

const CompleteProfile = ({ userData, onComplete }: CompleteProfileProps) => {
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["General"]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{
    bio?: string;
    headline?: string;
    roles?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateBio = (value: string): string | undefined => {
    if (value.length > VALIDATION_LIMITS.BIO_MAX_LENGTH) {
      return `Bio must be less than ${VALIDATION_LIMITS.BIO_MAX_LENGTH} characters`;
    }
    return undefined;
  };

  const validateHeadline = (value: string): string | undefined => {
    if (!value) {
      return "Headline is required";
    }
    if (value.length > VALIDATION_LIMITS.HEADLINE_MAX_LENGTH) {
      return `Headline must be less than ${VALIDATION_LIMITS.HEADLINE_MAX_LENGTH} characters`;
    }
    return undefined;
  };

  const validateRoles = (roles: string[]): string | undefined => {
    if (roles.length === 0) {
      return "Please select at least one role";
    }
    return undefined;
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= VALIDATION_LIMITS.BIO_MAX_LENGTH) {
      setBio(value);
      if (errors.bio) {
        const error = validateBio(value);
        setErrors({ ...errors, bio: error });
      }
    }
  };

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= VALIDATION_LIMITS.HEADLINE_MAX_LENGTH) {
      setHeadline(value);
      if (errors.headline) {
        const error = validateHeadline(value);
        setErrors({ ...errors, headline: error });
      }
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= VALIDATION_LIMITS.LOCATION_MAX_LENGTH) {
      setLocation(value);
    }
  };

  const toggleRole = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];

    setSelectedRoles(newRoles);
    if (errors.roles) {
      const error = validateRoles(newRoles);
      setErrors({ ...errors, roles: error });
    }
  };

  const removeRole = (role: string) => {
    const newRoles = selectedRoles.filter(r => r !== role);
    setSelectedRoles(newRoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const headlineError = validateHeadline(headline);
    const bioError = validateBio(bio);
    const rolesError = validateRoles(selectedRoles);

    if (headlineError || bioError || rolesError) {
      setErrors({
        headline: headlineError,
        bio: bioError,
        roles: rolesError
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine registration data from step 1 with profile data from step 2
      const { data } = await api.post(
        "/auth/register",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          headline: headline,
          location: location || undefined,
          bio: bio || undefined,
          roles: selectedRoles
        },
        {
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        }
      );

      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

      // Transition to app first
      onComplete();

      // Show notification after page loads
      setTimeout(() => {
        showNotification("success", "Registration successful! Welcome to ConnectIn!");
      }, 100);
    } catch (error: any) {
      setErrors({
        headline: error.response?.data?.message || "Registration failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card complete-profile-card">
        <div className="auth-header">
          <div className="auth-logo">Cin</div>
          <h1>Complete your profile</h1>
          <p>Tell us about yourself to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="headline">
              Headline <span className="required">*</span>
            </label>
            <input
              id="headline"
              type="text"
              className={`form-input ${errors.headline ? "error" : ""}`}
              value={headline}
              onChange={handleHeadlineChange}
              onBlur={() => {
                const error = validateHeadline(headline);
                setErrors({ ...errors, headline: error });
              }}
              placeholder="e.g., Electrician at ABC Services"
            />
            <span className="char-count">
              {headline.length}/{VALIDATION_LIMITS.HEADLINE_MAX_LENGTH}
            </span>
            {errors.headline && <span className="error-message">{errors.headline}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              className="form-input"
              value={location}
              onChange={handleLocationChange}
              placeholder="e.g., New York, NY"
            />
            <span className="char-count">
              {location.length}/{VALIDATION_LIMITS.LOCATION_MAX_LENGTH}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="roles">
              Roles/Skills <span className="required">*</span>
            </label>
            <div className="multi-select-container" ref={dropdownRef}>
              <div
                className={`multi-select-trigger ${isDropdownOpen ? "open" : ""} ${errors.roles ? "error" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedRoles.length === 0 ? (
                  <span className="multi-select-placeholder">Select your roles</span>
                ) : (
                  <div className="multi-select-values">
                    {selectedRoles.map(role => (
                      <div key={role} className="multi-select-tag">
                        {role}
                        <button
                          type="button"
                          className="multi-select-tag-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRole(role);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <span className={`multi-select-arrow ${isDropdownOpen ? "open" : ""}`}>
                  ▼
                </span>
              </div>

              {isDropdownOpen && (
                <div className="multi-select-dropdown">
                  {TRADE_CATEGORIES.map(role => (
                    <div
                      key={role}
                      className="multi-select-option"
                      onClick={() => toggleRole(role)}
                    >
                      <div className={`multi-select-checkbox ${selectedRoles.includes(role) ? "checked" : ""}`} />
                      <span className="multi-select-option-label">{role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.roles && <span className="error-message">{errors.roles}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bio">About</label>
            <textarea
              id="bio"
              className={`form-textarea ${errors.bio ? "error" : ""}`}
              value={bio}
              onChange={handleBioChange}
              placeholder="Write a brief description about yourself..."
              rows={5}
            />
            <span className="char-count">
              {bio.length}/{VALIDATION_LIMITS.BIO_MAX_LENGTH}
            </span>
            {errors.bio && <span className="error-message">{errors.bio}</span>}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Completing..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
