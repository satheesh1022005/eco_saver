import React, { useState, useRef, useEffect } from "react";
import "./Editor.css";
import { NavBar } from "../../pages";
import Edit from "../ErDiagram/Edit";
import ErDiagramFetcher from "../ErDiagram/ErDiagramFetcher";
import ViewMermaidERDiagram from "../ErDiagram/ViewMermaidERDiagram";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import axios from "axios";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import axiosHeader from "../../services/axiosHeader";
import Deploy from "../Deploy/Deploy";
function Editor() {
  const { id } = useParams();
  const [erDiagram, setErDiagram] = useState({});
  const [view, setView] = useState(false);
  const [editView, setEditView] = useState(true);
  const [deployView, setDeployView] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [projectDetails, setProjectDetails] = useState({});
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosHeader.get(`/project/get-project/${id}`);
        //console.log(response.data);
        setProjectDetails({
          name: response.data.project_name,
          description: response.data.description,
        });
        const erObjectData = response.data.er_object;
        //console.log("inside", erObjectData);
        setErDiagram({ ...erObjectData });
      } catch (error) {
        toast("Failed to fetch project details", {
          type: "error",
          autoClose: 2000,
        });
        //console.error("Error fetching project details:", error.message);
      }
    };
    fetchProjectDetails();
  }, []);
  const updateErdiagram = async () => {
    try {
      const response = await axiosHeader.post(`/project/update-project/${id}`, {
        erObject: erDiagram,
      });
      //console.log(response.data);
    } catch (error) {
      toast("Failed to update ER diagram", { type: "error", autoClose: 2000 });
      //console.error("Error updating ER diagram:", error.message);
    }
  };

  const navBarData = {
    name: projectDetails.name,
    logo: false,
    menuItems: [
      {
        label: "Export as PNG",
        action: () => exportToPNG(setView),
      },
      { label: "Export as SVG", action: () => exportToSVG(setView) },
      {
        label: "Generate documentation",
        action: () => fetchDocumentation(erDiagram),
      },
      { label: "Deploy", action: () => setDeployView((prev) => !prev) },
      {
        label: "Mermaid code",
        action: () => downloadMermaidCode(generateMermaidCode(erDiagram)),
      },
    ],
  };
  //console.log(projectDetails);
  return (
    <>
      <NavBar navBarData={navBarData} setView={setView} />
      {!deployView ? (
        <div className="editor-container">
          <div className="editor-left">
            {view ? (
              <ViewMermaidERDiagram
                generateMermaidCode={() => generateMermaidCode(erDiagram)}
              />
            ) : (
              <ErDiagramFetcher
                erDiagram={erDiagram}
                setErDiagram={setErDiagram}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                updateErdiagram={updateErdiagram}
                generateMermaidCode={generateMermaidCode}
                projectId={id}
              />
            )}
          </div>
          <button
            onClick={() => setEditView((prev) => !prev)}
            className={`edit-view-btn ${editView ? "open" : "closed"}`}
          >
            {editView ? (
              <span className="vertical-text">
                C<br />L<br />O<br />S<br />E<br />
                <br />E<br />D<br />I<br />T<br />O
                <br />R
              </span>
            ) : (
              <span className="vertical-text">
                O<br />P<br />E<br />N<br />
                <br />E<br />D<br />I<br />T<br />O
                <br />R
              </span>
            )}
          </button>
          {editView && (
            <div className="editor-right">
              <Edit
                erDiagram={erDiagram}
                setErDiagram={setErDiagram}
                setView={setView}
                updateErdiagram={updateErdiagram}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="deploy-container-scroll">
          <Deploy erDiagram={erDiagram} id={id} setDeployView={setDeployView} />
        </div>
      )}
    </>
  );
}
export default Editor;
const downloadMermaidCode = (mermaidCode) => {
  const blob = new Blob([mermaidCode], { type: "text/plain" });
  saveAs(blob, "er-diagram.mmd");
};
const exportToSVG = (setView) => {
  setView(true);
  const svgElement = document.querySelector(".mermaid-main svg");
  if (!svgElement) {
    toast("SVG diagram not found", { type: "error", autoClose: 2000 });
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, "diagram.svg");
};

const fetchDocumentation = async (erDiagram) => {
  const loadingToastId = toast.loading("Generating documentation...");
  try {
    const response = await axios.post(
      "https://nlp2db-bot.onrender.com/generate-document",
      {
        er_object: erDiagram,
      }
    );
    const documentText = response.data.document;
    //console.log(documentText);
    // Trigger the download
    downloadTextFile(documentText, "er_documentation.txt");
    toast.update(loadingToastId, {
      render: "Documentation generated successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (err) {
    toast.update(loadingToastId, {
      render: "Failed to generate documentation.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    console.error("Error fetching documentation:", err);
  } finally {
  }
};
const downloadTextFile = (text, filename) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height; // Get the page height
  let y = 35; // Initial Y position for text
  const lineHeight = 10; // Line height
  const footerText = "Generated by NLP2ER";
  // Set font and title formatting
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ER Diagram Documentation", 10, 20);

  // Add a horizontal line for visual separation
  doc.setLineWidth(0.5);
  doc.line(10, 25, 200, 25);

  // Set font back to normal for the body text
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  // Split the input text into multiple lines
  const lines = doc.splitTextToSize(text, 180); // 180 is the width of the text box

  lines.forEach((line) => {
    // Check if adding this line would exceed the page height
    if (y + lineHeight > pageHeight - 20) {
      // -20 for margin
      // Add a footer on the current page before creating a new page
      doc.setFontSize(10);
      doc.text(footerText, 10, pageHeight - 10);

      // Add new page and reset y position
      doc.addPage();
      y = 20; // Reset y for the next page
    }

    // Add the current line to the PDF
    doc.text(line, 10, y);
    y += lineHeight; // Move the y position down for the next line
  });

  // Add the footer on the last page
  doc.setFontSize(10);
  doc.text(footerText, 10, pageHeight - 10);

  // Save the PDF file
  doc.save(`${filename}.pdf`);
};
function generateCreateTableSQL(data) {
  const sqlStatements = [];

  // Mapping for data types
  const typeMapping = {
    STRING: "VARCHAR(255)", // Default length for strings
    INT: "INT",
    TEXT: "TEXT",
    DATE: "DATE",
    BOOL: "BOOLEAN",
  };

  // Loop through each entity and generate SQL for CREATE TABLE
  data.entities.forEach((entity) => {
    let sql = `CREATE TABLE ${entity.name} (\n`;

    // Add each attribute as a column in the SQL table
    entity.attributes.forEach((attr) => {
      let type = typeMapping[attr.type.toUpperCase()] || "VARCHAR(255)"; // Default to VARCHAR(255) if no mapping is found
      sql += `  ${attr.name} ${type}`;
      if (attr.name === entity.primaryKey) {
        sql += " PRIMARY KEY";
      }
      sql += ",\n";
    });

    // Remove the last comma and newline
    sql = sql.slice(0, -2) + "\n";

    sql += ");";
    sqlStatements.push(sql);
  });

  // Loop through each relationship to add foreign key constraints if necessary
  data.relationships.forEach((rel) => {
    const fromEntity = data.entities.find((e) => e.name === rel.from);
    const toEntity = data.entities.find((e) => e.name === rel.to);

    if (fromEntity && toEntity) {
      const fkName = `${rel.from}_${rel.to}_fk`;
      const fkColumn = `${rel.from}Id`;
      const refColumn = toEntity.primaryKey;

      // Generate ALTER TABLE statement for the foreign key constraint
      const fkSql = `
          ALTER TABLE ${rel.from}
          ADD CONSTRAINT ${fkName}
          FOREIGN KEY (${fkColumn}) REFERENCES ${toEntity.name}(${refColumn});
        `;
      sqlStatements.push(fkSql.trim());
    }
  });

  //console.log(sqlStatements); // For debugging
  return sqlStatements;
}

const exportToPNG = (setView) => {
  setView(true);
  const svgElement = document.querySelector(".mermaid-main svg");
  if (!svgElement) {
    toast("SVG diagram not found", { type: "error", autoClose: 2000 });
    return;
  }

  const canvas = document.createElement("canvas");
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      saveAs(blob, "diagram.png");
    });
    URL.revokeObjectURL(url);
  };
  img.src = url;
};

const generateMermaidCode = (data) => {
  let mermaidCode = "erDiagram\n";
  data?.entities?.length > 0 &&
    data.entities.forEach((entity) => {
      let entityCode = `${entity.name} {\n`;
      entity.attributes.forEach((attr) => {
        const key =
          attr.name === entity?.primaryKey
            ? "PK"
            : attr.name === entity?.foreignKey
            ? "FK"
            : "";
        entityCode += `  ${attr.type} ${attr.name} ${key}\n`;
      });
      entityCode += "}\n";
      mermaidCode += entityCode;
    });

  data?.relationships?.length > 0 &&
    data.relationships.forEach((rel) => {
      let relLine = "";
      if (rel.cardinality === "many-to-one") {
        relLine = `${rel.to} ||--o{ ${rel.from} : "${rel.type}"\n`;
      } else if (rel.cardinality === "one-to-many") {
        relLine = `${rel.from} ||--o{ ${rel.to} : "${rel.type}"\n`;
      } else if (rel.cardinality === "one-to-one") {
        relLine = `${rel.from} ||--|| ${rel.to} : "${rel.type}"\n`;
      } else if (rel.cardinality === "many-to-many") {
        relLine = `${rel.from} ||--o{ ${rel.to} : "${rel.type}"\n`;
      }
      mermaidCode += relLine;
    });

  return mermaidCode;
};
