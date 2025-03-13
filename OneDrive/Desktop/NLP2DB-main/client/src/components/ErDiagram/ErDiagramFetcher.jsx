import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosHeader from "../../services/axiosHeader";
import MermaidERDiagram from "./MermaidERDiagram";
import "./style.css";

const ErDiagramFetcher = ({
  erDiagram,
  setErDiagram,
  chatHistory,
  setChatHistory,
  updateErdiagram,
  generateMermaidCode,
  projectId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  // Function to fetch the ER diagram
  const fetchErDiagram = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetch
    setChatHistory((prev) => [...prev, { type: "user", text: input }]);
    try {
      const data = await axios.post(
        "http://127.0.0.1:5000/generate-er-prompt",
        {
          requirement: input,
        }
      );
      //console.log(data.data.er_model_prompt);
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-er",
        {
          description: data.data.er_model_prompt,
        }
      );
      // Extract the ER diagram from response
      const jsonString = response.data.er_diagram.replace(/```json\n|```/g, "");
      const parsedDiagram = JSON.parse(jsonString); // Parse the cleaned JSON string
      /*erDiagram == {} ? setErDiagram({ ...parsedDiagram }) : null;*/
      await axiosHeader.post("/project/create-history", {
        projectId,
        queryText: input,
        queryResult: parsedDiagram,
      });
      setChatHistory((prev) => [
        ...prev,
        { type: "system", diagram: parsedDiagram },
      ]);
    } catch (err) {
      // More informative error handling
      console.error("Error fetching ER diagram:", err);
      setError(err.response ? err.response.data : "Error fetching data");
      setErDiagram({}); // Reset ER diagram on error
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };
  const changeErDiagram = (parsedDiagram) => {
    setErDiagram({ ...parsedDiagram });
    //updateErdiagram();
  };
  useEffect(() => {
    if (erDiagram && Object.keys(erDiagram).length > 0) {
      updateErdiagram();
    }
  }, [erDiagram]);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosHeader.get(`/project/queries/${projectId}`);
        console.log("Query history:", response);
        const historyMessages = response.data.flatMap((history) => [
          {
            type: "user",
            text: history.query_text, // User query text
          },
          {
            type: "system",
            diagram: history.query_result, // System diagram (ER diagram)
          },
        ]);
        // Update the chat history state with both user and system messages
        setChatHistory(historyMessages);
      } catch (err) {
        console.error("Error fetching query history:", err);
        setError("Error fetching query history");
      }
    };

    fetchHistory();
  }, [projectId]);
  //if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  //console.log(chatHistory);
  return (
    <div className="chat-container">
      <div className="chat-window">
        <h2 className="chat-header">ER Diagram Generator</h2>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.type === "user" ? "user-message" : "system-message"
            }`}
          >
            {message.type === "user" ? (
              <p>{message.text}</p>
            ) : message.diagram ? (
              <>
                <MermaidERDiagram
                  key={index}
                  chat={true}
                  generateMermaidCode={() =>
                    generateMermaidCode(message.diagram)
                  }
                />
                <button onClick={() => changeErDiagram(message.diagram)}>
                  Save Diagram
                </button>
              </>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        ))}

        {loading && <p className="loading">Generating diagram...</p>}
        {error && <p className="error">Error: {error}</p>}
      </div>

      <div className="chat-input-container">
        <textarea
          type="text"
          value={input}
          className="chat-input"
          placeholder="Describe your ER diagram..."
          onChange={(e) => setInput(e.target.value)}
          rows={1}
        />
        <button onClick={fetchErDiagram} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ErDiagramFetcher;
