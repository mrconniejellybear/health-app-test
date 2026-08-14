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


// --- COMPLETE NUTRITION & MACROS CONTROLLER ---

function getNutritionTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 1. Persistent Goals (Defaults)
let nutritionGoals = JSON.parse(localStorage.getItem("healthApp_nutritionGoals")) || {
  calories: 2000,
  protein: 140,
  carbs: 220,
  fats: 65,
  water: 64
};

// 2. Persistent Logs (By Date)
let nutritionLogs = JSON.parse(localStorage.getItem("healthApp_nutritionLogs")) || {};

// Helper: Get today's object
function getTodayNutrition() {
  const today = getNutritionTodayKey();
  if (!nutritionLogs[today]) {
    nutritionLogs[today] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }
  return nutritionLogs[today];
}

// 3. Definitions Schema for Hero Graph & Toggles
const NUTRITION_METRICS = [
  {
    id: "water",
    label: "Water",
    unit: "oz",
    icon: "💧",
    color: "#3883e0",
    getGoal: () => nutritionGoals.water,
    getValue: () => {
      const logs = JSON.parse(localStorage.getItem("healthApp_waterLogs")) || {};
      return logs[getNutritionTodayKey()] || 0;
    }
  },
  {
    id: "calories",
    label: "Calories",
    unit: "cal",
    icon: "🔥",
    color: "#ff9f0a",
    getGoal: () => nutritionGoals.calories,
    getValue: () => getTodayNutrition().calories
  },
  {
    id: "protein",
    label: "Protein",
    unit: "g",
    icon: "🥩",
    color: "#ff453a",
    getGoal: () => nutritionGoals.protein,
    getValue: () => getTodayNutrition().protein
  },
  {
    id: "carbs",
    label: "Carbs",
    unit: "g",
    icon: "🍞",
    color: "#64d2ff",
    getGoal: () => nutritionGoals.carbs,
    getValue: () => getTodayNutrition().carbs
  },
  {
    id: "fats",
    label: "Fats",
    unit: "g",
    icon: "🥑",
    color: "#ffd60a",
    getGoal: () => nutritionGoals.fats,
    getValue: () => getTodayNutrition().fats
  }
];

// Display Toggles (Persisted)
let visibleMetrics = JSON.parse(localStorage.getItem("healthApp_visibleNutritionMetrics")) || ["water", "calories", "protein", "carbs", "fats"];

// SVG Ring Circumference (2 * Math.PI * 66)
const CIRCUMFERENCE = 414.7;

// UI Updater for Calorie Ring & Macro Summary Pills
function updateCalorieUI() {
  const todayData = getTodayNutrition();
  const cals = todayData.calories;
  const goal = nutritionGoals.calories;

  // 1. Doughnut Chart (Remaining focus)
  const remainingValEl = document.getElementById("calorie-remaining-val");
  const loggedSubEl = document.getElementById("calorie-logged-sub");
  const fillRing = document.getElementById("calorie-doughnut-fill");

  const diff = goal - cals;
  if (remainingValEl) remainingValEl.textContent = Math.max(0, diff).toLocaleString();
  if (loggedSubEl) loggedSubEl.textContent = `${cals.toLocaleString()} / ${goal.toLocaleString()}`;

  const ratio = Math.min(cals / goal, 1);
  const offset = CIRCUMFERENCE - (ratio * CIRCUMFERENCE);

  if (fillRing) {
    fillRing.style.strokeDashoffset = offset;
    fillRing.style.stroke = cals >= goal ? "#30d158" : "#ff9f0a";
  }

  // 2. Macro Pills Fill & Text
  const updateMacroPill = (type, unit = "g") => {
    const current = todayData[type] || 0;
    const target = nutritionGoals[type] || 1;
    const display = document.getElementById(`macro-${type}-display`);
    const fill = document.getElementById(`macro-${type}-fill`);
    if (display) display.textContent = `${current}/${target}${unit}`;
    if (fill) fill.style.width = `${Math.min((current / target) * 100, 100)}%`;
  };

  updateMacroPill("protein");
  updateMacroPill("carbs");
  updateMacroPill("fats");
}

