import React, { useState } from "react";
import "./Auth.css";
import { FaArrowLeft } from "react-icons/fa"; // Importing the back arrow icon
import { useAuth } from "../../services/AuthContext"; // Importing AuthContext
import { register, login } from "../../services/AuthServices"; // Importing auth services
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
function Auth({ setShowAuth }) {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: authLogin } = useAuth(); // Use login from AuthContext

  const handleToggle = () => {
    setIsSignup(!isSignup); // Toggle form between login and signup
    setError(""); // Clear error message
  };

  const handleBackClick = () => {
    setShowAuth(false); // Close the auth component when the back icon is clicked
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Handle Signup
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        Swal.fire({
          title: "Account Created Successfull!",
          text: "Verification link sent! Check your email to confirm your account.",
          icon: "success",
          confirmButtonText: "OK",
          background: "#333", // Dark background
          color: "#fff", // White text color
          confirmButtonColor: "#00b7ff", // Button color
          cancelButtonColor: "#f44336", // Optional cancel button color
        });
        setIsSignup(false); // Switch to login form
      } else {
        // Handle Login
        const user = await login({
          email: formData.email,
          password: formData.password,
        });
        //console.log("login", user);
        handleOAuthTokenRefresh();
        authLogin(user); // Update user in AuthContext
        //console.log(user);
        toast("Login Successfull", { type: "success", autoClose: 2000 });
      }
    } catch (err) {
      //console.log(err);
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
      toast(err.response?.data?.msg || "An error occurred. Please try again.", {
        type: "error",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleOAuthTokenRefresh = async () => {
    try {
      const response = await axios.get(
        "https://nlp2db-bot.onrender.com/get-auth-url"
      );

      // Validate response structure
      if (!response.data || typeof response.data.success === "undefined") {
        throw new Error("Invalid response format from the server.");
      }

      // Check if the response indicates failure
      if (!response.data.success) {
        const authUrl = response.data.auth_url;

        // Validate authUrl before attempting to open it
        if (authUrl && typeof authUrl === "string") {
          window.open(authUrl, "_blank");
        } else {
          throw new Error(
            "Invalid or missing auth_url in the server response."
          );
        }
      }
    } catch (err) {
      // Log the error for debugging
      console.error("Error during OAuth token refresh:", err);

      // Optionally, display a user-friendly error message
      toast("An error occurred during OAuth token refresh.", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <div className="back-button" onClick={handleBackClick}>
        <FaArrowLeft size={24} color="#ecf0f1" />
      </div>
      <h1>{isSignup ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="name"
            name="name"
            placeholder="Enter your user name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {isSignup && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        {error && <p className="error-text">{error}</p>} {/* Error message */}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <p className="toggle-form-text">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <span className="toggle-link" onClick={handleToggle}>
              Login
            </span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span className="toggle-link" onClick={handleToggle}>
              Sign Up
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default Auth;
