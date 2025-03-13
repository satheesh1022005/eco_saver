import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Landing } from "./pages/index";
import Auth from "./components/Auth/Auth";
import axiosHeader from "./services/axiosHeader";
import DashBoard from "./components/Dashboard/DashBoard";
import Editor from "./components/Project/Editor";
import { useAuth } from "./services/AuthContext";
function App() {
  const [data, setData] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosHeader.get("/auth/getUser");
        //localStorage.setItem("data", JSON.stringify(response.data));
        console.log(response.data);
        setData(response.data); //Store the data in state
        //navigate("/dashboard/" + response.data.user_id);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      }
    };

    if (user) {
      // Fetch data only if 'user' exists
      fetchData();
    }
    //console.log(user);
  }, [user]);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        {user ? (
          <Route path="/dashboard/:id" element={<DashBoard />} />
        ) : (
          navigate("/")
        )}
        {user ? (
          <Route path="/project/:id" element={<Editor />} />
        ) : (
          navigate("/")
        )}
      </Routes>
    </>
  );
}

export default App;
