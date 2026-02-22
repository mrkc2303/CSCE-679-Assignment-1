import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";

// Months 1 to 12
const months = d3.range(1, 13);

function ymKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}


// Load daily temp CSV and aggregate into month cells 
// last N years is configurable, set as 10
// Returns an object with years, months and cellMap
export function useTemperatureData({ lastNYears = 10 } = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const parseDate = d3.timeParse("%Y-%m-%d");

        const rows = await d3.csv(`${import.meta.env.BASE_URL}temperature_daily.csv`, (d) => ({
          dateStr: d.date,
          dateObj: parseDate(d.date),
          tmax: +d.max_temperature,
          tmin: +d.min_temperature,
        }));

        const allYears = Array.from(new Set(rows.map((r) => r.dateObj.getFullYear()))).sort(
          (a, b) => a - b
        );
        const years = allYears.slice(-lastNYears);

        const filtered = rows.filter((r) => years.includes(r.dateObj.getFullYear()));

        const cellMap = new Map();
        for (const r of filtered) {
          const year = r.dateObj.getFullYear();
          const month = r.dateObj.getMonth() + 1; // 1..12
          const key = ymKey(year, month);

          if (!cellMap.has(key)) {
            cellMap.set(key, { year, month, days: [] });
          }

          cellMap.get(key).days.push({
            day: r.dateObj.getDate(),
            dateStr: r.dateStr,
            tmax: r.tmax,
            tmin: r.tmin,
          });
        }

        // Aggregate per month
        for (const cell of cellMap.values()) {
          cell.days.sort((a, b) => a.day - b.day);
          cell.monthlyMax = d3.max(cell.days, (d) => d.tmax);
          cell.monthlyMin = d3.min(cell.days, (d) => d.tmin);
        }

        if (!cancelled) {
          setData({ years, months, cellMap });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [lastNYears]);

  // Build a full grid
  const gridCells = useMemo(() => {
    if (!data) return [];

    const out = [];
    for (const y of data.years) {
      for (const m of months) {
        const key = ymKey(y, m);
        const found = data.cellMap.get(key);

        out.push(
          found
            ? { key, ...found, missing: false }
            : { key, year: y, month: m, days: [], monthlyMax: null, monthlyMin: null, missing: true }
        );
      }
    }
    return out;
  }, [data]);

  return { loading, error, data, gridCells };
}
