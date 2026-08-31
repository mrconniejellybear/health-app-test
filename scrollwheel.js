// ==========================================
// --- ROTARY WHEEL & MOOD DRAWER ENGINE ---
// ==========================================

// 1. Dynamic Subtitle Prompt Variations
const moodPrompts = [
  "I'm feeling...",
  "I feel...",
  "Right now, I'm...",
  "Right now, I feel...",
  "I am...",
  "In this moment, I'm...",
  "My mood is...",
  "Currently feeling...",
  "Today I'm...",
  "Today I feel..."
];

function updateMoodSubtitle() {
  const subtitleEl = document.getElementById("rotary-subtitle") || document.querySelector(".rotary-subtitle");
  if (!subtitleEl) return;
  const randomIndex = Math.floor(Math.random() * moodPrompts.length);
  subtitleEl.textContent = moodPrompts[randomIndex];
}

// 2. Complete Emotion Configuration Array
const moodConfig = [
  { id: "fine", label: "Fine", score: 3, color: "rgba(146, 161, 182, 0.35)", primaryColor: "#bcc5d4", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm20 180h240v-60H360v60Zm-36 228.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "happy", label: "Happy", score: 4, color: "#f8dd673c", primaryColor: "#ffd000", svg: 
    `<svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.702 20.324C14.2864 27.9932 19.7742 14.8544 13.3281 16.1176C6.88189 17.3808 3.84678 28.9376 0.601718 19.0932C-2.64335 9.24884 9.70445 0.0894475 16.3845 0.152426C23.0646 0.215404 29.1176 12.6549 21.702 20.324Z" fill="#FFE989"/>
<path d="M13.1074 10.3289C13.1074 12.1026 11.7643 10.3289 10.1074 10.3289C8.45057 10.3289 7.10742 12.1026 7.10742 10.3289C7.10742 8.5551 8.45057 7.11719 10.1074 7.11719C11.7643 7.11719 13.1074 8.5551 13.1074 10.3289Z" fill="white"/>
<path d="M21.1074 10.3289C21.1074 12.1026 19.7643 10.3289 18.1074 10.3289C16.4506 10.3289 15.1074 12.1026 15.1074 10.3289C15.1074 8.5551 16.4506 7.11719 18.1074 7.11719C19.7643 7.11719 21.1074 8.5551 21.1074 10.3289Z" fill="white"/>
<path d="M21.1074 10.5259C21.1074 11.8563 19.9881 10.5259 18.6074 10.5259C17.2267 10.5259 16.1074 11.8563 16.1074 10.5259C16.1074 9.19562 17.2267 8.11719 18.6074 8.11719C19.9881 8.11719 21.1074 9.19562 21.1074 10.5259Z" fill="black"/>
<path d="M13.1074 10.5259C13.1074 11.8563 11.9881 10.5259 10.6074 10.5259C9.22671 10.5259 8.10742 11.8563 8.10742 10.5259C8.10742 9.19562 9.22671 8.11719 10.6074 8.11719C11.9881 8.11719 13.1074 9.19562 13.1074 10.5259Z" fill="black"/>
</svg>
` },

  { id: "excited", label: "Excited", score: 6, color: "#d2ff5835", primaryColor: "#ffb700", svg: 
    `<svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.1709 22.3936L11.1709 19.3936L20.1709 12.8936L12.1709 9.89355L21.6709 5.89355" stroke="#E6FF58" stroke-width="9" stroke-linecap="square"/>
<path d="M13.6767 12.5553C13.2068 14.3092 12.5386 11.1157 10.7847 10.6458C9.03079 10.1758 6.85539 12.6073 7.32535 10.8534C7.7953 9.09954 9.59808 8.05871 11.352 8.52866C13.1058 8.99861 14.1467 10.8014 13.6767 12.5553Z" fill="white"/>
<path d="M12.9884 10.8877C12.7232 11.8775 12.2006 10.0363 11.0314 9.72301C9.8621 9.40971 8.48894 10.7429 8.75416 9.75312C9.01938 8.76333 10.1822 8.21492 11.3515 8.52822C12.5208 8.84152 13.2536 9.89789 12.9884 10.8877Z" fill="black"/>
<path d="M23.0166 10.8527C23.4866 12.6066 21.3112 10.1751 19.5574 10.6451C17.8035 11.115 17.1353 14.3084 16.6654 12.5545C16.1954 10.8007 17.2362 8.99794 18.9901 8.528C20.7439 8.05806 22.5467 9.09887 23.0166 10.8527Z" fill="white"/>
<path d="M21.5874 9.75331C21.8526 10.7431 20.4795 9.4099 19.3103 9.7232C18.141 10.0365 17.6185 11.8776 17.3533 10.8879C17.088 9.89808 17.8209 8.84173 18.9901 8.52843C20.1594 8.21514 21.3222 8.76353 21.5874 9.75331Z" fill="black"/>
</svg>
` },

  { id: "proud", label: "Proud", score: 6, color: "#f2a10027", primaryColor: "#ff8c00d6", svg: 
    `<svg width="48" height="48" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2482 10.2498C12.1303 8.36784 14.2051 8.80476 16.2759 10.3002C16.4797 9.62908 16.8474 8.9968 17.378 8.46618C19.1009 6.74348 21.8941 6.74404 23.6169 8.46687C24.1473 8.9973 24.5132 9.62938 24.717 10.3002C26.7886 8.80318 28.8644 8.36555 30.7474 10.2484C32.6301 12.1312 32.1929 14.2068 30.6963 16.2782C31.3669 16.4821 31.9988 16.8487 32.529 17.3789C34.2515 19.1017 34.2516 21.8944 32.529 23.6172C31.9984 24.1477 31.366 24.5141 30.6949 24.7179C32.1915 26.7892 32.6291 28.8643 30.7467 30.7469C28.8642 32.6295 26.7882 32.1935 24.717 30.6972C24.5132 31.368 24.1473 32.0002 23.617 32.5306C21.8941 34.2535 19.1002 34.2535 17.3773 32.5306C16.8312 31.9845 16.4578 31.3309 16.2579 30.6378C14.1032 32.0709 11.8744 32.3722 10.0846 30.5826C8.30239 28.8004 8.77951 26.7697 10.2883 24.7151C9.62149 24.5107 8.99349 24.1453 8.46595 23.6179C6.74316 21.8951 6.74268 19.1018 8.46526 17.3789C8.99529 16.8489 9.62692 16.4814 10.2972 16.2775C8.80214 14.2069 8.36625 12.1318 10.2482 10.2498Z" fill="#F2A100"/>
<path d="M21.7038 21.707C21.7038 19.7056 23.3263 18.0831 25.3277 18.0831C27.3292 18.0831 28.9517 19.7056 28.9517 21.707C28.9517 21.707 27.3292 21.103 25.3277 21.103C23.3263 21.103 21.7038 21.707 21.7038 21.707Z" fill="white"/>
<path d="M12.0407 21.707C12.0407 19.7056 13.6632 18.0831 15.6646 18.0831C17.6661 18.0831 19.2886 19.7056 19.2886 21.707C19.2886 21.707 17.6661 21.103 15.6646 21.103C13.6632 21.103 12.0407 21.707 12.0407 21.707Z" fill="white"/>
<path d="M22.911 21.707C22.911 20.3725 23.9928 19.2907 25.3273 19.2907C26.6618 19.2907 27.7437 20.3725 27.7437 21.707C27.7437 21.707 26.6618 21.1029 25.3273 21.1029C23.9928 21.1029 22.911 21.707 22.911 21.707Z" fill="black"/>
<path d="M13.2484 21.707C13.2484 20.3725 14.3302 19.2907 15.6647 19.2907C16.9992 19.2907 18.0811 20.3725 18.0811 21.707C18.0811 21.707 16.9992 21.1029 15.6647 21.1029C14.3302 21.1029 13.2484 21.707 13.2484 21.707Z" fill="black"/>
</svg>
` },

    { id: "loved", label: "Loved", score: 6, color: "#f8577a20", primaryColor: "#ff00c3d6", svg: 
    `<svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 23C12.5 23 -2.79783e-07 17.4581 -2.69298e-07 6.37438C-2.58813e-07 -4.70937 13 10.2421 12.5 5.82019C11.5 10.2421 25 -4.70937 25 6.37438C25 17.4581 12.5 23 12.5 23Z" fill="#F56080"/>
<path d="M13.0435 6.81485C13.0435 10.5785 10.2448 13.1429 6.76018 13.1429C3.27554 13.1429 0.0045535 12.2315 5.19713e-06 6.81485C-0.00454311 1.39823 2.9769 0 6.46154 0C9.94617 0 13.0435 3.05116 13.0435 6.81485Z" fill="#F56080"/>
<path d="M11.9565 6.81482C11.9565 10.5785 13.8643 13.1429 17.652 13.1429C21.4396 13.1429 24.9951 12.2315 25 6.81482C25.0049 1.39816 21.7642 0 17.9766 0C14.1889 0 11.9565 3.0511 11.9565 6.81482Z" fill="#F56080"/>
<path d="M10.8694 10.5741C10.8694 11.575 9.16617 10.272 7.06509 10.272C4.96401 10.272 3.26074 11.575 3.26074 10.5741C3.26074 9.57314 4.96401 8.76172 7.06509 8.76172C9.16617 8.76172 10.8694 9.57314 10.8694 10.5741Z" fill="black" fill-opacity="0.2"/>
<path d="M21.7391 10.5741C21.7391 11.575 20.0358 10.272 17.9347 10.272C15.8336 10.272 14.1304 11.575 14.1304 10.5741C14.1304 9.57314 15.8336 8.76172 17.9347 8.76172C20.0358 8.76172 21.7391 9.57314 21.7391 10.5741Z" fill="black" fill-opacity="0.2"/>
</svg>` },

  { id: "relaxed", label: "Relaxed", score: 5, color: "rgba(192, 0, 230, 0.3)", primaryColor: "#a900bc", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-260q39 0 75-17.5t67-52.5l-44-40q-22 24-47 36.5T480-321q-26 0-51-12.5T382-370l-44 40q32 35 67.5 52.5T480-260ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Zm86-399q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T340-540q-21 0-33.5-17.5T289-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Zm280 0q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T620-540q-21 0-33.5-17.5T569-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Z"/></svg>` },

  { id: "tired", label: "Tired", score: 2, color: "#9e8fcd46", primaryColor: "#5a00d7", svg: 
    `<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 14.3461C25 23.0238 19.2792 19.1281 12.2222 19.1281C5.16525 19.1281 0 23.0238 0 14.3461C0 5.66837 7.38747 0 14.4444 0C21.5014 0 25 5.66837 25 14.3461Z" fill="#9D8FCD"/>
<path d="M6 12.7112C6 11.1408 7.567 13.8486 9.5 13.8486C11.433 13.8486 13 11.1408 13 12.7112C13 14.2816 11.433 15.5547 9.5 15.5547C7.567 15.5547 6 14.2816 6 12.7112Z" fill="black" fill-opacity="0.3"/>
<path d="M16 12.7112C16 11.1408 17.567 13.8486 19.5 13.8486C21.433 13.8486 23 11.1408 23 12.7112C23 14.2816 21.433 15.5547 19.5 15.5547C17.567 15.5547 16 14.2816 16 12.7112Z" fill="black" fill-opacity="0.3"/>
</svg>
` },

  { id: "bored", label: "Bored", score: 2, color: "rgba(42, 30, 80, 0.31)", primaryColor: "#4e3c6e", svg: 
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 1.79688C13.4111 1.79688 14.7369 2.06467 15.9775 2.59961C17.218 3.13459 18.2988 3.86148 19.2188 4.78125C20.1386 5.70122 20.8654 6.782 21.4004 8.02246C21.9354 9.26309 22.2031 10.5889 22.2031 12C22.2031 13.4111 21.9354 14.7369 21.4004 15.9775C20.8654 17.218 20.1386 18.2988 19.2188 19.2188C18.2988 20.1386 17.218 20.8654 15.9775 21.4004C14.7369 21.9354 13.4111 22.2031 12 22.2031C10.5889 22.2031 9.26309 21.9354 8.02246 21.4004C6.782 20.8654 5.70122 20.1386 4.78125 19.2188C3.86148 18.2988 3.13459 17.218 2.59961 15.9775C2.06467 14.7369 1.79688 13.4111 1.79688 12C1.79689 10.5889 2.06463 9.26309 2.59961 8.02246C3.13461 6.78197 3.86142 5.70125 4.78125 4.78125C5.70125 3.86142 6.78197 3.13461 8.02246 2.59961C9.26309 2.06463 10.5889 1.79689 12 1.79688ZM9 15.5479H15V13.9521H9V15.5479ZM6 11H10V9H6V11ZM14 9V11H18V9H14Z" fill="currentColor"/>
</svg>` },


  { id: "embarrassed", label: "Embarrassed", score: 1, color: "rgba(174, 255, 0, 0.27)", primaryColor: "#8eb51a", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM298-456l143-104-143-104-36 48 77 56-77 56 36 48Zm122 178 60-60 60 60 60-60 39 39 42-42-81-81-60 60-60-60-60 60-60-60-81 81 42 42 39-39 60 60Zm242-178 36-48-77-56 77-56-36-48-143 104 143 104Z"/></svg>` },

    { id: "shy", label: "Shy", score: 1, color: "#0fc2b632", primaryColor: "#10b31b", svg: 
    `<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.92172 5.54562C9.94482 2.79474 14.0553 2.79474 16.0785 5.54561L16.3836 5.96047C16.8733 6.62643 17.5769 7.10403 18.3767 7.31336C20.9656 7.99105 21.9418 11.1523 20.1858 13.1718L20.0055 13.379C19.3665 14.1139 19.0359 15.067 19.0826 16.0397L19.1049 16.5047C19.2398 19.3177 16.2156 21.171 13.7704 19.7738C12.6734 19.1469 11.3267 19.1469 10.2297 19.7738C7.7846 21.171 4.76035 19.3177 4.89531 16.5047L4.91762 16.0397C4.96429 15.067 4.63364 14.1139 3.99465 13.379L3.81441 13.1718C2.05834 11.1523 3.03456 7.99105 5.62351 7.31336C6.42324 7.10403 7.12684 6.62643 7.61662 5.96047L7.92172 5.54562Z" fill="#2191A7"/>
<path d="M11 11.4054C11 12.3719 10.1046 11.6554 9 11.6554C7.89543 11.6554 7 12.3719 7 11.4054C7 10.439 8 10.6556 9 10.1554C10 9.65527 11 10.439 11 11.4054Z" fill="white"/>
<path d="M13 11.4054C13 12.3719 13.8954 11.6554 15 11.6554C16.1046 11.6554 17 12.3719 17 11.4054C17 10.439 16 10.6556 15 10.1554C14 9.65527 13 10.439 13 11.4054Z" fill="white"/>
<path d="M12.998 11.6466C12.998 12.1523 14.4982 12 14.9982 11.6466C14.9982 11.1409 14.498 11.2542 13.998 10.9925C13.498 10.7308 12.998 11.1409 12.998 11.6466Z" fill="black"/>
<path d="M7 11.7355C7 12.2412 8.50011 12.0889 9.00011 11.7355C9.00011 11.2297 8.5 11.3431 8 11.0814C7.5 10.8197 7 11.2297 7 11.7355Z" fill="black"/>
</svg>
` },

  { id: "anxious", label: "Anxious", score: 1, color: "#42e3d341", primaryColor: "#0bbea9", svg: 
    `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.305 0L15.8277 6.51724L23.3429 5.34768L21.0691 11L26.0691 17.3638L19.0688 18L18.4306 27L13.5691 21L7.06908 25V17.3638L0 19.2259L4.06885 11L1.06885 5.34768L11.0691 6L12.305 0Z" fill="#42E3CE"/>
<path d="M12.0688 14.0928C12.0688 15.7865 10.8188 14.6162 9.06885 14.5C7.31885 14.3838 5.06885 15.7865 5.06885 14.0928C5.06885 12.399 7.98551 11.6625 9.73551 11.0259C11.4855 10.3893 12.0688 12.399 12.0688 14.0928Z" fill="white"/>
<path d="M11.0688 13.5937C11.0688 14.4406 10.0688 13.7099 9.06885 13.6518C8.06885 13.5937 7.06885 14.4406 7.06885 13.5937C7.06885 12.7469 8.73551 12.3786 9.73551 12.0603C10.7355 11.742 11.0688 12.7469 11.0688 13.5937Z" fill="black"/>
<path d="M14.0688 14.1875C14.0688 15.8813 15.3188 14.6162 17.0688 14.5C18.8188 14.3838 21.0688 15.8813 21.0688 14.1875C21.0688 12.4937 18.1522 11.7572 16.4022 11.1206C14.6522 10.484 14.0688 12.4937 14.0688 14.1875Z" fill="white"/>
<path d="M15.0688 13.5937C15.0688 14.4406 16.0688 13.7099 17.0688 13.6518C18.0688 13.5937 19.0688 14.4406 19.0688 13.5937C19.0688 12.7469 17.4022 12.3786 16.4022 12.0603C15.4022 11.742 15.0688 12.7469 15.0688 13.5937Z" fill="black"/>
</svg>
` },

  { id: "frustrated", label: "Frustrated", score: 1, color: "rgba(255, 125, 55, 0.34)", primaryColor: "#ff6c22", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M452-240h56q55 0 93.5-35t38.5-85q0-50-38.5-85T508-480h-56q-55 0-93.5 35T320-360q0 50 38.5 85t93.5 35Zm0-60q-30 0-51-17.5T380-360q0-25 21-42.5t51-17.5h56q30 0 51 17.5t21 42.5q0 25-21 42.5T508-300h-56ZM240-560h80q50 0 85-35t35-85h-60q0 25-17.5 42.5T320-620h-80v60Zm400 0h80v-60h-80q-25 0-42.5-17.5T580-680h-60q0 50 35 85t85 35ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "angry", label: "Angry", score: 1, color: "#e5280f2e", primaryColor: "#ff0000", svg: 
    `<svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.87469 20C-0.125535 0 26.8748 0 20.8745 20" stroke="#DD2A0A" stroke-width="10"/>
<path d="M11.999 9.00092C11.0921 10.5413 8.67881 11.05 6.59287 9.86894C4.50693 8.68791 3.70638 6.5394 4.61326 4.99901C4.6144 4.99707 5.95999 6.0635 8.04593 7.24454C10.1319 8.42557 11.999 9.00092 11.999 9.00092Z" fill="white"/>
<path d="M11.0501 8.67299C10.4455 9.69992 8.63839 9.78674 7.01379 8.86691C5.38919 7.94708 4.78799 6.40095 5.39258 5.37402C5.39258 5.37402 6.28821 6.24867 7.91282 7.1685C9.53742 8.08833 11.0501 8.67299 11.0501 8.67299Z" fill="black"/>
<path d="M14.0471 9.00708C15.0911 10.4581 17.615 10.6925 19.6817 9.2579C21.7485 7.82334 22.4217 5.56033 21.3777 4.10932C21.3764 4.1075 20.0648 5.34056 17.998 6.77513C15.9312 8.20969 14.0471 9.00708 14.0471 9.00708Z" fill="white"/>
<path d="M14.9616 8.59355C15.6576 9.56088 17.522 9.44259 19.1259 8.32933C20.7297 7.21607 21.236 5.58746 20.54 4.62012C20.54 4.62012 19.6824 5.60473 18.0786 6.71799C16.4747 7.83125 14.9616 8.59355 14.9616 8.59355Z" fill="black"/>
</svg>
` },

  { id: "overwhelmed", label: "Overwhelmed", score: 1, color: "rgba(181, 26, 80, 0.4)", primaryColor: "#d42260", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M391-240q17 0 32.5-6t30.5-14q6-4 12.5-7t13.5-3q8 0 26 10 15 8 30.5 14t32.5 6q50 0 80.5-35.5T680-370q0-72-49.5-111T488-520h-16q-93 0-142.5 39T280-370q0 59 30.5 94.5T391-240Zm-1-60q-24 0-37.5-18.5T339-370q0-46 32.5-68T472-460h15q68 0 100 22t32 68q0 33-13 51.5T569-300q-12 0-34-12-13-8-26.5-13t-28.5-5q-15 0-29 5t-27 13q-8 5-16.5 8.5T390-300ZM251-532q60-24 96-53t68-79l-50-32q-26 41-54.5 63T228-588l23 56Zm457 0 23-56q-53-22-81-44t-55-64l-50 32q32 50 68 78.5t95 53.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "depressed", label: "Depressed", score: 1, color: "#2c2b3724", primaryColor: "#2f385e", svg: 
    `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3" cy="3" r="3" fill="#2C2B37"/>
<circle cx="5" cy="22" r="5" fill="#2C2B37"/>
<path d="M24 16.5C24 22.0225 16.5 22.9987 12.35 22.9987C8.2 22.9987 2 19.5225 2 14C2 8.47752 6.95142 3 12.35 3C20 3.5 24 10.9775 24 16.5Z" fill="#2C2B37"/>
<circle cx="23.5" cy="21.5" r="3.5" fill="#2C2B37"/>
<path d="M13 15C14.8 15 14.3431 15 16 15C17.6569 15 16.6 15 19 15C19 16.1046 17.6569 17 16 17C14.3431 17 13 16.1046 13 15Z" fill="white"/>
<path d="M5 15C6.8 15 6.34315 15 8 15C9.65685 15 8.6 15 11 15C11 16.1046 9.65685 17 8 17C6.34315 17 5 16.1046 5 15Z" fill="white"/>
<path d="M10 15C8.8 15 9.10457 15 8 15C6.89543 15 7.6 15 6 15C6 15.5523 6.89543 16 8 16C9.10457 16 10 15.5523 10 15Z" fill="black"/>
<path d="M14 15C15.2 15 14.8954 15 16 15C17.1046 15 16.4 15 18 15C18 15.5523 17.1046 16 16 16C14.8954 16 14 15.5523 14 15Z" fill="black"/>
<circle cx="21" cy="5" r="4" fill="#2C2B37"/>
</svg>` },

  { id: "dissapointed", label: "Dissapointed", score: 2, color: "rgba(23,65,163,0.35)", primaryColor: "#0d3bb9", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm16.5 138.5Q301-343 276-280h408q-25-63-80.5-101.5T480-420q-68 0-123.5 38.5Zm-32.5 270Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "sad", label: "Sad", score: 2, color: "rgba(26,145,214,0.35)", primaryColor: "#237ff0", svg: 
    `<svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 13.106C27.5 21.6248 24.5 25.6799 16.5 21.6248C8.5 17.5697 0 28.7036 0 16.999C0 5.29437 8 1.13301e-08 14 0C20 -1.13301e-08 26.5 4.58709 27 13.106Z" fill="#2B84D3"/>
<path d="M14 12.9854C14 15.2026 12.2091 17 10 17C7.79086 17 6 15.2026 6 12.9854C6 10.7682 7.79086 12.9846 10 12.9846C12.2091 12.9846 14 10.7682 14 12.9854Z" fill="white"/>
<path d="M13 15C13 16.5 11.5 17.0008 10 17.0008C9 17.0008 8 16.1379 8 15.0734C8 14.009 9.11929 14.0008 10.5 14.0008C11.8807 14.0008 13 13.9356 13 15Z" fill="#040404"/>
<path d="M24 12.9854C24 15.2026 22.2091 17 20 17C17.7909 17 16 15.2026 16 12.9854C16 10.7682 17.7909 12.9846 20 12.9846C22.2091 12.9846 24 10.7682 24 12.9854Z" fill="white"/>
<path d="M23 14.9992C23 16.499 21.5 17 20 17C19 17 18 16.1369 18 15.0727C18 14.0084 19.1193 14 20.5 14C21.8807 14 23 13.935 23 14.9992Z" fill="#040404"/>
</svg>` }
];

// 3. Audio & Haptic Feedback Engine
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMicroTickSound() {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.008);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.008);
}

