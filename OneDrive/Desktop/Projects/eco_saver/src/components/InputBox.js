import { useState } from "react";
import './ChatWindow.css'
const InputBox = ({ sendMessage, loading }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  const handleButtonClick = () => {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="input-box">
      {loading && <progress style={{ width: "100%" }} />}
      <div className="input-container">
        <input
          disabled={loading}
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={loading ? "Loading..." : input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="prompt-button">
        <button 
          className="btn btn-primary"
          onClick={handleButtonClick}
          disabled={loading}
        >
          Send
        </button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
