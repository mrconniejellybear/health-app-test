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
    `<svg width="37" height="30" viewBox="0 0 37 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0874 19.6013L10.1292 15.5497L-0.000207901 20.4454L10.7113 23.8858L12.0874 19.6013ZM23.7832 13.9486L25.7414 18.0002L36.3191 12.8878L25.0328 9.62554L23.7832 13.9486ZM13.116 10.8652L10.619 7.12161L2.5588 12.4979L11.8665 15.1883L13.116 10.8652ZM22.547 9.98386L26.2906 7.4868L21.2965 -0.000445366L17.5528 2.49661L20.0499 6.24023L22.547 9.98386ZM28.0874 24.7402L29.4635 20.4558L13.4635 15.3169L12.0874 19.6013L10.7113 23.8858L26.7113 29.0247L28.0874 24.7402ZM12.0874 19.6013L14.0456 23.6529L25.7414 18.0002L23.7832 13.9486L21.825 9.89697L10.1292 15.5497L12.0874 19.6013ZM23.7832 13.9486L25.0328 9.62554L14.3656 6.5422L13.116 10.8652L11.8665 15.1883L22.5337 18.2716L23.7832 13.9486ZM13.116 10.8652L15.6131 14.6089L22.547 9.98386L20.0499 6.24023L17.5528 2.49661L10.619 7.12161L13.116 10.8652Z" fill="#E6FF58"/>
<path d="M23.0967 16.4177C23.0967 18.3357 20.6342 20.7402 17.5967 20.7402C14.5591 20.7402 12.0962 18.3386 12.0967 16.4177C12.0971 14.4969 14.559 17.2709 17.5966 17.2709C20.6341 17.2709 23.0967 14.4997 23.0967 16.4177Z" fill="black" fill-opacity="0.1"/>
<path d="M16.3293 13.674C16.4841 14.7773 15.3251 12.7963 14.2594 12.9459C13.1936 13.0954 12.6246 15.3188 12.4698 14.2155C12.315 13.1122 13.0534 12.0965 14.1192 11.947C15.185 11.7975 16.1745 12.5706 16.3293 13.674Z" fill="black" fill-opacity="0.3"/>
<path d="M18.867 13.684C18.7178 14.7881 19.8668 12.8013 20.9333 12.9455C21.9998 13.0897 22.58 15.3102 22.7292 14.2062C22.8785 13.1021 22.1349 12.0901 21.0684 11.946C20.0019 11.8018 19.0163 12.5799 18.867 13.684Z" fill="black" fill-opacity="0.3"/>
</svg>

` },

  { id: "proud", label: "Proud", score: 6, color: "#f2a10027", primaryColor: "#ff8c00d6", svg: 
    `<svg width="33" height="31" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.5" cy="16.5" r="8.5" fill="#F2A100"/>
<circle cx="12.5" cy="11.5" r="6.5" fill="#F2A100"/>
<path d="M25.9322 17.5945C23.5431 19.9836 19.232 19.5459 16.3031 16.617C13.3741 13.6881 12.9365 9.37697 15.3256 6.98788C17.7147 4.59879 24.6878 2.37437 27.6168 5.3033C30.5457 8.23223 28.3213 15.2054 25.9322 17.5945Z" fill="#F2A100"/>
<path d="M6.98772 13.3254C9.37681 10.9364 13.6879 11.374 16.6169 14.3029C19.5458 17.2318 19.9834 21.543 17.5943 23.932C15.2052 26.3211 8.23208 28.5456 5.30314 25.6166C2.37421 22.6877 4.59863 15.7145 6.98772 13.3254Z" fill="#F2A100"/>
<path d="M15.3259 23.9322C12.9368 21.5431 13.3745 17.232 16.3034 14.3031C19.2323 11.3741 23.5434 10.9365 25.9325 13.3256C28.3216 15.7147 30.546 22.6878 27.6171 25.6168C24.6882 28.5457 17.715 26.3213 15.3259 23.9322Z" fill="#F2A100"/>
<path d="M6.98772 17.5945C9.37681 19.9836 13.6879 19.5459 16.6169 16.617C19.5458 13.6881 19.9834 9.37697 17.5943 6.98788C15.2052 4.59879 8.23208 2.37437 5.30314 5.3033C2.37421 8.23223 4.59863 15.2054 6.98772 17.5945Z" fill="#F2A100"/>
<path d="M15 14.599C15 16.0344 13.6569 13 12 13C10.3431 13 9 16.0344 9 14.599C9 13.1636 10.3431 12 12 12C13.6569 12 15 13.1636 15 14.599Z" fill="black" fill-opacity="0.2"/>
<path d="M18 14.599C18 16.0344 19.3431 13 21 13C22.6569 13 24 16.0344 24 14.599C24 13.1636 22.6569 12 21 12C19.3431 12 18 13.1636 18 14.599Z" fill="black" fill-opacity="0.2"/>
<path d="M20 17.401C20 15.9656 18.433 18.5 16.5 18.5C14.567 18.5 13 15.9656 13 17.401C13 18.8364 14.567 20 16.5 20C18.433 20 20 18.8364 20 17.401Z" fill="black" fill-opacity="0.4"/>
<ellipse cx="9" cy="17.5" rx="2" ry="1.5" fill="white" fill-opacity="0.3"/>
<ellipse cx="24" cy="17.5" rx="2" ry="1.5" fill="white" fill-opacity="0.3"/>
</svg>

` },

    { id: "loved", label: "Loved", score: 6, color: "#f8577a20", primaryColor: "#ff00c3d6", svg: 
    `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8193 0C18.2214 0 20.3735 0.604978 21.3867 2.63184C21.773 3.17952 22 4.0389 22 5.31055C22 5.37262 21.9971 5.43444 21.9961 5.49609C21.9971 5.55572 22.0001 5.61592 22 5.67676C21.9993 6.37832 21.922 6.98914 21.7813 7.52051C20.2416 15.2799 11 19.1602 11 19.1602C10.988 19.1551 1.94585 15.3556 0.266603 7.76172C0.096042 7.17613 0.00071994 6.48708 1.16333e-06 5.67676C-5.46043e-05 5.61193 0.00190841 5.54782 0.00293085 5.48438C0.00206287 5.42661 2.5213e-06 5.36868 1.16333e-06 5.31055C1.1645e-06 4.13641 0.185781 3.31318 0.507814 2.7627C1.41413 0.63134 3.42994 0 5.68652 0C7.93058 0.000149752 9.99033 1.3623 10.9346 3.32129C11.6741 1.36191 13.3798 2.35359e-05 15.8193 0Z" fill="#F56080"/>
<path d="M9.5653 8.74212C9.5653 9.56965 8.28055 8.14924 6.69574 8.14924C5.11092 8.14924 3.82617 9.56965 3.82617 8.74212C3.82617 7.9146 5.11092 6.79102 6.69574 6.79102C8.28055 6.79102 9.5653 7.9146 9.5653 8.74212Z" fill="black" fill-opacity="0.2"/>
<path d="M18.1737 8.74212C18.1737 9.56965 16.889 8.14924 15.3041 8.14924C13.7193 8.14924 12.4346 9.56965 12.4346 8.74212C12.4346 7.9146 13.7193 6.79102 15.3041 6.79102C16.889 6.79102 18.1737 7.9146 18.1737 8.74212Z" fill="black" fill-opacity="0.2"/>
<ellipse cx="17" cy="11" rx="2" ry="1" fill="white" fill-opacity="0.3"/>
<ellipse cx="5" cy="11" rx="2" ry="1" fill="white" fill-opacity="0.3"/>
</svg>
` },

  { id: "relaxed", label: "Relaxed", score: 5, color: "rgba(192, 0, 230, 0.3)", primaryColor: "#a900bc", svg: 
    `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.50049 20.4876C14.0324 21.7637 1.00049 4.54703 6.50049 3.54622C12.0005 2.54542 14.5354 20.0479 18.5005 20.0479C23.5273 20.0479 23.1182 11.0454 21.0005 8.04544" stroke="#E569F0" stroke-width="7" stroke-linecap="round"/>
<path d="M3.02136 5.75979C2.75681 4.77248 4.03401 6.44648 4.98773 6.19093C5.94145 5.93538 6.21054 3.84705 6.47509 4.83437C6.73964 5.82169 6.18096 6.82923 5.22724 7.08478C4.27352 7.34033 3.28591 6.74711 3.02136 5.75979Z" fill="black" fill-opacity="0.3"/>
<path d="M4.53197 8.77213C4.42284 7.89799 6.37035 9.34634 8.51623 9.07845C10.6621 8.81055 12.1938 6.92785 12.3029 7.80199C12.412 8.67613 10.7609 9.60194 8.61503 9.86983C6.46915 10.1377 4.6411 9.64627 4.53197 8.77213Z" fill="white" fill-opacity="0.3"/>
<path d="M7.9909 4.8415C8.26179 3.83053 8.47737 5.95282 9.37997 6.19468C10.2826 6.43653 11.5304 4.70636 11.2595 5.71733C10.9886 6.7283 10.0373 7.35179 9.13473 7.10994C8.23212 6.86809 7.72001 5.85247 7.9909 4.8415Z" fill="black" fill-opacity="0.3"/>
</svg>
` },

  { id: "tired", label: "Tired", score: 2, color: "#9e8fcd46", primaryColor: "#5a00d7", svg: 
    `<svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 13.7722C24 22.1028 18.508 18.363 11.7333 18.363C4.95864 18.363 0 22.1028 0 13.7722C0 5.44164 7.09197 0 13.8667 0C20.6414 0 24 5.44164 24 13.7722Z" fill="#9D8FCD"/>
<path d="M5.75998 11.2029C5.75998 9.69528 7.2643 12.2948 9.11998 12.2948C10.9757 12.2948 12.48 9.69528 12.48 11.2029C12.48 12.7105 10.9757 13.9326 9.11998 13.9326C7.2643 13.9326 5.75998 12.7105 5.75998 11.2029Z" fill="black" fill-opacity="0.3"/>
<path d="M15.3601 11.2029C15.3601 9.69528 16.8644 12.2948 18.7201 12.2948C20.5758 12.2948 22.0801 9.69528 22.0801 11.2029C22.0801 12.7105 20.5758 13.9326 18.7201 13.9326C16.8644 13.9326 15.3601 12.7105 15.3601 11.2029Z" fill="black" fill-opacity="0.3"/>
<ellipse cx="11.5" cy="16" rx="1.5" ry="1" fill="white" fill-opacity="0.3"/>
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
<path d="M6.81907 20.1113C1.29138 1.76866 25.7055 0.828977 20.1781 20.1113" stroke="#DD2A0A" stroke-width="12"/>
<path d="M14.3408 6.45423C14.6042 7.45779 16.0706 7.92858 17.6161 7.50578C19.1616 7.08297 20.7398 4.7146 19.8204 4.47653C18.9011 4.23845 15.8863 6.03143 14.3408 6.45423Z" fill="black" fill-opacity="0.2"/>
<path d="M12.803 6.45531C12.5396 7.45887 11.0538 7.92435 9.48429 7.49498C7.91479 7.06561 6.30481 4.68853 7.23655 4.45385C8.16829 4.21916 11.2335 6.02594 12.803 6.45531Z" fill="black" fill-opacity="0.2"/>
<path d="M17.9985 11.7731C17.9985 13.7049 15.9838 9.44131 13.4985 9.44131C11.0133 9.44131 8.99854 13.7049 8.99854 11.7731C8.99854 9.84139 11.0133 8.27539 13.4985 8.27539C15.9838 8.27539 17.9985 9.84139 17.9985 11.7731Z" fill="black" fill-opacity="0.4"/>
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
