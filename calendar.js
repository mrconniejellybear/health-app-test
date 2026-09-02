const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSnapSound() {
  if (audioCtx.state === "suspended") audioCtx.resume();

  // Generate 15ms of organic noise
 const bufferSize = audioCtx.sampleRate * 0.015;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 700;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}




// --- ACTIVITES 7-DAY CALENDAR STRIP LOGIC ---
let selectedActivitiesDate = new Date(); // Defaults to local today

// Helper to get local date string YYYY-MM-DD (prevents UTC date skipping)
function getLocalDateStr(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function render7DayCalendarStrip(centerDate = new Date()) {
  const rowContainer = document.getElementById("calendar-7day-row");
  const monthYearLabel = document.getElementById("strip-month-year");
  if (!rowContainer) return;

  rowContainer.innerHTML = "";

  // 1. Update Header Month / Year
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  if (monthYearLabel) {
    monthYearLabel.textContent = `${monthNames[centerDate.getMonth()]} ${centerDate.getFullYear()}`;
  }

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const localTodayStr = getLocalDateStr(new Date());

  // Inside render7DayCalendarStrip loop in calendar.js:
  for (let offset = -3; offset <= 3; offset++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);

    const isoDate = getLocalDateStr(d);
    const isSelected = offset === 0;
    const isToday = isoDate === localTodayStr;

    // --- DATA CHECK FOR STATUS DOT ---
    // Safe fallbacks to prevent errors if arrays are uninitialized[span_5](start_span)[span_5](end_span)
    const currentMeds = typeof medications !== "undefined" ? medications : [];
    const currentMoods = typeof moodLogs !== "undefined" ? moodLogs : [];
    const currentSymptoms = typeof symptomLogs !== "undefined" ? symptomLogs : [];

    // Check if any logged activity happened on this exact date[span_6](start_span)[span_6](end_span)[span_7](start_span)[span_7](end_span)
    const hasMedTaken = currentMeds.some(m => (m.history || []).includes(isoDate));
    const hasMood = currentMoods.some(m => m.date === isoDate);
    const hasSymptom = currentSymptoms.some(s => s.date === isoDate);

    const isLoggedDay = hasMedTaken || hasMood || hasSymptom; // Add/remove variables as you prefer[span_8](start_span)[span_8](end_span)

    const pill = document.createElement("div");
    pill.className = `day-pill ${isSelected ? "active" : ""} ${isToday ? "is-today" : ""}`;
    pill.dataset.date = isoDate;

    pill.innerHTML = `
      <span class="day-name">${dayNames[d.getDay()]}</span>
      <div class="pill-box">
        <span class="day-num">${d.getDate()}</span>
        <span class="status-dot ${isLoggedDay ? 'has-activity' : ''}"></span>
      </div>
    `;

    // Pill click handler ...

    // Click handler to re-center window on tapped date
    pill.addEventListener("click", () => {
      selectedActivitiesDate = new Date(d);
      render7DayCalendarStrip(selectedActivitiesDate);
      if (typeof playCalendarPopSound === "function") playCalendarPopSound();
      if (typeof playSnapSound === "function") playSnapSound();
    });

    rowContainer.appendChild(pill);
  }
}

// "Today" Button Listener
document.getElementById("strip-today-btn")?.addEventListener("click", () => {
  selectedActivitiesDate = new Date();
  render7DayCalendarStrip(selectedActivitiesDate);
  if (typeof playCalendarPopSound === "function") playCalendarPopSound();
  if (typeof playSnapSound === "function") playSnapSound();
});

// Trigger strip initial render on page load
document.addEventListener("DOMContentLoaded", () => {
  render7DayCalendarStrip(selectedActivitiesDate);
});




// --- MONTHLY CHECK-IN MATRIX RENDERER ---
function renderMonthlyCheckinMatrix(year = 2026, month = 7) { // 7 = August (0-indexed)
  const container = document.getElementById("monthly-pill-matrix");
  const statLabel = document.getElementById("checkin-streak-stat");
  if (!container) return;

  container.innerHTML = "";

  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let completedCount = 0;

  for (let day = 1; day <= totalDays; day++) {
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month + 1).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Safe fallbacks to prevent errors if arrays are uninitialized
    const medList = typeof medications !== "undefined" ? medications : [];
    const medAdh = typeof medAdherenceLogs !== "undefined" ? medAdherenceLogs : {};
    const moods = typeof moodLogs !== "undefined" ? moodLogs : [];
    const symptoms = typeof symptomLogs !== "undefined" ? symptomLogs : [];
    const weights = typeof weightLogs !== "undefined" ? weightLogs : [];

    // Check if any metric had activity on this date
    const hasMed = medList.some(m => (m.history || []).includes(dateStr));
    const hasAdherence = medAdh[dateStr] === "taken";
    const hasMood = moods.some(m => m.date === dateStr);
    const hasSymptom = symptoms.some(s => s.date === dateStr);
    const hasWeight = weights.some(w => w.date === dateStr);

    const isLogged = hasMed || hasAdherence || hasMood || hasSymptom || hasWeight;
    const isFuture = (year === currentYear && month === currentMonth && day > currentDay) || (year > currentYear) || (year === currentYear && month > currentMonth);

    if (isLogged) completedCount++;

    const tick = document.createElement("div");
    tick.className = `pill-tick ${isLogged ? "logged" : ""} ${isFuture ? "future" : ""}`;
    tick.title = dateStr;
    container.appendChild(tick);
  }

  if (statLabel) {
    statLabel.textContent = `${completedCount} / ${totalDays} Days Logged`;
  }
}

// Trigger renders when the DOM loads
document.addEventListener("DOMContentLoaded", () => {
  renderContinuousMonthCalendar(selectedActivitiesDate);
  renderMonthlyCheckinMatrix(2026, 7); // <-- Invokes the matrix for August 2026!
});
