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

// Trigger initial render on page load
document.addEventListener("DOMContentLoaded", () => {
  renderContinuousMonthCalendar(selectedActivitiesDate);




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



