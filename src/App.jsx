import { useMemo, useState } from "react";
import { useTemperatureData } from "./hooks/useTemperatureData";
import { MatrixView } from "./components/MatrixView";
import { Tooltip } from "./components/Tooltip";
import "./styles.css";

export default function App() {
  // mode can be "max" or "min"
  const [mode, setMode] = useState("max");

  const { loading, error, data, gridCells } = useTemperatureData({ lastNYears: 10 });

  const [toolT, setToolT] = useState({ visible: false, x: 0, y: 0, html: "" });

  const onToggleMode = () => setMode((m) => (m === "max" ? "min" : "max"));

  const tooltipHTML = useMemo(() => {
    return (cell) => {
      const label = `${cell.year}-${String(cell.month).padStart(2, "0")}`;

      if (cell.missing) {
        return `<div><b>Date:</b> ${label}</div><div><b>No data</b></div>`;
      }

      const selected = mode === "max" ? cell.monthlyMax : cell.monthlyMin;
      const selectedLabel = mode === "max" ? "Monthly MAX" : "Monthly MIN";

      return `
        <div><b>Date:</b> ${label}</div>
        <div style="margin-top:6px;">
          <b>Max:</b> ${Math.round(cell.monthlyMax)} C, <b>Min:</b> ${Math.round(cell.monthlyMin)} C
        </div>
      `;
    };
  }, [mode]);

  // Render states issues if we face any
  if (loading) 
    return <div className="page"><p>Loading CSV…</p></div>;
  if (error) 
    return <div className="page"><p style={{ color: "crimson" }}>Error: {error}</p></div>;
  if (!data) 
    return null;

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Hong Kong Monthly Temperature</h1>
          <p className="subtitle">
            Click to switch between <b>MAX</b> and <b>MIN</b>. Hover a cell for details.
          </p>
        </div>

        <button className="mode-btn" onClick={onToggleMode}>
          Mode: <span>{mode.toUpperCase()}</span> (click here to change)
        </button>
      </header>

      <div className="vis-wrap">
        <MatrixView
          years={data.years}
          months={data.months}
          gridCells={gridCells}
          mode={mode}
          onToggleMode={onToggleMode}
          onHoverCell={(cell, pageX, pageY) => {
            setToolT({
              visible: true,
              x: pageX + 14,
              y: pageY + 14,
              html: tooltipHTML(cell),
            });
          }}
          onLeaveCell={() => setToolT((t) => ({ ...t, visible: false }))}
        />
      </div>

      <Tooltip x={toolT.x} y={toolT.y} visible={toolT.visible} html={toolT.html} />
    </div>
  );
}
