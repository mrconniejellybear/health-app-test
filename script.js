// --- 1. GLOBAL APP DATA STATE & LOCALSTORAGE LOAD ---

let medications = JSON.parse(localStorage.getItem("healthApp_medications")) || [];
let moodLogs = JSON.parse(localStorage.getItem("healthApp_moodLogs")) || [
  { date: "2026-07-26", score: 3 },
  { date: "2026-07-27", score: 4 },
  { date: "2026-07-28", score: 2 },
  { date: "2026-07-29", score: 5 },
  { date: "2026-07-30", score: 5 },
  { date: "2026-07-31", score: 6 }
];
let medAdherenceLogs = JSON.parse(localStorage.getItem("healthApp_medLogs")) || {
  "2026-08-01": "taken",
  "2026-08-02": "taken"
};
let sexualActivityLogs = JSON.parse(localStorage.getItem("healthApp_sexLogs")) || [];
let customSymptoms = JSON.parse(localStorage.getItem("healthApp_customSymptoms")) || [];
let symptomLogs = JSON.parse(localStorage.getItem("healthApp_symptomLogs")) || [];
let journalLogs = JSON.parse(localStorage.getItem("healthApp_journalLogs")) || [];
let weightLogs = JSON.parse(localStorage.getItem("healthApp_weightLogs")) || [];
let contraceptiveData = JSON.parse(localStorage.getItem("healthApp_contraceptive")) || {
  type: "",
  customName: ""
};

let homePieChartInstance = null;


// --- 2. STORAGE HELPER ---

function saveAppState() {
  localStorage.setItem("healthApp_medications", JSON.stringify(medications));
  localStorage.setItem("healthApp_moodLogs", JSON.stringify(moodLogs));
  localStorage.setItem("healthApp_medLogs", JSON.stringify(medAdherenceLogs));
  localStorage.setItem("healthApp_symptomLogs", JSON.stringify(symptomLogs));
  localStorage.setItem("healthApp_journalLogs", JSON.stringify(journalLogs));
  localStorage.setItem("healthApp_weightLogs", JSON.stringify(weightLogs));
  localStorage.setItem("healthApp_contraceptive", JSON.stringify(contraceptiveData));
  localStorage.setItem("healthApp_customSymptoms", JSON.stringify(customSymptoms));
  localStorage.setItem("healthApp_sexLogs", JSON.stringify(sexualActivityLogs));
}


// --- 3. MEDICATION TRACKER LOGIC ---

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Helper: Time Format (e.g., "20:00" -> "8:00 PM")
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return minutes === "00" ? `${h} ${ampm}` : `${h}:${minutes} ${ampm}`;
}

const medList = document.getElementById("med-list");
const statusCounter = document.getElementById("status-counter");
const addBtn = document.getElementById("add-med-btn") || document.getElementById("add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const cancelBtn = document.getElementById("cancel-btn") || document.getElementById("cancel-med-btn");
const medForm = document.getElementById("med-form");

if (addBtn && modalOverlay) {
  addBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
}
if (cancelBtn && modalOverlay) {
  cancelBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
}

const MED_COLOR_PALETTE = {
  "color-1": { main: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" }, // Purple
  "color-2": { main: "#176efa", bg: "rgba(45, 132, 255, 0.15)" },  // Blue
  "color-3": { main: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },  // Green
  "color-4": { main: "#fb9405", bg: "rgba(245, 158, 11, 0.15)" },  // Amber
  "color-5": { main: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },  // Pink
  "color-6": { main: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)" },   // Cyan
  "color-7": { main: "#84cc16", bg: "rgba(132, 204, 22, 0.15)" },  // Lime
  "color-8": { main: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)" }    // Rose
};

if (medForm) {
  medForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("med-name").value.trim();
    const dosage = document.getElementById("med-dosage").value.trim();
    const rawTime = document.getElementById("med-time").value;
    const freqInput = document.getElementById("med-frequency");
    const frequency = freqInput ? freqInput.value : "Daily";

    const selectedIcon = document.querySelector('input[name="med_icon"]:checked')?.value || "pill-1";
    const selectedColorKey = document.querySelector('input[name="med_color"]:checked')?.value || "color-1";

    if (name && rawTime) {
      const formattedTime = formatTime(rawTime);
      const newMed = {
        id: Date.now(),
        name,
        dosage,
        scheduledTime: formattedTime,
        frequency,
        icon: selectedIcon,
        colorKey: selectedColorKey,
        history: []
      };

      medications.push(newMed);
      saveAppState();
      medForm.reset();
      if (modalOverlay) modalOverlay.classList.add("hidden");
      renderMedications();
      if (typeof updateHomeDashboard === 'function') updateHomeDashboard();
    }
  });
}

