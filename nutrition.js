// --- 4. WATER TRACKER LOGIC ---

// 1. Load today's logs and goal from localStorage
let dailyWaterLogs = JSON.parse(localStorage.getItem("healthApp_waterLogs")) || {};
let goalWaterOz = parseInt(localStorage.getItem("healthApp_waterGoal"), 10) || 64;

// Helper to get today's intake
function getTodayWater() {
  const today = typeof getNutritionTodayKey === "function" 
    ? getNutritionTodayKey() 
    : new Date().toISOString().split("T")[0];
  return dailyWaterLogs[today] || 0;
}

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
  const currentWaterOz = getTodayWater();
  
  if (waterCounter) {
    waterCounter.textContent = `${currentWaterOz} oz / ${goalWaterOz} oz`;
  }
  if (waterFill) {
    const percentage = Math.min((currentWaterOz / goalWaterOz) * 100, 100);
    waterFill.style.width = `${percentage}%`;
  }
}

function addWater(amount) {
  if (amount > 0) {
    const today = typeof getNutritionTodayKey === "function" 
      ? getNutritionTodayKey() 
      : new Date().toISOString().split("T")[0];

    // Increment & Save to localStorage
    dailyWaterLogs[today] = (dailyWaterLogs[today] || 0) + amount;
    localStorage.setItem("healthApp_waterLogs", JSON.stringify(dailyWaterLogs));

    // Sound feedback
    if (typeof playLogSound === "function") playLogSound();

    // Re-render UI and Hero Bar Graph
    updateWaterUI();
    if (typeof renderHeroGraph === "function") renderHeroGraph();
    
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




// --- NUTRITION & CALORIE LOGIC ---

// Helper: Get today's key string (YYYY-MM-DD)
function getNutritionTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// State retrieval from localStorage
let calorieGoal = parseInt(localStorage.getItem("healthApp_calorieGoal"), 10) || 2000;
let dailyCalorieLogs = JSON.parse(localStorage.getItem("healthApp_calorieLogs")) || {};

// SVG Ring Circumference (2 * Math.PI * 66)
const CIRCUMFERENCE = 414.7;

function getTodayCalories() {
  const today = getNutritionTodayKey();
  return dailyCalorieLogs[today] || 0;
}

function updateCalorieUI() {
  const currentCals = getTodayCalories();
  const fillRing = document.getElementById("calorie-doughnut-fill");
  const currentDisplay = document.getElementById("calorie-current-display");
  const goalDisplay = document.getElementById("calorie-goal-display");
  const remainingDisplay = document.getElementById("calorie-remaining-display");

  if (goalDisplay) goalDisplay.textContent = calorieGoal.toLocaleString();
  if (currentDisplay) currentDisplay.textContent = currentCals.toLocaleString();

  // Progress Calculation & Doughnut offset
  const ratio = Math.min(currentCals / calorieGoal, 1);
  const offset = CIRCUMFERENCE - (ratio * CIRCUMFERENCE);

  if (fillRing) {
    fillRing.style.strokeDashoffset = offset;
    // Turn green if goal hit / exceeded
    if (currentCals >= calorieGoal) {
      fillRing.style.stroke = "#30d158";
    } else {
      fillRing.style.stroke = "#37b813";
    }
  }

  if (remainingDisplay) {
    const diff = calorieGoal - currentCals;
    if (diff > 0) {
      remainingDisplay.textContent = `${diff.toLocaleString()}`;
      remainingDisplay.style.color = "#757575";
    } else if (diff === 0) {
      remainingDisplay.textContent = "Goal Reached! 🎯";
      remainingDisplay.style.color = "#30d158";
    } else {
      remainingDisplay.textContent = `+${Math.abs(diff).toLocaleString()} over`;
      remainingDisplay.style.color = "#30d158";
    }
  }
}

function logCalories(amount) {
  const today = getNutritionTodayKey();
  dailyCalorieLogs[today] = (dailyCalorieLogs[today] || 0) + amount;
  localStorage.setItem("healthApp_calorieLogs", JSON.stringify(dailyCalorieLogs));
  
  if (typeof playLogSound === "function") playLogSound();
  updateCalorieUI();
}

// Form & Goal Listeners
document.addEventListener("DOMContentLoaded", () => {
  const calForm = document.getElementById("calorie-log-form");
  const calInput = document.getElementById("calorie-input");
  const editGoalBtn = document.getElementById("edit-calorie-goal-btn");

  if (calForm && calInput) {
    calForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = parseInt(calInput.value, 10);
      if (val > 0) {
        logCalories(val);
        calInput.value = "";
      }
    });
  }

  if (editGoalBtn) {
    editGoalBtn.addEventListener("click", () => {
      const userGoal = prompt("Set your daily calorie goal (kcal):", calorieGoal);
      const parsed = parseInt(userGoal, 10);
      if (parsed && parsed > 0) {
        calorieGoal = parsed;
        localStorage.setItem("healthApp_calorieGoal", calorieGoal);
        updateCalorieUI();
      }
    });
  }

  updateCalorieUI();
});




