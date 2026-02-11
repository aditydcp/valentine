import { emptyNameErrorTexts, partialNameErrorTexts, wrongNameErrorTexts } from "./texts.js";

const intendedPersonName = "Yohana Sinta Kristyasari";
const intendedPersonNickname = "Sinta";

const errorState = {
  empty: { count: 0, texts: emptyNameErrorTexts },
  partial: { count: 0, texts: partialNameErrorTexts },
  wrong: { count: 0, texts: wrongNameErrorTexts },
};

function showNameErrorText(type) {
  const errorText = document.getElementById("error-text");
  const input = document.getElementById("name-input");

  const state = errorState[type];

  if (!state) return;

  const { count, texts } = state;

  errorText.innerText =
    count < texts.length
      ? texts[count]
      : texts[texts.length - 1];

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

  showWelcomeTransition();

  document.getElementById("bg-music")
    .play()
    .catch(() => {});
}

function answerYes() {
  showScreen("success-screen");

  const message = document.getElementById("personal-message");
  message.innerText = `Thank you, ${intendedPersonNickname}. You just made me the happiest person alive ❤️`;
}

function moveNoButton() {
  const button = document.getElementById("no-button");
  const container = button.parentElement.parentElement.parentElement;

  button.classList.add("absolute");

  const maxX = container.clientWidth - 2 * button.clientWidth;
  const maxY = container.clientHeight - 2 * button.clientHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  button.style.transform = `translate(${x}px, ${y}px)`;

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
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
  overlay.classList.remove("opacity-0", "pointer-events-none");

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

  }, 2500);
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
    .addEventListener("click", moveNoButton);
});