function renderMedications() {
  if (!medList) return;
  medList.innerHTML = "";

  const today = getTodayStr();

  medications.forEach(med => {
    if (!med.history) med.history = [];
    if (!med.dosage) med.dosage = "200mg";
    if (!med.colorKey) med.colorKey = "color-1";
    if (!med.icon) med.icon = "pill-1";
  });

  const total = medications.length;
  const takenCount = medications.filter(m => m.history.includes(today)).length;

  if (statusCounter) {
    statusCounter.textContent = total === 0 ? "None Listed" : `${takenCount}/${total} Taken`;
  }

  const sortedMeds = [...medications].sort((a, b) => {
    const aTaken = a.history.includes(today);
    const bTaken = b.history.includes(today);
    return aTaken === bTaken ? 0 : aTaken ? 1 : -1;
  });

  sortedMeds.forEach((med) => {
    const isTakenToday = med.history.includes(today);
    const colorTheme = MED_COLOR_PALETTE[med.colorKey] || MED_COLOR_PALETTE["color-1"];

    const li = document.createElement("li");
    li.className = `med-item ${isTakenToday ? "completed" : ""}`;
    li.dataset.id = med.id;

    li.style.backgroundColor = colorTheme.bg;
    li.style.borderColor = `${colorTheme.main}40`;

    li.innerHTML = `
      <div class="med-card-wrapper">
        <div class="med-icon-display" style="color: ${colorTheme.main}">
          ${getIconSVG(med.icon)}
        </div>
        <div class="med-grid">
          <span class="med-name" style="color: ${colorTheme.main}">${med.name}</span>
          <span class="med-dosage">${med.dosage}</span>
          <span class="med-time" style="color: ${colorTheme.main}">${med.scheduledTime}</span>
          <span class="logged-status">
            ${isTakenToday ? "✓ Taken Today" : "Pending"}
          </span>
        </div>
      </div>
    `;

    attachSwipeGesture(li, med, today);
    medList.appendChild(li);
  });
}

function getIconSVG(iconKey) {
  const iconMap = {
    "pill-1": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="m668-349 106-107q32-32 49-73t17-86q0-94-65.5-159.5T615-840q-45 0-86 17t-73 49L349-668l319 319ZM345-120q45 0 86-17t73-49l107-106-319-319-106 107q-32 32-49 73t-17 86q0 94 65.5 159.5T345-120Z"/></svg>',

    "pill-2": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="M520-40q-33 0-56.5-23.5T440-120v-83q-103-14-171.5-92.5T200-480v-360q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v360q0 106-68.5 184.5T520-203v83h240v80H520Zm30-400h126q2-10 3-19.5t1-20.5v-40H520v-80h160v-80H480v-80h200v-80H280v320h110q33 0 62.5 15t49.5 41q8 11 21 17.5t27 6.5Z"/></svg>',

    "pill-3": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="M156-513q-11-12-11-28.5t11-28.5l112-112-43-43-12 12q-12 12-28.5 12T156-713q-11-12-11-28.5t11-27.5l80-80q12-12 28.5-12t28.5 12q12 11 12 28t-12 28l-12 12 43 43 112-112q12-12 28.5-12t28.5 12q12 12 12 28.5T493-793l-27 26 62 62-113 112q-11 12-11 28.5t11 28.5q12 12 28.5 12t28.5-12l112-113 61 60-113 113q-12 12-12 28.5t12 28.5q11 11 27.5 10.5T588-420l112-113 61 61q23 23 23 56.5T761-359l-28 29 189 188H808L676-274l-28 29q-23 23-56.5 23T535-245L240-540l-27 27q-12 11-28.5 11T156-513Z"/></svg>',

    "pill-4": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="m320-60-80-60v-160h-40q-33 0-56.5-23.5T120-360v-300q-17 0-28.5-11.5T80-700q0-17 11.5-28.5T120-740h120v-60h-20q-17 0-28.5-11.5T180-840q0-17 11.5-28.5T220-880h120q17 0 28.5 11.5T380-840q0 17-11.5 28.5T340-800h-20v60h120q17 0 28.5 11.5T480-700q0 17-11.5 28.5T440-660v300q0 33-23.5 56.5T360-280h-40v220Zm247-67q-47-47-47-113v-320q0-66 47-113t113-47q66 0 113 47t47 113v320q0 66-47 113T680-80q-66 0-113-47ZM200-360h160v-60h-70q-12 0-21-9t-9-21q0-12 9-21t21-9h70v-60h-70q-12 0-21-9t-9-21q0-12 9-21t21-9h70v-60H200v300Zm400 40h160v-160H600v160Z"/></svg>',

    "pill-5": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="M420-260h120v-100h100v-120H540v-100H420v100H320v120h100v100ZM280-120q-33 0-56.5-23.5T200-200v-440q0-33 23.5-56.5T280-720h400q33 0 56.5 23.5T760-640v440q0 33-23.5 56.5T680-120H280Zm-40-640v-80h480v80H240Z"/></svg>',

    "pill-6": '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="currentColor"><path d="M200-120q-17 0-28.5-11.5T160-160q0-17 11.5-28.5T200-200h560q17 0 28.5 11.5T800-160q0 17-11.5 28.5T760-120H200Zm520-520h80v-120h-80v120ZM320-280q-66 0-113-47t-47-113v-311q0-37 26-63t63-26h111v96l-72 58q-2 2-8 16v170q0 8 6 14t14 6h160q8 0 14-6t6-14v-170q0-2-8-16l-72-58v-96h400q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Z"/></svg>',

    "pill-7": "🍃",

    "pill-8": "✨"

  };
  return iconMap[iconKey] || "💊";
}

