import * as d3 from "d3";
import { useMemo } from "react";
import { Legend } from "./Legend";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export function MatrixView({years,months,gridCells, mode,onToggleMode, onHoverCell,onLeaveCell}) {
  // Layout config (easy to modify)
  const margin = { top: 42, right: 120, bottom: 10, left: 90 };
  const cell = { w: 78, h: 58, padX: 14, padY: 14 };
  const sparkMargin = { top: 8, right: 6, bottom: 8, left: 6 };

  const gridW = years.length * (cell.w + cell.padX) - cell.padX;
  const gridH = months.length * (cell.h + cell.padY) - cell.padY;

  const width = margin.left + gridW + margin.right;
  const height = margin.top + gridH + margin.bottom;

  const tempDomain = [0, 40];

  // Similar to example: low=blue, high=red
  const colorScale = useMemo(() => {
    return d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([tempDomain[1], tempDomain[0]])
      .clamp(true);
  }, []);

  // Global sparkline y-scale (so all mini-charts comparable)
  const sparkW = cell.w - sparkMargin.left - sparkMargin.right;
  const sparkH = cell.h - sparkMargin.top - sparkMargin.bottom;

  const sparkY = useMemo(() => {
    return d3.scaleLinear().domain(tempDomain).range([sparkH, 0]).clamp(true);
  }, []);

  const line = useMemo(() => d3.line().x((d) => d.x).y((d) => d.y), []);

  const xPos = (year) => years.indexOf(year) * (cell.w + cell.padX);
  const yPos = (month) => (month - 1) * (cell.h + cell.padY);

  // top axis line like the example
  const topAxisY = -18;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Top axis line */}
        <line
          x1={0}
          x2={gridW}
          y1={topAxisY}
          y2={topAxisY}
          stroke="#111827"
          strokeWidth={1.5}
        />

        {/* Year ticks + labels */}
        {years.map((y) => {
          const cx = xPos(y) + cell.w / 2;
          return (
            <g key={y}>
              <line
                x1={cx}
                x2={cx}
                y1={topAxisY}
                y2={topAxisY - 6}
                stroke="#111827"
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={-26}
                textAnchor="middle"
                fontSize={12}
                fill="#111827"
              >
                {y}
              </text>
            </g>
          );
        })}

        {/* Month labels */}
        {months.map((m) => (
          <text
            key={m}
            x={-14}
            y={yPos(m) + cell.h / 2 + 4}
            textAnchor="end"
            fontSize={12}
            fill="#111827"
          >
            {MONTH_NAMES[m - 1]}
          </text>
        ))}

        {/* Cells */}
        {gridCells.map((c) => {
          const bgValue = c.missing
            ? null
            : mode === "max"
              ? c.monthlyMax
              : c.monthlyMin;

          const fill = c.missing ? "#f3f4f6" : colorScale(bgValue);

          // Sparkline points
          let maxPath = null;
          let minPath = null;

          if (!c.missing && c.days.length > 0) {
            const x = d3
              .scaleLinear()
              .domain([1, d3.max(c.days, (d) => d.day)])
              .range([0, sparkW]);

            const yLocal = d3.scaleLinear()
            .domain([
                d3.min(c.days, d => d.tmin),
                d3.max(c.days, d => d.tmax),
            ])
            .nice()
            .range([sparkH, 0]);

            const maxPts = c.days.map((d) => ({ x: x(d.day), y: yLocal(d.tmax) }));
            const minPts = c.days.map((d) => ({ x: x(d.day), y: yLocal(d.tmin) }));


            maxPath = line(maxPts);
            minPath = line(minPts);
          }

          return (
            <g
              key={c.key}
              transform={`translate(${xPos(c.year)},${yPos(c.month)})`}
              style={{ cursor: "pointer" }}
              onClick={onToggleMode}
              onMouseMove={(e) => {
                onHoverCell?.(c, e.pageX, e.pageY);
              }}
              onMouseLeave={onLeaveCell}
            >
              <rect
                width={cell.w}
                height={cell.h}
                fill={fill}
                stroke="rgba(0,0,0,0.12)"
                strokeWidth={1}
              />

              {/* Sparklines */}
              {!c.missing && c.days.length > 0 && (
                <g transform={`translate(${sparkMargin.left},${sparkMargin.top})`}>
                  <path d={maxPath} stroke="#16a34a" strokeWidth={1.5} fill="none" />
                  <path d={minPath} stroke="#06b6d4" strokeWidth={1.5} fill="none" />
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <Legend
          x={gridW + 30}
          y={6}
          width={16}
          height={230}
          domain={tempDomain}
          colorScale={colorScale}
        />
      </g>
    </svg>
  );
}
