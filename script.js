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




// Path relative to your HTML file (or /assets/sound.mp3)
const actionSound = new Audio("universfield-bubble-pop-04-323580.mp3"); 
actionSound.volume = 0.04; // Optional: 0.0 to 1.0

window.addEventListener("pointerdown", () => {
  actionSound.load();
}, { once: true });



// --- MULTI-THEME TOGGLE CONTROLLER ---
const THEME_CLASSES = ["light", "dark", "dagobah"];

function applyTheme(themeClass) {
  // 1. Strip any existing theme classes so they don't conflict
  document.body.classList.remove(...THEME_CLASSES);

  // 2. Add the selected theme class and save to localStorage
  document.body.classList.add(themeClass);
  localStorage.setItem("healthApp_theme", themeClass);
}

function initThemeToggle() {
  const themeBtn = document.getElementById("theme-tog");
  const savedTheme = localStorage.getItem("healthApp_theme") || "light";

  // Apply saved theme on initial page load
  applyTheme(savedTheme);

  // Hook up your #theme-tog button
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      // Find whichever theme class is currently active on <body>
      const currentTheme = THEME_CLASSES.find((c) => document.body.classList.contains(c)) || "light";
      const currentIndex = THEME_CLASSES.indexOf(currentTheme);

      // Cycle to the next theme in the array (loops back to index 0)
      const nextIndex = (currentIndex + 1) % THEME_CLASSES.length;
      const nextTheme = THEME_CLASSES[nextIndex];

      applyTheme(nextTheme);

      // Audio feedback
      if (typeof playClickSound === "function") playClickSound();
    });
  }
}

// Attach to DOM load
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
});






// --- DYNAMIC DATE & GREETING ---

// 1. Format current date: e.g. "December 10, 2025"
function getFormattedCurrentDate() {
  const now = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  return now.toLocaleDateString("en-US", options);
}

// 2. Relative time-of-day greeting
function getTimeBasedGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 4 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

// 3. Update Dashboard Header UI
function updateDashboardGreeting() {
  const dateEl = document.getElementById("dashboard-current-date");
  const greetingEl = document.getElementById("dashboard-greeting-text");

  if (dateEl) {
    dateEl.textContent = getFormattedCurrentDate();
  }

  if (greetingEl) {
    greetingEl.textContent = getTimeBasedGreeting();
  }
}

// 4. Hook into page initialization
document.addEventListener("DOMContentLoaded", () => {
  updateDashboardGreeting();
});



// ==========================================
// --- 3. MEDICATION TRACKER LOGIC ---
// ==========================================

// Global state tracking
let isMedEditMode = false;

// DOM Elements
const medList = document.getElementById("med-list");
const statusCounter = document.getElementById("status-counter");
const medForm = document.getElementById("med-form");

// Bottom Sheet Elements
const sheetOverlay = document.getElementById("modal-overlay");
const sheetBackdrop = document.getElementById("sheet-backdrop");
const sheetCard = document.getElementById("sheet-card");
const sheetGrabberZone = document.getElementById("sheet-grabber-zone");
const cancelBtn = document.getElementById("cancel-btn") || document.getElementById("cancel-med-btn");

// Action Menu Elements
const medMenuBtn = document.getElementById("med-menu-btn");
const medActionMenu = document.getElementById("med-action-menu");
const menuAddMed = document.getElementById("menu-add-med");
const menuEditMeds = document.getElementById("menu-edit-meds");
const menuEditText = document.getElementById("menu-edit-text");

// Clock Icon for Reminders
const reminderClockIcon = `<svg width="128pt" height="128pt" class="med-reminder-icon" version="1.1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="currentColor" >
 <path d="m64 104.96c10.863 0 21.281-4.3164 28.965-11.996 7.6797-7.6836 11.996-18.102 11.996-28.965s-4.3164-21.281-11.996-28.965c-7.6836-7.6797-18.102-11.996-28.965-11.996s-21.281 4.3164-28.965 11.996c-7.6797 7.6836-11.996 18.102-11.996 28.965s4.3164 21.281 11.996 28.965c7.6836 7.6797 18.102 11.996 28.965 11.996zm0-71.68c8.1484 0 15.961 3.2344 21.723 8.9961 5.7617 5.7617 8.9961 13.574 8.9961 21.723s-3.2344 15.961-8.9961 21.723c-5.7617 5.7617-13.574 8.9961-21.723 8.9961s-15.961-3.2344-21.723-8.9961c-5.7617-5.7617-8.9961-13.574-8.9961-21.723s3.2344-15.961 8.9961-21.723c5.7617-5.7617 13.574-8.9961 21.723-8.9961z"/>
 <path d="m64 73.832 6.3984 3.5703c2.4766 1.3711 5.5938 0.47656 6.9648-1.9961 1.3711-2.4766 0.47656-5.5938-1.9961-6.9648l-6.3984-3.5703h-0.003906c-1.4922-0.85938-2.4102-2.4531-2.4062-4.1719v-10.777c0-2.8281-2.2891-5.1211-5.1172-5.1211s-5.1211 2.293-5.1211 5.1211v10.777c-0.007812 2.6719 0.70313 5.3008 2.0547 7.6094 1.3477 2.3086 3.293 4.2148 5.625 5.5234z"/>
</svg>
`;
 