function attachSwipeGesture(element, med, today) {
  let startX = 0;
  let currentX = 0;

  element.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  element.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    const isTakenToday = med.history.includes(today);

    if (diffX < 0 && !isTakenToday) {
      element.style.transform = `translateX(${Math.max(diffX, -80)}px)`;
    } else if (diffX > 0 && isTakenToday) {
      element.style.transform = `translateX(${Math.min(diffX, 80)}px)`;
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    const diffX = currentX - startX;
    element.style.transform = "translateX(0px)";
    const isTakenToday = med.history.includes(today);

    if (diffX < -60 && !isTakenToday) {
      med.history.push(today);
      if (typeof playLogSound === "function") playLogSound();
      saveAppState();
      renderMedications();
      if (typeof updateHomeDashboard === 'function') updateHomeDashboard();

    } else if (diffX > 60 && isTakenToday) {
      med.history = med.history.filter(date => date !== today);
      saveAppState();
      renderMedications();
      if (typeof updateHomeDashboard === 'function') updateHomeDashboard();
    }

    startX = 0;
    currentX = 0;
  });
}


// --- 4. WATER & CAFFEINE TRACKER LOGIC ---

let currentWaterOz = 0;
const goalWaterOz = 64;

const waterCounter = document.getElementById("water-counter");
const waterFill = document.getElementById("water-fill");
const addWaterBtn = document.getElementById("add-water-btn");
const waterModalOverlay = document.getElementById("water-modal-overlay");
const waterCancelBtn = document.getElementById("water-cancel-btn");
const waterForm = document.getElementById("water-form");
const quickAddBtns = document.querySelectorAll(".quick-add-btn");

if (addWaterBtn && waterModalOverlay) {
  addWaterBtn.addEventListener("click", () => waterModalOverlay.classList.remove("hidden"));
}
if (waterCancelBtn && waterModalOverlay) {
  waterCancelBtn.addEventListener("click", () => waterModalOverlay.classList.add("hidden"));
}

function updateWaterUI() {
  if (!waterCounter || !waterFill) return;
  waterCounter.textContent = `${currentWaterOz} oz / ${goalWaterOz} oz`;
  const percentage = Math.min((currentWaterOz / goalWaterOz) * 100, 100);
  waterFill.style.width = `${percentage}%`;
}

function addWater(amount) {
  if (amount > 0) {
    currentWaterOz += amount;
    updateWaterUI();
    if (waterModalOverlay) waterModalOverlay.classList.add("hidden");
  }
}

if (waterForm) {
  waterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("water-amount");
    const amount = parseInt(input.value, 10);
    
    if (amount) {
      addWater(amount);
      input.value = "";
    }
  });
}

quickAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const amount = parseInt(btn.dataset.amount, 10);
    addWater(amount);
  });
});

let currentCaffeineMg = JSON.parse(localStorage.getItem("healthApp_caffeineMg")) || 0;
let goalCaffeineMg = JSON.parse(localStorage.getItem("healthApp_caffeineGoal")) || 200;

