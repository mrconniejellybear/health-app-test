const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSnapSound() {
  try {
    if (audioCtx.state === "suspended") audioCtx.resume();
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
  } catch (e) {}
}

function playCalendarPopSound() {
if (audioCtx.state === "suspended") audioCtx.resume();
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

// Renamed to avoid colliding with script.js
const calendarStripCheckmarkIcon = `
  <svg class="day-check-circle" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
    <path d="m423.28-416.37-79.78-79.78q-12.43-12.44-31.35-12.44-18.91 0-31.35 12.44-12.43 12.43-12.31 31.35.12 18.91 12.55 31.34l110.18 110.18q13.76 13.67 32.11 13.67 18.34 0 32.02-13.67L677.76-545.7q12.44-12.43 12.44-31.22 0-18.8-12.44-31.23-12.43-12.44-31.35-12.44-18.91 0-31.34 12.44L423.28-416.37ZM480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Z"/>
  </svg>
`;

let selectedActivitiesDate = new Date();

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

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  if (monthYearLabel) {
    monthYearLabel.textContent = `${monthNames[centerDate.getMonth()]} ${centerDate.getFullYear()}`;
  }

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const localTodayStr = getLocalDateStr(new Date());

  for (let offset = -3; offset <= 3; offset++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);

    const isoDate = getLocalDateStr(d);
    const isSelected = offset === 0;
    const isToday = isoDate === localTodayStr;

    // Verify activity logs across categories
    const currentMeds = typeof medications !== "undefined" ? medications : [];
    const currentMedAdh = typeof medAdherenceLogs !== "undefined" ? medAdherenceLogs : {};
    const currentMoods = typeof moodLogs !== "undefined" ? moodLogs : [];
    const currentSymptoms = typeof symptomLogs !== "undefined" ? symptomLogs : [];
    const currentWeights = typeof weightLogs !== "undefined" ? weightLogs : [];

    const hasMedTaken = currentMeds.some(m => (m.history || []).includes(isoDate));
    const hasAdherence = currentMedAdh[isoDate] === "taken";
    const hasMood = currentMoods.some(m => m.date === isoDate);
    const hasSymptom = currentSymptoms.some(s => s.date === isoDate);
    const hasWeight = currentWeights.some(w => w.date === isoDate);

    const hasData = hasMedTaken || hasAdherence || hasMood || hasSymptom || hasWeight;

    const pill = document.createElement("div");
    pill.className = `day-pill ${isSelected ? "active" : ""} ${isToday ? "is-today" : ""}`;
    pill.dataset.date = isoDate;

    pill.innerHTML = `
      <span class="day-name">${dayNames[d.getDay()]}</span>
      <div class="pill-box">
        ${hasData ? calendarStripCheckmarkIcon : `<span class="day-num">${d.getDate()}</span>`}
      </div>
    `;


    pill.addEventListener("click", () => {
      selectedActivitiesDate = new Date(d);
      render7DayCalendarStrip(selectedActivitiesDate);
      playCalendarPopSound();
      playSnapSound();
    });

    rowContainer.appendChild(pill);
  }
}

document.getElementById("strip-today-btn")?.addEventListener("click", () => {
  selectedActivitiesDate = new Date();
  render7DayCalendarStrip(selectedActivitiesDate);
  playCalendarPopSound();
  playSnapSound();
});

function renderMonthlyCheckinMatrix(year = 2026, month = 7) {
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

    const medList = typeof medications !== "undefined" ? medications : [];
    const medAdh = typeof medAdherenceLogs !== "undefined" ? medAdherenceLogs : {};
    const moods = typeof moodLogs !== "undefined" ? moodLogs : [];
    const symptoms = typeof symptomLogs !== "undefined" ? symptomLogs : [];
    const weights = typeof weightLogs !== "undefined" ? weightLogs : [];

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

document.addEventListener("DOMContentLoaded", () => {
  render7DayCalendarStrip(selectedActivitiesDate);
  renderMonthlyCheckinMatrix(2026, 7);
});
