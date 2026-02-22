export function Tooltip({ x, y, visible, html }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.98)",
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
        fontSize: 12,
        lineHeight: 1.25,
        maxWidth: 260,
        transition: "opacity 80ms linear",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