// Color Palette
const MED_COLOR_PALETTE = {
 "color-1": { main: "#a855f7", bg: "rgba(169, 85, 247, 0.27)" }, // Purple
 "color-2": { main: "#6584f3", bg: "#7492ff3b" },  // Blue
 "color-3": { main: "#09b083", bg: "rgba(16, 185, 129, 0.21)" },  // Green
 "color-4": { main: "#ea8901", bg: "rgba(245, 159, 11, 0.21)" },  // Amber
 "color-5": { main: "#e8559f", bg: "rgba(238, 92, 165, 0.24)" },  // Pink
 "color-6": { main: "#06b1cf", bg: "rgba(6, 181, 212, 0.24)" },   // Cyan
 "color-7": { main: "#66b60a", bg: "rgba(131, 204, 22, 0.26)" },  // Lime
 "color-8": { main: "#eb3c5a", bg: "rgba(240, 43, 76, 0.19)" }    // Rose
};


// --- CAROUSEL ASSET LIST ---
// 1. Single Master List of Icons
const AVAILABLE_MED_ICONS = [
  { key: "1-pill", file: "pill-1.png" },
  { key: "3-pill", file: "pill-3.png" },
  { key: "2-pills", file: "P2PNG.png" },


  { key: "2-tablets", file: "2-tablets.png" },
  { key: "2-tabletsalt", file: "2-tablets-alt.png" },


  { key: "assorted-pills1", file: "assorted-pills1.png" },


  { key: "orange-blister", file: "pills-tablet-3d-icon-png-download-5889253.png" },
  { key: "pink-blister", file: "pink-blister.png" },
  { key: "blue-blister", file: "blue-blister.png" },

  { key: "pueple-bottle", file: "medicine-jar-3d-icon-png-download-4697203.png" },

  { key: "vaccine", file: "vaccine.png" },
  { key: "glass-bottle", file: "vaccine-bottle-3d-icon-png-download-8609266.png" },

  { key: "soap", file: "acondicionador-3d-icon-png-download-14910010.png" },


  { key: "nasal-spray", file: "nasal-spray.png" },

  { key: "inahler", file: "inahler1.png" },

  { key: "gel2", file: "face-wash.png" },

  { key: "injection", file: "syringe3.png" },

  { key: "clear-bottle", file: "pill-jar.png" },
  { key: "sepia-bottle", file: "syrup-bottle-3d-icon-png-download-7387765.png" },


  { key: "spray", file: "foundation-3d-icon-png-download-14909999.png" },
  { key: "spray2", file: "spray2.png" },


  
  { key: "pestle", file: "mortar-and-pestle-3d-icon-png-download-4754720.png"},

  { key: "band-aid2", file: "band-aid-3d-icon-png-download-8614930.png" },
  { key: "band-aid", file: "bandaid.png" },

 
  { key: "medical-marijuana", file: "leaf.png" },

  { key: "no-icon", file: "files.png" },
];

// 2. Lookup Helper that reads directly from the master list
function getMedIconMarkup(iconKey) {
  const match = AVAILABLE_MED_ICONS.find(item => item.key === iconKey);
  const fileName = match ? match.file : "2-tablets.png"; // Fallback if key doesn't exist
  return `<img src="med-icons/${fileName}" alt="${iconKey}" class="med-3d-img" />`;
}



let activeIconIndex = 0;