const caffeineCounter = document.getElementById("caffeine-counter");
const caffeineFill = document.getElementById("caffeine-fill");
const caffeineGoalLabel = document.getElementById("caffeine-goal-label");
const addCaffeineBtn = document.getElementById("add-caffeine-btn");
const caffeineModalOverlay = document.getElementById("caffeine-modal-overlay");
const caffeineCancelBtn = document.getElementById("caffeine-cancel-btn");
const caffeineForm = document.getElementById("caffeine-form");
const caffeineGoalInput = document.getElementById("caffeine-goal-input");
const caffeineQuickBtns = document.querySelectorAll(".caffeine-quick-btn");

if (addCaffeineBtn) {
  addCaffeineBtn.addEventListener("click", () => {
    if (caffeineGoalInput) caffeineGoalInput.value = goalCaffeineMg;
    caffeineModalOverlay?.classList.remove("hidden");
  });
}

if (caffeineCancelBtn) {
  caffeineCancelBtn.addEventListener("click", () => {
    caffeineModalOverlay?.classList.add("hidden");
  });
}

function updateCaffeineUI() {
  if (!caffeineCounter) return;
  caffeineCounter.textContent = `${currentCaffeineMg}mg / ${goalCaffeineMg}mg`;
  if (caffeineGoalLabel) caffeineGoalLabel.textContent = `${goalCaffeineMg}mg`;

  const percentage = Math.min((currentCaffeineMg / goalCaffeineMg) * 100, 100);
  if (caffeineFill) caffeineFill.style.width = `${percentage}%`;
}

function addCaffeine(amount) {
  if (amount > 0) {
    currentCaffeineMg += amount;
    if (caffeineGoalInput) {
      const newGoal = parseInt(caffeineGoalInput.value, 10);
      if (newGoal && newGoal > 0) goalCaffeineMg = newGoal;
    }

    saveCaffeineState();
    updateCaffeineUI();
    caffeineModalOverlay?.classList.add("hidden");
  }
}

caffeineQuickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    addCaffeine(parseInt(btn.dataset.amount, 10));
  });
});

if (caffeineForm) {
  caffeineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("caffeine-amount");
    const amount = parseInt(input.value, 10);
    
    if (amount) {
      addCaffeine(amount);
      input.value = "";
    } else if (caffeineGoalInput) {
      const newGoal = parseInt(caffeineGoalInput.value, 10);
      if (newGoal && newGoal > 0) {
        goalCaffeineMg = newGoal;
        saveCaffeineState();
        updateCaffeineUI();
        caffeineModalOverlay?.classList.add("hidden");
      }
    }
  });
}

function saveCaffeineState() {
  localStorage.setItem("healthApp_caffeineMg", JSON.stringify(currentCaffeineMg));
  localStorage.setItem("healthApp_caffeineGoal", JSON.stringify(goalCaffeineMg));
}

const sexForm = document.getElementById("sexual-activity-form");
const sexDateInput = document.getElementById("sex-log-date");
const sexTimeInput = document.getElementById("sex-log-time");

if (sexDateInput && sexTimeInput) {
  const now = new Date();
  sexDateInput.value = now.toISOString().split("T")[0];
  
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  sexTimeInput.value = `${hours}:${minutes}`;
}

if (sexForm) {
  sexForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedProtection = document.querySelector('input[name="protection-used"]:checked');
    const logDate = sexDateInput.value;
    const logTime = sexTimeInput.value;

    if (!logDate || !logTime) {
      alert("Please select both a date and time.");
      return;
    }

    const activityEntry = {
      id: Date.now(),
      date: logDate,
      time: logTime,
      protectionUsed: selectedProtection ? selectedProtection.value === "yes" : null
    };

    sexualActivityLogs.push(activityEntry);
    saveAppState();

    alert("Activity logged successfully!");
    if (selectedProtection) selectedProtection.checked = false;
  });
}


// --- 5. WEIGHT TRACKER LOGIC ---

const addWeightBtn = document.getElementById("add-weight-btn");
const weightModalOverlay = document.getElementById("weight-modal-overlay");
const weightCancelBtn = document.getElementById("weight-cancel-btn");
const weightForm = document.getElementById("weight-form");
const rangeText = document.getElementById("range-text");
const maxWeightLabel = document.getElementById("max-weight-label");
const minWeightLabel = document.getElementById("min-weight-label");
const weightPath = document.getElementById("weight-path");

