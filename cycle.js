function initPeriodColorSlider() {
  const slider = document.getElementById('period-color-slider');
  const indicator = document.getElementById('slider-arrow');
  
  // New DOM elements for the info card
  const infoTitle = document.getElementById('color-info-title');
  const infoDesc = document.getElementById('color-info-desc');
  const infoLink = document.getElementById('color-info-link');

  const totalSegments = 4; 
  let currentSegment = 0;
  let isDragging = false;
  
  // 1. The Content Data
  const colorData = [
    {
      title: "Bright",
      desc: "Bright red hues usually appear at the beginning of a period, and indicate the flow of fresh blood. Its duration can vary: for some, it lasts the first 1-3 days, for others, it spans the entire period. Both are acceptable, healthy patterns during a typical cycle.",
      link: "https://www.medicalnewstoday.com/articles/324848#bright-red"
    },
    {
      title: "Medium",
      desc: "Medium red hues indicate a normal, fresh flow of blood actively leaving the uterus. The shade reflects how long the blood takes to exit the body; medium red means it is relatively fresh with minimal oxidation. Hues within this range are healthy during a typical cycle.",
      link: "https://www.healthline.com/health/womens-health/period-blood"
    },
    {
      title: "Dark",
      desc: "Dark red hues are a result of that blood has remained in the uterus longer, giving it time to oxidize (react to oxygen). It is a common color, and completely healthy to see this at both the beginning or the end of your period, when your flow is slower.",
      link: "https://www.healthline.com/health/womens-health/period-blood"
    },
    {
      title: "Darkest",
      desc: "Black to brown hues are merely leftover blood. They are typical at the beginning or ends of a cycle, when flow is slow. If this color lasts longer than the duration of your typical period, and you have not started/changed birth controls, consult a physician",
      link: "https://www.medicalnewstoday.com/articles/324848#brown-or-dark-red"
    }
  ];

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playClickSound() {
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
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 0.015);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  }

  function updateSliderPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width)); 
    
    const segmentWidth = rect.width / totalSegments;
    const newSegment = Math.floor(x / segmentWidth);
    const snappedSegment = Math.min(newSegment, totalSegments - 1);
    
    if (snappedSegment !== currentSegment) {
      currentSegment = snappedSegment;
      
      const percentage = ((currentSegment * segmentWidth) + (segmentWidth / 2)) / rect.width * 100;
      indicator.style.left = `${percentage}%`;
      playClickSound();
      
      // 2. Update the Info Card Content dynamically!
      infoTitle.innerText = colorData[currentSegment].title;
      infoDesc.innerText = colorData[currentSegment].desc;
      infoLink.href = colorData[currentSegment].link;
    }
  }

  // Event Listeners (Same as before)
  slider.addEventListener('mousedown', (e) => { isDragging = true; updateSliderPosition(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (isDragging) updateSliderPosition(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });
  slider.addEventListener('touchstart', (e) => { isDragging = true; updateSliderPosition(e.touches[0].clientX); });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: false });
  window.addEventListener('touchend', () => { isDragging = false; });
}

document.addEventListener('DOMContentLoaded', initPeriodColorSlider);


// --- CYCLE CARDS VISIBILITY CONTROLLER ---
const DEFAULT_CYCLE_CARD_VISIBILITY = {
  "card-cycle-symptoms": true,
  "card-cycle-flow": true,
  "card-cycle-discharge": true,
  "card-cycle-bc": true,
  "card-cycle-sex": true
};

let cycleCardVisibility = JSON.parse(localStorage.getItem("cycle_card_visibility")) || DEFAULT_CYCLE_CARD_VISIBILITY;

// 1. Open / Close Modal
function openCycleDisplayModal() {
  const modal = document.getElementById("cycle-display-modal");
  if (!modal) return;

  // Sync checkboxes with current state
  const checkboxes = modal.querySelectorAll('input[type="checkbox"][data-card]');
  checkboxes.forEach((cb) => {
    const cardId = cb.dataset.card;
    cb.checked = cycleCardVisibility[cardId] !== false;
  });

  modal.classList.remove("hidden");
  if (typeof playClickSound === "function") playClickSound();
}

function closeCycleDisplayModal() {
  const modal = document.getElementById("cycle-display-modal");
  if (modal) modal.classList.add("hidden");
}

// 2. Apply Visibility to DOM Cards
function applyCycleCardVisibility() {
  Object.keys(cycleCardVisibility).forEach((cardId) => {
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;

    if (cycleCardVisibility[cardId]) {
      cardEl.classList.remove("card-hidden");
    } else {
      cardEl.classList.add("card-hidden");
    }
  });
}

// 3. Form Submit Listener & Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Apply saved visibility on load
  applyCycleCardVisibility();

  const displayForm = document.getElementById("cycle-display-form");
  if (displayForm) {
    displayForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const checkboxes = displayForm.querySelectorAll('input[type="checkbox"][data-card]');
      checkboxes.forEach((cb) => {
        const cardId = cb.dataset.card;
        cycleCardVisibility[cardId] = cb.checked;
      });

      // Save to localStorage & update DOM
      localStorage.setItem("cycle_card_visibility", JSON.stringify(cycleCardVisibility));
      applyCycleCardVisibility();
      closeCycleDisplayModal();

      if (typeof playLogSound === "function") playLogSound();
      if (navigator.vibrate) navigator.vibrate(10);
    });
  }
});
