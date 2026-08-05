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
let symptomLogs = JSON.parse(localStorage.getItem("healthApp_symptomLogs")) || [];
let weightLogs = JSON.parse(localStorage.getItem("healthApp_weightLogs")) || [
  { date: "2026-02-26", weight: 154 },
  { date: "2026-03-15", weight: 158 },
  { date: "2026-04-02", weight: 156 },
  { date: "2026-05-10", weight: 165 },
  { date: "2026-05-28", weight: 161 },
  { date: "2026-06-12", weight: 151 },
  { date: "2026-06-26", weight: 160 }
];
let contraceptiveData = JSON.parse(localStorage.getItem("healthApp_contraceptive")) || {
  type: "",
  customName: ""
};

// --- 2. STORAGE HELPER ---

function saveAppState() {
  localStorage.setItem("healthApp_medications", JSON.stringify(medications));
  localStorage.setItem("healthApp_moodLogs", JSON.stringify(moodLogs));
  localStorage.setItem("healthApp_medLogs", JSON.stringify(medAdherenceLogs));
  localStorage.setItem("healthApp_symptomLogs", JSON.stringify(symptomLogs));
  localStorage.setItem("healthApp_weightLogs", JSON.stringify(weightLogs));
  localStorage.setItem("healthApp_contraceptive", JSON.stringify(contraceptiveData));
}


// --- 3. MEDICATION TRACKER LOGIC ---

// DOM Elements
const medList = document.getElementById("med-list");
const statusCounter = document.getElementById("status-counter");
const addBtn = document.getElementById("add-med-btn") || document.getElementById("add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const cancelBtn = document.getElementById("cancel-btn");
const medForm = document.getElementById("med-form");

// Modal Controls
if (addBtn && modalOverlay) {
  addBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
}
if (cancelBtn && modalOverlay) {
  cancelBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
}

// Add Medication Form Submit
if (medForm) {
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

      saveAppState();
      medForm.reset();
      modalOverlay.classList.add("hidden");
      render();
    }
  });
}

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
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Render Medication List UI
function render() {
  if (!medList) return;
  medList.innerHTML = "";

  const total = medications.length;
  const takenCount = medications.filter(m => m.isLogged).length;

  if (statusCounter) {
    if (total === 0) {
      statusCounter.textContent = "None Listed";
    } else {
      statusCounter.textContent = `${takenCount}/${total} Taken`;
    }
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
    
    if (diffX > 0 && !med.isLogged) {
      element.style.transform = `translateX(${Math.min(diffX, 80)}px)`;
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    const diffX = currentX - startX;
    element.style.transform = "translateX(0px)";

    if (diffX > 60 && !med.isLogged) {
      med.isLogged = true;
      med.loggedTime = getCurrentFormattedTime();
      saveAppState();
      render();
    }
    
    startX = 0;
    currentX = 0;
  });
}


// --- 4. WATER TRACKER LOGIC ---

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

// --- CAFFEINE TRACKER LOGIC ---

// Global variables with localStorage recovery
let currentCaffeineMg = JSON.parse(localStorage.getItem("healthApp_caffeineMg")) || 0;
let goalCaffeineMg = JSON.parse(localStorage.getItem("healthApp_caffeineGoal")) || 200;

// DOM Elements
const caffeineCounter = document.getElementById("caffeine-counter");
const caffeineFill = document.getElementById("caffeine-fill");
const caffeineGoalLabel = document.getElementById("caffeine-goal-label");
const addCaffeineBtn = document.getElementById("add-caffeine-btn");
const caffeineModalOverlay = document.getElementById("caffeine-modal-overlay");
const caffeineCancelBtn = document.getElementById("caffeine-cancel-btn");
const caffeineForm = document.getElementById("caffeine-form");
const caffeineGoalInput = document.getElementById("caffeine-goal-input");
const caffeineQuickBtns = document.querySelectorAll(".caffeine-quick-btn");

// Open & Close Modal Controls
if (addCaffeineBtn) {
  addCaffeineBtn.addEventListener("click", () => {
    caffeineGoalInput.value = goalCaffeineMg; // Populate input with current goal
    caffeineModalOverlay.classList.remove("hidden");
  });
}

