const logSuccessSound = new Audio("MOODLOGGED.mp3");

function playLogSound() {
  logSuccessSound.currentTime = 0; // Rewind to start for rapid clicks
  logSuccessSound.play().catch((err) => {
    console.log("Audio play blocked or failed:", err);
  });
}


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

const medList = document.getElementById("med-list");
const statusCounter = document.getElementById("status-counter");
const addBtn = document.getElementById("add-med-btn") || document.getElementById("add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const cancelBtn = document.getElementById("cancel-btn");
const medForm = document.getElementById("med-form");

if (addBtn && modalOverlay) {
  addBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
}
if (cancelBtn && modalOverlay) {
  cancelBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
}

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

function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return minutes === "00" ? `${h} ${ampm}` : `${h}:${minutes} ${ampm}`;
}

function getCurrentFormattedTime() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function render() {
  if (!medList) return;
  medList.innerHTML = "";

  const total = medications.length;
  const takenCount = medications.filter(m => m.isLogged).length;

  if (statusCounter) {
    statusCounter.textContent = total === 0 ? "None Listed" : `${takenCount}/${total} Taken`;
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

// Caffeine
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
    caffeineGoalInput.value = goalCaffeineMg;
    caffeineModalOverlay.classList.remove("hidden");
  });
}

if (caffeineCancelBtn) {
  caffeineCancelBtn.addEventListener("click", () => {
    caffeineModalOverlay.classList.add("hidden");
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
    const newGoal = parseInt(caffeineGoalInput.value, 10);
    if (newGoal && newGoal > 0) goalCaffeineMg = newGoal;

    saveCaffeineState();
    updateCaffeineUI();
    caffeineModalOverlay.classList.add("hidden");
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
    } else {
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

function saveCaffeineState() {
  localStorage.setItem("healthApp_caffeineMg", JSON.stringify(currentCaffeineMg));
  localStorage.setItem("healthApp_caffeineGoal", JSON.stringify(goalCaffeineMg));
}


document.addEventListener('DOMContentLoaded', () => {
  const activityButtons = document.querySelectorAll('.activity-btn');
  const calcBtn = document.getElementById('calc-calories-btn');
  const calorieCountDisplay = document.getElementById('calorie-count');
  const durationInput = document.getElementById('exercise-duration');

  let selectedActivity = null;

  // Single-selection handler across activity grids
  activityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      activityButtons.forEach(b => b.classList.remove('is-active'));

      // Highlight clicked button
      btn.classList.add('is-active');
      selectedActivity = btn.dataset.activity;

      console.log(`Selected Activity: ${selectedActivity}`);
    });
  });

  // Calculate Button Click Event (Placeholder Logic)
  calcBtn?.addEventListener('click', () => {
    if (!selectedActivity) {
      alert('Please select an activity first!');
      return;
    }

    const durationValue = durationInput.value; // e.g. "00:30"
    
    // Placeholder calculation logic until user demographics are added
    console.log(`Calculating calories for ${selectedActivity} during ${durationValue}...`);
    
    // Random mock display update to verify UI response
    const mockCalories = Math.floor(Math.random() * (350 - 150 + 1)) + 150;
    calorieCountDisplay.textContent = mockCalories;
  });
});

const sexForm = document.getElementById("sexual-activity-form");
const sexDateInput = document.getElementById("sex-log-date");
const sexTimeInput = document.getElementById("sex-log-time");

// 1. Auto-fill date & time inputs with current moment on initialization
if (sexDateInput && sexTimeInput) {
  const now = new Date();
  sexDateInput.value = now.toISOString().split("T")[0]; // YYYY-MM-DD
  
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  sexTimeInput.value = `${hours}:${minutes}`; // HH:MM (24hr format)
}

// 2. Submit Handler
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

    // Push to state & persist
    sexualActivityLogs.push(activityEntry);
    saveAppState();

    alert("Activity logged successfully!");
    
    // Reset selection state
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

