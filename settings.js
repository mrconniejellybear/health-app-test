// --- SETTINGS CONTROLLER ---
function initSettings() {
  // 1. Drawer Navigation (Slide-in /// views)
  document.querySelectorAll("[data-open-drawer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const drawerId = btn.dataset.openDrawer;
      const drawer = document.getElementById(drawerId);
      if (drawer) drawer.classList.add("open");
      if (typeof playClickSound === "function") playClickSound();
    });
  });

  document.querySelectorAll("[data-close-drawer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const openDrawer = btn.closest(".settings-drawer");
      if (openDrawer) openDrawer.classList.remove("open");
      if (typeof playClickSound === "function") playClickSound();
    });
  });

  // 2. Display on Homepage Toggles
  const displayToggles = document.querySelectorAll('.switch input[type="checkbox"]');
  displayToggles.forEach((toggle) => {
    const targetTabId = toggle.dataset.target;
    if (!targetTabId) return;

    // Load saved visibility state
    const savedState = localStorage.getItem(`display_${targetTabId}`);
    if (savedState !== null) {
      const isVisible = savedState === "true";
      toggle.checked = isVisible;
      const navBtn = document.querySelector(`.nav-btn[data-tab="${targetTabId}"]`);
      if (navBtn) navBtn.style.display = isVisible ? "flex" : "none";
    }

    // Toggle event listener
    toggle.addEventListener("change", (e) => {
      const isVisible = e.target.checked;
      const navBtn = document.querySelector(`.nav-btn[data-tab="${targetTabId}"]`);
      if (navBtn) navBtn.style.display = isVisible ? "flex" : "none";
      localStorage.setItem(`display_${targetTabId}`, isVisible ? "true" : "false");
    });
  });

  // 3. Demographic Data Management
  const demoAge = document.getElementById("demo-age");
  const demoGender = document.getElementById("demo-gender");
  const demoHeight = document.getElementById("demo-height");
  const demoWeight = document.getElementById("demo-weight");
  const saveDemoBtn = document.getElementById("save-demographics-btn");

  // Load saved demographics
  const savedDemographics = JSON.parse(localStorage.getItem("healthApp_demographics")) || {};
  if (demoAge && savedDemographics.age) demoAge.value = savedDemographics.age;
  if (demoGender && savedDemographics.gender) demoGender.value = savedDemographics.gender;
  if (demoHeight && savedDemographics.height) demoHeight.value = savedDemographics.height;
  if (demoWeight && savedDemographics.weight) demoWeight.value = savedDemographics.weight;

  // Save demographics handler
  if (saveDemoBtn) {
    saveDemoBtn.addEventListener("click", () => {
      const demographics = {
        age: demoAge ? demoAge.value : "",
        gender: demoGender ? demoGender.value : "",
        height: demoHeight ? demoHeight.value : "",
        weight: demoWeight ? demoWeight.value : ""
      };

      localStorage.setItem("healthApp_demographics", JSON.stringify(demographics));
      if (typeof playLogSound === "function") playLogSound();

      // Close drawer after saving
      const openDrawer = saveDemoBtn.closest(".settings-drawer");
      if (openDrawer) openDrawer.classList.remove("open");
    });
  }

  // 4. Data Export Actions
  const exportAllBtn = document.getElementById("btn-export-all");
  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      const fullBackup = {
        medications: JSON.parse(localStorage.getItem("healthApp_medications")) || [],
        moods: JSON.parse(localStorage.getItem("healthApp_moodLogs")) || [],
        weights: JSON.parse(localStorage.getItem("healthApp_weightLogs")) || [],
        cycle: JSON.parse(localStorage.getItem("healthApp_symptomLogs")) || [],
        demographics: JSON.parse(localStorage.getItem("healthApp_demographics")) || {}
      };

      downloadJsonFile(fullBackup, `GoodHealth_AllData_${new Date().toISOString().split("T")[0]}.json`);
    });
  }

  const exportSelectedBtn = document.getElementById("btn-export-selected");
  if (exportSelectedBtn) {
    exportSelectedBtn.addEventListener("click", () => {
      const selectedTopics = Array.from(document.querySelectorAll('input[name="export-topic"]:checked')).map(cb => cb.value);
      const partialBackup = {};

      if (selectedTopics.includes("meds")) partialBackup.medications = JSON.parse(localStorage.getItem("healthApp_medications")) || [];
      if (selectedTopics.includes("moods")) partialBackup.moods = JSON.parse(localStorage.getItem("healthApp_moodLogs")) || [];
      if (selectedTopics.includes("cycle")) partialBackup.cycle = JSON.parse(localStorage.getItem("healthApp_symptomLogs")) || [];
      if (selectedTopics.includes("weight")) partialBackup.weights = JSON.parse(localStorage.getItem("healthApp_weightLogs")) || [];

      downloadJsonFile(partialBackup, `GoodHealth_Export_${new Date().toISOString().split("T")[0]}.json`);
    });
  }

  // 5. Clear Account Data
  const clearDataBtn = document.getElementById("btn-clear-data");
  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to clear all account data? This cannot be undone.");
      if (confirmed) {
        localStorage.clear();
        location.reload();
      }
    });
  }
}

// Helper: Download JSON
function downloadJsonFile(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
