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
  { id: "neutral", label: "Neutral", score: 3, color: "rgba(146, 161, 182, 0.35)", primaryColor: "#bcc5d4", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm20 180h240v-60H360v60Zm-36 228.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "okay", label: "Okay", score: 3, color: "rgba(225, 229, 2, 0.35)", primaryColor: "#ece000", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "happy", label: "Happy", score: 4, color: "rgba(255,208,0,0.35)", primaryColor: "#ffd000", svg: 
    `<svg width="28" height="23" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.6154 19.5C15.6154 27 21.4591 14.2169 14.4494 15.5C7.4397 16.7831 4.25185 28.0107 0.615452 18.5C-3.02094 8.9893 10.3371 0 17.6152 0C24.8934 0 31.6155 12 23.6154 19.5Z" fill="#FFAA00"/>
<path d="M15.1152 10.5146C15.1152 12.7318 13.5482 10.5146 11.6152 10.5146C9.68224 10.5146 8.11523 12.7318 8.11523 10.5146C8.11523 8.29739 9.68224 6.5 11.6152 6.5C13.5482 6.5 15.1152 8.29739 15.1152 10.5146Z" fill="white"/>
<path d="M24.1152 10.5146C24.1152 12.7318 22.5482 10.5146 20.6152 10.5146C18.6822 10.5146 17.1152 12.7318 17.1152 10.5146C17.1152 8.29739 18.6822 6.5 20.6152 6.5C22.5482 6.5 24.1152 8.29739 24.1152 10.5146Z" fill="white"/>
<path d="M15.1152 10.9087C15.1152 12.2391 13.9959 10.9087 12.6152 10.9087C11.2345 10.9087 10.1152 12.2391 10.1152 10.9087C10.1152 9.57843 11.2345 8.5 12.6152 8.5C13.9959 8.5 15.1152 9.57843 15.1152 10.9087Z" fill="black"/>
<path d="M24.1152 10.9087C24.1152 12.2391 22.9959 10.9087 21.6152 10.9087C20.2345 10.9087 19.1152 12.2391 19.1152 10.9087C19.1152 9.57843 20.2345 8.5 21.6152 8.5C22.9959 8.5 24.1152 9.57843 24.1152 10.9087Z" fill="black"/>
</svg>` },

  { id: "excited", label: "Excited", score: 6, color: "rgba(255,162,0,0.35)", primaryColor: "#ffb700", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M603.5-298.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM312-520l44-42 42 42 42-42-84-86-86 86 42 42Zm250 0 42-42 44 42 42-42-86-86-84 86 42 42ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "proud", label: "Proud", score: 6, color: "rgba(255, 144, 47, 0.38)", primaryColor: "#ff8c00d6", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-480v80q0 66 47 113t113 47q66 0 113-47t47-113v-80H320Zm160 180q-42 0-71-29t-29-71v-20h200v20q0 42-29 71t-71 29ZM272.5-652.5Q243-625 231-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T340-680q-38 0-67.5 27.5Zm280 0Q523-625 511-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T620-680q-38 0-67.5 27.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

    { id: "loved", label: "Loved", score: 6, color: "rgba(255, 79, 226, 0.32)", primaryColor: "#ff00c3d6", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M592-379q49-39 63-101h-83q-12 27-37 43.5T480-420q-30 0-55-16.5T388-480h-83q14 62 63 101t112 39q63 0 112-39ZM405.5-554.5Q420-569 420-590t-14.5-35.5Q391-640 370-640t-35.5 14.5Q320-611 320-590t14.5 35.5Q349-540 370-540t35.5-14.5Zm220 0Q640-569 640-590t-14.5-35.5Q611-640 590-640t-35.5 14.5Q540-611 540-590t14.5 35.5Q569-540 590-540t35.5-14.5ZM480-120l-58-50q-101-88-167-152T150-437q-39-51-54.5-94T80-620q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 89T810-437q-39 51-105 115T538-170l-58 50Z"/></svg>` },

  { id: "relaxed", label: "Relaxed", score: 5, color: "rgba(192, 0, 230, 0.3)", primaryColor: "#a900bc", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-260q39 0 75-17.5t67-52.5l-44-40q-22 24-47 36.5T480-321q-26 0-51-12.5T382-370l-44 40q32 35 67.5 52.5T480-260ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Zm86-399q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T340-540q-21 0-33.5-17.5T289-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Zm280 0q28-30.5 39-72.5l-58-14q-5 22-17.5 39.5T620-540q-21 0-33.5-17.5T569-597l-58 14q11 42 39 72.5t70 30.5q42 0 70-30.5Z"/></svg>` },

  { id: "tired", label: "Tired", score: 2, color: "rgba(100, 13, 215, 0.19)", primaryColor: "#5a00d7", svg: 
    `<svg width="27" height="21" viewBox="0 0 27 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 13.4077C27 22.3385 23 22.1743 15 19.0802C7 15.9861 0 24.4012 0 15.4704C0 6.53966 7.30502 3.535e-08 13.5 1.8099e-08C19.695 8.47968e-10 27 4.47694 27 13.4077Z" fill="#8069BE"/>
<path d="M14 12.6058C14 13.4927 12.433 12.6058 10.5 12.6058C8.567 12.6058 7 13.4927 7 12.6058C7 11.719 8.567 11 10.5 11C12.433 11 14 11.719 14 12.6058Z" fill="black" fill-opacity="0.6"/>
<path d="M24 12.6058C24 13.4927 22.433 12.6058 20.5 12.6058C18.567 12.6058 17 13.4927 17 12.6058C17 11.719 18.567 11 20.5 11C22.433 11 24 11.719 24 12.6058Z" fill="black" fill-opacity="0.6"/>
</svg>` },

  { id: "bored", label: "Bored", score: 2, color: "rgba(42, 30, 80, 0.31)", primaryColor: "#4e3c6e", svg: 
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 1.79688C13.4111 1.79688 14.7369 2.06467 15.9775 2.59961C17.218 3.13459 18.2988 3.86148 19.2188 4.78125C20.1386 5.70122 20.8654 6.782 21.4004 8.02246C21.9354 9.26309 22.2031 10.5889 22.2031 12C22.2031 13.4111 21.9354 14.7369 21.4004 15.9775C20.8654 17.218 20.1386 18.2988 19.2188 19.2188C18.2988 20.1386 17.218 20.8654 15.9775 21.4004C14.7369 21.9354 13.4111 22.2031 12 22.2031C10.5889 22.2031 9.26309 21.9354 8.02246 21.4004C6.782 20.8654 5.70122 20.1386 4.78125 19.2188C3.86148 18.2988 3.13459 17.218 2.59961 15.9775C2.06467 14.7369 1.79688 13.4111 1.79688 12C1.79689 10.5889 2.06463 9.26309 2.59961 8.02246C3.13461 6.78197 3.86142 5.70125 4.78125 4.78125C5.70125 3.86142 6.78197 3.13461 8.02246 2.59961C9.26309 2.06463 10.5889 1.79689 12 1.79688ZM9 15.5479H15V13.9521H9V15.5479ZM6 11H10V9H6V11ZM14 9V11H18V9H14Z" fill="currentColor"/>
</svg>` },


  { id: "embarrassed", label: "Embarrassed", score: 1, color: "rgba(174, 255, 0, 0.27)", primaryColor: "#8eb51a", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM298-456l143-104-143-104-36 48 77 56-77 56 36 48Zm122 178 60-60 60 60 60-60 39 39 42-42-81-81-60 60-60-60-60 60-60-60-81 81 42 42 39-39 60 60Zm242-178 36-48-77-56 77-56-36-48-143 104 143 104Z"/></svg>` },

    { id: "confused", label: "Confused", score: 1, color: "rgba(24, 208, 49, 0.3)", primaryColor: "#10b31b", svg: 
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.167 14.666C13.624 14.3575 12.6485 14.8513 11.8311 15.2285C11.0784 15.5759 10.3911 15.8699 9.13965 15.6611L9 16.5L8.86035 17.3379C10.6085 17.6295 11.6718 17.174 12.5439 16.7715C13.3512 16.3989 13.8764 16.1418 14.833 16.333L15 15.5L15.167 14.666ZM8.5 9C7.67157 9 7 9.67157 7 10.5C7 11.3284 7.67157 12 8.5 12C9.32843 12 10 11.3284 10 10.5C10 9.67157 9.32843 9 8.5 9ZM18.335 8.77344C17.1619 8.18703 16.2327 8.18493 15.3604 8.3291C14.4655 8.47706 13.8987 8.69434 13 8.69434V10.1943C13.3685 10.1943 13.722 10.1577 14.0527 10.1084C14.019 10.2333 14 10.3644 14 10.5C14 11.3284 14.6716 12 15.5 12C16.3284 12 17 11.3284 17 10.5C17 10.2517 16.9389 10.0178 16.832 9.81152C17.0875 9.86664 17.3605 9.96296 17.665 10.1152L18.335 8.77344ZM8.63965 6.3291C7.76735 6.18493 6.83813 6.18703 5.66504 6.77344L6.33496 8.11523C7.16149 7.702 7.75619 7.70386 8.39551 7.80957C9.0125 7.91161 9.94616 8.19434 11 8.19434V6.69434C10.1013 6.69434 9.5345 6.47706 8.63965 6.3291Z" fill="currentColor"/>
  </svg>` },

  { id: "anxious", label: "Anxious", score: 1, color: "rgba(0, 255, 195, 0.29)", primaryColor: "#0bbea9", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M452-240h56q55 0 93.5-35t38.5-85q0-50-38.5-85T508-480h-56q-55 0-93.5 35T320-360q0 50 38.5 85t93.5 35Zm0-60q-30 0-51-17.5T380-360q0-25 21-42.5t51-17.5h56q30 0 51 17.5t21 42.5q0 25-21 42.5T508-300h-56ZM240-560h80q50 0 85-35t35-85h-60q0 25-17.5 42.5T320-620h-80v60Zm400 0h80v-60h-80q-25 0-42.5-17.5T580-680h-60q0 50 35 85t85 35ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "frustrated", label: "Frustrated", score: 1, color: "rgba(255, 125, 55, 0.34)", primaryColor: "#ff6c22", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M452-240h56q55 0 93.5-35t38.5-85q0-50-38.5-85T508-480h-56q-55 0-93.5 35T320-360q0 50 38.5 85t93.5 35Zm0-60q-30 0-51-17.5T380-360q0-25 21-42.5t51-17.5h56q30 0 51 17.5t21 42.5q0 25-21 42.5T508-300h-56ZM240-560h80q50 0 85-35t35-85h-60q0 25-17.5 42.5T320-620h-80v60Zm400 0h80v-60h-80q-25 0-42.5-17.5T580-680h-60q0 50 35 85t85 35ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "angry", label: "Angry", score: 1, color: "rgba(255, 40, 21, 0.37)", primaryColor: "#ff0000", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm60-444 20-12q2 24 19 40t41 16q25 0 42.5-17.5T680-540q0-15-7-28.5T654-590l26-15-20-35-140 80 20 36Zm-120 0 20-36-140-80-20 35 26 15q-12 8-19 21.5t-7 28.5q0 25 17.5 42.5T340-480q24 0 41-16t19-40l20 12Zm60 84q-71 0-125 45.5T279-280h402q-22-69-76-114.5T480-440Z"/></svg>` },

  { id: "overwhelmed", label: "Overwhelmed", score: 1, color: "rgba(181, 26, 80, 0.4)", primaryColor: "#d42260", svg: 
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M391-240q17 0 32.5-6t30.5-14q6-4 12.5-7t13.5-3q8 0 26 10 15 8 30.5 14t32.5 6q50 0 80.5-35.5T680-370q0-72-49.5-111T488-520h-16q-93 0-142.5 39T280-370q0 59 30.5 94.5T391-240Zm-1-60q-24 0-37.5-18.5T339-370q0-46 32.5-68T472-460h15q68 0 100 22t32 68q0 33-13 51.5T569-300q-12 0-34-12-13-8-26.5-13t-28.5-5q-15 0-29 5t-27 13q-8 5-16.5 8.5T390-300ZM251-532q60-24 96-53t68-79l-50-32q-26 41-54.5 63T228-588l23 56Zm457 0 23-56q-53-22-81-44t-55-64l-50 32q32 50 68 78.5t95 53.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5Z"/></svg>` },

  { id: "depressed", label: "Depressed", score: 1, color: "rgba(0, 30, 84, 0.31)", primaryColor: "#2f385e", svg: 
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