// Log Food Function (Calories + Macros)
function logNutrition({ calories = 0, protein = 0, carbs = 0, fats = 0 }) {
  const today = getNutritionTodayKey();
  const todayData = getTodayNutrition();

  // If calories not entered directly, auto-calculate from macros (4-4-9 rule)
  let calculatedCals = calories;
  if (!calculatedCals && (protein || carbs || fats)) {
    calculatedCals = (protein * 4) + (carbs * 4) + (fats * 9);
  }

  todayData.calories += calculatedCals;
  todayData.protein += protein;
  todayData.carbs += carbs;
  todayData.fats += fats;

  nutritionLogs[today] = todayData;
  localStorage.setItem("healthApp_nutritionLogs", JSON.stringify(nutritionLogs));

  if (typeof playLogSound === "function") playLogSound();

  updateCalorieUI();
  renderHeroGraph();
}

// --- HERO BAR GRAPH & TOGGLE MODAL LOGIC ---
function renderHeroGraph() {
  const container = document.getElementById("metric-bars-row");
  if (!container) return;
  container.innerHTML = "";

  const activeConfigs = NUTRITION_METRICS.filter(m => visibleMetrics.includes(m.id));

  if (activeConfigs.length === 0) {
    container.innerHTML = `<span style="color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: auto;">No metrics selected. Tap Edit Display to choose bars.</span>`;
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
        <div class="bar-fill" style="height: ${percent}%; background-color: ${percent >= 100 ? '#17bb40' : m.color};"></div>
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

// Goal Customizer Prompt Helper
function openGoalSetter() {
  const cals = prompt("Set Daily Calories Goal (kcal):", nutritionGoals.calories);
  if (cals && parseInt(cals, 10) > 0) nutritionGoals.calories = parseInt(cals, 10);

  const prot = prompt("Set Daily Protein Goal (g):", nutritionGoals.protein);
  if (prot && parseInt(prot, 10) > 0) nutritionGoals.protein = parseInt(prot, 10);

  const carb = prompt("Set Daily Carbs Goal (g):", nutritionGoals.carbs);
  if (carb && parseInt(carb, 10) > 0) nutritionGoals.carbs = parseInt(carb, 10);

  const fat = prompt("Set Daily Fats Goal (g):", nutritionGoals.fats);
  if (fat && parseInt(fat, 10) > 0) nutritionGoals.fats = parseInt(fat, 10);

  localStorage.setItem("healthApp_nutritionGoals", JSON.stringify(nutritionGoals));
  updateCalorieUI();
  renderHeroGraph();
}

// Form & Modal Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nutrition-log-form");
  const calsInput = document.getElementById("input-cals");
  const protInput = document.getElementById("input-protein");
  const carbsInput = document.getElementById("input-carbs");
  const fatsInput = document.getElementById("input-fats");
  const editGoalsBtn = document.getElementById("edit-nutrition-goals-btn");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const calories = parseInt(calsInput.value, 10) || 0;
      const protein = parseInt(protInput.value, 10) || 0;
      const carbs = parseInt(carbsInput.value, 10) || 0;
      const fats = parseInt(fatsInput.value, 10) || 0;

      if (calories > 0 || protein > 0 || carbs > 0 || fats > 0) {
        logNutrition({ calories, protein, carbs, fats });
        form.reset();
      }
    });
  }

  if (editGoalsBtn) {
    editGoalsBtn.addEventListener("click", openGoalSetter);
  }

  updateCalorieUI();
  renderHeroGraph();
  renderDisplayToggles();
});


document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial renders
  updateCalorieUI();
  updateWaterUI();
  renderHeroGraph();
  renderDisplayToggles();

  // 2. Edit Display Modal Open/Close wiring
  const openModalBtn = document.getElementById("open-display-modal-btn");
  const closeModalBtn = document.getElementById("close-display-modal-btn");
  const modalOverlay = document.getElementById("display-modal-overlay");

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener("click", () => {
      renderDisplayToggles(); // Refresh checkboxes
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
      if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");
      }
    });
  }

  // 3. Goal setter & form submits
  const editGoalsBtn = document.getElementById("edit-nutrition-goals-btn");
  if (editGoalsBtn) {
    editGoalsBtn.addEventListener("click", openGoalSetter);
  }

  const form = document.getElementById("nutrition-log-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const calories = parseInt(document.getElementById("input-cals")?.value, 10) || 0;
      const protein = parseInt(document.getElementById("input-protein")?.value, 10) || 0;
      const carbs = parseInt(document.getElementById("input-carbs")?.value, 10) || 0;
      const fats = parseInt(document.getElementById("input-fats")?.value, 10) || 0;

      if (calories > 0 || protein > 0 || carbs > 0 || fats > 0) {
        logNutrition({ calories, protein, carbs, fats });
        form.reset();
      }
    });
  }
});