// Sleep Quality Configuration Mapping
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

    // 1. Update Badge Text & Classes
    sleepBadge.textContent = config.label;
    sleepBadge.className = `sleep-badge ${config.class}`;

    // 2. Update Slider Track Fill Gradient & Thumb Color
    const trackColor = "#e2e8f0";
    e.target.style.background = `linear-gradient(to right, ${config.color} ${config.fillPct}%, ${trackColor} ${config.fillPct}%)`;
  });

  // Trigger once on initialization to ensure correct default state
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

      playLogSound(); // 🔊 Play sound effect on successful log!
      saveAppState(); // Save data to localStorage
      updateHomeDashboard(); // Refresh home screen charts!
      
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

// Contraceptives
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

// Attach event listeners to all severity sliders (built-in + dynamic)
document.querySelectorAll(".severity-slider").forEach((slider) => {
  slider.addEventListener("input", (e) => {
    const symptomKey = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${symptomKey}`);
    const theme = severityColors[val];

    // 1. Update Badge Text & Colors
    if (badge) {
      badge.textContent = intensityLabels[val];
      badge.style.backgroundColor = theme.badgeBg;
      badge.style.color = theme.badgeText;
    }

    // 2. Update Slider Thumb Color
    e.target.style.accentColor = theme.sliderColor;

    // 3. Update Filled Bar Track Background (Green -> Yellow -> Red Fill)
    const percentage = (val / 3) * 100;
    e.target.style.background = `linear-gradient(to right, ${theme.sliderColor} 0%, ${theme.sliderColor} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  });
  
  // Trigger once on startup to set correct initial states
  slider.dispatchEvent(new Event("input"));
});


document.querySelectorAll(".severity-slider").forEach((slider) => {
  slider.addEventListener("input", (e) => {
    const symptomKey = e.target.dataset.symptom;
    const val = parseInt(e.target.value, 10);
    const badge = document.getElementById(`badge-${symptomKey}`);
    const theme = severityColors[val];

    if (badge) {
      badge.textContent = intensityLabels[val];
      badge.style.backgroundColor = theme.badgeBg;
      badge.style.color = theme.badgeText;
    }

    e.target.style.accentColor = theme.sliderColor;
  });
  
  slider.dispatchEvent(new Event("input"));
});

const symptomForm = document.getElementById("symptom-form");
if (symptomForm) {
  symptomForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const symptomRatings = {};
    document.querySelectorAll(".severity-slider").forEach((slider) => {
      symptomRatings[slider.dataset.symptom] = parseInt(slider.value, 10);
    });

    // --- 1. MENSTRUATION DATA ---
    // (Make sure your period HTML uses name="period-texture" and name="period-color", 
    // or whatever names you set for them originally!)
    const periodTextures = [];
    document.querySelectorAll('input[name="period-texture"]:checked').forEach((cb) => periodTextures.push(cb.value));

    const periodColors = [];
    document.querySelectorAll('input[name="period-color"]:checked').forEach((cb) => periodColors.push(cb.value));

    // --- 2. DISCHARGE DATA (Your new additions!) ---
    const dischargeTextures = [];
    document.querySelectorAll('input[name="discharge-texture"]:checked').forEach((cb) => dischargeTextures.push(cb.value));

    const dischargeColors = [];
    document.querySelectorAll('input[name="discharge-color"]:checked').forEach((cb) => dischargeColors.push(cb.value));

    // --- 3. SAVE TO LOGS ---
    symptomLogs.push({
      date: new Date().toISOString().split("T")[0],
      ratings: symptomRatings,
      textures: periodTextures,             // Saves period texture
      colors: periodColors,                 // Saves period color
      dischargeTextures: dischargeTextures, // Saves discharge texture
      dischargeColors: dischargeColors      // Saves discharge color
    });

    saveAppState();
    alert("Symptoms logged successfully!");
  });
}



// --- DYNAMIC CUSTOM SYMPTOMS LOGIC ---

const customSymptomsList = document.getElementById("custom-symptoms-list");
const newSymptomInput = document.getElementById("new-symptom-input");
const addCustomSymptomBtn = document.getElementById("add-custom-symptom-btn");

// 1. Render saved custom symptoms on page load
function renderCustomSymptoms() {
  if (!customSymptomsList) return;
  customSymptomsList.innerHTML = ""; // Clear list

  customSymptoms.forEach((name) => {
    createSymptomRowDOM(name);
  });
}

