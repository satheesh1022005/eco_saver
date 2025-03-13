import React, { useEffect, useState } from "react";
import Mermaid from "react-mermaid2";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ExecuteSQL from "./ExecuteSQL";
import "./ViewMermaidERDiagram.css";

const ViewMermaidERDiagram = ({ generateMermaidCode }) => {
  const [mermaidCode, setMermaidCode] = useState("");
  useEffect(() => {
    const code = generateMermaidCode();
    setMermaidCode(code);
  }, [generateMermaidCode]);

  return (
    <div className="mermaid-container">
      {mermaidCode && (
        <div className="mermaid-main">
          <TransformWrapper
            options={{
              minScale: 0.5, // Allow smaller scale for better visibility
              limitToBounds: false, // Let the diagram exceed bounds
            }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent wrapperStyle={{ height: "100%" }}>
                  <div className="mermaid-diagram">
                    <Mermaid chart={mermaidCode} key={mermaidCode} />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      )}
    </div>
  );
};

export default ViewMermaidERDiagram;