// Initialize Carousel & Picker
function initMedStudioCarousel() {
  const slider = document.getElementById("stage-slider");
  const stage = document.getElementById("med-picker-stage");
  const iconInput = document.getElementById("selected-med-icon");
  const colorInput = document.getElementById("selected-med-color");
  const nativeColorPicker = document.getElementById("med-native-color-picker");
  const prevBtn = document.getElementById("stage-prev-btn");
  const nextBtn = document.getElementById("stage-next-btn");

  if (!slider || !stage) return;

  // 1. Build slides
  slider.innerHTML = AVAILABLE_MED_ICONS.map((icon, idx) => `
    <div class="stage-slide-item ${idx === 0 ? "active" : ""}" data-key="${icon.key}">
      <img src="med-icons/${icon.file}" alt="${icon.key}" />
    </div>
  `).join("");

  function updateSlidePosition() {
    slider.style.transform = `translateX(-${activeIconIndex * 100}%)`;
    
    // Update active highlight classes
    const slides = slider.querySelectorAll(".stage-slide-item");
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === activeIconIndex);
    });

    // Update hidden input
    if (iconInput) {
      iconInput.value = AVAILABLE_MED_ICONS[activeIconIndex].key;
    }

    if (navigator.vibrate) navigator.vibrate(8);
  }

  // Prev / Next Button Navigation
  prevBtn?.addEventListener("click", () => {
    activeIconIndex = (activeIconIndex - 1 + AVAILABLE_MED_ICONS.length) % AVAILABLE_MED_ICONS.length;
    updateSlidePosition();
  });

  nextBtn?.addEventListener("click", () => {
    activeIconIndex = (activeIconIndex + 1) % AVAILABLE_MED_ICONS.length;
    updateSlidePosition();
  });

  // 2. Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Right -> Previous
        activeIconIndex = (activeIconIndex - 1 + AVAILABLE_MED_ICONS.length) % AVAILABLE_MED_ICONS.length;
      } else {
        // Swiped Left -> Next
        activeIconIndex = (activeIconIndex + 1) % AVAILABLE_MED_ICONS.length;
      }
      updateSlidePosition();
    }
  });

  // 3. Dynamic Color Picker Sync
  nativeColorPicker?.addEventListener("input", (e) => {
    const chosenColor = e.target.value;
    stage.style.backgroundColor = chosenColor;
    if (colorInput) colorInput.value = chosenColor;
  });
}

// Call on startup
document.addEventListener("DOMContentLoaded", initMedStudioCarousel);




// --- POP-UP ACTION MENU LOGIC ---
medMenuBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  medActionMenu?.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (medActionMenu && !medActionMenu.contains(e.target) && e.target !== medMenuBtn) {
    medActionMenu.classList.add("hidden");
  }
});

menuAddMed?.addEventListener("click", () => {
  medActionMenu?.classList.add("hidden");
  openBottomSheet();
});

menuEditMeds?.addEventListener("click", () => {
  medActionMenu?.classList.add("hidden");
  isMedEditMode = !isMedEditMode;

  if (menuEditText) {
    menuEditText.textContent = isMedEditMode ? "Removing..." : "Remove";
  }

  const listEl = document.getElementById("med-list");
  if (listEl) {
    listEl.classList.toggle("editing", isMedEditMode);
  }
});

// --- BOTTOM SHEET CONTROLLER & DRAG GESTURES ---
function openBottomSheet() {
  if (!sheetOverlay) return;
  sheetOverlay.classList.remove("hidden");
  void sheetOverlay.offsetWidth;
  sheetOverlay.classList.add("open");
  if (navigator.vibrate) navigator.vibrate(10);
}

function closeBottomSheet() {
  if (!sheetOverlay || !sheetCard) return;
  sheetOverlay.classList.remove("open");
  sheetCard.classList.remove("fullscreen");
  sheetCard.style.transform = "";
  setTimeout(() => {
    sheetOverlay.classList.add("hidden");
  }, 320);
}

sheetBackdrop?.addEventListener("click", closeBottomSheet);
cancelBtn?.addEventListener("click", closeBottomSheet);

let startSheetY = 0;
let currentSheetY = 0;
let isDraggingSheet = false;

function onGrabStart(e) {
  isDraggingSheet = true;
  startSheetY = e.touches ? e.touches[0].clientY : e.clientY;
  if (sheetCard) sheetCard.style.transition = "none";
}

