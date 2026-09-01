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

  { id: "happy", label: "Happy", score: 4, color: "#f8dd673c", primaryColor: "#ffd000", svg: 
    `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.1454 1.62583C7.54148 -0.00512968 3.55707 -0.90336 1.39734 1.35533C-0.353329 3.1867 0.343464 6.59609 1.64539 9.37388C-0.0336127 12.4325 -0.904388 18.3605 1.3993 20.7704C3.57622 23.0476 7.19482 21.0969 9.64344 19.0614C12.2793 21.2285 19.2631 23.4003 21.7802 20.7674C24.4555 17.9688 21.8931 11.3828 19.7108 9.09947C19.6159 9.00017 19.5172 8.90662 19.4179 8.81724C21.5731 6.45282 23.755 3.42123 21.7802 1.35533C19.6213 -0.902781 13.5547 -0.00420972 10.1454 1.62583Z" fill="#FFCC00"/>
<path d="M5.92578 11.3848C5.92578 12.725 7.6405 14.8223 10.1258 14.8223C12.6111 14.8223 14.9258 12.725 14.9258 11.3848C14.9258 10.0445 12.0068 13.7235 9.60679 13.1576C7.20679 12.5917 5.92578 10.0445 5.92578 11.3848Z" fill="black" fill-opacity="0.15"/>
<path d="M11.5883 8.24649C11.5883 9.62311 12.6579 6.75811 13.9773 6.75811C15.2966 6.75811 16.3662 9.62311 16.3662 8.24649C16.3662 6.86987 15.2966 5.75391 13.9773 5.75391C12.6579 5.75391 11.5883 6.86987 11.5883 8.24649Z" fill="black" fill-opacity="0.4"/>
<path d="M9.67733 8.24649C9.67733 9.62311 8.60776 6.75811 7.28837 6.75811C5.96899 6.75811 4.89941 9.62311 4.89941 8.24649C4.89941 6.86987 5.96899 5.75391 7.28837 5.75391C8.60776 5.75391 9.67733 6.86987 9.67733 8.24649Z" fill="black" fill-opacity="0.4"/>
</svg>

` },

  { id: "excited", label: "Excited", score: 6, color: "#d0ff0035", primaryColor: "#ffb700", svg: 
    `<svg width="37" height="30" viewBox="0 0 37 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0874 19.6013L10.1292 15.5497L-0.000207901 20.4454L10.7113 23.8858L12.0874 19.6013ZM23.7832 13.9486L25.7414 18.0002L36.3191 12.8878L25.0328 9.62554L23.7832 13.9486ZM13.116 10.8652L10.619 7.12161L2.5588 12.4979L11.8665 15.1883L13.116 10.8652ZM22.547 9.98386L26.2906 7.4868L21.2965 -0.000445366L17.5528 2.49661L20.0499 6.24023L22.547 9.98386ZM28.0874 24.7402L29.4635 20.4558L13.4635 15.3169L12.0874 19.6013L10.7113 23.8858L26.7113 29.0247L28.0874 24.7402ZM12.0874 19.6013L14.0456 23.6529L25.7414 18.0002L23.7832 13.9486L21.825 9.89697L10.1292 15.5497L12.0874 19.6013ZM23.7832 13.9486L25.0328 9.62554L14.3656 6.5422L13.116 10.8652L11.8665 15.1883L22.5337 18.2716L23.7832 13.9486ZM13.116 10.8652L15.6131 14.6089L22.547 9.98386L20.0499 6.24023L17.5528 2.49661L10.619 7.12161L13.116 10.8652Z" fill="#E6FF00"/>
<path d="M22.0967 16.4177C22.0967 18.3357 20.082 20.7402 17.5967 20.7402C15.1114 20.7402 13.0963 18.3386 13.0967 16.4177C13.0971 14.4969 15.1113 17.2709 17.5966 17.2709C20.0819 17.2709 22.0967 14.4997 22.0967 16.4177Z" fill="black" fill-opacity="0.2"/>
<path d="M16.3833 13.4194C16.6717 14.4955 15.2795 12.6709 14.24 12.9494C13.2005 13.228 12.9072 15.5042 12.6188 14.4281C12.3304 13.3519 12.9394 12.2537 13.9789 11.9751C15.0185 11.6966 16.095 12.3432 16.3833 13.4194Z" fill="black" fill-opacity="0.4"/>
<path d="M18.81 13.4194C18.5217 14.4955 19.9138 12.6709 20.9534 12.9494C21.9929 13.228 22.2862 15.5042 22.5746 14.4281C22.8629 13.3519 22.254 12.2537 21.2144 11.9751C20.1749 11.6966 19.0984 12.3432 18.81 13.4194Z" fill="black" fill-opacity="0.4"/>
</svg>
` },

  { id: "proud", label: "Proud", score: 6, color: "#ff800030", primaryColor: "#ff8c00d6", svg: 
    `<svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.9614 0.997727C16.6174 1.12427 17.8775 3.03314 18.1384 5.53814C18.1799 5.50306 18.2216 5.46782 18.264 5.43315C20.8452 3.32065 23.9922 2.78115 25.2932 4.22792C26.5941 5.67472 25.5563 8.56013 22.9751 10.6726C22.9329 10.7071 22.8894 10.7398 22.8469 10.7734C25.4025 11.4005 27.1884 12.8796 27.0676 14.4602C26.9466 16.0406 24.9574 17.2304 22.3368 17.462C22.3737 17.5018 22.4107 17.5416 22.4471 17.5821C24.6774 20.0623 25.2648 23.0719 23.7591 24.3042C22.2533 25.5362 19.2248 24.5248 16.9946 22.0449C16.9579 22.0041 16.9223 21.9621 16.8865 21.921C16.248 24.3569 14.7133 26.0513 13.0576 25.9251C11.4017 25.7986 10.1405 23.8905 9.87959 21.3856C9.83816 21.4206 9.79719 21.4571 9.75493 21.4917C7.17374 23.6039 4.02664 24.1436 2.72568 22.6969C1.42471 21.2501 2.46259 18.3647 5.04377 16.2522C5.08592 16.2177 5.1286 16.184 5.17104 16.1503C2.61634 15.5231 0.831536 14.045 0.952298 12.4646C1.07341 10.8841 3.06289 9.69425 5.68402 9.46292C5.64699 9.42301 5.60934 9.38347 5.57273 9.34276C3.34243 6.86259 2.75505 3.85301 4.26078 2.62072C5.76654 1.38853 8.79503 2.39987 11.0253 4.88C11.0613 4.92002 11.0965 4.96047 11.1316 5.00076C11.7703 2.56561 13.306 0.871533 14.9614 0.997727Z" fill="#F2A100"/>
<path d="M11.8223 12.9747C11.4489 14.3683 11.3734 11.1905 10.3065 10.9046C9.23953 10.6187 7.58519 13.3331 7.95862 11.9394C8.33204 10.5458 9.49968 9.64777 10.5666 9.93365C11.6335 10.2195 12.1957 11.5811 11.8223 12.9747Z" fill="black" fill-opacity="0.2"/>
<path d="M15.5346 12.9747C15.908 14.3683 15.9835 11.1905 17.0505 10.9046C18.1174 10.6187 19.7717 13.3331 19.3983 11.9394C19.0249 10.5458 17.8572 9.64777 16.7903 9.93365C15.7234 10.2195 15.1612 11.5811 15.5346 12.9747Z" fill="black" fill-opacity="0.2"/>
<path d="M17.1787 15.3229C17.1787 13.8875 15.6117 15.3828 13.6787 15.3828C11.7457 15.3828 10.1787 13.8875 10.1787 15.3229C10.1787 16.7583 11.7457 17.9219 13.6787 17.9219C15.6117 17.9219 17.1787 16.7583 17.1787 15.3229Z" fill="black" fill-opacity="0.4"/>
</svg>
` },

