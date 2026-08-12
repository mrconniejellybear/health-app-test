// Web Audio API generator for date clicks
function playDateSelectSound() {
    try {
        const audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.012);

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.012);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.012);
    } catch (e) {
    }
}
// --- DEDICATED CALENDAR STRIP POP SOUND ---
function playCalendarPopSound() {
  try {
    const audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Pure sine wave gives it a round, clean "pop"
    osc.type = "sine";

    // Quick frequency pitch-drop (750 Hz down to 200 Hz in 15 milliseconds)
    osc.frequency.setValueAtTime(750, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.015);

    // Fast volume envelope so it stays snappy
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime); // Volume
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.015);
  } catch (e) {
    // Silently ignore if audio isn't unlocked yet
  }
}




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
      
      playCalendarPopSound(); 
    });
    // "Today" Button Listener
document.getElementById("strip-today-btn")?.addEventListener("click", () => {
  playCalendarPopSound(); // Call it here too!
  selectedActivitiesDate = new Date();
  render7DayCalendarStrip(selectedActivitiesDate);
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



