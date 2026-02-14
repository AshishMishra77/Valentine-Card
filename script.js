let phaseIndex = 0;
let qIndex = 0;
let yesScale = 1;
let typingInterval = null;
let typing = false;

const phases = [
  {
    questions: [
      "Tum meri kahaani ka wo scene banogi jo kabhi fade na ho?",
      "Dil toh tumne kab ka le liya… Valentine bhi ban jaogi?"
    ],
    panda: "panda1.gif"
  },
  {
    questions: [
      "Agar main hamesha saath rahun, chalega?",
      "Toh final pooch loon… meri zindagi banogi?"
    ],
    panda: "panda3.gif"
  }
];

const questionEl = document.getElementById("question");
const pandaGif = document.getElementById("pandaGif");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const callBtn = document.getElementById("callBtn");

const bgMusic = document.getElementById("bgMusic");
const finalMusic = document.getElementById("finalMusic");
const popSound = document.getElementById("popSound");
const hoverSound = document.getElementById("hoverSound");

function typeText(text) {
  if (typingInterval) clearInterval(typingInterval);

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

/* Start Overlay */
document.getElementById("startOverlay").addEventListener("click", () => {
  bgMusic.volume = 0.3;
  bgMusic.play();
  document.getElementById("startOverlay").style.display = "none";
  typeText(phases[0].questions[0]);
});

/* No Button Escape */
noBtn.addEventListener("mouseover", () => {
  hoverSound.play();
  noBtn.style.transform =
    `translate(${Math.random()*200-100}px, ${Math.random()*80-40}px)`;
});

noBtn.addEventListener("click", () => {
  if (typing) return;

  yesScale += 0.2;
  yesBtn.style.transform = `scale(${yesScale})`;

  if (qIndex < phases[phaseIndex].questions.length - 1) {
    qIndex++;
    pandaGif.src = "panda2.gif";
    typeText(phases[phaseIndex].questions[qIndex]);
  } else {
    handleYes();
  }
});

/* Yes Button */
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

function finalYes() {
  bgMusic.pause();
  finalMusic.volume = 0.5;
  finalMusic.play();

  pandaGif.src = "pandaFinal.gif";
  typeText("Bas! Ab tum meri zindagi ho 💍💖");

  yesBtn.style.display = "none";
  noBtn.style.display = "none";
  callBtn.style.display = "block";
}