function onGrabMove(e) {
  if (!isDraggingSheet || !sheetCard) return;
  currentSheetY = e.touches ? e.touches[0].clientY : e.clientY;
  const deltaY = currentSheetY - startSheetY;

  if (deltaY > 0) {
    sheetCard.style.transform = `translateY(${deltaY}px)`;
  } else if (deltaY < 0 && !sheetCard.classList.contains("fullscreen")) {
    sheetCard.style.transform = `translateY(${Math.max(deltaY, -140)}px)`;
  }
}

function onGrabEnd(e) {
  if (!isDraggingSheet || !sheetCard) return;
  isDraggingSheet = false;
  sheetCard.style.transition = "";

  const deltaY = currentSheetY - startSheetY;

  if (deltaY > 90) {
    closeBottomSheet();
  } else if (deltaY < -40) {
    sheetCard.classList.add("fullscreen");
    sheetCard.style.transform = "translateY(0)";
    if (navigator.vibrate) navigator.vibrate(12);
  } else {
    sheetCard.style.transform = "translateY(0)";
  }

  startSheetY = 0;
  currentSheetY = 0;
}

sheetGrabberZone?.addEventListener("touchstart", onGrabStart, { passive: true });
window.addEventListener("touchmove", onGrabMove, { passive: true });
window.addEventListener("touchend", onGrabEnd);

sheetGrabberZone?.addEventListener("mousedown", onGrabStart);
window.addEventListener("mousemove", onGrabMove);
window.addEventListener("mouseup", onGrabEnd);

// --- TIME & REMINDER HELPERS ---
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return minutes === "00" ? `${h} ${ampm}` : `${h}:${minutes} ${ampm}`;
}

function calculateReminderTimes(doseTimeStr, selectedOffsets) {
  if (!doseTimeStr) return [];
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

// --- FORM SUBMIT LOGIC ---
if (medForm) {
  medForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("med-name");
    const dosageInput = document.getElementById("med-dosage");
    const timeInput = document.getElementById("med-time");
    const freqInput = document.getElementById("med-frequency");

    const name = nameInput ? nameInput.value.trim() : "";
    const dosage = dosageInput ? dosageInput.value.trim() : "100mg";
    const rawTime = timeInput ? timeInput.value : "";
    const frequency = freqInput ? freqInput.value : "Daily";

    // Read from the new studio carousel stage, with fallbacks
    const iconInput = document.getElementById("selected-med-icon");
    const colorInput = document.getElementById("selected-med-color");
    const selectedIcon = iconInput ? iconInput.value : "2-tablets";
    const selectedColor = colorInput ? colorInput.value : "#3883e0";

    if (!name) return;

    // Safe time formatting
    let formattedTime = rawTime;
    if (typeof formatTime === "function" && rawTime) {
      formattedTime = formatTime(rawTime);
    }

    const newMed = {
      id: Date.now().toString(),
      name,
      dosage,
      scheduledTime: formattedTime,
      frequency,
      icon: selectedIcon,
      customColor: selectedColor,
      colorKey: "custom",
      history: []
    };

    medications.push(newMed);
    if (typeof saveAppState === "function") saveAppState();

    medForm.reset();

    // Close Modal / Bottom Sheet
    if (typeof closeBottomSheet === "function") {
      closeBottomSheet();
    } else if (modalOverlay) {
      modalOverlay.classList.add("hidden");
    }

    renderMedications();
    if (typeof updateHomeDashboard === "function") updateHomeDashboard();
  });
}