// 2. Helper: Build a new slider row dynamically
function createSymptomRowDOM(symptomName) {
  // Convert name to slug (e.g. "Back Pain" -> "back-pain")
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

  // Attach slider listener so track color and badge update dynamically
  const newSlider = row.querySelector(".severity-slider");
  attachSliderEventListener(newSlider);
}

// 3. Attach slider event listener helper
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
    
    // Fill slider bar
    const percentage = (val / 3) * 100;
    e.target.style.background = `linear-gradient(to right, ${theme.sliderColor} 0%, ${theme.sliderColor} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  });
  
  slider.dispatchEvent(new Event("input"));
}



// 4. Add custom symptom button click handler
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


// Journal Entry Submit
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

// 1. Mood Hero Card Calculation
function renderHomeMoodCard() {
  const positivityEl = document.getElementById("home-positivity-pct");
  const topMoodEl = document.getElementById("home-top-mood-val");
  const canvas = document.getElementById("home-mood-pie-chart");

  if (!canvas || !moodLogs || moodLogs.length === 0) {
    if (positivityEl) positivityEl.textContent = "0%";
    if (topMoodEl) topMoodEl.textContent = "No logs";
    return;
  }

  // Check log.label (from scroll wheel) or log.mood
  const positiveCount = moodLogs.filter(log => {
    const moodName = log.label || log.mood;
    return log.score >= 4 || ["Happy", "Excited", "Relaxed", "Okay", "Proud"].includes(moodName);
  }).length;

  const pct = Math.round((positiveCount / moodLogs.length) * 100);
  if (positivityEl) positivityEl.textContent = `${pct}%`;

  // Find Most Logged Mood
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

  // Render/Re-render Chart.js Pie Safely
  if (homePieChartInstance) {
    homePieChartInstance.destroy();
  }

  const great = moodLogs.filter(l => l.score >= 5).length;
  const okay = moodLogs.filter(l => l.score === 3 || l.score === 4).length;
  const low = moodLogs.filter(l => l.score <= 2).length;

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
      plugins: {legend: { display: false } }
    }
  });
}


// 2. Medication Compact Card
function renderHomeMedCard() {
  const statusEl = document.getElementById("home-med-status");
  const nextEl = document.getElementById("home-med-next");

  if (!medications || medications.length === 0) {
    if (statusEl) statusEl.textContent = "None Set";
    if (nextEl) nextEl.textContent = "Tap to add meds";
    return;
  }

  const takenCount = medications.filter(m => m.isLogged).length;
  if (statusEl) statusEl.textContent = `${takenCount}/${medications.length} Taken`;

  const pendingMed = medications.find(m => !m.isLogged);
  if (nextEl) {
    nextEl.textContent = pendingMed ? `Next: ${pendingMed.scheduledTime || pendingMed.name}` : "All taken today!";
  }
}

// 3. Weight Stat Card
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
  render();
  updateWaterUI();
  updateCaffeineUI();
  renderWeightGraph();
  renderMoodGraph();
  renderMedicationCalendar();
  renderCustomSymptoms();
  updateHomeDashboard();
});











// --- ACTIVITES 7-DAY CALENDAR STRIP LOGIC ---
let selectedActivitiesDate = new Date(); // Defaults to today

function render7DayCalendarStrip(centerDate = new Date()) {
  const rowContainer = document.getElementById("calendar-7day-row");
  const monthYearLabel = document.getElementById("strip-month-year");
  if (!rowContainer) return;

  rowContainer.innerHTML = "";

  // 1. Update Month / Year Title
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  if (monthYearLabel) {
    monthYearLabel.textContent = `${monthNames[centerDate.getMonth()]} ${centerDate.getFullYear()}`;
  }

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  // 2. Generate 7 days centered on target date (-3 to +3)
  for (let offset = -3; offset <= 3; offset++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);

    const isoDate = d.toISOString().split("T")[0];
    const isSelected = offset === 0; // Center item is always active

    const pill = document.createElement("div");
    pill.className = `day-pill ${isSelected ? "active" : ""}`;
    pill.dataset.date = isoDate;

    pill.innerHTML = `
      <span class="day-name">${dayNames[d.getDay()]}</span>
      <span class="day-num">${d.getDate()}</span>
      <span class="status-dot"></span>
    `;

    // Click handler to center on clicked date
    pill.addEventListener("click", () => {
      selectedActivitiesDate = new Date(d);
      render7DayCalendarStrip(selectedActivitiesDate);
      if (typeof playLogSound === "function") playLogSound(); // Audio cue!
    });

    rowContainer.appendChild(pill);
  }
}

// "Today" Button Listener
document.getElementById("strip-today-btn")?.addEventListener("click", () => {
  selectedActivitiesDate = new Date();
  render7DayCalendarStrip(selectedActivitiesDate);
});

// Trigger strip initial render on page load
document.addEventListener("DOMContentLoaded", () => {
  render7DayCalendarStrip();





  // --- TASKS STATE & RENDER LOGIC ---
let tasksList = JSON.parse(localStorage.getItem("goodhealth_tasks")) || [];

// Save to localStorage & render
function saveAndRenderTasks() {
  localStorage.setItem("goodhealth_tasks", JSON.stringify(tasksList));
  renderTasks();
}



// Render Task Cards
function renderTasks() {
  const container = document.getElementById("task-list-container");
  if (!container) return;

  container.innerHTML = "";

  if (tasksList.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="background:#fff; border-radius:16px; padding:24px; text-align:center; color:#94a3b8;">
        No tasks for today yet. Tap <strong>+ Add Task</strong> above!
      </div>`;
    return;
  }

  tasksList.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = `task-card ${task.completed ? "completed" : ""}`;
    card.draggable = true;
    card.dataset.index = index;

    card.innerHTML = `
      <span class="drag-handle">⋮⋮</span>
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} />
      <div class="task-content">
        <h4 class="task-title">${task.title}</h4>
        <div class="task-meta">
          ${task.time ? `<span>${task.time}</span>` : ""}
          ${task.desc ? `<span>${task.desc}</span>` : ""}
        </div>
      </div>
      <button class="delete-task-btn" style="background:none; border:none; color:#cbd5e1; cursor:pointer;">&times;</button>
    `;

    // Toggle Complete
    const checkbox = card.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      if (task.completed && typeof playLogSound === "function") playLogSound();
      saveAndRenderTasks();
    });

    // Delete Task
    const deleteBtn = card.querySelector(".delete-task-btn");
    deleteBtn.addEventListener("click", () => {
      tasksList.splice(index, 1);
      saveAndRenderTasks();
    });

    // Drag and Drop Reordering
    card.addEventListener("dragstart", (e) => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", index);
    });

    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (e) => e.preventDefault());

    card.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      const targetIndex = index;

      if (draggedIndex !== targetIndex) {
        const [draggedItem] = tasksList.splice(draggedIndex, 1);
        tasksList.splice(targetIndex, 0, draggedItem);
        saveAndRenderTasks();
      }
    });

    container.appendChild(card);
  });
}

