// --- CARD REORDERING CONTROLLER (Touch + Desktop Mouse) ---
let isReorderMode = false;
let draggedCard = null;

function initCardReordering(containerSelector = "#view-diet") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(".card");

  cards.forEach((card) => {
    if (card.dataset.reorderBound === "true") return;
    card.dataset.reorderBound = "true";

    // -------------------------------------------------------------
    // 1. DESKTOP MOUSE DRAG LISTENERS
    // -------------------------------------------------------------
    card.addEventListener("dragstart", (e) => {
      if (!isReorderMode) { e.preventDefault(); return; }
      draggedCard = card;
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.id || "card");
    });

    card.addEventListener("dragend", () => {
      if (draggedCard) draggedCard.classList.remove("dragging");
      cards.forEach((c) => c.classList.remove("drag-over"));
      draggedCard = null;
      saveCardOrder(container);
    });

    card.addEventListener("dragover", (e) => {
      if (!isReorderMode || !draggedCard || draggedCard === card) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      card.classList.add("drag-over");
    });

    card.addEventListener("dragleave", () => {
      card.classList.remove("drag-over");
    });

    card.addEventListener("drop", (e) => {
      if (!isReorderMode || !draggedCard || draggedCard === card) return;
      e.preventDefault();
      card.classList.remove("drag-over");
      performCardSwap(draggedCard, card);
      saveCardOrder(container);
    });

    // -------------------------------------------------------------
    // 2. MOBILE TOUCH LISTENERS (DevTools Mobile + Smartphones)
    // -------------------------------------------------------------
    card.addEventListener("touchstart", (e) => {
      if (!isReorderMode) return;
      draggedCard = card;
      card.classList.add("dragging");
    }, { passive: true });

    card.addEventListener("touchmove", (e) => {
      if (!isReorderMode || !draggedCard) return;

      const touch = e.touches[0];
      // Detect card currently beneath the user's thumb
      const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetCard = elementUnderTouch ? elementUnderTouch.closest(".card") : null;

      cards.forEach((c) => c.classList.remove("drag-over"));

      if (targetCard && targetCard !== draggedCard && targetCard.parentNode === draggedCard.parentNode) {
        targetCard.classList.add("drag-over");
      }
    }, { passive: false });

    card.addEventListener("touchend", (e) => {
      if (!isReorderMode || !draggedCard) return;

      const touch = e.changedTouches[0];
      const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetCard = elementUnderTouch ? elementUnderTouch.closest(".card") : null;

      if (targetCard && targetCard !== draggedCard && targetCard.parentNode === draggedCard.parentNode) {
        performCardSwap(draggedCard, targetCard);
      }

      draggedCard.classList.remove("dragging");
      cards.forEach((c) => c.classList.remove("drag-over"));
      draggedCard = null;
      saveCardOrder(container);
    });
  });
}

// Swaps the DOM elements and triggers feedback
function performCardSwap(movingCard, targetCard) {
  const parent = targetCard.parentNode;
  if (!parent) return;

  const allCards = Array.from(parent.querySelectorAll(".card"));
  const movingIndex = allCards.indexOf(movingCard);
  const targetIndex = allCards.indexOf(targetCard);

  if (movingIndex < targetIndex) {
    parent.insertBefore(movingCard, targetCard.nextSibling);
  } else {
    parent.insertBefore(movingCard, targetCard);
  }

  if (typeof playClickSound === "function") playClickSound();
  if (navigator.vibrate) navigator.vibrate(12);
}

// Toggle Reorder Mode Button
function toggleCardReorderMode(btnElement, containerSelector = "#view-diet") {
  isReorderMode = !isReorderMode;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  initCardReordering(containerSelector);

  const cards = container.querySelectorAll(".card");
  cards.forEach((card) => {
    card.setAttribute("draggable", isReorderMode ? "true" : "false");
    card.classList.toggle("is-draggable", isReorderMode);
  });

  if (btnElement) {
    btnElement.classList.toggle("active", isReorderMode);
  }

  if (typeof playClickSound === "function") playClickSound();
}

// LocalStorage Persistence
function saveCardOrder(container) {
  if (!container || !container.id) return;
  const cardIds = Array.from(container.querySelectorAll(".card"))
    .map((card) => card.id)
    .filter((id) => Boolean(id));

  localStorage.setItem(`card_order_${container.id}`, JSON.stringify(cardIds));
}

function restoreCardOrder(containerId = "view-diet") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const savedOrder = JSON.parse(localStorage.getItem(`card_order_${containerId}`));
  if (!savedOrder || !Array.isArray(savedOrder)) return;

  savedOrder.forEach((id) => {
    const card = document.getElementById(id);
    if (card && card.parentElement === container) {
      container.appendChild(card);
    }
  });
}
