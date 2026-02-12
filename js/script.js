import { emptyNameErrorTexts, partialNameErrorTexts, wrongNameErrorTexts, rejectQuestionErrorTexts } from "./texts.js";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

const intendedPersonName = "Yohana Sinta Kristyasari";
const intendedPersonNickname = "Sinta";

const errorState = {
  empty: { count: 0, texts: emptyNameErrorTexts },
  partial: { count: 0, texts: partialNameErrorTexts },
  wrong: { count: 0, texts: wrongNameErrorTexts },
};

const questionMode = ["anti-reject", "pro-yes"];

const questionState = {
  reject: { count: 0, texts: rejectQuestionErrorTexts },
  yes: { scale: 1, zIndex: 0 },
  mode: Math.random() < 0.5 ? questionMode[0] : questionMode[1],
}

function showNameErrorText(type) {
  const errorText = document.getElementById("name-error-text");
  const input = document.getElementById("name-input");

  const state = errorState[type];
  if (!state) return;

  errorText.classList.remove("hidden");

  const { count, texts } = state;

  errorText.innerText = texts[Math.min(count, texts.length - 1)];

  state.count++;

  // Shake animation
  input.classList.remove("shake");
  void input.offsetWidth;
  input.classList.add("shake");
}

function validateUser(name) {
  const normalized = name.toLowerCase().replace(/\s+/g, " ").trim();
  const expected = intendedPersonName.toLowerCase().replace(/\s+/g, " ").trim();

  if (normalized === expected) {
    return { valid: true };
  }

  const expectedParts = expected.split(" ");
  const inputParts = normalized.split(" ");

  const allValidWords = inputParts.every(part =>
    expectedParts.includes(part)
  );

  if (!allValidWords) {
    return { valid: false, type: "wrong" };
  }

  // subsequence check
  let lastIndex = -1;

  for (const part of inputParts) {
    const currentIndex = expectedParts.indexOf(part);

    if (currentIndex <= lastIndex) {
      return { valid: false, type: "wrong" };
    }

    lastIndex = currentIndex;
  }

  return { valid: false, type: "partial" };
}

function showScreen(screenId) {
  document.querySelectorAll("[id$='-screen']")
    .forEach(el => el.classList.add("hidden"));

  document.getElementById(screenId)
    .classList.remove("hidden");
}

function submitName() {
  const input = document.getElementById("name-input");
  const userName = input.value.trim();

  if (!userName) {
    showNameErrorText("empty");
    return;
  }

  const result = validateUser(userName);

  if (!result.valid) {
    showNameErrorText(result.type);
    return;
  }

  playSound("question-song", { volume: 0.4, loop: true });

  showWelcomeTransition();
}

const confettiCanvas = document.createElement("canvas");

const myConfetti = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true
});
window.myConfetti = myConfetti; // debug purpose

function triggerSprayConfetti() {
  // Continuous confetti burst
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ffb6c1", "#ff69b4", "#ffc0cb", "#ffffff"],
      startVelocity: 30,
      gravity: 0.8,
      scalar: 0.8,
    });

    myConfetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ffb6c1", "#ff69b4", "#ffc0cb", "#ffffff"],
      startVelocity: 30,
      gravity: 0.8,
      scalar: 0.8,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function triggerPopConfetti() {
  // Initial explosive pop
  myConfetti({
    particleCount: 300,
    spread: 120,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.6 },
    ticks: 60
  });

  // Slow-mo continuation layer
  setTimeout(() => {
    myConfetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 20,
      gravity: 0.4,     // lighter gravity
      ticks: 250,       // stay longer
      scalar: 1.1,
      origin: { x: 0.5, y: 0.6 }
    });
  }, 120);
}

let confettiInterval;

function startFallingConfetti() {
  if (confettiInterval) return;

  confettiInterval = setTimeout(function spawn() {
    myConfetti({
      particleCount: 3,
      angle: 90,
      spread: 50,

      startVelocity: 20,
      gravity: 0.45,
      ticks: 800,

      drift: (Math.random() - 0.5) * 2,

      scalar: Math.random() * 0.5 + 0.7,

      origin: {
        x: Math.random(),
        y: 0
      },

      colors: ["#ffb6c1", "#ffc0cb", "#ffffff", "#ffd1dc"]
    });

    confettiInterval = setTimeout(spawn, 120 + Math.random() * 120);
  }, 150);
}

function stopFallingConfetti() {
  clearInterval(confettiInterval);
  confettiInterval = null;
}

function triggerAllConfetti() {
  triggerPopConfetti();

  setTimeout(() => {
    triggerSprayConfetti();
  }, 150);

  setTimeout(() => {
    startFallingConfetti();
  }, 300);
}

function answerYes() {
  document.getElementById("hearts-bg").classList.add("hidden");
  stopHearts();

  stopSound("question-song");
  playSound("confetti-sfx");
  setTimeout(() => {
    playSound("finish-song", { volume: 0.45, loop: true });
  }, 1000);

  triggerAllConfetti();

  if (navigator.vibrate) {
    navigator.vibrate(2000);
  }

  showScreen("success-screen");
}

