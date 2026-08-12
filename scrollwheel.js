const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
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
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start();
}






// 1. Mood Configuration Array (Easily add/remove items anytime!)
const moodConfig = [

  { id: "neutral", label: "Neutral", score: 3, color: "rgba(148,163,184,0.3)", primaryColor: "#94a3b8", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm20 180h240v-60H360v60Zm-36 228.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "okay", label: "Okay", score: 3, color: "#f6d50040", primaryColor: "#ffd900", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "happy", label: "Happy", score: 4, color: "#fceabe", primaryColor: "#ffd000", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "excited", label: "Excited", score: 6, color: "#ffa2005e", primaryColor: "#ffb700", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M603.5-298.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM312-520l44-42 42 42 42-42-84-86-86 86 42 42Zm250 0 42-42 44 42 42-42-86-86-84 86 42 42ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "proud", label: "Proud", score: 6, color: "#fdc594", primaryColor: "#ff8c00", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-480v80q0 66 47 113t113 47q66 0 113-47t47-113v-80H320Zm160 180q-42 0-71-29t-29-71v-20h200v20q0 42-29 71t-71 29ZM272.5-652.5Q243-625 231-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T340-680q-38 0-67.5 27.5Zm280 0Q523-625 511-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T620-680q-38 0-67.5 27.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "loved", label: "Loved", score: 6, color: "#fd94d8", primaryColor: "#ff00d0", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M340-520q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM756-640 616-780q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T920-837q0 15-6 30t-18 27L756-640ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880q10 0 19.5.5T519-878q-5 17-7.5 34.5T509-807q0 53 20.5 98.5T585-629q-11 8-18 21t-7 28q0 25 17.5 42.5T620-520q23 0 39.5-15t19.5-37q18 6 37.5 9t39.5 3q29 0 57-7t53-19q7 26 10.5 52t3.5 54q0 83-31.5 156T763-197q-54 54-127 85.5T480-80q-83 0-156-31.5Z"/></svg>` },

    { id: "relaxed", label: "Relaxed", score: 5, color: "#e600f649", primaryColor: "#a900bc", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-260q39 0 75-17.5t67-52.5l-44-40q-22 24-47 36.5T480-321q-26 0-51-12.5T382-370l-44 40q32 35 67.5 52.5T480-260ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Zm86-399q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T340-540q-21 0-33.5-17.5T289-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Zm280 0q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T620-540q-21 0-33.5-17.5T569-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Z"/></svg>` },

    { id: "tired", label: "Tired", score: 2, color: "#6b00f649", primaryColor: "#5a00d7", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M366.15-346.15h227.7v-47.7h-227.7v47.7Zm-34.29 216.23q-69.37-29.92-120.68-81.21-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100q-78.84 0-148.21-29.92Zm10.06-483.93q-29.3 0-54.11 15.89-24.81 15.88-42.04 40.42l40 26.46q10.77-14.23 24.96-24.34 14.19-10.12 31.19-10.12t31.2 9.92q14.19 9.93 24.96 23.54l40-26.46q-17.23-23.92-42.18-39.61-24.95-15.7-53.98-15.7Zm276.16 0q-29.31 0-54.12 15.89-24.81 15.88-42.04 40.42l40 26.46q10.77-13.61 24.96-23.73 14.2-10.11 31.2-10.11t31.5 9.8q14.5 9.81 24.65 24.04l40-26.46q-17.23-24.54-42.18-40.42-24.94-15.89-53.97-15.89Z"/></svg>` },

  { id: "embarrassed", label: "Embarrassed", score: 1, color: "#22b28959", primaryColor: "#00b05b", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM298-456l143-104-143-104-36 48 77 56-77 56 36 48Zm122 178 60-60 60 60 60-60 39 39 42-42-81-81-60 60-60-60-60 60-60-60-81 81 42 42 39-39 60 60Zm242-178 36-48-77-56 77-56-36-48-143 104 143 104Z"/></svg>` },

  { id: "idk", label: "Lost", score: 1, color: "#12aeab59", primaryColor: "#26abb2", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M513.5-254.5Q528-269 528-290t-14.5-35.5Q499-340 478-340t-35.5 14.5Q428-311 428-290t14.5 35.5Q457-240 478-240t35.5-14.5ZM442-394h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>` },

  { id: "angry", label: "Angry", score: 1, color: "rgba(208, 55, 24, 0.39)", primaryColor: "#eb4200", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm60-444 20-12q2 24 19 40t41 16q25 0 42.5-17.5T680-540q0-15-7-28.5T654-590l26-15-20-35-140 80 20 36Zm-120 0 20-36-140-80-20 35 26 15q-12 8-19 21.5t-7 28.5q0 25 17.5 42.5T340-480q24 0 41-16t19-40l20 12Zm60 84q-71 0-125 45.5T279-280h402q-22-69-76-114.5T480-440Z"/></svg>` },

  { id: "anxious", label: "Anxious", score: 1, color: "#fc73e566", primaryColor: "#ff63b1", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M452-240h56q55 0 93.5-35t38.5-85q0-50-38.5-85T508-480h-56q-55 0-93.5 35T320-360q0 50 38.5 85t93.5 35Zm0-60q-30 0-51-17.5T380-360q0-25 21-42.5t51-17.5h56q30 0 51 17.5t21 42.5q0 25-21 42.5T508-300h-56ZM240-560h80q50 0 85-35t35-85h-60q0 25-17.5 42.5T320-620h-80v60Zm400 0h80v-60h-80q-25 0-42.5-17.5T580-680h-60q0 50 35 85t85 35ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

   { id: "overwhelmed", label: "Overwhelmed", score: 1, color: "#d61b2e6d", primaryColor: "#e42c38", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M356.5-381.5Q301-343 276-280h408q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5ZM312-480l44-42 42 42 42-42-42-42 42-44-42-42-42 42-44-42-42 42 42 44-42 42 42 42Zm250 0 42-42 44 42 42-42-42-42 42-44-42-42-44 42-42-42-42 42 42 44-42 42 42 42ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

    { id: "depressed", label: "Depressed", score: 1, color: "#313f5085", primaryColor: "#2c3241", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M250-320h60v-10q0-71 49.5-120.5T480-500q71 0 120.5 49.5T650-330v10h60v-10q0-96-67-163t-163-67q-96 0-163 67t-67 163v10Zm34-270q41-6 86.5-32t72.5-59l-46-38q-20 24-55.5 44T276-650l8 60Zm392 0 8-60q-30-5-65.5-25T563-719l-46 38q27 33 72.5 59t86.5 32ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

   { id: "dissapointed", label: "Dissapointed", score: 2, color: "#1741a385", primaryColor: "#113188", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h408q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

     { id: "sad", label: "Sad", score: 2, color: "#1a91d680", primaryColor: "#3883e0", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

];

let currentRotationAngle = 0;
let startAngle = 0;
let isDragging = false;
let activeMoodIndex = 0;

// Example helper to read active wheel choice in your main script
function getSelectedRotaryMood() {
  return moodConfig[activeMoodIndex];
}


// Initialize Rotary Wheel
function initRotaryWheel() {
  const wheel = document.getElementById("rotary-wheel");
  if (!wheel) return;

  wheel.innerHTML = "";
  const total = moodConfig.length;
  const radius = 132; // Perfect radius alignment for 300px wheel!

  moodConfig.forEach((item, index) => {
    const slotAngle = (index / total) * 360;
    const angleRad = (slotAngle - 90) * (Math.PI / 180);

    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;

    const slot = document.createElement("div");
    slot.className = "emoji-slot";
    slot.dataset.index = index;
    // Center alignment offset
    slot.style.transform = `translate(${x}px, ${y}px)`;
    slot.innerHTML = item.svg;

    wheel.appendChild(slot);
  });

  attachRotaryPhysics();
  updateRotarySelection(0);
}


function attachRotaryPhysics()
{
  const viewport = document.getElementById("rotary-viewport");
  const wheel = document.getElementById("rotary-wheel");
  if (!viewport || !wheel) return;

  function getAngle(e){
    const rect = viewport.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    return radians * (180 / Math.PI);}

  function onStart(e) {
  isDragging = true;
    wheel.classList.remove("snapping");
    startAngle = getAngle(e) - currentRotationAngle;
  }
   function onMove(e) {
   if (!isDragging) return;
   const angle = getAngle(e);
   currentRotationAngle = angle - startAngle;
    wheel.style.transform = `translate(-50%, 0) rotate(${currentRotationAngle}deg)`;
;

    // Keep child SVG emojis facing 100% upright!
    const slots = wheel.querySelectorAll(".emoji-slot");
    slots.forEach(slot => {
      slot.style.transform = slot.style.transform.replace(/rotate\([^)]*\)/g, "") + ` rotate(${-currentRotationAngle}deg)`;
    });

    calculateActiveFocalEmoji();
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    wheel.classList.add("snapping");

    // 4. Snapping physics to nearest emoji slot
    const total = moodConfig.length;
    const step = 360 / total;
    
    // Calculate nearest slot index
    let normalized = (-currentRotationAngle) % 360;
    if (normalized < 0) normalized += 360;
    
    activeMoodIndex = Math.round(normalized / step) % total;
    currentRotationAngle = -activeMoodIndex * step;

    // Snap Wheel
    wheel.style.transform = `translate(-50%, 0) rotate(${currentRotationAngle}deg)`;
;

    // Snap upright rotations
    const slots = wheel.querySelectorAll(".emoji-slot");
    slots.forEach(slot => {
      slot.style.transform = slot.style.transform.replace(/rotate\([^)]*\)/g, "") + ` rotate(${-currentRotationAngle}deg)`;
    });

    updateRotarySelection(activeMoodIndex);

    // Trigger haptic click on mobile devices
    if (navigator.vibrate) navigator.vibrate(12);
  }

  viewport.addEventListener("touchstart", onStart, { passive: true });
  viewport.addEventListener("touchmove", onMove, { passive: true });
  viewport.addEventListener("touchend", onEnd);

  viewport.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

// Calculate active focal emoji while spinning
function calculateActiveFocalEmoji() {
  const total = moodConfig.length;
  const step = 360 / total;
  let normalized = (-currentRotationAngle) % 360;
  if (normalized < 0) normalized += 360;

  const nearestIndex = Math.round(normalized / step) % total;
  
  // When the wheel passes a new slot, trigger the tick!
  if (nearestIndex !== activeMoodIndex) {
    activeMoodIndex = nearestIndex;
    updateRotarySelection(activeMoodIndex);
    
    // 🔊 Play the sound effect!
    playClickSound();

    // Soft vibration for mobile tactile feel
    if (navigator.vibrate) navigator.vibrate(5);
  }
}


// 5. Update UI Title, Arc Color & Active Highlights
function updateRotarySelection(index) {
  const activeMood = moodConfig[index];
  const label = document.getElementById("rotary-label");
  const glow = document.getElementById("rotary-glow");
  const wheel = document.getElementById("rotary-wheel");

  if (label) label.textContent = activeMood.label;
  if (glow) glow.style.background = `radial-gradient(circle, ${activeMood.color} 0%, rgba(255,255,255,0) 70%)`;
  if (wheel) wheel.style.borderColor = activeMood.color;

  const slots = document.querySelectorAll(".emoji-slot");
  slots.forEach((slot, i) => {
    if (i === index) {
      slot.classList.add("active");
      slot.querySelector("svg").style.color = activeMood.primaryColor;
    } else {
      slot.classList.remove("active");
      slot.querySelector("svg").style.color = "#fff";
    }
  });
}

// 6. Hook up Save Button to existing moodLogs & LocalStorage engine
document.getElementById("save-mood-btn")?.addEventListener("click", () => {
  const activeMood = moodConfig[activeMoodIndex];
  
  moodLogs.push({
    date: new Date().toISOString().split("T")[0],
    score: activeMood.score,
    label: activeMood.label,
    mood: activeMood.label // 👈 Backup key so all filter functions detect it
  });

  saveAppState();

  // Play audio feedback
  if (typeof playLogSound === "function") playLogSound();

  // Force full UI refresh across tabs
  if (typeof renderMoodGraph === "function") renderMoodGraph();
  if (typeof updateHomeDashboard === "function") updateHomeDashboard();

  // If home chart instance exists, force Chart.js to recalculate data
  if (typeof homePieChartInstance !== "undefined" && homePieChartInstance !== null) {
    homePieChartInstance.update();
  }

  alert(`Logged mood: ${activeMood.label}`);
  
});



// Run initialization on DOM load
document.addEventListener("DOMContentLoaded", initRotaryWheel);