{ id: "hopeful", label: "Hopeful", score: 6, color: "#dbd0076c", primaryColor: "#ff8c00d6", svg: 
    `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 0C19.3151 0 26.1388 5.50631 24.8398 12.7715C24.279 15.9082 23.1729 16.3341 21.5479 15.8076C22.7146 17.5929 23.2774 19.7736 22.8652 22.1748C21.7741 28.5315 18.2246 22.1748 12.5 22.1748C6.7754 22.1748 3.22624 28.5315 2.13477 22.1748C1.72256 19.7739 2.28382 17.5927 3.4502 15.8076C1.82626 16.3331 0.721003 15.9069 0.160156 12.7715C-1.13918 5.50631 5.68494 6.38989e-06 12.5 0Z" fill="#FFFDD0"/>
<path d="M8 11.325C8 10.3999 10.0147 13.5 12.5 13.5C14.9853 13.5 17 10.3999 17 11.325C17 12.2501 14.9853 14.5 12.5 14.5C10.0147 14.5 8 12.2501 8 11.325Z" fill="black" fill-opacity="0.4"/>
<path d="M18.8911 9.47027C18.6516 10.3638 17.9845 8.02923 16.6509 7.67187C15.3172 7.31452 13.822 9.06974 14.0614 8.17617C14.3009 7.28261 15.8172 6.31422 17.1509 6.67157C18.4845 7.02893 19.1305 8.57671 18.8911 9.47027Z" fill="black" fill-opacity="0.3"/>
<path d="M6.58307 9.47027C6.82249 10.3638 7.48958 8.02923 8.82324 7.67187C10.1569 7.31452 11.6521 9.06974 11.4127 8.17617C11.1733 7.28261 9.6569 6.31422 8.32324 6.67157C6.98957 7.02893 6.34364 8.57671 6.58307 9.47027Z" fill="black" fill-opacity="0.3"/>
</svg>

` },

    { id: "loved", label: "Loved", score: 6, color: "#ff0a3f2c", primaryColor: "#ff00c3d6", svg: 
    `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8193 0C18.2214 0 20.3735 0.604978 21.3867 2.63184C21.773 3.17952 22 4.0389 22 5.31055C22 5.37262 21.9971 5.43444 21.9961 5.49609C21.9971 5.55572 22.0001 5.61592 22 5.67676C21.9993 6.37832 21.922 6.98914 21.7813 7.52051C20.2416 15.2799 11 19.1602 11 19.1602C10.988 19.1551 1.94585 15.3556 0.266603 7.76172C0.096042 7.17613 0.00071994 6.48708 1.16333e-06 5.67676C-5.46043e-05 5.61193 0.00190841 5.54782 0.00293085 5.48438C0.00206287 5.42661 2.5213e-06 5.36868 1.16333e-06 5.31055C1.1645e-06 4.13641 0.185781 3.31318 0.507814 2.7627C1.41413 0.63134 3.42994 0 5.68652 0C7.93058 0.000149752 9.99033 1.3623 10.9346 3.32129C11.6741 1.36191 13.3798 2.35359e-05 15.8193 0Z" fill="#F56080"/>
<path d="M9.5653 8.74212C9.5653 9.56965 8.28055 8.14924 6.69574 8.14924C5.11092 8.14924 3.82617 9.56965 3.82617 8.74212C3.82617 7.9146 5.11092 6.79102 6.69574 6.79102C8.28055 6.79102 9.5653 7.9146 9.5653 8.74212Z" fill="black" fill-opacity="0.2"/>
<path d="M18.1737 8.74212C18.1737 9.56965 16.889 8.14924 15.3041 8.14924C13.7193 8.14924 12.4346 9.56965 12.4346 8.74212C12.4346 7.9146 13.7193 6.79102 15.3041 6.79102C16.889 6.79102 18.1737 7.9146 18.1737 8.74212Z" fill="black" fill-opacity="0.2"/>
<ellipse cx="17" cy="11" rx="2" ry="1" fill="white" fill-opacity="0.3"/>
<ellipse cx="5" cy="11" rx="2" ry="1" fill="white" fill-opacity="0.3"/>
</svg>
` },

  { id: "relaxed", label: "Relaxed", score: 5, color: "#e569f02e", primaryColor: "#a900bc", svg: 
    `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.50049 20.4876C14.0324 21.7637 1.00049 4.54703 6.50049 3.54622C12.0005 2.54542 14.5354 20.0479 18.5005 20.0479C23.5273 20.0479 23.1182 11.0454 21.0005 8.04544" stroke="#E569F0" stroke-width="7" stroke-linecap="round"/>
<path d="M3.02136 5.75979C2.75681 4.77248 4.03401 6.44648 4.98773 6.19093C5.94145 5.93538 6.21054 3.84705 6.47509 4.83437C6.73964 5.82169 6.18096 6.82923 5.22724 7.08478C4.27352 7.34033 3.28591 6.74711 3.02136 5.75979Z" fill="black" fill-opacity="0.3"/>
<path d="M4.53197 8.77213C4.42284 7.89799 6.37035 9.34634 8.51623 9.07845C10.6621 8.81055 12.1938 6.92785 12.3029 7.80199C12.412 8.67613 10.7609 9.60194 8.61503 9.86983C6.46915 10.1377 4.6411 9.64627 4.53197 8.77213Z" fill="white" fill-opacity="0.3"/>
<path d="M7.9909 4.8415C8.26179 3.83053 8.47737 5.95282 9.37997 6.19468C10.2826 6.43653 11.5304 4.70636 11.2595 5.71733C10.9886 6.7283 10.0373 7.35179 9.13473 7.10994C8.23212 6.86809 7.72001 5.85247 7.9909 4.8415Z" fill="black" fill-opacity="0.3"/>
</svg>
` },

  { id: "tired", label: "Tired", score: 2, color: "#9e8fcd46", primaryColor: "#5a00d7", svg: 
    `<svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.1865 19.7722C26.1865 28.1028 20.6946 24.363 13.9199 24.363C7.14516 24.363 2.18652 28.1028 2.18652 19.7722C2.18652 11.4416 9.2785 6 16.0532 6C22.8279 6 26.1865 11.4416 26.1865 19.7722Z" fill="#8160A5"/>
<path d="M7.9465 17.2029C7.9465 15.6953 9.45083 18.2948 11.3065 18.2948C13.1622 18.2948 14.6665 15.6953 14.6665 17.2029C14.6665 18.7105 13.1622 19.9326 11.3065 19.9326C9.45083 19.9326 7.9465 18.7105 7.9465 17.2029Z" fill="black" fill-opacity="0.4"/>
<path d="M17.5466 17.2029C17.5466 15.6953 19.0509 18.2948 20.9066 18.2948C22.7623 18.2948 24.2666 15.6953 24.2666 17.2029C24.2666 18.7105 22.7623 19.9326 20.9066 19.9326C19.0509 19.9326 17.5466 18.7105 17.5466 17.2029Z" fill="black" fill-opacity="0.4"/>
<ellipse cx="12.6865" cy="22" rx="1.5" ry="1" fill="black" fill-opacity="0.2"/>
<path d="M6.21767 7.69615L2.26221 8.75601L1.98863 7.73503L3.57588 4.38196L1.22965 5.01064L0.934335 3.90851L4.84923 2.85952L5.12824 3.90079L3.52203 7.23719L5.92236 6.59403L6.21767 7.69615Z" fill="#333333"/>
<path d="M10.0065 5.36348L7.09545 5.0783L7.16906 4.32689L9.07284 2.48373L7.3461 2.31457L7.42556 1.50345L10.3068 1.78571L10.2317 2.55204L8.31943 4.3793L10.086 4.55236L10.0065 5.36348Z" fill="#333333"/>
</svg>
` },

  { id: "uncomfortable", label: "Uncomfortable", score: 2, color: "#35c8703b", primaryColor: "#5a00d7", svg: 
    `<svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3604 11.5742L15.0801 20.0518L11.0801 26.0518L2.08057 18.5518L11.3604 11.5742Z" fill="#3FCB77"/>
<path d="M9.74461 8.24965L21.7706 5.00001L28.5774 15.4332L20.7583 25.1309L9.11898 20.6912L9.74461 8.24965Z" fill="#3FCB77"/>
<path d="M9.08008 15.0512L1.58023 11.0518L11.5793 2.05178L19.5801 7.55176L9.08008 15.0512Z" fill="#3FCB77"/>
<path d="M13.5776 9.9873C15.5567 10.5874 15.6602 12.1872 15.3689 12.8372C15.0776 13.4873 13.7647 12.3504 11.7856 11.7503C9.80657 11.1501 7.92415 11.5807 8.20214 10.6639C8.48013 9.74721 11.5986 9.38717 13.5776 9.9873Z" fill="black" fill-opacity="0.3"/>
<path d="M21.2185 11.4738C22.4002 10.9645 23.8777 11.7569 24.2557 12.634C24.6338 13.511 23.2977 13.0466 22.116 13.5559C20.9344 14.0653 20.3546 15.3555 19.9766 14.4785C19.5985 13.6014 20.0369 11.9831 21.2185 11.4738Z" fill="black" fill-opacity="0.3"/>
<path d="M12.5786 15.5504C15.6162 15.5504 18.0786 17.1107 18.0786 18.0506C18.0786 18.9905 17.1162 17.0508 14.0786 17.0508C11.041 17.0508 7.07861 18.9905 7.07861 18.0506C7.07861 17.1107 9.54105 15.5504 12.5786 15.5504Z" fill="white" fill-opacity="0.4"/>
</svg>
` },

