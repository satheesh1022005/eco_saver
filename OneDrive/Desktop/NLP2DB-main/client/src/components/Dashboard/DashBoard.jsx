import React, { useState, useEffect } from "react";
import { HomeNavBar } from "../../pages/index";
import "./DashBoard.css";
import { toast } from "react-toastify";
import { logout } from "../../services/AuthServices";
import axiosHeader from "../../services/axiosHeader"; // Assuming axiosHeader is configured for authenticated requests
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineFolderAdd, AiOutlineDelete } from "react-icons/ai";
function DashBoard() {
  const [projects, setProjects] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axiosHeader.get(`/project/get-projects`);
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };
  //console.log(userData);
  useEffect(() => {
    fetchProjects();
  }, [userData.userInfo.id]);

  // Handle input changes for creating a project
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  // Handle project creation
  const handleCreateProject = async () => {
    try {
      const response = await axiosHeader.post("/project/create-project", {
        name: newProject.name,
        description: newProject.description,
      });
      if (response.status === 201) {
        fetchProjects();
        setNewProject({
          name: "",
          description: "",
          createdAt: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Error creating project:", error.message);
    }
  };

  // Handle search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter projects based on search term
  const filteredProjects =
    searchTerm === ""
      ? projects
      : projects.filter(
          (project) =>
            project.project_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
  const handleProjectEditor = (id) => {
    navigate("/project/" + id);
  };
  const navBarData = {
    name: "NLP2DB",
    logo: true,
    menuItems: [
      { label: "Dashboard", action: () => navigate("/dashboard/" + id) },
      { label: "Logout", action: () => logout(navigate) },
    ],
  };
  const handleDeleteProject = async (id) => {
    try {
      const response = await axiosHeader.delete(
        `/project/delete-project/${id}`
      );
      if (response.status === 200) {
        fetchProjects();
        toast.success("Project deleted successfully", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };
  //console.log(projects);
  //console.log(filteredProjects);
  return (
    <>
      <HomeNavBar navBarData={navBarData} />
      <div className="dashboard-container">
        <div className="dashboard-columns">
          {/* Left Column: Project List */}
          <div className="projects-column">
            <header className="dashboard-header">
              <h1>Top Designs</h1>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-field"
              />
            </header>
            <div
              className={
                filteredProjects.length == 0 ? "no-projects" : "project-list"
              }
            >
              {filteredProjects.length == 0 ? (
                <div className="no-projects-container">
                  <div className="logo-container">
                    <AiOutlineFolderAdd size={50} color="#00b7ff" />
                  </div>
                  <div className="no-projects-message">
                    <h3>No projects to list</h3>
                    <p>Start by creating a new project to get started.</p>
                  </div>
                </div>
              ) : (
                filteredProjects.map((project, index) => (
                  <div
                    key={index}
                    className="project-card"
                    onClick={() => handleProjectEditor(project.project_id)}
                  >
                    <h2 className="project-name">{project.project_name}</h2>
                    <AiOutlineDelete
                      size={20}
                      className="delete-project-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click event
                        handleDeleteProject(project.project_id);
                      }}
                    />
                    <p className="project-description">{project.description}</p>
                    <span className="project-date">
                      Created on: {project.created_at.substring(0, 10)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Info and Create Project */}
          <div className="info-column">
            <div className="user-info">
              <h2>Welcome, {userData.userInfo.name}!</h2>
              <p>Manage your database projects efficiently.</p>
            </div>
            <div className="create-project-section">
              <h3>Create a New Project</h3>
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={newProject.name}
                onChange={handleInputChange}
                className="input-field"
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={newProject.description}
                onChange={handleInputChange}
                className="input-field"
              ></textarea>
              <button
                className="create-project-btn"
                onClick={handleCreateProject}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