// --- MODAL CONTROLS & SUBMIT ---
const modal = document.getElementById("task-modal");
const openBtn = document.getElementById("open-task-modal-btn");
const closeBtn = document.getElementById("close-task-modal-btn");
const cancelBtn = document.getElementById("cancel-task-btn");
const form = document.getElementById("create-task-form");

function toggleModal(show) {
  if (show) modal?.classList.remove("hidden");
  else {
    modal?.classList.add("hidden");
    form?.reset();
  }
}

openBtn?.addEventListener("click", () => toggleModal(true));
closeBtn?.addEventListener("click", () => toggleModal(false));
cancelBtn?.addEventListener("click", () => toggleModal(false));

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("task-title");
  const timeInput = document.getElementById("task-time");
  const categoryInput = document.getElementById("task-category");
  const descInput = document.getElementById("task-desc");

  const newTask = {
    id: Date.now(),
    title: titleInput ? titleInput.value : "",
    time: timeInput ? timeInput.value : "",
    category: categoryInput ? categoryInput.value : "General",
    desc: descInput ? descInput.value : "",
    completed: false
  };

  // Add to array, sound, save to localStorage & render!
  tasksList.push(newTask);
  if (typeof playLogSound === "function") playLogSound();
  saveAndRenderTasks();
  toggleModal(false);
});

// Initial Render on Page Load
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});

});



