import React, { useEffect, useState } from "react";
import axiosHeader from "../../services/axiosHeader";
import "./Deploy.css";
import ExecuteSQL from "../ErDiagram/ExecuteSQL";
import { toast } from "react-toastify";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
const Deploy = ({ erDiagram, id, setDeployView }) => {
  const [connectionDetails, setConnectionDetails] = useState({
    host: "",
    user: "",
    password: "",
    database: "",
    port: 3306,
    databaseId: "",
  });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [sqlQueries, setSqlQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null); // New state to track deployment status
  const [showConnectionSection, setShowConnectionSection] = useState(true);
  const [showSQLSection, setShowSQLSection] = useState(true);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setConnectionDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const generateCreateTableSQL = (data) => {
    const sqlStatements = [];
    const typeMapping = {
      STRING: "VARCHAR(255)",
      INT: "INT",
      TEXT: "TEXT",
      DATE: "DATE",
      BOOL: "BOOLEAN",
    };

    // Generate CREATE TABLE statements
    data.entities.forEach((entity) => {
      let sql = `CREATE TABLE ${entity.name} (\n`;

      entity.attributes.forEach((attr) => {
        if (!attr.type) {
          throw new Error(
            `Missing 'type' for attribute '${attr.name}' in entity '${entity.name}'.`
          );
        }

        let type = typeMapping[attr.type.toUpperCase()] || "VARCHAR(255)";
        sql += `  ${attr.name} ${type}`;
        if (attr.name === entity.primaryKey) {
          sql += " PRIMARY KEY";
        }
        sql += ",\n";
      });

      sql = sql.slice(0, -2) + "\n";
      sql += ");";
      sqlStatements.push(sql);
    });

    // Generate ALTER TABLE statements for relationships
    data.relationships.forEach((rel) => {
      const fromEntity = data.entities.find((e) => e.name === rel.from);
      const toEntity = data.entities.find((e) => e.name === rel.to);

      if (fromEntity && toEntity) {
        const fkName = `${rel.from}_${rel.to}_fk`;
        const refColumn = toEntity.primaryKey;

        // Find a matching attribute in the "from" entity
        let fkColumn = fromEntity.attributes.find((attr) =>
          attr.name.toLowerCase().includes(refColumn.toLowerCase())
        );

        // If no matching column exists, create it in the "from" entity
        if (!fkColumn) {
          fkColumn = {
            name: `${toEntity.name}${refColumn}`,
            type:
              toEntity.attributes.find((attr) => attr.name === refColumn)
                ?.type || "INT",
          };
          fromEntity.attributes.push(fkColumn); // Add the new column to the "from" entity
        }

        const fkSql = `ALTER TABLE ${rel.from} ADD CONSTRAINT ${fkName} FOREIGN KEY (${fkColumn.name}) REFERENCES ${toEntity.name}(${refColumn});`;
        sqlStatements.push(fkSql.trim());
      }
    });

    return sqlStatements;
  };

  const connectToDatabase = async () => {
    const { host, user, password, database, port } = connectionDetails;
    if (!host || !user || !password || !database) {
      toast("Please fill in all connection details.", { autoClose: 2000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosHeader.post("/create-connection", {
        projectId: id,
        connectionDetails,
      });

      if (response.data.success) {
        setConnectionStatus("Connected to the database successfully!");
        setConnectionDetails((prev) => ({
          ...prev,
          databaseId: response.data.databaseId,
        }));
        toast("Connected to the database successfully!", { autoClose: 2000 });
      } else {
        setConnectionStatus("Failed to connect to the database.");
        toast("Failed to connect to the database.", { autoClose: 2000 });
      }
    } catch (error) {
      setConnectionStatus("Error connecting to the database: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSQLQueries = () => {
    const queries = generateCreateTableSQL(erDiagram);
    setSqlQueries(queries);
  };

  const deploySQLQueries = async () => {
    if (sqlQueries.length === 0) {
      toast("Please generate the SQL queries first.", { autoClose: 2000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosHeader.post(
        `/create-table/${connectionDetails.databaseId}`,
        { queries: sqlQueries }
      );

      if (response.data.success) {
        setDeployStatus("Tables created successfully!");
      } else {
        setDeployStatus("Error deploying tables.");
      }
    } catch (error) {
      setDeployStatus("Error deploying tables: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const terminateConnection = async () => {
    try {
      const response = await axiosHeader.delete(
        `/terminate-connection/${connectionDetails.databaseId}`
      );
      if (response.data.success) {
        toast("Connection terminated successfully!", { autoClose: 2000 });
        setConnectionStatus(null);
      } else {
        toast("Failed to terminate the connection.", { autoClose: 2000 });
      }
    } catch (error) {
      setConnectionStatus("Error terminating the connection: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function fetchConnectionDetails() {
      try {
        const response = await axiosHeader.get("/get-connection-details/" + id);
        const connectionDetailsData = response.data.connection_details;
        //console.log(connectionDetailsData);
        setConnectionDetails({
          host: connectionDetailsData.host || "",
          user: connectionDetailsData.user || "",
          password: connectionDetailsData.password || "",
          database: connectionDetailsData.database || "",
          port: connectionDetailsData.port || "",
          databaseId: connectionDetailsData.databaseId || "",
        });
      } catch (error) {
        toast("Error storing the connection details", {
          type: "error",
          autoClose: 2000,
        });
        //console.log(error);
      }
    }
    fetchConnectionDetails();
  }, [id]);
  return (
    <>
      <button
        onClick={() => setDeployView((prev) => !prev)}
        className="deploy-back"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <div className="deploy-container">
        <div className="top-row">
          {/* Connection Section */}
          <div className="section">
            <button
              className="toggle-button"
              onClick={() => setShowConnectionSection(!showConnectionSection)}
            >
              {showConnectionSection ? (
                <>
                  <FaChevronUp className="mr-2" />
                  Hide Connection Details
                </>
              ) : (
                <>
                  <FaChevronDown className="mr-2" />
                  Show Connection Details
                </>
              )}
            </button>
            {showConnectionSection && (
              <div className="connection-section">
                <h2>Connection Details</h2>
                <input
                  type="text"
                  placeholder="Host"
                  name="host"
                  value={connectionDetails.host}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="User"
                  name="user"
                  value={connectionDetails.user}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={connectionDetails.password}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Database"
                  name="database"
                  value={connectionDetails.database}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  placeholder="Port"
                  name="port"
                  value={connectionDetails.port}
                  onChange={handleInputChange}
                />
                <button onClick={connectToDatabase} disabled={loading}>
                  {loading ? "Connecting..." : "Connect to Database"}
                </button>
                {connectionStatus && (
                  <button onClick={terminateConnection} disabled={loading}>
                    {loading ? "Terminating..." : "Terminate Connection"}
                  </button>
                )}
                {connectionStatus && <p>{connectionStatus}</p>}
              </div>
            )}
          </div>

          {/* SQL Section */}
          <div className="section gen-query">
            <button
              className="toggle-button"
              onClick={() => setShowSQLSection(!showSQLSection)}
            >
              {showSQLSection ? (
                <>
                  <FaChevronUp className="mr-2" />
                  Hide SQL Generation
                </>
              ) : (
                <>
                  <FaChevronDown className="mr-2" />
                  Show SQL Generation
                </>
              )}
            </button>
            {showSQLSection && (
              <div className="sql-generation-section">
                <h2>SQL Create Table Query</h2>
                <button
                  onClick={() => {
                    generateSQLQueries();
                    generateSQLQueries();
                  }}
                >
                  Generate SQL Queries
                </button>
                <div className="sql-display">
                  {sqlQueries.length > 0 && (
                    <pre>{sqlQueries.join("\n\n")}</pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bottom-row">
          <button onClick={deploySQLQueries} disabled={loading}>
            {loading ? "Deploying..." : "Deploy Tables"}
          </button>
          {deployStatus && <p>{deployStatus}</p>}
          <ExecuteSQL databaseId={connectionDetails.databaseId} />
        </div>
      </div>
    </>
  );
};

export default Deploy;