// --- PRESS & HOLD QUICK-DELETE BADGE ---
// --- PRESS & HOLD QUICK-DELETE BADGE ---
function attachLongPressDelete(element, medId) {
  let pressTimer = null;
  let touchStartPos = { x: 0, y: 0 };
  const HOLD_DURATION = 500;

  function startHold(e) {
    if (isMedEditMode || e.target.closest('.med-hold-delete-btn') || e.target.closest('.med-delete-btn')) return;
    
    const touch = e.touches ? e.touches[0] : e;
    touchStartPos = { x: touch.clientX, y: touch.clientY };

    element.classList.add("holding");

    pressTimer = setTimeout(() => {
      triggerQuickDelete(element, medId);
    }, HOLD_DURATION);
  }

  function moveHold(e) {
    if (!pressTimer) return;
    const touch = e.touches ? e.touches[0] : e;
    const moveX = Math.abs(touch.clientX - touchStartPos.x);
    const moveY = Math.abs(touch.clientY - touchStartPos.y);

    // Only cancel hold if finger moves significantly (>10px) to allow natural touch wobble
    if (moveX > 10 || moveY > 10) {
      cancelHold();
    }
  }

  function cancelHold() {
    clearTimeout(pressTimer);
    pressTimer = null;
    element.classList.remove("holding");
  }

  function triggerQuickDelete(el, id) {
    cancelHold();
    if (navigator.vibrate) navigator.vibrate(15);
    if (typeof playClickSound === "function") playClickSound();

    document.querySelectorAll(".med-hold-delete-btn").forEach(btn => btn.remove());

    const deleteBadge = document.createElement("button");
    deleteBadge.className = "med-hold-delete-btn";
    deleteBadge.innerHTML = '<svg width="100pt" fill="currentColor" height="100pt" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m74 40h1.8281c1.5938 0.039062 2.957-1.125 3.1719-2.6992 0.085938-0.84766-0.19141-1.6914-0.76562-2.3203-0.57031-0.62891-1.3828-0.98438-2.2344-0.98047h-13v-6c0-4.9688-4.0312-9-9-9h-8c-4.9688 0-9 4.0312-9 9v6h-12.828c-1.5938-0.039062-2.957 1.125-3.1719 2.6992-0.085938 0.84766 0.19141 1.6914 0.76562 2.3203 0.57031 0.62891 1.3828 0.98438 2.2344 0.98047h2v32c0 4.9688 4.0312 9 9 9h30c4.9688 0 9-4.0312 9-9zm-31-12c0-1.6562 1.3438-3 3-3h8c1.6562 0 3 1.3438 3 3v6h-14zm25 44c0 1.6562-1.3438 3-3 3h-30c-1.6562 0-3-1.3438-3-3v-32h36z"/></svg>';
    deleteBadge.setAttribute("aria-label", "Delete medication");

    // ---> ADD / UPDATE THE LISTENER HERE
    deleteBadge.addEventListener("click", (e) => {
      e.stopPropagation();

      // 1. Trigger sound first so UI re-render crashes never block playback
      actionSound.currentTime = 0;
      actionSound.play().catch(err => console.warn("Audio playback failed:", err));

      // 2. Remove medication and sync dashboard
      deleteMedication(id);
    });

    el.appendChild(deleteBadge);

    const dismissHandler = (event) => {
      if (!el.contains(event.target)) {
        deleteBadge.remove();
        document.removeEventListener("pointerdown", dismissHandler);
      }
    };
    setTimeout(() => document.addEventListener("pointerdown", dismissHandler), 20);
  }


  element.addEventListener("touchstart", startHold, { passive: true });
  element.addEventListener("touchmove", moveHold, { passive: true });
  element.addEventListener("touchend", cancelHold);
  element.addEventListener("touchcancel", cancelHold);

  element.addEventListener("mousedown", startHold);
  element.addEventListener("mousemove", moveHold);
  element.addEventListener("mouseup", cancelHold);
  element.addEventListener("mouseleave", cancelHold);
}


// --- DELETE FUNCTION ---
function deleteMedication(id) {
  medications = medications.filter(med => String(med.id) !== String(id));
  saveAppState();
  if (typeof playClickSound === "function") playClickSound();
  renderMedications();
  if (typeof updateHomeDashboard === "function") updateHomeDashboard();
}

function getTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// --- SWIPE GESTURE (Left to Log / Right to Undo) ---
function attachSwipeGesture(element, med, today) {
  let startX = 0;
  let currentX = 0;
  let startY = 0;
  let currentY = 0;
  let hasMovedHorizontally = false;
  const isTakenToday = med.history && med.history.includes(today);

  element.addEventListener("touchstart", (e) => {
    if (e.target.closest('.med-hold-delete-btn') || e.target.closest('.med-delete-btn')) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentX = startX;
    currentY = startY;
    hasMovedHorizontally = false;
  }, { passive: true });

  element.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // If moving vertically (scrolling), ignore swipe
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (Math.abs(diffX) > 8) {
      hasMovedHorizontally = true;
    }

    if (diffX < 0 && !isTakenToday) {
      element.style.transform = `translateX(${Math.max(diffX, -80)}px)`;
    } else if (diffX > 0 && isTakenToday) {
      element.style.transform = `translateX(${Math.min(diffX, 80)}px)`;
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    // If the card didn't drag horizontally (e.g. was a tap or hold), do not evaluate swipe thresholds
    if (!hasMovedHorizontally || element.querySelector('.med-hold-delete-btn')) {
      element.style.transform = "translateX(0px)";
      return;
    }

    const diffX = currentX - startX;
    element.style.transform = "translateX(0px)";

    if (diffX < -60 && !isTakenToday) {
      if (!med.history) med.history = [];
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
  });
}