if (caffeineCancelBtn) {
  caffeineCancelBtn.addEventListener("click", () => {
    caffeineModalOverlay.classList.add("hidden");
  });
}

// Update UI Display
function updateCaffeineUI() {
  if (!caffeineCounter) return;

  caffeineCounter.textContent = `${currentCaffeineMg}mg / ${goalCaffeineMg}mg`;
  if (caffeineGoalLabel) caffeineGoalLabel.textContent = `${goalCaffeineMg}mg`;

  // Calculate Percentage Cap at 100%
  const percentage = Math.min((currentCaffeineMg / goalCaffeineMg) * 100, 100);
  if (caffeineFill) caffeineFill.style.width = `${percentage}%`;
}

// Add Caffeine Handler
function addCaffeine(amount) {
  if (amount > 0) {
    currentCaffeineMg += amount;
    
    // Check if user updated their goal in the input field
    const newGoal = parseInt(caffeineGoalInput.value, 10);
    if (newGoal && newGoal > 0) {
      goalCaffeineMg = newGoal;
    }

    saveCaffeineState();
    updateCaffeineUI();
    caffeineModalOverlay.classList.add("hidden");
  }
}

// Quick Add Button Listeners
caffeineQuickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const amount = parseInt(btn.dataset.amount, 10);
    addCaffeine(amount);
  });
});

// Custom Form Submit
if (caffeineForm) {
  caffeineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("caffeine-amount");
    const amount = parseInt(input.value, 10);
    
    if (amount) {
      addCaffeine(amount);
      input.value = "";
    } else {
      // If user only wanted to update their daily goal limit without adding mg
      const newGoal = parseInt(caffeineGoalInput.value, 10);
      if (newGoal && newGoal > 0) {
        goalCaffeineMg = newGoal;
        saveCaffeineState();
        updateCaffeineUI();
        caffeineModalOverlay.classList.add("hidden");
      }
    }
  });
}

// Helper: Save Caffeine State to LocalStorage
function saveCaffeineState() {
  localStorage.setItem("healthApp_caffeineMg", JSON.stringify(currentCaffeineMg));
  localStorage.setItem("healthApp_caffeineGoal", JSON.stringify(goalCaffeineMg));
}

// Initial UI Call
updateCaffeineUI();


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
    const selectedRating = document.querySelector('input[name="mood-score"]:checked');
    const date = document.getElementById("mood-date").value;

    if (selectedRating && date) {
      moodLogs.push({ date, score: parseInt(selectedRating.value, 10) });
      moodLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

      saveAppState();
      selectedRating.checked = false;
      moodModalOverlay.classList.add("hidden");
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
  1: "#c62828",
  2: "#ef5350",
  3: "#ffa726",
  4: "#ffee58",
  5: "#66bb6a",
  6: "#2e7d32"
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


// --- 7. MEDICATION ADHERENCE CALENDAR LOGIC ---

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

    if (dateKey === todayStr) {
      dayCell.classList.add("today");
    }

    const status = medAdherenceLogs[dateKey];
    if (status) {
      dayCell.classList.add(status);
    }

    grid.appendChild(dayCell);
  }
}

// --- CONTRACEPTIVE MANAGEMENT LOGIC ---
const contraForm = document.getElementById("contraceptive-form");
const customNameInput = document.getElementById("contra-custom-name");

// 1. Populate saved contraceptive data on page load
function loadSavedContraceptive() {
  if (contraceptiveData.type) {
    const targetRadio = document.querySelector(`input[name="contraceptive-type"][value="${contraceptiveData.type}"]`);
    if (targetRadio) targetRadio.checked = true;
  }
  if (contraceptiveData.customName && customNameInput) {
    customNameInput.value = contraceptiveData.customName;
  }
}

// 2. Handle form submission
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

// Call on initialization
loadSavedContraceptive();



// --- 8. SYMPTOM TRACKER LOGIC ---

