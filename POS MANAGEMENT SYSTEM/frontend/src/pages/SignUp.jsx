import React, { useState, useContext } from "react";
import "../styles/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import GoogleLoginComponent from "./GoogleLoginComponent";
import handleSubmit from "../actions/signUp/handleSubmit";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Owner");
  const [notification, setNotification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userID, setUserID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1); // Controls which part of the form to display

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const generateUserID = (callback) => {
    const userID = `USER-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    callback(null, userID);
  };

  // Password validation regex: at least one lowercase letter, one uppercase letter, and one number
  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
  };

  // Password strength meter
  const getPasswordStrength = (password) => {
    if (password.length >= 8 && isPasswordValid(password)) {
      return "Strong";
    } else if (password.length >= 6) {
      return "Medium";
    }
    return "Weak";
  };

  const closeModal = () => {
    setModalVisible(false);
    navigate("/welcome", {
      state: { firstName, lastName, role, username, email, userID },
    });
  };

  const goToNextStep = () => {
    setStep(2);
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => {
          if (step === 2) {
            setStep(1); // Go back to the first step
          } else {
            navigate("/"); // Navigate to the home page or desired route
          }
        }}
      >
        ← Back
      </button>

      <div className="signup-box">
        {notification && <div className="notification">{notification}</div>}
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>

        {/* Step 1: First Name and Last Name */}
        {step === 1 && (
          <form>
            <div className="first-name">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="name-input"
              />
            </div>
            <div className="last-name">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="name-input"
              />
            </div>
            <div className="form-section">
              <div className="next-button-container">
                <button
                  type="button"
                  className="next-button"
                  onClick={(e) => {
                    const form = e.target.closest("form");
                    if (form.checkValidity()) {
                      goToNextStep();
                    } else {
                      form.reportValidity();
                    }
                  }}
                >
                  Next
                </button>
              </div>

              {/* "Already have an account?" link */}
              <div className="account-link-container">
                <p>
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Rest of the Form */}
        {step === 2 && (
          <form
            onSubmit={(e) =>
              handleSubmit({
                e,
                password,
                confirmPassword,
                setNotification,
                generateUserID,
                setUserID,
                role,
                firstName,
                lastName,
                email,
                username,
                setUser,
                setModalVisible,
              })
            }
          >
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group password-group">
                <label>Password</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span onClick={togglePasswordVisibility} className="eye-icon">
                    {showPassword ? "👁️" : "🙈"}
                  </span>
                </div>
                {password && !isPasswordValid(password) && (
                  <p className="small-error-message">
                    Password must include at least one lowercase letter, one
                    uppercase letter, and one number.
                  </p>
                )}
                {password && (
                  <p className="password-strength">
                    Strength: {getPasswordStrength(password)}
                  </p>
                )}
              </div>

              <div className="form-group password-group">
                <label>Confirm Password</label>
                <div className="input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="eye-icon"
                  >
                    {showConfirmPassword ? "👁️" : "🙈"}
                  </span>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="small-error-message">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <div className="role">
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                  required
                >
                  <option value="Owner">Owner</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>
            </div>
            <div className="action-buttons">
              <button type="submit" className="register-button">
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Alternative buttons for login and Google sign-in */}
        <div className="alternative-buttons">
          <p>Or</p>
          <GoogleLoginComponent />
        </div>
      </div>
      {modalVisible && (
        <div className="userID-modal">
          <div className="userID-modal-content">
            <h2>Registration Successful</h2>
            <p>Your User ID is:</p>
            <strong>{userID}</strong>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