function answerNo() {
  updateQuestionState();

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

function resetQuestion() {
  updateQuestionState(true);
}

function updateQuestionState(reset = false) {
  const errorText = document.getElementById("question-error-text");
  const yesButtonContainer = document.getElementById("yes-button-container");
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");
  const resetButton = document.getElementById("reset-button");

  if (reset) {
    questionState.reject = { count: 0, texts: rejectQuestionErrorTexts };
    questionState.yes = { scale: 1, zIndex: 0 };
    questionState.mode = questionMode[questionState.mode === questionMode[0] ? 1 : 0];

    toggleCat("normal");
    errorText.classList.add("hidden");
    yesButton.style.transform = "scale(1)";
    yesButtonContainer.classList.remove("z-10");
    noButton.style.transform = "translate(0px, 0px)";
    noButton.classList.remove("absolute");
    resetButton.classList.add("hidden");

    return;
  }

  const { count, texts } = questionState.reject;

  errorText.classList.remove("hidden");

  if (count === 0) toggleCat("angy");

  if (count >= 3) resetButton.classList.remove("hidden");

  errorText.innerText = texts[Math.min(count, texts.length - 1)];

  questionState.reject.count++;

  if (questionState.mode === "anti-reject") moveNoButton();
  if (questionState.mode === "pro-yes") enlargeYesButton();

  // Shake animation
  yesButtonContainer.classList.remove("shake");
  void yesButtonContainer.offsetWidth;
  yesButtonContainer.classList.add("shake");
}

function toggleCat(state) {
  const image = document.getElementById("question-img");
  switch (state) {
    case "normal":
      image.src = "assets/rose_cat.png";
      break;
    case "angy":
      image.src = "assets/rose_cat_angy.png";
      break;
  }
}

function enlargeYesButton() {
  const container = document.getElementById("yes-button-container");
  const button = document.getElementById("yes-button");

  questionState.yes.zIndex = 10;
  container.classList.add("z-10");

  let currentScale = questionState.yes.scale;
  currentScale *= 1.2;
  questionState.yes.scale = currentScale;

  button.style.transform = `scale(${currentScale})`;
}

function moveNoButton() {
  const button = document.getElementById("no-button");
  const container = document.getElementById("bounding-container");

  const padding = 40;

  button.classList.add("absolute");

  const containerRect = container.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();

  // Maximum allowed position (inside padding)
  const maxX = containerRect.width - buttonRect.width - padding;
  const maxY = containerRect.height - buttonRect.height - padding;

  // Random target inside safe area
  const targetX = Math.random() * (maxX - padding) + padding;
  const targetY = Math.random() * (maxY - padding) + padding;

  // Current position relative to container
  const currentX = buttonRect.left - containerRect.left;
  const currentY = buttonRect.top - containerRect.top;

  // Compute translation delta
  const deltaX = targetX - currentX;
  const deltaY = targetY - currentY;

  button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

function createSparkles() {
  const container = document.getElementById("sparkle-container");
  container.innerHTML = "";

  const createStar = (className, sizeMin, sizeMax, count) => {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.classList.add("star", className);

      const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const duration = Math.random() * 3 + 4;
      star.style.animationDuration = `${duration}s`;

      container.appendChild(star);
    }
  };

  // ⭐ Large (few, dramatic)
  createStar("star-large", 14, 20, 8);

  // ✨ Medium (main layer)
  createStar("star-medium", 8, 14, 15);

  // · Micro stars (ambient background)
  createStar("star-micro", 2, 4, 40);
}

function showWelcomeTransition() {
  const overlay = document.getElementById("welcome-overlay");
  const overlayTextContainer = document.getElementById("welcome-text-container");

  // Show overlay
  setTimeout(() => {
    overlay.classList.remove("opacity-0", "pointer-events-none");
    document.getElementById("hearts-bg").classList.remove("hidden");
    startHearts();
  }, 750);

  // Create sparkles
  createSparkles();

  // Start the animation
  overlayTextContainer.classList.add("animate-welcome");

  // After seconds delay → move to question screen
  setTimeout(() => {
    showScreen("question-screen");

    // Fade out overlay
    overlay.classList.add("opacity-0");

    // Remove blocking after fade
    setTimeout(() => {
      overlay.classList.add("pointer-events-none");
    }, 500);

  }, 5000);
}

function playSound(id, { volume = 1, loop = false } = {}) {
  const audio = document.getElementById(id);
  if (!audio) return;

  audio.currentTime = 0;
  audio.volume = volume;
  audio.loop = loop;

  audio.play().catch(() => { });
}

function stopSound(id) {
  const audio = document.getElementById(id);
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}

let heartSpawner = null;

function spawnHeart() {
  const container = document.getElementById("hearts-bg");
  if (!container) return;

  const heart = document.createElement("div");
  heart.className = "floating-heart";

  // random size
  const size = Math.random() * 18 + 12;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  // random horizontal start
  heart.style.left = Math.random() * 100 + "vw";

  // random duration
  const duration = Math.random() * 8 + 10;
  heart.style.animationDuration = duration + "s";

  // random opacity
  heart.style.opacity = Math.random() * 0.5 + 0.4;

  // random drift distance
  heart.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");

  // random color (pink + white mix)
  const colors = ["#ff6fa5", "#ff8fc0", "#ffc0cb", "#ffffff"];
  heart.style.background = colors[Math.floor(Math.random() * colors.length)];

  container.appendChild(heart);

  // remove after animation
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

function startHearts() {
  if (heartSpawner) return;

  const loop = () => {
    spawnHeart();

    // random spawn timing (stream feel)
    const next = Math.random() * 500 + 200;
    heartSpawner = setTimeout(loop, next);
  };

  loop();
}

function stopHearts() {
  clearTimeout(heartSpawner);
  heartSpawner = null;

  const container = document.getElementById("hearts-bg");
  if (container) container.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submit-button")
    .addEventListener("click", submitName);

  document
    .getElementById("yes-button")
    .addEventListener("click", answerYes);

  document
    .getElementById("no-button")
    .addEventListener("click", answerNo);

  document
    .getElementById("reset-button")
    .addEventListener("click", resetQuestion);

  document.body.appendChild(confettiCanvas);
  Object.assign(confettiCanvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "9999"
  });
});