// --- CONFIGURABLE HERO METRICS SYSTEM ---

// Metrics definition schema
const NUTRITION_METRICS = [
  {
    id: "water",
    label: "Water",
    unit: "oz",
    icon: "💧",
    color: "#0ca7fd", // Water blue
    getGoal: () => parseInt(localStorage.getItem("healthApp_waterGoal"), 10) || 64,
    getValue: () => {
      const logs = JSON.parse(localStorage.getItem("healthApp_waterLogs")) || {};
      return logs[getNutritionTodayKey()] || 0;
    }
  },
  {
    id: "calories",
    label: "Cal",
    unit: "kcal",
    icon: "🔥",
    color: "#36b811", // Calorie orange
    getGoal: () => parseInt(localStorage.getItem("healthApp_calorieGoal"), 10) || 2000,
    getValue: () => {
      const logs = JSON.parse(localStorage.getItem("healthApp_calorieLogs")) || {};
      return logs[getNutritionTodayKey()] || 0;
    }
  }
  // Ready to add protein, carbs, fats, caffeine later!
];

// Persistent state for which metrics the user turned ON
let visibleMetrics = JSON.parse(localStorage.getItem("healthApp_visibleNutritionMetrics")) || ["water", "calories"];

function renderHeroGraph() {
  const container = document.getElementById("metric-bars-row");
  if (!container) return;
  container.innerHTML = "";

  const activeConfigs = NUTRITION_METRICS.filter(m => visibleMetrics.includes(m.id));

  if (activeConfigs.length === 0) {
    container.innerHTML = `<span style="color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: auto;">No metrics selected. Tap Edit Display to add bars.</span>`;
    return;
  }

  activeConfigs.forEach(m => {
    const goal = m.getGoal();
    const value = m.getValue();
    const percent = Math.min(Math.round((value / goal) * 100), 100);

    const col = document.createElement("div");
    col.className = "metric-bar-col";
    col.innerHTML = `
      <span class="bar-goal-top">${goal.toLocaleString()}${m.unit === 'oz' ? 'oz' : ''}</span>
      <div class="bar-track-wrapper">
        <div class="bar-fill" style="height: ${percent}%; background-color: ${percent >= 100 ? '#30d158' : m.color};"></div>
      </div>
      <span class="bar-value-bottom">${value.toLocaleString()}</span>
      <span class="bar-label-tag">${m.label}</span>
    `;
    container.appendChild(col);
  });
}

function renderDisplayToggles() {
  const container = document.getElementById("display-toggles-container");
  if (!container) return;
  container.innerHTML = "";

  NUTRITION_METRICS.forEach(m => {
    const isChecked = visibleMetrics.includes(m.id);
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <div class="toggle-info">
        <span class="toggle-icon">${m.icon}</span>
        <span class="toggle-title">${m.label}</span>
      </div>
      <label class="switch">
        <input type="checkbox" data-metric-id="${m.id}" ${isChecked ? "checked" : ""}>
        <span class="slider-switch"></span>
      </label>
    `;

    row.querySelector("input").addEventListener("change", (e) => {
      const metricId = e.target.dataset.metricId;
      if (e.target.checked) {
        if (!visibleMetrics.includes(metricId)) visibleMetrics.push(metricId);
      } else {
        visibleMetrics = visibleMetrics.filter(id => id !== metricId);
      }
      localStorage.setItem("healthApp_visibleNutritionMetrics", JSON.stringify(visibleMetrics));
      renderHeroGraph();
    });

    container.appendChild(row);
  });
}

// Hook up graph updates to logging triggers
const originalLogCalories = logCalories;
logCalories = function(amount) {
  originalLogCalories(amount);
  renderHeroGraph();
};

// Modal Open/Close Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderHeroGraph();
  renderDisplayToggles();

  const openModalBtn = document.getElementById("open-display-modal-btn");
  const closeModalBtn = document.getElementById("close-display-modal-btn");
  const modalOverlay = document.getElementById("display-modal-overlay");

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener("click", () => {
      renderDisplayToggles();
      modalOverlay.classList.remove("hidden");
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener("click", () => {
      modalOverlay.classList.add("hidden");
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
    });
  }
});
