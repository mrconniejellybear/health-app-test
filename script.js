let medications = [];

// DOM Elements
const medList = document.getElementById("med-list");
const statusCounter = document.getElementById("status-counter");
const addBtn = document.getElementById("add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const cancelBtn = document.getElementById("cancel-btn");
const medForm = document.getElementById("med-form");

// Modal Controls
addBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
cancelBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));

// Add Medication Form Submit
medForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("med-name").value.trim();
  const rawTime = document.getElementById("med-time").value;

  if (name && rawTime) {
    const formattedTime = formatTime(rawTime);
    medications.push({
      id: Date.now(),
      name,
      scheduledTime: formattedTime,
      isLogged: false,
      loggedTime: null
    });

    medForm.reset();
    modalOverlay.classList.add("hidden");
    render();
  }
});

// Format 24hr string "17:00" -> "5 PM"
function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return minutes === "00" ? `${h} ${ampm}` : `${h}:${minutes} ${ampm}`;
}

// Get current logged timestamp "8:07 AM"
function getCurrentFormattedTime() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "AM" : "AM"; // Matching screenshot casing style
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Render the List UI
function render() {
  medList.innerHTML = "";

  const total = medications.length;
  const takenCount = medications.filter(m => m.isLogged).length;

  if (total === 0) {
    statusCounter.textContent = "None Listed";
  } else {
    statusCounter.textContent = `${takenCount}/${total} Taken`;
  }

  medications.forEach((med) => {
    const li = document.createElement("li");
    li.className = `med-item ${med.isLogged ? "logged" : ""}`;
    li.dataset.id = med.id;

    li.innerHTML = `
      <div class="med-info">
        <div class="check-icon">✓</div>
        <span class="med-text">${med.name}: ${med.scheduledTime}</span>
      </div>
      <span class="logged-status">
        ${med.isLogged ? `Logged: ${med.loggedTime}` : "Not Logged"}
      </span>
    `;

    attachSwipeGesture(li, med);
    medList.appendChild(li);
  });
}

// Touch Handling for Swipe Right
function attachSwipeGesture(element, med) {
  let startX = 0;
  let currentX = 0;

  element.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  element.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    
    // Only allow dragging to the right if not already logged
    if (diffX > 0 && !med.isLogged) {
      element.style.transform = `translateX(${Math.min(diffX, 80)}px)`;
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    const diffX = currentX - startX;
    element.style.transform = "translateX(0px)";

    // Threshold swipe distance (60px) to toggle status
    if (diffX > 60 && !med.isLogged) {
      med.isLogged = true;
      med.loggedTime = getCurrentFormattedTime();
      render();
    }
    
    startX = 0;
    currentX = 0;
  });
}

// Initial Render
render();

// --- WATER TRACKER LOGIC ---
let currentWaterOz = 0;
const goalWaterOz = 64;

// DOM Elements
const waterCounter = document.getElementById("water-counter");
const waterFill = document.getElementById("water-fill");
const addWaterBtn = document.getElementById("add-water-btn");
const waterModalOverlay = document.getElementById("water-modal-overlay");
const waterCancelBtn = document.getElementById("water-cancel-btn");
const waterForm = document.getElementById("water-form");
const quickAddBtns = document.querySelectorAll(".quick-add-btn");

// Toggle Modal
addWaterBtn.addEventListener("click", () => waterModalOverlay.classList.remove("hidden"));
waterCancelBtn.addEventListener("click", () => waterModalOverlay.classList.add("hidden"));

// Update Progress Display
function updateWaterUI() {
  waterCounter.textContent = `${currentWaterOz} oz / ${goalWaterOz} oz`;
  
  // Calculate percentage capped at 100%
  const percentage = Math.min((currentWaterOz / goalWaterOz) * 100, 100);
  waterFill.style.width = `${percentage}%`;
}

// Add Water Function
function addWater(amount) {
  if (amount > 0) {
    currentWaterOz += amount;
    updateWaterUI();
    waterModalOverlay.classList.add("hidden");
  }
}

// Submit Custom Water Entry
waterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("water-amount");
  const amount = parseInt(input.value, 10);
  
  if (amount) {
    addWater(amount);
    input.value = "";
  }
});

// Quick Add Presets (+8 / +16 oz)
quickAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const amount = parseInt(btn.dataset.amount, 10);
    addWater(amount);
  });
});

// Initialize UI
updateWaterUI();


// --- WEIGHT TRACKER LOGIC ---

// Initial Seed Data (Sorted by Date)
let weightLogs = [
  { date: "2026-02-26", weight: 154 },
  { date: "2026-03-15", weight: 158 },
  { date: "2026-04-02", weight: 156 },
  { date: "2026-05-10", weight: 165 },
  { date: "2026-05-28", weight: 161 },
  { date: "2026-06-12", weight: 151 },
  { date: "2026-06-26", weight: 160 }
];

// DOM Elements
const addWeightBtn = document.getElementById("add-weight-btn");
const weightModalOverlay = document.getElementById("weight-modal-overlay");
const weightCancelBtn = document.getElementById("weight-cancel-btn");
const weightForm = document.getElementById("weight-form");
const rangeText = document.getElementById("range-text");
const maxWeightLabel = document.getElementById("max-weight-label");
const minWeightLabel = document.getElementById("min-weight-label");
const weightPath = document.getElementById("weight-path");