// Color map for symptom severity states
const severityColors = {
  0: { badgeBg: "#f1f5f9", badgeText: "#64748b8f", sliderColor: "#cbd5e1" }, // None (Gray)
  1: { badgeBg: "#d1fae5", badgeText: "#065f46", sliderColor: "#4fa23a" }, // Mild (Green)
  2: { badgeBg: "#fef3c7", badgeText: "#92400e", sliderColor: "#f59e0b" }, // Moderate (Yellow)
  3: { badgeBg: "#fee2e2", badgeText: "#991b1b", sliderColor: "#d04a35" }  // Severe (Red)
};

const intensityLabels = {
  0: "None",
  1: "Mild",
  2: "Moderate",
  3: "Severe"
};

// Update badges AND slider colors dynamically
document.querySelectorAll(".severity-slider").forEach((slider) => {
  slider.addEventListener("input", (e) => {
    const symptomKey = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${symptomKey}`);
    const theme = severityColors[val];

    // 1. Update Badge Text & Color
    if (badge) {
      badge.textContent = intensityLabels[val];
      badge.style.backgroundColor = theme.badgeBg;
      badge.style.color = theme.badgeText;
    }

    // 2. Update Slider Track & Accent Color
    e.target.style.accentColor = theme.sliderColor; // For modern native styling
    
    // Custom WebKit track background styling (if custom CSS track is used)
    const percentage = (val / 3) * 100;
    e.target.style.background = `linear-gradient(to right, ${theme.sliderColor} ${percentage}%, #e2e8f0 ${percentage}%)`;
  });
  
  // Trigger once on initialization to apply colors to pre-filled/default states
  slider.dispatchEvent(new Event("input"));
});

document.querySelectorAll(".severity-slider").forEach((slider) => {
  slider.addEventListener("input", (e) => {
    const symptomKey = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${symptomKey}`);

    if (badge) {
      badge.textContent = intensityLabels[val];
      if (val > 0) {
        badge.classList.add("active");
      } else {
        badge.classList.remove("active");
      }
    }
  });
});



// Submit Symptoms, Flow, Texture & Color
const symptomForm = document.getElementById("symptom-form");
if (symptomForm) {
  symptomForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Gather sliders (Flow, Cramps, etc.)
    const symptomRatings = {};
    document.querySelectorAll(".severity-slider").forEach((slider) => {
      symptomRatings[slider.dataset.symptom] = parseInt(slider.value, 10);
    });

    // 2. Gather selected textures
    const selectedTextures = [];
    document.querySelectorAll(".texture-checkbox:checked").forEach((checkbox) => {
      selectedTextures.push(checkbox.value);
    });

    // 3. Gather selected colors
    const selectedColors = [];
    document.querySelectorAll(".color-checkbox:checked").forEach((checkbox) => {
      selectedColors.push(checkbox.value);
    });

    // 4. Create and persist entry
    const symptomLogEntry = {
      date: new Date().toISOString().split("T")[0],
      ratings: symptomRatings,
      textures: selectedTextures,
      colors: selectedColors
    };

    symptomLogs.push(symptomLogEntry);
    saveAppState();
    alert("Symptoms, Texture & Color log saved!");
  });
}
// --- DYNAMIC CUSTOM SYMPTOMS LOGIC ---

// 1. Persistent Store for Custom Symptom Names
let customSymptoms = JSON.parse(localStorage.getItem("healthApp_customSymptoms")) || [];

// DOM Elements
const customSymptomsList = document.getElementById("custom-symptoms-list");
const newSymptomInput = document.getElementById("new-symptom-input");
const addCustomSymptomBtn = document.getElementById("add-custom-symptom-btn");

// 2. Render Existing Custom Symptoms on Page Load
function renderCustomSymptoms() {
  if (!customSymptomsList) return;
  customSymptomsList.innerHTML = ""; // Clear existing

  customSymptoms.forEach((name) => {
    createSymptomRowDOM(name);
  });
}

// 3. Helper: Build and Attach a New Symptom Slider Row
function createSymptomRowDOM(symptomName) {
  // Generate a safe slug key (e.g., "Joint Pain" -> "joint-pain")
  const key = symptomName.toLowerCase().replace(/\s+/g, "-");

  const row = document.createElement("div");
  row.className = "symptom-row";
  row.innerHTML = `
    <div class="symptom-header">
      <span class="symptom-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="19px" viewBox="0 -960 960 960" width="19px" fill="currentColor"><path d="M157.37-228.28q-19.15 0-32.33-13.18-13.17-13.17-13.17-32.32t13.17-32.33q13.18-13.17 32.33-13.17h405.26q19.15 0 32.33 13.17 13.17 13.18 13.17 32.33t-13.17 32.32q-13.18 13.18-32.33 13.18H157.37Zm0-206.22q-19.15 0-32.33-13.17-13.17-13.18-13.17-32.33t13.17-32.33q13.18-13.17 32.33-13.17h645.26q19.15 0 32.33 13.17 13.17 13.18 13.17 32.33t-13.17 32.33q-13.18 13.17-32.33 13.17H157.37Zm0-206.22q-19.15 0-32.33-13.17-13.17-13.18-13.17-32.33t13.17-32.32q13.18-13.18 32.33-13.18h645.26q19.15 0 32.33 13.18 13.17 13.17 13.17 32.32t-13.17 32.33q-13.18 13.17-32.33 13.17H157.37Z"/></svg>
        ${symptomName}
      </span>
      <span class="severity-badge" id="badge-${key}">None (0)</span>
    </div>
    <input type="range" class="severity-slider" data-symptom="${key}" min="0" max="3" value="0" step="1">
  `;

  customSymptomsList.appendChild(row);

  // Attach dynamic slider event listener (for color & badge updates)
  const newSlider = row.querySelector(".severity-slider");
  attachSliderEventListener(newSlider);
}

// 4. Attach Event Listener to Individual Sliders
function attachSliderEventListener(slider) {
  slider.addEventListener("input", (e) => {
    const key = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${key}`);

    if (badge) {
      badge.textContent = intensityLabels[val] || `Level ${val}`;
    }

    // Dynamic accent color styling
    const theme = severityColors[val];
    if (theme) {
      e.target.style.accentColor = theme.sliderColor;
    }
  });
}

// 5. Add Custom Symptom Trigger
if (addCustomSymptomBtn) {
  addCustomSymptomBtn.addEventListener("click", () => {
    const name = newSymptomInput.value.trim();
    if (name) {
      // Prevent duplicates
      if (!customSymptoms.includes(name)) {
        customSymptoms.push(name);
        localStorage.setItem("healthApp_customSymptoms", JSON.stringify(customSymptoms));
        createSymptomRowDOM(name);
      }
      newSymptomInput.value = "";
    }
  });
}

// Call on initial load
renderCustomSymptoms();


// 2. Submit Standalone Daily Journal Entry
const journalForm = document.getElementById("journal-form");
if (journalForm) {
  journalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const notes = document.getElementById("symptom-notes").value.trim();

    if (notes) {
      // Create journal entry object
      const journalEntry = {
        date: new Date().toISOString().split("T")[0],
        text: notes
      };

      // Push to journal array and persist
      journalLogs.push(journalEntry);
      saveAppState();
      alert("Journal entry saved!");
    }
  });
}



// --- 9. NAVIGATION BAR LOGIC ---

const navButtons = document.querySelectorAll(".nav-btn");
const tabViews = document.querySelectorAll(".tab-view");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTabId = btn.dataset.tab;

    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    tabViews.forEach((view) => {
      if (view.id === targetTabId) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    if (targetTabId === "view-mental") {
      renderMoodGraph();
    } else if (targetTabId === "view-diet") {
      renderWeightGraph();
    } else if (targetTabId === "view-meds") {
      renderMedicationCalendar();
    }
  });
});


// --- 10. INITIAL RENDER ON PAGE LOAD ---

document.addEventListener("DOMContentLoaded", () => {
  render();
  updateWaterUI();
  renderWeightGraph();
  renderMoodGraph();
  renderMedicationCalendar();
});