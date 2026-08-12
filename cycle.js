function initPeriodColorSlider() {
  const slider = document.getElementById('period-color-slider');
  const indicator = document.getElementById('slider-arrow');
  const totalSegments = 3; 
  let currentSegment = 0;
  let isDragging = false;

  // 1. Initialize Audio Context (Safely scoped inside this function)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Your Custom Organic Snap Sound
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
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 0.015);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
  }

  // 2. Dragging & Snapping Logic
  function updateSliderPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    
    // Keep constraints within the slider bounds
    x = Math.max(0, Math.min(x, rect.width)); 
    
    // Calculate which segment (0, 1, or 2) we are currently in
    const segmentWidth = rect.width / totalSegments;
    const newSegment = Math.floor(x / segmentWidth);
    const snappedSegment = Math.min(newSegment, totalSegments - 1);
    
    // If we crossed into a new segment, snap it and play the noise
    if (snappedSegment !== currentSegment) {
      currentSegment = snappedSegment;
      
      // Calculate the center percentage of the current segment
      const percentage = ((currentSegment * segmentWidth) + (segmentWidth / 2)) / rect.width * 100;
      indicator.style.left = `${percentage}%`;
      
      // Trigger your custom click!
      playClickSound();
    }
  }

  // 3. Event Listeners for Mouse
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSliderPosition(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 4. Event Listeners for Touch (Mobile)
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevents the screen from scrolling while sliding
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: false });
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPeriodColorSlider);
