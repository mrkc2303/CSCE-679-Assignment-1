import * as d3 from "d3";

// Vertical gradient legend from 0 to 40 C, similar to the example.
// We render it in SVG using a linearGradient.
export function Legend({ x, y, height, width, domain, colorScale }) {
  const gradientId = "tempLegendGrad";
  const [minV, maxV] = domain;

  const axisScale = d3.scaleLinear().domain([minV, maxV]).range([0, height]);
  const ticks = axisScale.ticks(5);

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          {d3.range(0, 1.0001, 0.05).map((t) => {
            const v = minV + t * (maxV - minV);
            return (
              <stop key={t} offset={`${t * 100}%`} stopColor={colorScale(v)} />
            );
          })}
        </linearGradient>
      </defs>

      <text x={0} y={-10} fontSize={12} fontWeight={600} fill="#111827">
        Celsius
      </text>

      <rect width={width} height={height} fill={`url(#${gradientId})`} />

      {/* tick labels on the right */}
      {ticks.map((t) => (
        <g key={t} transform={`translate(${width},${axisScale(t)})`}>
          <line x1={0} x2={6} y1={0} y2={0} stroke="#111827" strokeWidth={1} />
          <text x={10} y={4} fontSize={12} fill="#111827">
            {t}
          </text>
        </g>
      ))}
    </g>
  );
}
