const MASTER_MOODS = [
  { id: "depressed", label: "Depressed", color: "#475569",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M250-320h60v-10q0-71 49.5-120.5T480-500q71 0 120.5 49.5T650-330v10h60v-10q0-96-67-163t-163-67q-96 0-163 67t-67 163v10Zm34-270q41-6 86.5-32t72.5-59l-46-38q-20 24-55.5 44T276-650l8 60Zm392 0 8-60q-30-5-65.5-25T563-719l-46 38q27 33 72.5 59t86.5 32ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },
  { id: "dissapointed", label: "Disappointed", color: "#3b82f6",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-260q-68 0-123.5-38.5T276-400h66q22 37 58.5 58.5T480-320q43 0 79.5-21.5T618-400h66q-25 63-80.5 101.5T480-260Z"/></svg>` },
  { id: "sad", label: "Sad", color: "#3883e0",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },
  { id: "tired", label: "Tired", color: "#7c3aed",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M366.15-346.15h227.7v-47.7h-227.7v47.7Zm-34.29 216.23q-69.37-29.92-120.68-81.21-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100q-78.84 0-148.21-29.92Z"/></svg>` },
  { id: "overwhelmed", label: "Overwhelmed", color: "#e42c38",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><circle cx="480" cy="-480" r="160"/><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54-54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>` },
  { id: "anxious", label: "Anxious", color: "#ff63b1",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><circle cx="340" cy="-560" r="40"/><circle cx="620" cy="-560" r="40"/><path d="M480-280q40 0 75-20t55-55l-45-35q-15 25-40 37.5t-45 12.5q-20 0-45-12.5T435-390l-45 35q20 35 55 55t75 20Z"/></svg>` },
  { id: "angry", label: "Angry", color: "#eb4200",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M280-600l160 80-160 80v-160Zm400 0v160l-160-80 160-80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54-54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>` },
  { id: "idk", label: "Lost", color: "#26abb2",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><circle cx="480" cy="-480" r="60"/></svg>` },
  { id: "embarrassed", label: "Embarrassed", color: "#00b05b",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><circle cx="340" cy="-540" r="30"/><circle cx="620" cy="-540" r="30"/></svg>` },
  { id: "neutral", label: "Neutral", color: "#94a3b8",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M340-380h280v-60H340v60Z"/></svg>` },
  { id: "okay", label: "Okay", color: "#ffd900",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M340-360h280v-40H340v40Z"/></svg>` },
  { id: "relaxed", label: "Relaxed", color: "#a900bc",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-260q39 0 75-17.5t67-52.5l-44-40q-22 24-47 36.5T480-321q-26 0-51-12.5T382-370l-44 40q32 35 67.5 52.5T480-260Z"/></svg>` },
  { id: "happy", label: "Happy", color: "#ffd000",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Z"/></svg>` },
  { id: "loved", label: "Loved", color: "#ff00d0",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="m480-120-58-52q-101-91-167-157T153-442.5q-35-46.5-49-88T90-620q0-92 64-156t156-64q51 0 96 20.5t74 57.5q29-37 74-57.5t96-20.5q92 0 156 64t64 156q0 46-14 87.5t-49 88q-36 46.5-102 113.5T538-172l-58 52Z"/></svg>` },
  { id: "proud", label: "Proud", color: "#ff8c00",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Z"/></svg>` },
  { id: "excited", label: "Excited", color: "#ffb700",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-260q75 0 132-45t78-115H270q21 70 78 115t132 45Z"/></svg>` }
];



function renderMoodScatterplot() {
  const canvas = document.getElementById("scatter-canvas");
  const yLabels = document.getElementById("scatter-y-labels");
  const xLabels = document.getElementById("scatter-x-labels");
  const tooltip = document.getElementById("scatter-tooltip");

  if (!canvas || !yLabels || !xLabels) return;

  // 1. Build the rolling 7 dates (Past 6 days + Today)
  const rollingDays = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    rollingDays.push({
      dateStr: dateStr,
      label: i === 0 ? "Today" : dayNames[d.getDay()],
      isToday: i === 0
    });
  }

  // 2. Render Y-Axis Labels
  yLabels.innerHTML = "";
  MASTER_MOODS.forEach(m => {
    const el = document.createElement("div");
    el.className = "scatter-y-item";
    el.innerHTML = `<span style="color: ${m.color}; display: flex; align-items: center;">${m.svg}</span><span>${m.label}</span>`;
    yLabels.appendChild(el);
  });

  // 3. Render X-Axis Day Labels
  xLabels.innerHTML = "";
  rollingDays.forEach(d => {
    const el = document.createElement("div");
    el.className = `scatter-x-item ${d.isToday ? "today" : ""}`;
    el.textContent = d.label;
    xLabels.appendChild(el);
  });

  // 4. Render Grid Lines
  canvas.innerHTML = "";
  const totalRows = MASTER_MOODS.length;
  const totalCols = rollingDays.length;

  for (let r = 0; r < totalRows; r++) {
    const row = document.createElement("div");
    row.className = "scatter-grid-row";
    row.style.top = `${(r + 0.5) * (100 / totalRows)}%`;
    canvas.appendChild(row);
  }

  for (let c = 0; c < totalCols; c++) {
    const col = document.createElement("div");
    col.className = "scatter-grid-col";
    col.style.left = `${(c + 0.5) * (100 / totalCols)}%`;
    canvas.appendChild(col);
  }

  // 5. Aggregate Logs from localStorage
  const currentLogs = (typeof moodLogs !== "undefined") ? moodLogs : (JSON.parse(localStorage.getItem("healthApp_moodLogs")) || []);
  const counts = {};

  currentLogs.forEach(log => {
    // Resolve mood identifier (supports new moodId as well as legacy score)
    let moodId = log.moodId;
    if (!moodId && log.score !== undefined) {
      const legacyMap = { 1: "depressed", 2: "sad", 3: "neutral", 4: "okay", 5: "relaxed", 6: "happy" };
      moodId = legacyMap[log.score] || "neutral";
    }

    const colIndex = rollingDays.findIndex(d => d.dateStr === log.date);
    if (colIndex !== -1 && moodId) {
      const key = `${colIndex}_${moodId}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  // 6. Draw Nodes with Dynamic Scaling
  Object.keys(counts).forEach(key => {
    const [colStr, moodId] = key.split("_");
    const colIdx = parseInt(colStr, 10);
    const moodIdx = MASTER_MOODS.findIndex(m => m.id === moodId);
    const count = counts[key];
    const moodMeta = MASTER_MOODS[moodIdx];

    if (moodIdx === -1) return;

    const dot = document.createElement("div");
    dot.className = "scatter-node";

    const baseSize = 14;
    const size = Math.min(baseSize + (count - 1) * 6, 28);
    const glow = 4 + count * 4;

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${(colIdx + 0.5) * (100 / totalCols)}%`;
    dot.style.top = `${(totalRows - 1 - moodIdx + 0.5) * (100 / totalRows)}%`;
    dot.style.backgroundColor = moodMeta.color;
    dot.style.boxShadow = `0 0 ${glow}px ${moodMeta.color}`;

    if (count > 1) {
      dot.textContent = count;
    }

    // Interactive Hover/Tap Tooltip
    dot.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.innerHTML = `<strong>${moodMeta.label}</strong>: ${count} log${count > 1 ? 's' : ''} (${rollingDays[colIdx].label})`;
        tooltip.style.left = `${(colIdx + 0.5) * (100 / totalCols)}%`;
        tooltip.style.top = `${(totalRows - 1 - moodIdx + 0.5) * (100 / totalRows)}%`;
        tooltip.style.display = "block";
      }
    });

    dot.addEventListener("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none";
    });

    canvas.appendChild(dot);
  });
}
