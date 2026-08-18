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




// 1. Register the Service Worker
if ('serviceWorker' in navigator && 'Notification' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('GoodHealth Service Worker active:', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}

// 2. Request Notification Permission
async function requestMedicationNotificationPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Send immediate confirmation test
    triggerMedicationTestAlert('[item_name]', '[time_value]');
    return true;
  } else if (permission === 'denied') {
    alert('Notification permissions are blocked. Please enable them in your device settings.');
    return false;
  }
  return false;
}

// 3. Helper to trigger an immediate local test notification via SW
async function triggerMedicationTestAlert(medName, scheduledTime) {
  if (Notification.permission !== 'granted') return;
  
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Mr. Connie Healthy Bear', {
    body: `Test Notification! Can you see it?`,
    icon: '/healthappicon.png',
    badge: '/healthappicon.png',
    vibrate: [200, 100, 200],
    data: { url: '/' }
  });
}




// --- THEME TOGGLE CONTROLLER ---
function initThemeToggle() {
  const themeBtn = document.getElementById("theme-tog");
  const savedTheme = localStorage.getItem("healthApp_theme") || "light";

  // Apply saved theme on initial load
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");

      // Save preference so it persists across refreshes/tabs
      localStorage.setItem("healthApp_theme", isDark ? "dark" : "light");

      // Optional: Audio feedback
      if (typeof playClickSound === "function") playClickSound();
    });
  }
}

// Add initThemeToggle() inside your DOMContentLoaded listener:
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  // ... your other init functions
});




// Medication reminder alarm clock SVG icon
const reminderClockIcon = `
  <svg class="med-reminder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="13" height="13" fill="currentColor" style="display: inline-block; vertical-align: -1px; margin-left: 2px; margin-bottom: 2px; flex-shrink: 0;">
    <path d="M528-458v-134q0-20-14-34t-34-14q-20 0-34 14t-14 34v150q0 13 4.5 24t13.5 20l100 100q14 14 34.5 13.5T619-299q14-14 14-34.5T619-368l-91-90ZM327-77q-72-31-125.5-84.5T117-287q-31-72-31-153t31-153q31-72 84.5-125.5T327-803q72-31 153-31t153 31q72 31 125.5 84.5T843-593q31 72 31 153t-31 153q-31 72-84.5 125.5T633-77q-72 31-153 31T327-77Zm153-363ZM45-677q-14-14-13.5-34T46-745l130-130q14-14 33.5-14t33.5 14q14 14 14 34t-14 34L113-677q-14 14-34 14t-34-14Zm870 0q-14 14-34 14t-34-14L717-807q-14-14-14-34t14-34q14-14 34-13.5t34 14.5l130 130q14 14 14 33.5T915-677ZM480-172q112 0 190-78t78-190q0-112-78-190t-190-78q-112 0-190 78t-78 190q0 112 78 190t190 78Z"/></svg>
`;





// --- DYNAMIC GREETING & USER PROFILE ---

// 1. Get relative time-of-day greeting
function getTimeBasedGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 4 && currentHour < 12) {
    return 'Good morning,';
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon,";
  } else {
    return "Good evening,";
  }
}

// 2. Update Header UI
function updateDashboardGreeting() {
  const greetingPrefixEl = document.getElementById("dashboard-greeting-prefix");
  const userNameEl = document.getElementById("user-display-name");

  if (greetingPrefixEl) {
    greetingPrefixEl.textContent = getTimeBasedGreeting();
  }

  if (userNameEl) {
    const savedName = localStorage.getItem("user_profile_name") || "Friend";
    userNameEl.textContent = savedName;
  }
}

// 3. Prompt user to change their name when tapped
function promptChangeName() {
  const currentName = localStorage.getItem("user_profile_name") || "";
  const newName = prompt("What should we call you?", currentName);

  if (newName !== null && newName.trim() !== "") {
    const cleanName = newName.trim();
    localStorage.setItem("user_profile_name", cleanName);
    updateDashboardGreeting();
    
    if (typeof playLogSound === "function") playLogSound();
    if (navigator.vibrate) navigator.vibrate(10);
  }
}

