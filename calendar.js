const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSnapSound() {
  if (audioCtx.state === "suspended") audioCtx.resume();

  // Generate 15ms of organic noise
  const bufferSize = audioCtx.sampleRate * 0.015; 
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // Pure random noise
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  // Filter out low frequencies to make it sound like a crisp snap
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 700;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 0.015);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start();
}




let selectedActivitiesDate = new Date();
let lastSnappedDay = null;

function renderContinuousMonthCalendar(centerDate = new Date()) {
  const track = document.getElementById("calendar-month-track");
  const monthYearLabel = document.getElementById("strip-month-year");
  if (!track) return;

  track.innerHTML = "";

  const year = centerDate.getFullYear();
  const month = centerDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  if (monthYearLabel) {
    monthYearLabel.textContent = `${monthNames[month]} ${year}`;
  }

  const selectedStr = centerDate.toISOString().split("T")[0];

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const isoDate = d.toISOString().split("T")[0];
    const isSelected = isoDate === selectedStr;

    const pill = document.createElement("div");
    pill.className = `day-pill ${isSelected ? "active" : ""}`;
    pill.dataset.date = isoDate;
    pill.dataset.dayNum = day;

    pill.innerHTML = `
      <span class="day-name">${dayNames[d.getDay()]}</span>
      <div class="pill-box">
        <span class="day-num">${d.getDate()}</span>
        <span class="status-dot"></span>
      </div>
    `;

    // Click handler for direct taps
    pill.addEventListener("click", () => {
      document.querySelectorAll(".calendar-month-track .day-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

      selectedActivitiesDate = new Date(d);
      if (typeof playSnapSound === "function") playSnapSound();
    });

    track.appendChild(pill);
  }

  // Scroll to active date into view
  setTimeout(() => {
    const activePill = track.querySelector(".day-pill.active");
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      lastSnappedDay = activePill.dataset.dayNum;
    }
  }, 60);

  // Attach scroll audio listener
  attachScrollAudioListener(track);
}

// Sound feedback while dragging/swiping
function attachScrollAudioListener(track) {
  track.addEventListener("scroll", () => {
    const trackCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
    const pills = track.querySelectorAll(".day-pill");

    let closestPill = null;
    let minDistance = Infinity;

    pills.forEach((pill) => {
      const rect = pill.getBoundingClientRect();
      const pillCenter = rect.left + rect.width / 2;
      const distance = Math.abs(trackCenter - pillCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestPill = pill;
      }
    });

    if (closestPill && closestPill.dataset.dayNum !== lastSnappedDay && minDistance < 24) {
      lastSnappedDay = closestPill.dataset.dayNum;
      if (typeof playSnapSound === "function") {
        playCalendarPopSound();
      }
    }
  }, { passive: true });
}


// "Today" Button Listener
document.getElementById("strip-today-btn")?.addEventListener("click", () => {
  if (typeof playSnapSound === "function") playSnapSound();
  selectedActivitiesDate = new Date();
  renderContinuousMonthCalendar(selectedActivitiesDate);
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
