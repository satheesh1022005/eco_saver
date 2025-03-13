import React, { useEffect, useState } from "react";
import "./Landing.css";
import wf1 from "../assets/wf1.jpg";
import wf2 from "../assets/wf2.jpg";
import wf3 from "../assets/wf3.jpg";
import wf4 from "../assets/wf4.jpg";
import Auth from "../components/Auth/Auth";
function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const generateStars = () => {
    const starContainer = document.getElementById("stars-container");
    const numStars = 100; // Adjust the number of stars as needed

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      // Randomize position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      // Apply position
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;

      // Append star to container
      starContainer.appendChild(star);
    }
  };

  useEffect(() => {
    generateStars();
  }, []);
  return (
    <div className="landing-container">
      {/* Background GIF */}
      <div id="stars-container"></div>

      {/* Navbar */}
      <div className="navbar">
        <div className="logo">NLP2DB</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/* Hero Section */}
      {!showAuth ? (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">AI-Powered Database Creation</h1>
            <p className="hero-description">
              Automate your database creation, from requirements to deployment.
              Step into the future of database management.
            </p>
            <button
              className="cta-button"
              onClick={() => setShowAuth((prev) => !prev)}
            >
              Get Started
            </button>
          </div>
          {/* Features Section with Animation */}
          <div className="features-section">
            <h2 className="features-title">Our Workflow</h2>
            <div className="workflow-container">
              <div className="workflow-circle requirement">
                <div className="circle">
                  <img src={wf1} alt="wf1" />
                </div>
                <p>Requirement</p>
              </div>
              <div className="arrow arrow-1"></div>
              <div className="workflow-circle erdiagram">
                <div className="circle">
                  <img src={wf2} alt="wf2" />
                </div>
                <p>ER Diagram</p>
              </div>
              <div className="arrow arrow-2"></div>
              <div className="workflow-circle refinement">
                <div className="circle">
                  <img src={wf3} alt="wf3" />
                </div>
                <p>Refinement</p>
              </div>
              <div className="arrow arrow-3"></div>
              <div className="workflow-circle deployment">
                <div className="circle">
                  <img src={wf4} alt="wf4" />
                </div>
                <p>Deployment</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Auth setShowAuth={setShowAuth} />
      )}
      {/* Floating Lights */}
      <div className="floating-lights">
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
      </div>
    </div>
  );
}

export default Landing;