{ id: "annoyed", label: "Annoyed", score: 1, color: "#e2550f34", primaryColor: "#ff0000", svg: 
    `<svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.89147 6.62655C-4.10853 6.12655 0.866825 26.7411 7.36683 19.7411C21.8668 27.2411 24.3668 18.8162 24.3668 12.7411C31.3665 5.24215 19.3916 -3.87312 13.3668 1.7411C7.36683 -0.373047 4.3916 2.12688 4.89147 6.62655Z" fill="#EA6032"/>
<path d="M12.1064 10.6279C12.1064 11.732 10.5394 12.627 8.60645 12.627C6.67345 12.627 5.10645 11.732 5.10645 10.6279C5.10645 10.6279 6.67345 10.627 8.60645 10.627C10.5394 10.627 12.1064 10.6279 12.1064 10.6279Z" fill="black" fill-opacity="0.4"/>
<path d="M21.1064 10.6279C21.1064 11.732 19.5394 12.627 17.6064 12.627C15.6734 12.627 14.1064 11.732 14.1064 10.6279C14.1064 10.6279 15.6734 10.627 17.6064 10.627C19.5394 10.627 21.1064 10.6279 21.1064 10.6279Z" fill="black" fill-opacity="0.4"/>
<path d="M8.16535 15.3336C8.66063 16.187 11.3733 14.907 14.1087 14.907C16.844 14.907 18.5657 15.3336 19.0614 14.907C19.5572 14.4803 15.8534 13.627 13.1181 13.627C10.3828 13.627 7.67008 14.4803 8.16535 15.3336Z" fill="black" fill-opacity="0.2"/>
</svg>

` },



  { id: "angry", label: "Angry", score: 1, color: "#e01a0034", primaryColor: "#ff0000", svg: 
    `<svg width="29" height="22" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.96818 20.0029C2.9677 2.50293 25.9673 1.50293 21.4677 20.0029" stroke="#D02F13" stroke-width="13"/>
<path d="M15.6286 6.84241C15.8979 7.86848 17.3064 8.37466 18.7747 7.97299C20.2429 7.57133 21.7078 5.1905 20.8258 4.93124C19.9437 4.67198 17.0968 6.44074 15.6286 6.84241Z" fill="black" fill-opacity="0.4"/>
<path d="M13.3655 6.81507C13.0927 7.85453 11.6812 8.37152 10.2128 7.96982C8.74443 7.56811 7.28568 5.16314 8.16941 4.89781C9.05313 4.63248 11.8971 6.41337 13.3655 6.81507Z" fill="black" fill-opacity="0.4"/>
<path d="M19.498 11.9987C19.498 13.9305 17.2595 9.6669 14.498 9.6669C11.7366 9.6669 9.49805 13.9305 9.49805 11.9987C9.49805 10.067 11.7366 8.50098 14.498 8.50098C17.2595 8.50098 19.498 10.067 19.498 11.9987Z" fill="black" fill-opacity="0.2"/>
</svg>

` },

  { id: "depressed", label: "Depressed", score: 1, color: "#1d133e3f", primaryColor: "#2f385e", svg: 
    `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3" cy="3" r="3" fill="#3E4360"/>
<circle cx="5" cy="22" r="5" fill="#3E4360"/>
<path d="M24 16.5C24 22.0225 16.5 22.9987 12.35 22.9987C8.2 22.9987 2 19.5225 2 14C2 8.47752 6.95142 3 12.35 3C20 3.5 24 10.9775 24 16.5Z" fill="#3E4360"/>
<circle cx="23.5" cy="21.5" r="3.5" fill="#3E4360"/>
<path d="M13 15C14.8 15 14.3431 15 16 15C17.6569 15 16.6 15 19 15C19 16.1046 17.6569 17 16 17C14.3431 17 13 16.1046 13 15Z" fill="white" fill-opacity="0.4"/>
<path d="M5 15C6.8 15 6.34315 15 8 15C9.65685 15 8.6 15 11 15C11 16.1046 9.65685 17 8 17C6.34315 17 5 16.1046 5 15Z" fill="white" fill-opacity="0.4"/>
<circle cx="21" cy="5" r="4" fill="#3E4360"/>
</svg>
` },