// --- RENDER MEDICATIONS ---
function renderMedications() {
  const medList = document.getElementById("med-list");
  if (!medList) return;
  medList.innerHTML = "";

  const today = typeof getTodayStr === "function" ? getTodayStr() : new Date().toISOString().split("T")[0];

  if (isMedEditMode) {
    medList.classList.add("editing");
  } else {
    medList.classList.remove("editing");
  }

  // Ensure defaults exist on older records
  medications.forEach(med => {
    if (!med.history) med.history = [];
    if (!med.dosage) med.dosage = "100mg";
    if (!med.icon) med.icon = "2-tablets";
  });

  const total = medications.length;
  const takenCount = medications.filter(m => m.history && m.history.includes(today)).length;

  if (statusCounter) {
    statusCounter.textContent = total === 0 ? "None Created" : `${takenCount}/${total} Taken`;
  }

  // Render Vacancy Box if list is empty
  // EMPTY STATE: Render dashed vacancy container with centered label + 3D icon
  if (total === 0) {
    const vacancyBox = document.createElement("div");
    vacancyBox.className = "med-empty-vacancy";
    vacancyBox.innerHTML = `
      <div class="vacancy-label-group">
         <svg width="128pt" height="128pt" version="1.1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="currentColor" >
 <path d="m83.957 23.039h-0.12891c-5.582 0.039063-10.945 2.3281-15.078 6.4648l-37.492 37.492c-1.2305 1.2305-2.125 2.7539-2.6094 4.4297l-5.1211 17.922c-0.25781 0.91016-0.39844 1.8555-0.39844 2.8164 0 7.0547 5.7461 12.801 12.801 12.801 0.94531 0 1.8945-0.12891 2.8164-0.39844l17.922-5.1211c1.6758-0.47266 3.1992-1.3711 4.4297-2.6094l37.785-37.785c3.9805-3.9805 6.1836-9.2812 6.1836-14.926 0-11.637-9.4727-21.105-21.094-21.105zm-2.9961 39.461-27.098 27.098-17.922 5.1211c-1.4062 0-2.5586-1.1523-2.5586-2.5586l5.1211-17.922 28.379-28.379 15.359 15.359zm10.676-10.676-2.1641 2.1641-15.359-15.359 1.8672-1.8672c2.1133-2.1133 4.9297-3.457 7.9102-3.4688h0.0625c6.0039 0 10.867 4.8633 10.867 10.867 0 2.8789-1.1406 5.6445-3.1875 7.6797z"/>
 <path d="m28.559 48.613c2.6641-0.25781 4.6211-2.6367 4.6211-5.3125v-4.9023c0-2.8281 2.293-5.1211 5.1211-5.1211h4.9023c2.6758 0 5.0703-1.957 5.3125-4.6211 0.29297-3.0586-2.0977-5.6211-5.0938-5.6211h-5.1211c-8.4883 0-15.359 6.875-15.359 15.359v5.1211c0 2.9961 2.5742 5.3906 5.6211 5.0938z"/>
 <path d="m84.379 104.96h5.1211c8.4883 0 15.359-6.875 15.359-15.359v-5.1211c0-2.9961-2.5742-5.3906-5.6211-5.0938-2.6641 0.25781-4.6211 2.6367-4.6211 5.3125v4.9023c0 2.8281-2.293 5.1211-5.1211 5.1211h-4.9023c-2.6758 0-5.0547 1.957-5.3125 4.6211-0.29297 3.0586 2.0977 5.6211 5.0938 5.6211z"/>
</svg>


        <span>Tap to Create</span>
      </div>
      <img src="medication-all-types.png" alt="Pill Cluster" class="vacancy-cluster-img" />
    `;

    vacancyBox.addEventListener("click", () => {
      if (typeof openBottomSheet === "function") openBottomSheet();
      else if (modalOverlay) modalOverlay.classList.remove("hidden");
    });

    medList.appendChild(vacancyBox);
    return;
  }


  // Sort items: Pending first, Taken last
  const sortedMeds = [...medications].sort((a, b) => {
    const aTaken = a.history.includes(today);
    const bTaken = b.history.includes(today);
    return aTaken === bTaken ? 0 : aTaken ? 1 : -1;
  });

  sortedMeds.forEach((med) => {
    const isTakenToday = med.history.includes(today);
    const itemColor = med.customColor || (typeof MED_COLOR_PALETTE !== "undefined" && MED_COLOR_PALETTE[med.colorKey]?.main) || "#3883e0";
    const timeDisplay = med.scheduledTime || med.time || "";

    // Safely retrieve icon markup whether named getMedIconMarkup or getIconSVG
    let iconMarkup = "💊";
    if (typeof getMedIconMarkup === "function") {
      iconMarkup = getMedIconMarkup(med.icon);
    } else if (typeof getIconSVG === "function") {
      iconMarkup = getIconSVG(med.icon);
    }

    const li = document.createElement("li");
    li.className = `med-item ${isTakenToday ? "completed" : ""}`;
    li.dataset.id = med.id;

    li.innerHTML = `
      <button class="med-delete-btn" onclick="deleteMedication('${med.id}')">✕</button>
      <div class="med-card-wrapper">
        <div class="med-icon-badge" style="background-color: ${itemColor};">
          ${iconMarkup}
        </div>
        <div class="med-info-stack">
          <div class="med-name-label">${med.name}</div>
          <div class="med-sub-details">
            ${typeof reminderClockIcon !== "undefined" && (med.hasReminder || med.reminder) ? reminderClockIcon : ""}
            <span>${timeDisplay}</span>
            <span>${med.dosage}</span>
          </div>
        </div>
      </div>
      <span class="med-chevron"><svg width="128pt" height="128pt" version="1.1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
 <path d="m58.98 98.277c0.0625 0.33203 0.16797 0.65234 0.29297 0.96094 0.12891 0.30859 0.28125 0.60156 0.46094 0.88281 0.19141 0.28125 0.41016 0.53906 0.64062 0.78125 0.24219 0.23047 0.5 0.44922 0.78125 0.64062 0.28125 0.17969 0.57422 0.33203 0.88281 0.46094 0.30859 0.12891 0.62891 0.23047 0.96094 0.29297s0.66406 0.10156 1 0.10156c1.3438 0 2.6641-0.55078 3.6211-1.4961 0.94531-0.96094 1.4961-2.2773 1.4961-3.6211s-0.55078-2.6641-1.4961-3.6211c-1.1914-1.1914-2.957-1.7266-4.6211-1.3945-0.33203 0.0625-0.65234 0.16797-0.96094 0.29297-0.30859 0.12891-0.60156 0.28125-0.88281 0.46094-0.28125 0.19141-0.53906 0.41016-0.78125 0.64062-0.23047 0.24219-0.44922 0.5-0.64062 0.78125-0.17969 0.28125-0.33203 0.57422-0.46094 0.88281-0.12891 0.30859-0.23047 0.62891-0.29297 0.96094-0.0625 0.33203-0.10156 0.66406-0.10156 1 0 0.33203 0.039063 0.66406 0.10156 1z"/>
 <path d="m59.277 32.68c0.12891 0.30859 0.28125 0.60156 0.46094 0.88281 0.19141 0.28125 0.41016 0.53906 0.64062 0.78125 0.24219 0.23047 0.5 0.44922 0.78125 0.64062 0.28125 0.17969 0.57422 0.33203 0.88281 0.46094 0.30859 0.12891 0.62891 0.23047 0.96094 0.29297 0.33203 0.0625 0.66406 0.10156 1 0.10156 1.3438 0 2.6641-0.55078 3.6211-1.4961 0.94531-0.96094 1.4961-2.2773 1.4961-3.6211s-0.55078-2.6641-1.4961-3.6211c-1.1914-1.1914-2.957-1.7266-4.6211-1.3945-0.33203 0.0625-0.65234 0.16797-0.96094 0.29297-0.30859 0.12891-0.60156 0.28125-0.88281 0.46094-0.28125 0.19141-0.53906 0.41016-0.78125 0.64062-0.23047 0.24219-0.44922 0.5-0.64062 0.78125-0.17969 0.28125-0.33203 0.57422-0.46094 0.88281s-0.23047 0.62891-0.29297 0.96094c-0.0625 0.33203-0.10156 0.66406-0.10156 1 0 0.33203 0.039063 0.66406 0.10156 1 0.0625 0.33203 0.16797 0.65234 0.29297 0.96094z"/>
 <path d="m58.98 65c0.0625 0.33203 0.16797 0.65234 0.29297 0.96094 0.12891 0.30859 0.28125 0.60156 0.46094 0.88281 0.19141 0.28125 0.41016 0.53906 0.64062 0.78125 0.24219 0.23047 0.5 0.44922 0.78125 0.64062 0.28125 0.17969 0.57422 0.33203 0.88281 0.46094 0.30859 0.12891 0.62891 0.23047 0.96094 0.29297s0.66406 0.10156 1 0.10156c1.3438 0 2.6641-0.55078 3.6211-1.4961 0.94531-0.96094 1.4961-2.2773 1.4961-3.6211s-0.55078-2.6641-1.4961-3.6211c-1.1914-1.1914-2.957-1.7266-4.6211-1.3945-0.33203 0.0625-0.65234 0.16797-0.96094 0.29297-0.30859 0.12891-0.60156 0.28125-0.88281 0.46094-0.28125 0.19141-0.53906 0.41016-0.78125 0.64062-0.23047 0.24219-0.44922 0.5-0.64062 0.78125-0.17969 0.28125-0.33203 0.57422-0.46094 0.88281-0.12891 0.30859-0.23047 0.62891-0.29297 0.96094-0.0625 0.33203-0.10156 0.66406-0.10156 1 0 0.33203 0.039063 0.66406 0.10156 1z"/>
</svg></span>
    `;

    if (typeof attachSwipeGesture === "function") {
      attachSwipeGesture(li, med, today);
    }
    if (typeof attachLongPressDelete === "function") {
      attachLongPressDelete(li, med.id);
    }

    medList.appendChild(li);
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

// Clean Checkmark SVG icon for completed calendar days
const calCheckmarkIcon = `
  <svg class="day-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

function renderMedicationCalendar(year, month) {
  const calGrid = document.getElementById("calendar-grid");
  if (!calGrid) return;
  calGrid.innerHTML = "";

  const now = new Date();
  const currentYear = year !== undefined ? year : now.getFullYear();
  const currentMonth = month !== undefined ? month : now.getMonth();
  const todayStr = getTodayStr();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Blank slots for previous month alignment
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "cal-day empty";
    calGrid.appendChild(emptyCell);
  }

  // Populate Month Days
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday = formattedDate === todayStr;

    // Check adherence: are all registered meds taken on this date?
    const hasMeds = medications.length > 0;
    const isFullyCompleted = hasMeds && medications.every(med => (med.history || []).includes(formattedDate));

    const dayEl = document.createElement("div");
    dayEl.className = `cal-day ${isToday ? "today" : ""} ${isFullyCompleted ? "completed-day" : ""}`;
    dayEl.dataset.date = formattedDate;

    // IF completed -> Show Checkmark; ELSE -> Show Day Number
    dayEl.innerHTML = `
      <div class="day-circle">
        ${isFullyCompleted ? calCheckmarkIcon : day}
      </div>
    `;

    calGrid.appendChild(dayEl);
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
// --- REUSABLE TAB NAVIGATION HELPER ---
function navigateToTab(targetTabId) {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  // 1. Update Active Bottom Nav Button (sync bottom bar)
  navButtons.forEach((b) => {
    if (b.dataset.tab === targetTabId) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  // 2. Switch Active View
  tabViews.forEach((view) => {
    if (view.id === targetTabId) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // 3. Update Body/Theme Gradient if you have dynamic themes
  const activeTabBtn = document.querySelector(`.nav-btn[data-tab="${targetTabId}"]`);
  const theme = activeTabBtn?.dataset.theme || targetTabId.replace("view-", "");
  document.body.setAttribute("data-theme", theme);

  if (targetTabId === "view-home") {
    setTimeout(() => {
      if (typeof updateHomeDashboard === "function") updateHomeDashboard();
    }, 50);
  } else if (targetTabId === "view-meds") {
    if (typeof renderMedicationCalendar === "function") renderMedicationCalendar();
  } else if (targetTabId === "view-entries") {
    if (typeof render7DayCalendarStrip === "function") {
      render7DayCalendarStrip(selectedActivitiesDate);
    }
  }

  // Scroll to top of new view
  window.scrollTo({ top: 0, behavior: "instant" });
}

// --- GLOBAL CLICK LISTENER FOR ANY DATA-TAB ELEMENT ---
// This listens to bottom nav buttons AND your new home dashboard cards!
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-tab]");
  if (!trigger) return;

  // If clicked element or its container has data-tab, switch to that view!
  const targetTabId = trigger.dataset.tab;
  if (targetTabId) {
    navigateToTab(targetTabId);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSettings();
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