if (addWeightBtn && weightModalOverlay) {
  addWeightBtn.addEventListener("click", () => {
    document.getElementById("weight-date").value = new Date().toISOString().split('T')[0];
    weightModalOverlay.classList.remove("hidden");
  });
}

if (weightCancelBtn && weightModalOverlay) {
  weightCancelBtn.addEventListener("click", () => weightModalOverlay.classList.add("hidden"));
}

if (weightForm) {
  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("weight-date").value;

    if (weight && date) {
      weightLogs.push({ date, weight });
      weightLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      saveAppState();
      document.getElementById("weight-input").value = "";
      weightModalOverlay.classList.add("hidden");
      renderWeightGraph();
    }
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return `${month}/${year.slice(2)}`;
}

function renderWeightGraph() {
  if (!weightPath || weightLogs.length === 0) return;

  if (rangeText) {
    const firstDate = formatDateShort(weightLogs[0].date);
    const lastDate = formatDateShort(weightLogs[weightLogs.length - 1].date);
    rangeText.textContent = `${firstDate} — ${lastDate}`;
  }

  const weights = weightLogs.map(item => item.weight);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);

  const displayMin = Math.floor(rawMin - 2);
  const displayMax = Math.ceil(rawMax + 2);

  if (maxWeightLabel) maxWeightLabel.textContent = `${Math.ceil(rawMax)} lbs`;
  if (minWeightLabel) minWeightLabel.textContent = `${Math.floor(rawMin)} lbs`;

  const svgWidth = 300;
  const svgHeight = 120;
  const weightRange = displayMax - displayMin || 1;

  const points = weightLogs.map((item, index) => {
    const x = weightLogs.length > 1 ? (index / (weightLogs.length - 1)) * svgWidth : svgWidth / 2;
    const normalizedY = (item.weight - displayMin) / weightRange;
    const y = svgHeight - (normalizedY * svgHeight);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  weightPath.setAttribute("d", `M ${points.join(" L ")}`);
}

const sleepQualityMap = {
  1: { label: "Poor", class: "badge-poor", color: "#d04a35", fillPct: 0 },
  2: { label: "Fair", class: "badge-fair", color: "#f59e0b", fillPct: 33 },
  3: { label: "Good", class: "badge-good", color: "#4fa23a", fillPct: 66 },
  4: { label: "Excellent", class: "badge-excellent", color: "#059669", fillPct: 100 }
};

const sleepSlider = document.getElementById("sleep-quality-slider");
const sleepBadge = document.getElementById("badge-sleep-quality");

if (sleepSlider && sleepBadge) {
  sleepSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    const config = sleepQualityMap[val];

    sleepBadge.textContent = config.label;
    sleepBadge.className = `sleep-badge ${config.class}`;

    const trackColor = "#e2e8f0";
    e.target.style.background = `linear-gradient(to right, ${config.color} ${config.fillPct}%, ${trackColor} ${config.fillPct}%)`;
  });

  sleepSlider.dispatchEvent(new Event("input"));
}


// --- 6. MOOD TRACKER LOGIC ---

const addMoodBtn = document.getElementById("add-mood-btn");
const moodModalOverlay = document.getElementById("mood-modal-overlay");
const moodCancelBtn = document.getElementById("mood-cancel-btn");
const moodForm = document.getElementById("mood-form");
const moodRangeText = document.getElementById("mood-range-text");
const moodPath = document.getElementById("mood-path");

if (addMoodBtn && moodModalOverlay) {
  addMoodBtn.addEventListener("click", () => {
    document.getElementById("mood-date").value = new Date().toISOString().split('T')[0];
    moodModalOverlay.classList.remove("hidden");
  });
}

if (moodCancelBtn && moodModalOverlay) {
  moodCancelBtn.addEventListener("click", () => moodModalOverlay.classList.add("hidden"));
}

if (moodForm) {
  moodForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedRating = document.querySelector('input[name="mood-rating"]:checked');
    const dateInput = document.getElementById("mood-date");
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

    if (selectedRating && date) {
      moodLogs.push({ date, score: parseInt(selectedRating.value, 10) });
      moodLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

      if (typeof playLogSound === "function") playLogSound();
      saveAppState();
      updateHomeDashboard();
      
      selectedRating.checked = false;
      if (moodModalOverlay) moodModalOverlay.classList.add("hidden");
      renderMoodGraph();
    }
  });
}

