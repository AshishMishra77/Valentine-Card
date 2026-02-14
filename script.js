/* ================== STATE ================== */
let yesScale = 1;
let phaseIndex = 0;
let qIndex = 0;
let typing = false;

/* ================== UTILS ================== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
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
const shareBtn = document.getElementById("shareBtn");

const popSound = document.getElementById("popSound");
const hoverSound = document.getElementById("hoverSound");
const bgMusic = document.getElementById("bgMusic");
const finalMusic = document.getElementById("finalMusic");

/* ================== MUSIC ================== */
/* Try autoplay immediately (best possible) */
const overlay = document.getElementById("startOverlay");

overlay.addEventListener("click", () => {
  bgMusic.volume = 0.3;
  bgMusic.play();

  overlay.style.display = "none";

  // start first question after music
  setTimeout(() => {
    typeText(phases[0].questions[0]);
  }, 200);
});

/* Fallback: first interaction */
document.body.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.volume = 0.3;
    bgMusic.play();
  }
}, { once: true });

/* ================== TYPEWRITER ================== */
function typeText(text) {
  typing = true;
  questionEl.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    questionEl.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(interval);
      typing = false;
    }
  }, 40);
}

/* ================== START ================== */
setTimeout(() => {
  typeText(phases[0].questions[0]);
}, 300);

/* ================== NO BUTTON ================== */
noBtn.addEventListener("mouseover", () => {
  hoverSound.play();
  noBtn.style.transform = `translate(${Math.random()*220-110}px, ${Math.random()*100-50}px)`;
});

noBtn.addEventListener("click", () => {
  if (typing) return;

  /* YES button grows */
  yesScale += 0.15;
  yesBtn.style.transform = `scale(${yesScale})`;

  /* Next question or force YES */
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
  shareBtn.style.display = "block";

  partyPopper();
}

/* ================== STARS ================== */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.8 + 0.8,
  o: Math.random(),
  s: Math.random() * 0.5 + 0.2
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,182,213,${s.o})`;
    ctx.fill();
    s.o += s.s * (Math.random() > 0.5 ? 1 : -1);
    s.o = Math.min(1, Math.max(0.1, s.o));
  });
  requestAnimationFrame(animateStars);
}
animateStars();

/* ================== PARTY POPPER ================== */
function partyPopper() {
  let particles = [];

  [0, canvas.width].forEach(x => {
    for (let i = 0; i < 60; i++) {
      particles.push({
        x,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16,
        life: 90,
        c: `hsl(${Math.random()*360},100%,60%)`
      });
    }
  });

  (function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateStars();
    particles.forEach(p => {
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, 6, 3);
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length) requestAnimationFrame(anim);
  })();
}

/* ================== SAVE IMAGE ================== */
shareBtn.addEventListener("click", async () => {
  const reel = document.getElementById("reel");
  const canvasEl = document.getElementById("confetti");

  reel.classList.add("no-border");
  canvasEl.style.display = "none";

  await new Promise(r => setTimeout(r, 300));

  try {
    const img = await html2canvas(reel, {
      backgroundColor: "#ffe6ef",
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const a = document.createElement("a");
    a.href = img.toDataURL("image/png");
    a.download = "Ashish-Valentine.png";
    a.click();
  } catch (e) {
    alert("Screenshot failed. Use Chrome desktop.");
  }

  canvasEl.style.display = "block";
  reel.classList.remove("no-border");
});

document.getElementById("callBtn").style.display = "block";