// 4. Hook into page initialization & tab switching
document.addEventListener("DOMContentLoaded", () => {
  updateDashboardGreeting();
});




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
      
      // Check if your reminder checkbox/toggle is checked (or default to true if every created med has an alarm)
      const reminderInput = document.getElementById("med-reminder") || document.getElementById("med-alarm");
      const hasReminder = reminderInput ? reminderInput.checked : true;

      const newMed = {
        id: Date.now(),
        name,
        dosage,
        scheduledTime: formattedTime,
        frequency,
        icon: selectedIcon,
        colorKey: selectedColorKey,
        hasReminder: hasReminder, // <-- Added this property
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
  const medList = document.getElementById("med-list");
  if (!medList) return;
  medList.innerHTML = "";

  const today = getTodayStr ? getTodayStr() : new Date().toISOString().split("T")[0];

  // 1. Maintain Edit Mode class state
  if (isMedEditMode) {
    medList.classList.add("editing");
  }

  // 2. Data Migration Fallbacks
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

  // 3. Sort: Pending first, Taken last
  const sortedMeds = [...medications].sort((a, b) => {
    const aTaken = a.history.includes(today);
    const bTaken = b.history.includes(today);
    return aTaken === bTaken ? 0 : aTaken ? 1 : -1;
  });

  // 4. Render Items
  sortedMeds.forEach((med) => {
    const isTakenToday = med.history.includes(today);
    const colorTheme = (typeof MED_COLOR_PALETTE !== "undefined" && MED_COLOR_PALETTE[med.colorKey])
      ? MED_COLOR_PALETTE[med.colorKey] 
      : { main: "#3883e0", bg: "rgba(56, 131, 224, 0.1)" };

    // --- Check if an alarm/reminder is active ---
    const hasAlarm = Boolean(med.hasReminder || med.reminder || med.alarm);

    const li = document.createElement("li");
    li.className = `med-item ${isTakenToday ? "completed" : ""}`;
    li.dataset.id = med.id;
    li.style.backgroundColor = colorTheme.bg;
    li.style.borderColor = `${colorTheme.main}40`;

    // UNIFIED SINGLE INNERHTML: Delete Button + Icon + Info Card
    li.innerHTML = `
      <button class="med-delete-btn" onclick="deleteMedication('${med.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM428.5-291.5Q440-303 440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280q17 0 28.5-11.5Zm160 0Q600-303 600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280q17 0 28.5-11.5ZM280-720v520-520Z"/></svg></button>
      <div class="med-card-wrapper">
        <div class="med-icon-display" style="color: ${colorTheme.main}">
          ${typeof getIconSVG === "function" ? getIconSVG(med.icon) : ""}
        </div>
        <div class="med-grid">
          <span class="med-name" style="color: ${colorTheme.main}">${med.name}</span>
          <span class="med-dosage">${med.dosage}</span>
          <span class="med-time" style="color: ${colorTheme.main}">
            ${med.scheduledTime || med.time || ''} ${hasAlarm ? reminderClockIcon : ''}
          </span>
          <span class="logged-status">
            ${isTakenToday ? "Taken" : "Not Taken"}
          </span>
        </div>
      </div>
    `;

    if (typeof attachSwipeGesture === "function") {
      attachSwipeGesture(li, med, today);
    }
    
    medList.appendChild(li);
  });
}