function playMajorSnapSound() {
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

function triggerHapticFeedback() {
  if (typeof haptic === "function") haptic();
  if (navigator.vibrate) navigator.vibrate(10);
}

// 4. Geometry & Wheel Coordinates
let currentRotationAngle = 0;
let startAngle = 0;
let isDragging = false;
let activeMoodIndex = 2; // Happy
let lastTickAngle = 0;

const FOCAL_TARGET_ANGLE = -45; // Top-left focal apex target
const TRACK_RADIUS = 240;
const EMOJI_RADIUS = 286;  

// 5. Drawer Lifecycle Controls
const moodDrawer = document.getElementById("view-mood-drawer");
const closeDrawerBtn = document.getElementById("close-mood-drawer-btn");

function openMoodDrawer() {
  if (!moodDrawer) return;
  moodDrawer.classList.add("open");
  updateMoodSubtitle();
  initRotaryWheel();
}

function closeMoodDrawer() {
  if (!moodDrawer) return;
  moodDrawer.classList.remove("open");
}

closeDrawerBtn?.addEventListener("click", closeMoodDrawer);

document.querySelectorAll('[data-open-drawer="view-mood"], #open-mood-drawer-btn').forEach(btn => {
  btn.addEventListener("click", openMoodDrawer);
});

// 6. Build and Initialize the Rotary Wheel Track
// 2. Update initRotaryWheel()
function initRotaryWheel() {
  const wheel = document.getElementById("rotary-wheel-track") || document.getElementById("rotary-wheel");
  if (!wheel) return;

  wheel.innerHTML = "";
  const total = moodConfig.length;
  const step = 360 / total;
  const ticksPerSegment = 4;
  const totalTicks = total * ticksPerSegment;

  // 6a. Generate Gauge Ticks (Using TRACK_RADIUS = 240px)
  for (let i = 0; i < totalTicks; i++) {
    const tickAngle = (i * 360) / totalTicks;
    const isMajor = i % ticksPerSegment === 0;
    const rad = (tickAngle * Math.PI) / 180;
    
    const x = Math.sin(rad) * TRACK_RADIUS;
    const y = -Math.cos(rad) * TRACK_RADIUS;

    const tick = document.createElement("div");
    tick.className = `wheel-tick ${isMajor ? "major" : ""}`;
    tick.style.transform = `translate(${x}px, ${y}px) rotate(${tickAngle}deg)`;
    wheel.appendChild(tick);
  }

  // 6b. Position Emojis (Using EMOJI_RADIUS = 286px to sit outside the ticks)
  moodConfig.forEach((item, index) => {
    const slotAngle = index * step;
    const rad = (slotAngle * Math.PI) / 180;
    const x = Math.sin(rad) * EMOJI_RADIUS;
    const y = -Math.cos(rad) * EMOJI_RADIUS;

    const slot = document.createElement("div");
    slot.className = "emoji-slot";
    slot.dataset.index = index;
    slot.dataset.x = x;
    slot.dataset.y = y;
    slot.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
    slot.style.color = item.primaryColor;
    slot.innerHTML = item.svg;

    wheel.appendChild(slot);
  });

  // Calculate starting rotation for index 2 (Happy)
  activeMoodIndex = 1;
  currentRotationAngle = FOCAL_TARGET_ANGLE - (activeMoodIndex * step);
  wheel.style.transform = `rotate(${currentRotationAngle}deg)`;

  updateEmojiUprightAngles();
  attachRotaryPhysics();
  updateRotarySelection(activeMoodIndex);
}

// 7. Helper: Keep Emojis Upright Without Losing Circle Coordinates
function updateEmojiUprightAngles() {
  const wheel = document.getElementById("rotary-wheel-track") || document.getElementById("rotary-wheel");
  if (!wheel) return;
  const slots = wheel.querySelectorAll(".emoji-slot");
  slots.forEach(slot => {
    const x = slot.dataset.x;
    const y = slot.dataset.y;
    slot.style.transform = `translate(${x}px, ${y}px) rotate(${-currentRotationAngle}deg)`;
  });
}

// 8. Rotary Drag Physics
function attachRotaryPhysics() {
  const viewport = document.getElementById("rotary-viewport");
  const wheel = document.getElementById("rotary-wheel-track") || document.getElementById("rotary-wheel");
  if (!viewport || !wheel) return;

  function getAngle(e) {
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    return rad * (180 / Math.PI);
  }

  function onStart(e) {
    isDragging = true;
    wheel.classList.remove("snapping");
    startAngle = getAngle(e) - currentRotationAngle;
  }

  function onMove(e) {
    if (!isDragging) return;
    const angle = getAngle(e);
    currentRotationAngle = angle - startAngle;
    wheel.style.transform = `rotate(${currentRotationAngle}deg)`;

    updateEmojiUprightAngles();

    // Check Micro-Ticks Audio (every 5 degrees)
    if (Math.abs(currentRotationAngle - lastTickAngle) >= 5) {
      playMicroTickSound();
      lastTickAngle = currentRotationAngle;
    }

    calculateActiveFocalEmoji();
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    wheel.classList.add("snapping");

    const total = moodConfig.length;
    const step = 360 / total;

    // Snap to nearest focal slot
    let normalized = (FOCAL_TARGET_ANGLE - currentRotationAngle) % 360;
    if (normalized < 0) normalized += 360;

    activeMoodIndex = Math.round(normalized / step) % total;
    currentRotationAngle = FOCAL_TARGET_ANGLE - (activeMoodIndex * step);

    wheel.style.transform = `rotate(${currentRotationAngle}deg)`;
    updateEmojiUprightAngles();
    updateRotarySelection(activeMoodIndex);
    playMajorSnapSound();
    triggerHapticFeedback();
  }

  viewport.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onEnd);

  viewport.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

// 9. Synchronize Active Emotion with Headline and Arrow
function calculateActiveFocalEmoji() {
  const total = moodConfig.length;
  const step = 360 / total;
  
  let normalized = (FOCAL_TARGET_ANGLE - currentRotationAngle) % 360;
  if (normalized < 0) normalized += 360;

  const nearestIndex = Math.round(normalized / step) % total;

  if (nearestIndex !== activeMoodIndex) {
    activeMoodIndex = nearestIndex;
    updateRotarySelection(activeMoodIndex);
    playMajorSnapSound();
    triggerHapticFeedback();
  }
}

function updateRotarySelection(index) {
  const activeMood = moodConfig[index];
  const headline = document.getElementById("rotary-headline") || document.getElementById("rotary-label");
  const glow = document.getElementById("mood-ambient-glow") || document.getElementById("rotary-glow");

  if (headline) headline.textContent = activeMood.label;

  if (glow) {
    glow.style.background = `radial-gradient(circle at 30% 30%, ${activeMood.color} 0%, rgba(255,255,255,0) 70%)`;
  }

  const slots = document.querySelectorAll(".emoji-slot");
  slots.forEach((slot, i) => {
    if (i === index) {
      slot.classList.add("active");
    } else {
      slot.classList.remove("active");
    }
  });
}

// 10. Save Action
document.getElementById("save-mood-btn")?.addEventListener("click", () => {
  const activeMood = moodConfig[activeMoodIndex];

  moodLogs.push({
    date: new Date().toISOString().split("T")[0],
    moodId: activeMood.id,
    score: activeMood.score,
    label: activeMood.label,
    mood: activeMood.label,
    timestamp: Date.now()
  });

  saveAppState();

  if (typeof playLogSound === "function") playLogSound();
  if (typeof renderMoodVisualizations === "function") {
    renderMoodVisualizations();
  } else if (typeof renderMoodScatterplot === "function") {
    renderMoodScatterplot();
  }
  if (typeof updateHomeDashboard === "function") updateHomeDashboard();

  closeMoodDrawer();
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initRotaryWheel();
  updateMoodSubtitle();
});
