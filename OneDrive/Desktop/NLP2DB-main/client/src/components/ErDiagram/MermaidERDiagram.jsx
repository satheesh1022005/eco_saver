import React, { useEffect, useState, useRef } from "react";
import Mermaid from "react-mermaid2";
import ExecuteSQL from "./ExecuteSQL";
import Edit from "./Edit";
import "./style.css";
import {
  exportComponentAsPNG,
  exportComponentAsJPEG,
} from "react-component-export-image";
import svgCrowbar from "svg-crowbar";
import { saveAs } from "file-saver";
import axios from "axios";
import jsPDF from "jspdf";
const MermaidERDiagram = ({ chat, generateMermaidCode }) => {
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlQuery, setSqlQuery] = useState([]);
  const [dbName, setDbName] = useState("");
  const [dbCreationStatus, setDbCreationStatus] = useState("");
  const [viewEngine, setViewEngine] = useState(false);
  const diagramRef = useRef(null); // Ref for the diagram container
  useEffect(() => {
    // const generateMermaidCode = (data) => {
    //   let mermaidCode = "erDiagram\n";
    //   data?.entities?.length > 0 &&
    //     data.entities.forEach((entity) => {
    //       let entityCode = `${entity.name} {\n`;
    //       entity.attributes.forEach((attr) => {
    //         const key =
    //           attr.name === entity?.primaryKey
    //             ? "PK"
    //             : attr.name === entity?.foreignKey
    //             ? "FK"
    //             : "";
    //         entityCode += `  ${attr.type} ${attr.name} ${key}\n`;
    //       });
    //       entityCode += "}\n";
    //       mermaidCode += entityCode;
    //     });

    //   data?.relationships?.length > 0 &&
    //     data.relationships.forEach((rel) => {
    //       let relLine = "";
    //       if (rel.cardinality === "many-to-one") {
    //         relLine = `${rel.to} ||--o{ ${rel.from} : "${rel.type}"\n`;
    //       } else if (rel.cardinality === "one-to-many") {
    //         relLine = `${rel.from} ||--o{ ${rel.to} : "${rel.type}"\n`;
    //       } else if (rel.cardinality === "one-to-one") {
    //         relLine = `${rel.from} ||--|| ${rel.to} : "${rel.type}"\n`;
    //       } else if (rel.cardinality === "many-to-many") {
    //         relLine = `${rel.from} ||--o{ ${rel.to} : "${rel.type}"\n`;
    //       }
    //       mermaidCode += relLine;
    //     });

    //   return mermaidCode;
    // };
    const code = generateMermaidCode();
    setMermaidCode(code);
  }, []);
  return (
    <div>
      {mermaidCode && (
        <>
          <div
            ref={diagramRef}
            style={{ backgroundColor: "transparent" }}
            className={chat ? "mermaid-main chat-diagram" : "mermaid-main"}
          >
            <Mermaid chart={mermaidCode} key={mermaidCode} />
          </div>

          {dbCreationStatus && <p>{dbCreationStatus}</p>}
          {viewEngine && <ExecuteSQL dbName={dbName} />}
        </>
      )}
    </div>
  );
};

export default MermaidERDiagram;

{
  /* <section className="mermaid-top">
            <button onClick={downloadMermaidCode}>Download Mermaid Code</button>
            <button
              onClick={() => exportComponentAsPNG(diagramRef, "er-diagram")}
            >
              Download as PNG
            </button>
            <button
              onClick={() => exportComponentAsJPEG(diagramRef, "er-diagram")}
            >
              Download as JPG
            </button>
            <button onClick={exportToSVG}>Download as SVG</button>
            <button onClick={fetchDocumentation}>
              {loading ? "Generating..." : "Document"}
            </button>
            <input
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
              type="text"
            />
            <button onClick={createDB}>create DB</button>
          </section> */
}