{ id: "hurt", label: "Hurt", score: 1, color: "#28262d44", primaryColor: "#2f385e", svg: 
    `<svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 13.8163C0 22.1221 7.72531 16.932 14.5 16.932C21.2747 16.932 24 22.1221 24 13.8163C24 0.0851927 16 -2.46387 9 2.03612C4 -0.464374 0 5.51059 0 13.8163Z" fill="#839FB0"/>
<path d="M18 13.4505C18 14.4773 16.35 12.7012 13.05 12.7012C9.75 12.7012 7 15.1155 7 13.4505C7 12.4236 8.91243 11.0361 11.95 11.0361C14.9876 11.0361 18 12.4236 18 13.4505Z" fill="black" fill-opacity="0.2"/>
<path d="M10.3564 6.03613C10.5951 6.37746 10.7362 6.78184 10.7363 7.21777C10.7363 7.7648 10.5165 8.26333 10.1562 8.64746C9.69553 8.57589 9.09299 8.57776 8.44629 8.67188C7.90666 8.75043 7.41799 8.88153 7.03027 9.03809C6.48703 8.70237 6.10149 8.16769 6 7.5459C6.54779 7.5436 7.13404 7.47488 7.72949 7.32812C8.81084 7.0616 9.72687 6.58943 10.3564 6.03613Z" fill="black" fill-opacity="0.4"/>
<path d="M14.3799 6.03613C14.1413 6.37746 14.0001 6.78184 14 7.21777C14 7.7648 14.2198 8.26333 14.5801 8.64746C15.0408 8.57589 15.6433 8.57776 16.29 8.67188C16.8297 8.75043 17.3183 8.88153 17.7061 9.03809C18.2493 8.70237 18.6348 8.16769 18.7363 7.5459C18.1885 7.5436 17.6023 7.47488 17.0068 7.32812C15.9255 7.0616 15.0095 6.58943 14.3799 6.03613Z" fill="black" fill-opacity="0.4"/>
</svg>
` },

  { id: "sad", label: "Sad", score: 2, color: "#008cff23", primaryColor: "#237ff0", svg: 
    `<svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.8197 13.2648C24.9781 7.45245 17.5016 5.34655 21.188 0.0666636C10.1287 -0.463785 -0.243499 6.37679 0.121325 12.2266C0.486148 18.0764 4.71424 20.1658 10.6547 20.1317C16.5952 20.0976 22.6612 19.0771 23.8197 13.2648Z" fill="#30B0E2"/>
<path d="M18.0032 10.2412C18.3934 8.78498 16.4175 10.7215 14.625 10.2412C12.8326 9.76092 11.9024 7.04572 11.5122 8.50194C11.122 9.95817 12.2587 11.528 14.0512 12.0083C15.8436 12.4886 17.613 11.6974 18.0032 10.2412Z" fill="black" fill-opacity="0.3"/>
<path d="M15.1255 15.8735C15.1255 16.7603 13.5585 14.0133 11.6255 14.0133C9.6925 14.0133 8.12549 16.7603 8.12549 15.8735C8.12549 14.9866 9.6925 13.0498 11.6255 13.0498C13.5585 13.0498 15.1255 14.9866 15.1255 15.8735Z" fill="white" fill-opacity="0.3"/>
<path d="M9.41831 8.50194C9.02811 7.04571 7.91745 9.76092 6.12501 10.2412C4.33256 10.7215 2.53709 8.78497 2.92728 10.2412C3.31748 11.6974 5.08686 12.4886 6.87931 12.0083C8.67175 11.528 9.8085 9.95816 9.41831 8.50194Z" fill="black" fill-opacity="0.3"/>
</svg>

` }
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
  activeMoodIndex = 0;
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

  const total = moodConfig.length;
  const step = 360 / total;

  // 1. Calculate which index is physically closest to the focal target
  let normalized = (FOCAL_TARGET_ANGLE - currentRotationAngle) % 360;
  if (normalized < 0) normalized += 360;

  activeMoodIndex = Math.round(normalized / step) % total;

  // 2. Compute the SHORTEST relative angle difference to snap without jumping
  const idealNormalizedAngle = activeMoodIndex * step;
  let angleDelta = (FOCAL_TARGET_ANGLE - idealNormalizedAngle) - (currentRotationAngle % 360);

  // Shortest path correction across 360 boundary
  if (angleDelta > 180) angleDelta -= 360;
  if (angleDelta < -180) angleDelta += 360;

  // Apply the delta relative to current angle (preserves momentum position)
  currentRotationAngle += angleDelta;

  // 3. Add smooth snap class
  wheel.classList.add("snapping");
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