function renderMoodGraph() {
  if (!moodPath || moodLogs.length === 0) return;

  if (moodRangeText) {
    const firstDate = formatDateShort(moodLogs[0].date);
    const lastDate = formatDateShort(moodLogs[moodLogs.length - 1].date);
    moodRangeText.textContent = `${firstDate} — ${lastDate}`;
  }

  const minScore = 1;
  const maxScore = 6;
  const range = maxScore - minScore;

  const svgWidth = 300;
  const svgHeight = 120;

  const points = moodLogs.map((item, index) => {
    const x = moodLogs.length > 1 ? (index / (moodLogs.length - 1)) * svgWidth : svgWidth / 2;
    const normalizedY = (item.score - minScore) / range;
    const y = svgHeight - (normalizedY * svgHeight);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  moodPath.setAttribute("d", `M ${points.join(" L ")}`);
  renderMoodPieChart();
}

const moodColors = {
  1: "#c62828", 2: "#ef5350", 3: "#ffa726",
  4: "#ffee58", 5: "#66bb6a", 6: "#2e7d32"
};

function renderMoodPieChart() {
  const pieElement = document.getElementById("mood-pie-chart");
  if (!pieElement || moodLogs.length === 0) return;

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  moodLogs.forEach(log => {
    if (counts[log.score] !== undefined) counts[log.score]++;
  });

  const totalLogs = moodLogs.length;
  let gradientStops = [];
  let currentPercentage = 0;

  for (let score = 1; score <= 6; score++) {
    const count = counts[score];
    if (count > 0) {
      const percentage = (count / totalLogs) * 100;
      const start = currentPercentage;
      const end = currentPercentage + percentage;
      gradientStops.push(`${moodColors[score]} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
      currentPercentage = end;
    }
  }

  pieElement.style.background = `conic-gradient(${gradientStops.join(", ")})`;
}


// --- 7. MEDICATION CALENDAR & CONTRACEPTIVE LOGIC ---

function renderMedicationCalendar(year = 2026, month = 7) {
  const grid = document.getElementById("med-calendar-grid");
  const monthLabel = document.getElementById("cal-month-text");
  if (!grid) return;

  grid.innerHTML = "";

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split("T")[0];

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  
  if (monthLabel) {
    monthLabel.textContent = `${monthNames[month]} ${year}`;
  }

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("cal-day", "empty");
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("cal-day");
    dayCell.textContent = day;

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : month + 1;
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

    if (dateKey === todayStr) dayCell.classList.add("today");

    const status = medAdherenceLogs[dateKey];
    if (status) dayCell.classList.add(status);

    grid.appendChild(dayCell);
  }
}

const contraForm = document.getElementById("contraceptive-form");
const customNameInput = document.getElementById("contra-custom-name");

function loadSavedContraceptive() {
  if (contraceptiveData.type) {
    const targetRadio = document.querySelector(`input[name="contraceptive-type"][value="${contraceptiveData.type}"]`);
    if (targetRadio) targetRadio.checked = true;
  }
  if (contraceptiveData.customName && customNameInput) {
    customNameInput.value = contraceptiveData.customName;
  }
}

if (contraForm) {
  contraForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedType = document.querySelector('input[name="contraceptive-type"]:checked');
    const customName = customNameInput ? customNameInput.value.trim() : "";

    contraceptiveData = {
      type: selectedType ? selectedType.value : "",
      customName: customName
    };

    saveAppState();
  });
}

loadSavedContraceptive();


// --- 8. SYMPTOM TRACKER & JOURNAL LOGIC ---

const severityColors = {
  0: { badgeBg: "#f1f5f9", badgeText: "#64748b8f", sliderColor: "#cbd5e1" },
  1: { badgeBg: "#d1fae5", badgeText: "#065f46", sliderColor: "#4fa23a" },
  2: { badgeBg: "#fef3c7", badgeText: "#92400e", sliderColor: "#f59e0b" },
  3: { badgeBg: "#fee2e2", badgeText: "#991b1b", sliderColor: "#d04a35" }
};

const intensityLabels = { 0: "None", 1: "Mild", 2: "Moderate", 3: "Severe" };

document.querySelectorAll(".severity-slider").forEach((slider) => {
  attachSliderEventListener(slider);
});

const symptomForm = document.getElementById("symptom-form");
if (symptomForm) {
  symptomForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const symptomRatings = {};
    document.querySelectorAll(".severity-slider").forEach((slider) => {
      symptomRatings[slider.dataset.symptom] = parseInt(slider.value, 10);
    });

    const periodTextures = [];
    document.querySelectorAll('input[name="period-texture"]:checked').forEach((cb) => periodTextures.push(cb.value));

    const periodColors = [];
    document.querySelectorAll('input[name="period-color"]:checked').forEach((cb) => periodColors.push(cb.value));

    const dischargeTextures = [];
    document.querySelectorAll('input[name="discharge-texture"]:checked').forEach((cb) => dischargeTextures.push(cb.value));

    const dischargeColors = [];
    document.querySelectorAll('input[name="discharge-color"]:checked').forEach((cb) => dischargeColors.push(cb.value));

    symptomLogs.push({
      date: new Date().toISOString().split("T")[0],
      ratings: symptomRatings,
      textures: periodTextures,
      colors: periodColors,
      dischargeTextures: dischargeTextures,
      dischargeColors: dischargeColors
    });

    saveAppState();
    alert("Symptoms logged successfully!");
  });
}


// --- DYNAMIC CUSTOM SYMPTOMS LOGIC ---

const customSymptomsList = document.getElementById("custom-symptoms-list");
const newSymptomInput = document.getElementById("new-symptom-input");
const addCustomSymptomBtn = document.getElementById("add-custom-symptom-btn");

function renderCustomSymptoms() {
  if (!customSymptomsList) return;
  customSymptomsList.innerHTML = "";

  customSymptoms.forEach((name) => {
    createSymptomRowDOM(name);
  });
}

function createSymptomRowDOM(symptomName) {
  const key = symptomName.toLowerCase().replace(/\s+/g, "-");

  const row = document.createElement("div");
  row.className = "symptom-row";
  row.innerHTML = `
    <div class="symptom-header">
      <span class="symptom-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="19px" viewBox="0 -960 960 960" width="19px" fill="currentColor">
          <path d="M157.37-228.28q-19.15 0-32.33-13.18-13.17-13.17-13.17-32.32t13.17-32.33q13.18-13.17 32.33-13.17h405.26q19.15 0 32.33 13.17 13.17 13.18 13.17 32.33t-13.17 32.32q-13.18 13.18-32.33 13.18H157.37Zm0-206.22q-19.15 0-32.33-13.17-13.17-13.18-13.17-32.33t13.17-32.33q13.18-13.17 32.33-13.17h645.26q19.15 0 32.33 13.17 13.17 13.18 13.17 32.33t-13.17 32.33q-13.18 13.17-32.33 13.17H157.37Zm0-206.22q-19.15 0-32.33-13.17-13.17-13.18-13.17-32.33t13.17-32.32q13.18-13.18 32.33-13.18h645.26q19.15 0 32.33 13.18 13.17 13.17 13.17 32.32t-13.17 32.33q-13.18 13.17-32.33 13.17H157.37Z"/>
        </svg>
        ${symptomName}
      </span>
      <span class="severity-badge" id="badge-${key}">None</span>
    </div>
    <input type="range" class="severity-slider" data-symptom="${key}" min="0" max="3" value="0" step="1">
  `;

  customSymptomsList.appendChild(row);

  const newSlider = row.querySelector(".severity-slider");
  attachSliderEventListener(newSlider);
}

function attachSliderEventListener(slider) {
  slider.addEventListener("input", (e) => {
    const key = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${key}`);
    const theme = severityColors[val];

    if (badge) {
      badge.textContent = intensityLabels[val];
      badge.style.backgroundColor = theme.badgeBg;
      badge.style.color = theme.badgeText;
    }

    e.target.style.accentColor = theme.sliderColor;
    
    const percentage = (val / 3) * 100;
    e.target.style.background = `linear-gradient(to right, ${theme.sliderColor} 0%, ${theme.sliderColor} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  });
  
  slider.dispatchEvent(new Event("input"));
}

if (addCustomSymptomBtn) {
  addCustomSymptomBtn.addEventListener("click", () => {
    const name = newSymptomInput ? newSymptomInput.value.trim() : "";
    if (name) {
      if (!customSymptoms.includes(name)) {
        customSymptoms.push(name);
        saveAppState();
        createSymptomRowDOM(name);
      }
      if (newSymptomInput) newSymptomInput.value = "";
    }
  });
}

const journalForm = document.getElementById("journal-form");
if (journalForm) {
  journalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const notes = document.getElementById("symptom-notes").value.trim();

    if (notes) {
      journalLogs.push({
        date: new Date().toISOString().split("T")[0],
        text: notes
      });
      saveAppState();
      document.getElementById("symptom-notes").value = "";
      alert("Journal entry saved!");
    }
  });
}


// --- 9. HOME DASHBOARD CALCULATIONS & CHART ---

function updateHomeDashboard() {
  renderHomeMoodCard();
  renderHomeMedCard();
  renderHomeWeightCard();
}

function renderHomeMoodCard() {
  const positivityEl = document.getElementById("home-positivity-pct");
  const topMoodEl = document.getElementById("home-top-mood-val");
  const canvas = document.getElementById("home-mood-pie-chart");

  if (!canvas || !moodLogs || moodLogs.length === 0) {
    if (positivityEl) positivityEl.textContent = "0%";
    if (topMoodEl) topMoodEl.textContent = "No logs";
    return;
  }

  const positiveCount = moodLogs.filter(log => {
    const moodName = log.label || log.mood;
    return log.score >= 4 || ["Happy", "Excited", "Relaxed", "Okay", "Proud"].includes(moodName);
  }).length;

  const pct = Math.round((positiveCount / moodLogs.length) * 100);
  if (positivityEl) positivityEl.textContent = `${pct}%`;

  const frequencyMap = {};
  let maxCount = 0;
  let mostLogged = "None";

  moodLogs.forEach(log => {
    const key = log.label || log.mood || (log.score >= 5 ? "Great" : log.score >= 3 ? "Okay" : "Low");
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
    if (frequencyMap[key] > maxCount) {
      maxCount = frequencyMap[key];
      mostLogged = key;
    }
  });

  if (topMoodEl) topMoodEl.textContent = mostLogged;

  if (homePieChartInstance) {
    homePieChartInstance.destroy();
  }

  const great = moodLogs.filter(l => l.score >= 5).length;
  const okay = moodLogs.filter(l => l.score === 3 || l.score === 4).length;
  const low = moodLogs.filter(l => l.score <= 2).length;

  if (typeof Chart !== "undefined") {
    homePieChartInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Positive', 'Neutral', 'Low'],
        datasets: [{
          data: [great, okay, low],
          backgroundColor: ['#077d34', '#21ba64', '#9bce2c'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { display: false } }
      }
    });
  }
}

function renderHomeMedCard() {
  const statusEl = document.getElementById("home-med-status");
  const nextEl = document.getElementById("home-med-next");
  const today = getTodayStr();

  if (!medications || medications.length === 0) {
    if (statusEl) statusEl.textContent = "None Set";
    if (nextEl) nextEl.textContent = "Tap to add meds";
    return;
  }

  const takenCount = medications.filter(m => m.history && m.history.includes(today)).length;
  if (statusEl) statusEl.textContent = `${takenCount}/${medications.length} Taken`;

  const pendingMed = medications.find(m => !m.history || !m.history.includes(today));
  if (nextEl) {
    nextEl.textContent = pendingMed ? `Next: ${pendingMed.scheduledTime || pendingMed.name}` : "All taken today!";
  }
}

function renderHomeWeightCard() {
  const currentEl = document.getElementById("home-current-weight");
  const changeEl = document.getElementById("home-weight-change-val");

  if (!weightLogs || weightLogs.length === 0) {
    if (currentEl) currentEl.textContent = "--";
    if (changeEl) changeEl.textContent = "0 lbs";
    return;
  }

  const latestWeight = weightLogs[weightLogs.length - 1].weight;
  const startWeight = weightLogs[0].weight;
  const diff = (latestWeight - startWeight).toFixed(1);

  if (currentEl) currentEl.textContent = latestWeight;
  if (changeEl) {
    const sign = diff > 0 ? "+" : "";
    changeEl.textContent = `${sign}${diff} lbs since start`;
  }
}


// --- 10. NAVIGATION & APP INITIALIZATION ---

const navButtons = document.querySelectorAll(".nav-btn");
const tabViews = document.querySelectorAll(".tab-view");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTabId = btn.dataset.tab;

    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabViews.forEach(view => {
      view.classList.remove("active");
      if (view.id === targetTabId) {
        view.classList.add("active");
      }
    });

    if (targetTabId === "view-home") {
      setTimeout(() => {
        updateHomeDashboard();
      }, 50);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderMedications(); // Fixed: changed render() to renderMedications()
  updateWaterUI();
  updateCaffeineUI();
  renderWeightGraph();
  renderMoodGraph();
  renderMedicationCalendar();
  renderCustomSymptoms();
  updateHomeDashboard();
});