function getIconSVG(iconKey) {
  const iconMap = {
    "pill-1": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m698-352 90-89q34.91-35.02 53.45-79.89Q860-565.75 860-615q0-102.36-71.32-173.68Q717.36-860 615-860q-49 0-93.96 18.55Q476.09-822.91 441-788l-89 90 346 346ZM345-100q49 0 93.96-18.55Q483.91-137.09 519-172l89-90-346-346-90 89q-34.91 35.02-53.45 79.89Q100-394.25 100-345q0 102.36 71.32 173.68Q242.64-100 345-100Z"/></svg>',

    "2tablets": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13ZM9.03033 7.03033C9.32322 6.73744 9.32322 6.26256 9.03033 5.96967C8.73744 5.67678 8.26256 5.67678 7.96967 5.96967L5.96967 7.96967C5.67678 8.26256 5.67678 8.73744 5.96967 9.03033C6.26256 9.32322 6.73744 9.32322 7.03033 9.03033L9.03033 7.03033Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 22C19.5376 22 22 19.5376 22 16.5C22 13.4624 19.5376 11 16.5 11C13.4624 11 11 13.4624 11 16.5C11 19.5376 13.4624 22 16.5 22ZM16.9697 18.0303C17.2626 18.3232 17.7374 18.3232 18.0303 18.0303C18.3232 17.7374 18.3232 17.2626 18.0303 16.9697L16.0303 14.9697C15.7374 14.6768 15.2626 14.6768 14.9697 14.9697C14.6768 15.2626 14.6768 15.7374 14.9697 16.0303L16.9697 18.0303Z" fill="currentColor"/></svg>',

    "3tablets": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11ZM12.7071 7.25008C13.1213 7.25008 13.4571 6.91429 13.4571 6.50008C13.4571 6.08586 13.1213 5.75008 12.7071 5.75008H11.2929C10.8787 5.75008 10.5429 6.08586 10.5429 6.50008C10.5429 6.91429 10.8787 7.25008 11.2929 7.25008H12.7071Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 22C8.98528 22 11 19.9853 11 17.5C11 15.0147 8.98528 13 6.5 13C4.01472 13 2 15.0147 2 17.5C2 19.9853 4.01472 22 6.5 22ZM7.53033 17.5303C7.82322 17.2374 7.82322 16.7626 7.53033 16.4697C7.23744 16.1768 6.76256 16.1768 6.46967 16.4697L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L7.53033 17.5303Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 20C18.9853 20 21 17.9853 21 15.5C21 13.0147 18.9853 11 16.5 11C14.0147 11 12 13.0147 12 15.5C12 17.9853 14.0147 20 16.5 20ZM16.4697 16.5303C16.7626 16.8232 17.2374 16.8232 17.5303 16.5303C17.8232 16.2374 17.8232 15.7626 17.5303 15.4697L16.5303 14.4697C16.2374 14.1768 15.7626 14.1768 15.4697 14.4697C15.1768 14.7626 15.1768 15.2374 15.4697 15.5303L16.4697 16.5303Z" fill="currentColor"/></svg>',

    "med-bottle": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M420-354.5v40q0 25 17.5 42.5t42.5 17.5q25 0 42.5-17.5t17.5-42.5v-40h40q25 0 42.5-17.5t17.5-42.5q0-25-17.5-42.5T580-474.5h-40v-40q0-25-17.5-42.5T480-574.5q-25 0-42.5 17.5T420-514.5v40h-40q-25 0-42.5 17.5T320-414.5q0 25 17.5 42.5t42.5 17.5h40Zm-140 251q-37.54 0-64.27-26.73Q189-156.96 189-194.5v-440q0-37.54 26.73-64.27Q242.46-725.5 280-725.5h400q37.54 0 64.27 26.73Q771-672.04 771-634.5v440q0 37.54-26.73 64.27Q717.54-103.5 680-103.5H280Zm-1.91-662q-19.16 0-32.33-13.17-13.17-13.18-13.17-32.33t13.17-32.33q13.17-13.17 32.33-13.17h403.82q19.16 0 32.33 13.17 13.17 13.18 13.17 32.33t-13.17 32.33q-13.17 13.17-32.33 13.17H278.09Z"/></svg>',

    "IV-bag": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M520-32.11q-35.39 0-60.45-25.05-25.05-25.06-25.05-60.45v-83.96q-102.76-15.91-171.02-95.01-68.26-79.09-68.26-185.81v-353.78q0-37.79 26.61-64.4 26.6-26.6 64.39-26.6h387.56q37.79 0 64.39 26.6 26.61 26.61 26.61 64.4v353.78q0 106.72-68.26 185.81-68.26 79.1-171.02 95.01v78.46H720q19.15 0 32.33 13.18 13.17 13.17 13.17 32.32t-13.17 32.33Q739.15-32.11 720-32.11H520Zm25.22-415.54h127.67q1.76-8.81 2.52-16.99.76-8.19.76-17.75v-38.09H565.5q-18.2 0-30.65-12.45-12.46-12.46-12.46-30.66 0-18.19 12.46-30.65 12.45-12.46 30.65-12.46h110.67v-72.82H515.93q-18.19 0-30.65-12.46-12.45-12.45-12.45-30.65t12.45-30.65q12.46-12.46 30.65-12.46h160.24v-72.83H283.83v310.92h96.6q32.29 0 61.43 13.8 29.14 13.81 49.86 38.37 10.15 11.72 23.99 19.77 13.83 8.06 29.51 8.06Z"/></svg>',

    "syringe": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M150.02-509.89q-12.43-13.2-12.43-31.49t12.43-31.49L260.35-683.2l-40.37-40.37-12.24 12.48q-13.2 13.2-31.49 13.2t-31.49-13.2q-12.43-13.19-12.43-31.49 0-18.29 12.43-30.72l86.7-86.94q13.19-13.2 31.49-13.2 18.29 0 31.48 13.2 13.2 12.44 13.2 31.11t-13.2 31.11l-12.47 12.48 40.37 40.37 110.56-110.57q13.2-13.19 31.49-13.19t31.49 13.19q13.2 13.2 13.2 31.49t-13.2 31.49l-24.13 23.13 57.46 57.46-113 112q-12.44 13.19-12.44 31.49 0 18.29 12.44 31.48 13.19 13.2 31.48 13.2 18.3 0 31.49-13.2l112.24-112.76 53.11 52.35-112.76 113q-13.19 13.2-13.19 31.49t13.19 31.49q12.44 12.43 30.73 12.05 18.29-.38 31.49-12.81l112-113L761-480.37q26.35 26.35 26.35 64.27 0 37.93-26.35 64.27l-21.78 22.31L893.5-176q11.2 11.2 5.48 24.99-5.72 13.79-21.39 13.79h-42.92q-13.67 0-26.49-5.48-12.81-5.47-22.25-14.91L676.24-267.3l-21.54 22.54q-26.35 26.35-64.28 26.35-37.92 0-64.27-26.35L236.89-534.02 213-509.89q-13.2 12.43-31.49 12.43t-31.49-12.43Z"/></svg>',

    "med-vile": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-71.87q-86.35 0-146.76-60.89T272.83-280v-351.87q-33.48-2.39-57.22-26.49-23.74-24.1-23.74-57.57v-87.18q0-35.39 25.41-60.21 25.42-24.81 61.05-24.81h403.58q35.63 0 60.93 24.81 25.29 24.82 25.29 60.21v87.18q0 33.47-23.74 57.57t-57.22 26.49V-280q0 86.35-60.41 147.24Q566.35-71.87 480-71.87Zm84.04-123.61q34.53-35 34.53-84.52h-78.81q-18.19 0-30.65-12.46-12.46-12.45-12.46-30.65 0-18.19 12.46-30.65 12.46-12.46 30.65-12.46h78.81v-72.82h-78.81q-18.19 0-30.65-12.46-12.46-12.46-12.46-30.65 0-18.2 12.46-30.65 12.46-12.46 30.65-12.46h78.81v-105.65H361.43V-280q0 49.52 34.53 84.52 34.52 35 84.04 35t84.04-35Z"/></svg>',

    "marijuana": '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M436.65-240.54q-41.52 27-85.78 46.76-44.26 19.76-93.02 19.76-53.96 0-102.18-21.22-48.21-21.22-90.93-54.93-14.2-10.96-14.2-28.63 0-17.68 13.96-28.87 30.52-24.76 65.18-42.88 34.67-18.12 72.95-26.84-59.04-49.68-89.45-118.27-30.4-68.6-38.4-145.08-2.24-19.91 12.2-34.47 14.43-14.55 35.11-12.31 59.28 6 113.68 27.26 54.4 21.26 100.16 57.02v-6.09q.48-79.95 32.1-151.55 31.62-71.6 79.62-135.56 12.2-16.15 32.35-16.15 20.15 0 32.35 16.15 47.76 63.96 79.26 135.56 31.5 71.6 32.46 151.55 0 1.53-.39 3.05-.38 1.52-.38 3.04 46.53-35.76 100.93-56.52 54.4-20.76 113.68-27.76 19.92-2.24 34.85 11.93 14.94 14.18 12.7 34.85-7.24 76.48-38.76 145.08-31.53 68.59-90.33 118.27 38.28 8.72 72.56 26.84 34.29 18.12 65.57 42.88 13.96 10.95 14.08 28.75.12 17.79-14.08 28.75-42.72 33.71-90.67 54.93-47.96 21.22-101.92 21.22-49.52 0-93.9-19.76t-84.9-46.76v125.56q0 18.2-12.34 30.65Q498.43-71.87 480-71.87t-30.89-12.46q-12.46-12.45-12.46-30.89v-125.32Z"/></svg>'

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

let isMedEditMode = false;

// Toggle Edit Mode on button click
document.getElementById("edit-meds-btn")?.addEventListener("click", () => {
  isMedEditMode = !isMedEditMode;
  
  const editBtn = document.getElementById("edit-meds-btn");
  const listEl = document.getElementById("med-list");
  
  
  if (listEl) {
    listEl.classList.toggle("editing", isMedEditMode);
  }
});

function deleteMedication(id) {
  // Remove from master list
  medications = medications.filter(med => String(med.id) !== String(id));
  
  // Save updated state to localStorage
  saveAppState();

  // Play click/tap sound
  if (typeof playClickSound === "function") playClickSound();

  // Re-render the list and home dashboard summary
  renderMedications();
  if (typeof updateHomeDashboard === "function") updateHomeDashboard();
}

function calculateReminderTimes(doseTimeStr, selectedOffsets) {
  // doseTimeStr format: "21:00" or "09:00 PM"
  let [hours, minutes] = doseTimeStr.includes(":") ? doseTimeStr.split(":") : [9, 0];
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  const baseMinutes = hours * 60 + minutes;

  return selectedOffsets.map(offset => {
    let targetMinutes = baseMinutes;

    if (offset === "30_before") targetMinutes -= 30;
    if (offset === "15_before") targetMinutes -= 15;
    if (offset === "15_after")  targetMinutes += 15;
    if (offset === "30_after")  targetMinutes += 30;

    // Wrap around 24-hour clock (1440 minutes in a day)
    targetMinutes = (targetMinutes + 1440) % 1440;

    const h = Math.floor(targetMinutes / 60);
    const m = targetMinutes % 60;
    const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return {
      type: offset,
      triggerTime: formattedTime,
      label: offset.replace('_', ' ')
    };
  });
}

// 2. Updated Med Save / Submit Handler
function handleMedicationFormSubmit(e) {
  e.preventDefault();

  const medName = document.getElementById("med-name").value;
  const medDosage = document.getElementById("med-dosage").value;
  const medTime = document.getElementById("med-time").value; // e.g. "21:00"
  const medFreq = document.getElementById("med-frequency") ? document.getElementById("med-frequency").value : "Daily";

  // Gather all selected reminder chips
  const checkedChips = Array.from(document.querySelectorAll('input[name="med-reminder-offset"]:checked'))
    .map(el => el.value);

  const reminders = calculateReminderTimes(medTime, checkedChips);

  const hasReminderInput = document.getElementById("med-reminder-toggle");
  const hasReminder = hasReminderInput ? hasReminderInput.checked : false;

  const newMed = {
  id: Date.now(),
  name,
  dosage,
  scheduledTime: formattedTime,
  frequency,
  icon: selectedIcon,
  colorKey: selectedColorKey,
  hasReminder: hasReminder, // <-- Make sure this flag is included!
  history: []
};

  medications.push(newMed);
  if (typeof saveAppState === "function") saveAppState();
  if (typeof playLogSound === "function") playLogSound();
  
  renderMedications();
  toggleMedModal(false);
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
        if (typeof renderMoodScatterplot === "function") {
          renderMoodScatterplot();
        }
      }, 50);
    }

    if (targetTabId === "view-meds") { 
    updateMoodSubtitle();
    }  
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderMedications(); // Fixed: changed render() to renderMedications()
  updateWaterUI();
  updateCaffeineUI();
  renderWeightGraph();
    if (typeof renderMoodScatterplot === "function") {
    renderMoodScatterplot();
  }

  renderMedicationCalendar();
  renderCustomSymptoms();
  updateHomeDashboard();
  updateMoodSubtitle();
});


// Auto-refresh UI if the user returns to the app on a new day
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    updateWaterUI();
    updateCalorieUI();
    if (typeof renderHeroGraph === "function") renderHeroGraph();
  }
});


document.addEventListener("DOMContentLoaded", () => {

  restoreCardOrder("view-home");
  initCardReordering("#view-home");

  restoreCardOrder("view-wellbeing");
  initCardReordering("#view-wellbeing");

  restoreCardOrder("view-diet");
  initCardReordering("#view-diet");

  restoreCardOrder("view-home");
  initCardReordering("#view-home");
  

  const customizeCycleBtn = document.getElementById("customize-cycle-btn");
if (customizeCycleBtn) {
  customizeCycleBtn.addEventListener("click", openCycleDisplayModal);
}

});



