import React, { useState } from "react";
import SQLResultTable from "./SQLResultTable";
import "./ExecuteSQL.css";
import axiosHeader from "../../services/axiosHeader";
import { toast } from "react-toastify";
const ExecuteSQL = ({ databaseId }) => {
  const [sqlQuery, setSqlQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState("");

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast("Please enter a valid SQL query.", {
        type: "error",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    findQueryType(sqlQuery);
    try {
      const response = await axiosHeader.post(`/execute-query/${databaseId}`, {
        query: sqlQuery,
      });

      setResult(response.data.data);
    } catch (err) {
      setError(
        "Error executing SQL query: " + err.response?.data.message ||
          err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const findQueryType = (query) => {
    const queryLower = query.toLowerCase();
    if (queryLower.includes("select")) setQueryType("SELECT");
    else if (queryLower.includes("insert")) setQueryType("INSERT");
    else if (queryLower.includes("update")) setQueryType("UPDATE");
    else if (queryLower.includes("delete")) setQueryType("DELETE");
    else if (queryLower.includes("create")) setQueryType("CREATE");
    else if (queryLower.includes("drop")) setQueryType("DROP");
    else if (queryLower.includes("alter")) setQueryType("ALTER");
    else if (queryLower.includes("truncate")) setQueryType("TRUNCATE");
    else if (queryLower.includes("rename")) setQueryType("RENAME");
    else setQueryType("OTHER");
  };

  return (
    <div className="execute-sql-container">
      <h2>SQL Query Executor</h2>
      <div className="sql-input-container">
        <textarea
          value={sqlQuery}
          onChange={handleQueryChange}
          rows={6}
          placeholder="Write your SQL query here..."
        />
        <button
          className="execute-button"
          onClick={executeQuery}
          disabled={loading}
        >
          {loading ? "Executing..." : "Run Query"}
        </button>
      </div>

      {result && (
        <div className="result-container">
          <h3>Query Result:</h3>
          <SQLResultTable data={result} queryType={queryType} />
        </div>
      )}

      {error && (
        <div className="error-container">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ExecuteSQL;