// Modal Controls
addWeightBtn.addEventListener("click", () => {
  // Default date picker to today
  document.getElementById("weight-date").valueToDate = new Date();
  document.getElementById("weight-date").value = new Date().toISOString().split('T')[0];
  weightModalOverlay.classList.remove("hidden");
});

weightCancelBtn.addEventListener("click", () => weightModalOverlay.classList.add("hidden"));

// Submit New Weight Entry
weightForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const weight = parseFloat(document.getElementById("weight-input").value);
  const date = document.getElementById("weight-date").value;

  if (weight && date) {
    weightLogs.push({ date, weight });
    // Keep entries in chronological order
    weightLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    document.getElementById("weight-input").value = "";
    weightModalOverlay.classList.add("hidden");
    renderWeightGraph();
  }
});

// Format "YYYY-MM-DD" -> "MM/YY"
function formatDateShort(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${year.slice(2)}`;
}

// Render Graph & Dynamic Axis
function renderWeightGraph() {
  if (weightLogs.length === 0) return;

  // 1. Update Date Range Badge
  const firstDate = formatDateShort(weightLogs[0].date);
  const lastDate = formatDateShort(weightLogs[weightLogs.length - 1].date);
  rangeText.textContent = `${firstDate} — ${lastDate}`;

  // 2. Calculate Min / Max Weights with Padding
  const weights = weightLogs.map(item => item.weight);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);

  // Add 2lbs margin so graph line doesn't clip top/bottom borders
  const displayMin = Math.floor(rawMin - 2);
  const displayMax = Math.ceil(rawMax + 2);

  maxWeightLabel.textContent = `${Math.ceil(rawMax)} lbs`;
  minWeightLabel.textContent = `${Math.floor(rawMin)} lbs`;

  // 3. Map Data Points to SVG ViewBox Coordinates (300px wide by 120px tall)
  const svgWidth = 300;
  const svgHeight = 120;
  const weightRange = displayMax - displayMin || 1;

  const points = weightLogs.map((item, index) => {
    // Distribute X evenly across width
    const x = (index / (weightLogs.length - 1)) * svgWidth;
    
    // Invert Y because SVG (0,0) starts at top-left
    const normalizedY = (item.weight - displayMin) / weightRange;
    const y = svgHeight - (normalizedY * svgHeight);
    
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  // 4. Update SVG Path Data ("M x,y L x,y L x,y...")
  const pathData = `M ${points.join(" L ")}`;
  weightPath.setAttribute("d", pathData);
}

// Initial Graph Render
renderWeightGraph();


// --- MOOD TRACKER LOGIC ---

// Seed Data
let moodLogs = [
  { date: "2026-07-26", score: 3 },
  { date: "2026-07-27", score: 4 },
  { date: "2026-07-28", score: 2 },
  { date: "2026-07-29", score: 5 },
  { date: "2026-07-30", score: 5 },
  { date: "2026-07-31", score: 6 }
];

// DOM Elements
const addMoodBtn = document.getElementById("add-mood-btn");
const moodModalOverlay = document.getElementById("mood-modal-overlay");
const moodCancelBtn = document.getElementById("mood-cancel-btn");
const moodForm = document.getElementById("mood-form");
const moodRangeText = document.getElementById("mood-range-text");
const moodPath = document.getElementById("mood-path");

// Modal Controls
addMoodBtn.addEventListener("click", () => {
  document.getElementById("mood-date").value = new Date().toISOString().split('T')[0];
  moodModalOverlay.classList.remove("hidden");
});

moodCancelBtn.addEventListener("click", () => moodModalOverlay.classList.add("hidden"));

// Submit Entry
moodForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedRating = document.querySelector('input[name="mood-score"]:checked');
  const date = document.getElementById("mood-date").value;

  if (selectedRating && date) {
    moodLogs.push({ date, score: parseInt(selectedRating.value, 10) });
    moodLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    selectedRating.checked = false;
    moodModalOverlay.classList.add("hidden");
    renderMoodGraph();
  }
});

// Render Mood SVG Line
function renderMoodGraph() {
  if (moodLogs.length === 0) return;

  // Date Range Label
  const firstDate = formatDateShort(moodLogs[0].date);
  const lastDate = formatDateShort(moodLogs[moodLogs.length - 1].date);
  moodRangeText.textContent = `${firstDate} — ${lastDate}`;

  // Scale fixed between 1 and 6
  const minScore = 1;
  const maxScore = 6;
  const range = maxScore - minScore;

  const svgWidth = 300;
  const svgHeight = 120;

  const points = moodLogs.map((item, index) => {
    const x = (index / (moodLogs.length - 1)) * svgWidth;
    
    // Invert Y mapping for SVG coordinate space
    const normalizedY = (item.score - minScore) / range;
    const y = svgHeight - (normalizedY * svgHeight);

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathData = `M ${points.join(" L ")}`;
  moodPath.setAttribute("d", pathData);
}

// Initial Render
renderMoodGraph();


// --- NAVIGATION BAR LOGIC ---
const navButtons = document.querySelectorAll(".nav-btn");
const tabViews = document.querySelectorAll(".tab-view");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTabId = btn.dataset.tab;

    // 1. Update Active Nav Button
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 2. Switch Active View
    tabViews.forEach((view) => {
      if (view.id === targetTabId) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // 3. Trigger SVG path re-calculation if entering a tab with a graph
    if (targetTabId === "view-mental" && typeof renderMoodGraph === "function") {
      renderMoodGraph();
    } else if (targetTabId === "view-diet" && typeof renderWeightGraph === "function") {
      renderWeightGraph();
    }
  });
});