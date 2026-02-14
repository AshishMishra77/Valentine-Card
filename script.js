/* ================== STATE ================== */
let yesScale = 1;
let phaseIndex = 0;
let qIndex = 0;
let typing = false;
let typingInterval = null;

/* ================== UTILS ================== */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ================== DATA ================== */
const phases = [
  {
    questions: shuffle([
      "Tum meri kahaani ka wo scene banogi jo kabhi fade na ho?",
      "Dil toh tumne kab ka le liya… Valentine bhi ban jaogi?"
    ]),
    panda: "panda1.gif"
  },
  {
    questions: shuffle([
      "Agar main hamesha saath rahun, chalega?",
      "Toh final pooch loon… meri zindagi banogi?"
    ]),
    panda: "panda3.gif"
  }
];

/* ================== ELEMENTS ================== */
const questionEl = document.getElementById("question");
const pandaGif = document.getElementById("pandaGif");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const callBtn = document.getElementById("callBtn");

const popSound = document.getElementById("popSound");
const hoverSound = document.getElementById("hoverSound");
const bgMusic = document.getElementById("bgMusic");
const finalMusic = document.getElementById("finalMusic");

/* ================== TYPEWRITER (FIXED) ================== */
function typeText(text) {
  if (typingInterval) {
    clearInterval(typingInterval);
  }

  typing = true;
  questionEl.textContent = "";
  let i = 0;

  typingInterval = setInterval(() => {
    if (i < text.length) {
      questionEl.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      typing = false;
    }
  }, 40);
}

/* ================== START OVERLAY ================== */
const overlay = document.getElementById("startOverlay");

overlay.addEventListener("click", () => {
  bgMusic.volume = 0.3;
  bgMusic.play();
  overlay.style.display = "none";

  typeText(phases[0].questions[0]);
});

/* ❌ REMOVED extra auto start timeout */
/* DELETE THIS FROM YOUR OLD CODE:
setTimeout(() => {
  typeText(phases[0].questions[0]);
}, 300);
*/

/* ================== NO BUTTON ================== */
noBtn.addEventListener("mouseover", () => {
  hoverSound.play();
  noBtn.style.transform =
    `translate(${Math.random()*220-110}px, ${Math.random()*100-50}px)`;
});

noBtn.addEventListener("click", () => {
  if (typing) return;

  yesScale += 0.15;
  yesBtn.style.transform = `scale(${yesScale})`;

  if (qIndex < phases[phaseIndex].questions.length - 1) {
    qIndex++;
    pandaGif.src = "panda2.gif";
    typeText(phases[phaseIndex].questions[qIndex]);
  } else {
    handleYes();
  }
});

/* ================== YES BUTTON ================== */
yesBtn.addEventListener("click", handleYes);

function handleYes() {
  popSound.play();

  if (phaseIndex < phases.length - 1) {
    phaseIndex++;
    qIndex = 0;
    pandaGif.src = phases[phaseIndex].panda;
    typeText(phases[phaseIndex].questions[qIndex]);
  } else {
    finalYes();
  }
}

/* ================== FINAL YES ================== */
function finalYes() {
  bgMusic.pause();
  finalMusic.volume = 0.5;
  finalMusic.play();

  pandaGif.src = "pandaFinal.gif";
  typeText("Bas! Ab tum meri zindagi ho 💍💖");

  noBtn.style.display = "none";
  yesBtn.style.display = "none";
  callBtn.style.display = "block";
}
