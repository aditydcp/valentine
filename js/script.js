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

  showScreen("question-screen");

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