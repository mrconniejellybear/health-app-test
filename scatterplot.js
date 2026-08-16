const MASTER_MOODS = [
  { id: "depressed", label: "Depressd", color: "#475569",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M250-320h60v-10q0-71 49.5-120.5T480-500q71 0 120.5 49.5T650-330v10h60v-10q0-96-67-163t-163-67q-96 0-163 67t-67 163v10Zm34-270q41-6 86.5-32t72.5-59l-46-38q-20 24-55.5 44T276-650l8 60Zm392 0 8-60q-30-5-65.5-25T563-719l-46 38q27 33 72.5 59t86.5 32ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "dissapointed", label: "Disappntd", color: "#113188",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h408q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "sad", label: "Sad", color: "#3883e0",
    svg: `<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "tired", label: "Tired", color: "#7c3aed",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M366.15-346.15h227.7v-47.7h-227.7v47.7Zm-34.29 216.23q-69.37-29.92-120.68-81.21-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100q-78.84 0-148.21-29.92Zm10.06-483.93q-29.3 0-54.11 15.89-24.81 15.88-42.04 40.42l40 26.46q10.77-14.23 24.96-24.34 14.19-10.12 31.19-10.12t31.2 9.92q14.19 9.93 24.96 23.54l40-26.46q-17.23-23.92-42.18-39.61-24.95-15.7-53.98-15.7Zm276.16 0q-29.31 0-54.12 15.89-24.81 15.88-42.04 40.42l40 26.46q10.77-13.61 24.96-23.73 14.2-10.11 31.2-10.11t31.5 9.8q14.5 9.81 24.65 24.04l40-26.46q-17.23-24.54-42.18-40.42-24.94-15.89-53.97-15.89Z"/></svg>` },

  { id: "overwhelmed", label: "Ovrwhlmd", color: "#e42c5a",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M356.5-381.5Q301-343 276-280h408q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5ZM312-480l44-42 42 42 42-42-42-42 42-44-42-42-42 42-44-42-42 42 42 44-42 42 42 42Zm250 0 42-42 44 42 42-42-42-42 42-44-42-42-44 42-42-42-42 42 42 44-42 42 42 42ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "anxious", label: "Anxious", color: "#ff63b1",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M452-240h56q55 0 93.5-35t38.5-85q0-50-38.5-85T508-480h-56q-55 0-93.5 35T320-360q0 50 38.5 85t93.5 35Zm0-60q-30 0-51-17.5T380-360q0-25 21-42.5t51-17.5h56q30 0 51 17.5t21 42.5q0 25-21 42.5T508-300h-56ZM240-560h80q50 0 85-35t35-85h-60q0 25-17.5 42.5T320-620h-80v60Zm400 0h80v-60h-80q-25 0-42.5-17.5T580-680h-60q0 50 35 85t85 35ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "angry", label: "Angry", color: "#e44100",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm60-444 20-12q2 24 19 40t41 16q25 0 42.5-17.5T680-540q0-15-7-28.5T654-590l26-15-20-35-140 80 20 36Zm-120 0 20-36-140-80-20 35 26 15q-12 8-19 21.5t-7 28.5q0 25 17.5 42.5T340-480q24 0 41-16t19-40l20 12Zm60 84q-71 0-125 45.5T279-280h402q-22-69-76-114.5T480-440Z"/></svg>` },

  { id: "embarrassed", label: "Embrrsd", color: "#00b05b",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM298-456l143-104-143-104-36 48 77 56-77 56 36 48Zm122 178 60-60 60 60 60-60 39 39 42-42-81-81-60 60-60-60-60 60-60-60-81 81 42 42 39-39 60 60Zm242-178 36-48-77-56 77-56-36-48-143 104 143 104Z"/></svg>` },

  { id: "neutral", label: "Neutral", color: "#94a3b8", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm20 180h240v-60H360v60Zm-36 228.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "okay", label: "Okay", color: "#ffd900",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "relaxed", label: "Relaxed", color: "#a900bc",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-260q39 0 75-17.5t67-52.5l-44-40q-22 24-47 36.5T480-321q-26 0-51-12.5T382-370l-44 40q32 35 67.5 52.5T480-260ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Zm86-399q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T340-540q-21 0-33.5-17.5T289-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Zm280 0q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T620-540q-21 0-33.5-17.5T569-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Z"/></svg>` },

  { id: "happy", label: "Happy", color: "#ffd000",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "proud", label: "Proud", color: "#ff8c00",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-480v80q0 66 47 113t113 47q66 0 113-47t47-113v-80H320Zm160 180q-42 0-71-29t-29-71v-20h200v20q0 42-29 71t-71 29ZM272.5-652.5Q243-625 231-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T340-680q-38 0-67.5 27.5Zm280 0Q523-625 511-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T620-680q-38 0-67.5 27.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "excited", label: "Excited", color: "#ffb700",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M603.5-298.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM312-520l44-42 42 42 42-42-84-86-86 86 42 42Zm250 0 42-42 44 42 42-42-86-86-84 86 42 42ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` }
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

// --- 1. AFFECT COORDINATE MAP (Valence & Arousal: -1.0 to +1.0) ---
const AFFECT_COORDINATES = {
  // Top-Left: Negative Valence, High Arousal (Fight-or-Flight / Stress)
  angry:        { valence: -0.75, arousal:  0.75, color: "#eb4200", label: "Angry" },
  anxious:      { valence: -0.65, arousal:  0.65, color: "#ff63b1", label: "Anxious" },
  overwhelmed:  { valence: -0.80, arousal:  0.50, color: "#e42c38", label: "Overwhelmed" },
  embarrassed:  { valence: -0.45, arousal:  0.40, color: "#00b05b", label: "Embarrassed" },

  // Bottom-Left: Negative Valence, Low Arousal (Depletion / Fatigue)
  sad:          { valence: -0.65, arousal: -0.45, color: "#3883e0", label: "Sad" },
  dissapointed: { valence: -0.50, arousal: -0.35, color: "#3b82f6", label: "Disappointed" },
  depressed:    { valence: -0.85, arousal: -0.70, color: "#475569", label: "Depressed" },
  tired:        { valence: -0.30, arousal: -0.75, color: "#7c3aed", label: "Tired" },

  // Center: Equilibrium
  neutral:      { valence:  0.00, arousal:  0.00, color: "#94a3b8", label: "Neutral" },
  idk:          { valence: -0.15, arousal: -0.10, color: "#26abb2", label: "Lost" },

  // Bottom-Right: Positive Valence, Low Arousal (Rest & Calm)
  okay:         { valence:  0.30, arousal: -0.15, color: "#ffd900", label: "Okay" },
  relaxed:      { valence:  0.65, arousal: -0.55, color: "#a900bc", label: "Relaxed" },

  // Top-Right: Positive Valence, High Arousal (Joy & Engagement)
  happy:        { valence:  0.75, arousal:  0.45, color: "#ffd000", label: "Happy" },
  loved:        { valence:  0.85, arousal:  0.55, color: "#ff00d0", label: "Loved" },
  proud:        { valence:  0.70, arousal:  0.70, color: "#ff8c00", label: "Proud" },
  excited:      { valence:  0.80, arousal:  0.85, color: "#ffb700", label: "Excited" }
};

let currentMoodView = "timeline"; // 'timeline' or 'compass'

// --- 2. RENDER 2D COMPASS ---
function renderMoodCompass() {
  const container = document.getElementById("compass-nodes-layer");
  const dominantTxt = document.getElementById("compass-dominant-txt");
  const tooltip = document.getElementById("shared-mood-tooltip");
  if (!container) return;

  container.innerHTML = "";

  const currentLogs = (typeof moodLogs !== "undefined") ? moodLogs : (JSON.parse(localStorage.getItem("healthApp_moodLogs")) || []);
  const counts = {};

  currentLogs.forEach(log => {
    let id = log.moodId;
    if (!id && log.score !== undefined) {
      const legacy = { 1: "depressed", 2: "sad", 3: "neutral", 4: "okay", 5: "relaxed", 6: "happy" };
      id = legacy[log.score];
    }
    if (id && AFFECT_COORDINATES[id]) {
      counts[id] = (counts[id] || 0) + 1;
    }
  });

  const quadCounts = { tension: 0, passion: 0, fatigue: 0, serenity: 0 };

  Object.keys(counts).forEach(id => {
    const meta = AFFECT_COORDINATES[id];
    const count = counts[id];

    // Quadrant grouping
    if (meta.valence >= 0 && meta.arousal >= 0) quadCounts.passion += count;
    else if (meta.valence < 0 && meta.arousal >= 0) quadCounts.tension += count;
    else if (meta.valence < 0 && meta.arousal < 0) quadCounts.fatigue += count;
    else if (meta.valence >= 0 && meta.arousal < 0) quadCounts.serenity += count;

    // Convert -1..+1 to 0..100%
    const posX = ((meta.valence + 1) / 2) * 100;
    const posY = ((1 - meta.arousal) / 2) * 100;

    const node = document.createElement("div");
    node.className = "compass-node";
    const size = Math.min(16 + (count - 1) * 6, 32);
    const glow = 4 + count * 5;

    node.style.width = `${size}px`;
    node.style.height = `${size}px`;
    node.style.left = `${posX}%`;
    node.style.top = `${posY}%`;
    node.style.backgroundColor = meta.color;

    if (count > 1) node.textContent = count;

    node.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.innerHTML = `<strong>${meta.label}</strong>: ${count} log${count > 1 ? 's' : ''}`;
        tooltip.style.left = `${posX}%`;
        tooltip.style.top = `${posY}%`;
        tooltip.style.display = "block";
      }
    });

    node.addEventListener("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none";
    });

    container.appendChild(node);
  });

  // Calculate Dominant Quadrant
  if (dominantTxt) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) {
      dominantTxt.textContent = "No logs yet";
    } else {
      const max = Math.max(quadCounts.tension, quadCounts.passion, quadCounts.fatigue, quadCounts.serenity);
      if (quadCounts.tension === max) dominantTxt.textContent = "High Energy & Tension (Fight/Flight)";
      else if (quadCounts.passion === max) dominantTxt.textContent = "High Energy & Joy (Engagement)";
      else if (quadCounts.fatigue === max) dominantTxt.textContent = "Low Energy & Fatigue (Depletion)";
      else dominantTxt.textContent = "Low Energy & Serenity (Rest/Calm)";
    }
  }
}

// --- 3. MASTER RENDER DISPATCHER & TOGGLE SWITCHER ---
function renderMoodVisualizations() {
  if (typeof renderMoodScatterplot === "function") renderMoodScatterplot();
  renderMoodCompass();
}

// Setup Switcher Tab Listeners
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".mood-toggle-btn");
  const titleEl = document.getElementById("mood-view-title");
  const subTitleEl = document.getElementById("mood-view-subtitle");

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      currentMoodView = view;

      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".mood-display-pane").forEach(p => p.classList.remove("active"));
      const targetPane = document.getElementById(`pane-${view}`);
      if (targetPane) targetPane.classList.add("active");

      if (view === "timeline") {
        if (titleEl) titleEl.textContent = "Weekly Timeline";
        if (subTitleEl) subTitleEl.textContent = "Frequency across past 7 days";
        if (typeof renderMoodScatterplot === "function") renderMoodScatterplot();
      } else if (view === "compass") {
        if (titleEl) titleEl.textContent = "Affect Compass";
        if (subTitleEl) subTitleEl.textContent = "2D Valence & Arousal distribution";
        renderMoodCompass();
      }
    });
  });

  renderMoodVisualizations();
});
