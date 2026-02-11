const intendedPersonName = "Yohana Sinta Kristyasari";
const intendedPersonNickname = "Sinta";

let emptyNameErrorCount = 0;
let emptyNameErrorTexts = [
  "Tell me your name first",
  "I need to know who you are before we continue",
  "I need to make sure you are who I think you are",
  "This site is intended for a special person,\nI need to make sure it's you",
  "I can do this all day, you know",
  "I don't want this to land on someone\nother than the intended person",
  "This is a private site,\nonly the intended person should see it",
  "We won't be able to continue\nif you don't tell me your name",
  "Nope",
  "That won't do",
  "I need a name",
  "Give it up already",
  "Not going anywhere, are we?",
  "Fine, you can leave it blank",
  "SIKE! HAHA",
  "Please give me your name",
  "Do you not know your name?",
  "I need you to tell me your name",
  "**THIS IS AN AUTOMATED MESSAGE**\nThe person behind this had left, and will remain gone\nuntil you input your name",
]

let partialNameErrorCount = 0;
let partialNameErrorTexts = [
  "Is that you? Please enter your full name",
  "Are you who I think you are? Please enter your full name",
  "Hmmm, I can't be sure yet. Please enter your full name",
  "Is this the person I'm looking for? Please enter your full name",
  "I'm still not sure about that. Please enter your full name",
  "Are you who I'm looking for? Please enter your full name",
  "If this is really you, please enter your full name",
  "Please enter your full name",
  "Is that your full name? If so, then sorry you can't continue",
]

let wrongNameErrorCount = 0;
let wrongNameErrorTexts = [
  "I'm sorry, I don't think you're the right person",
  "Hello? Why are you still here?",
  "Who are you?",
  "The exit's in front of you",
  "Please press the \"X\" button on this browser tab",
  "This is a private site,\nonly the intended person may continue",
  "You may leave now",
  "Any second now",
  "Goodbye",
  "**THIS IS AN AUTOMATED MESSAGE**\nThe person behind this had left, and will remain gone",
]

function showNameErrorText(key) {
  const errorText = document.getElementById("error-text");
  const input = document.getElementById("name-input");

  switch (key) {
    case "empty":
      if (emptyNameErrorCount < emptyNameErrorTexts.length) {
        errorText.innerText = emptyNameErrorTexts[emptyNameErrorCount];
        emptyNameErrorCount++;
      } else {
        errorText.innerText = emptyNameErrorTexts[emptyNameErrorTexts.length - 1];
      }
      break;
    case "partial":
      if (partialNameErrorCount < partialNameErrorTexts.length) {
        errorText.innerText = partialNameErrorTexts[partialNameErrorCount];
        partialNameErrorCount++;
      } else {
        showNameErrorText("wrong");
        return;
      }
      break;
    case "wrong":
      if (wrongNameErrorCount < wrongNameErrorTexts.length) {
        errorText.innerText = wrongNameErrorTexts[wrongNameErrorCount];
        wrongNameErrorCount++;
      } else {
        errorText.innerText = wrongNameErrorTexts[wrongNameErrorTexts.length - 1];
      }
      break;
  }

  input.classList.remove("shake"); // reset if already applied
  void input.offsetWidth; // force reflow so animation can replay
  input.classList.add("shake");
}

function validateUser(name) {
  const normalized = name.toLowerCase().replace(/\s+/g, " ").trim();
  const expected = "yohana sinta kristyasari";

  // Exact match
  if (normalized === expected) {
    return true;
  }

  // Check partial name parts
  const expectedParts = expected.split(" ");
  const inputParts = normalized.split(" ");

  // 1️⃣ Check if all words are valid
  const allValidWords = inputParts.every(part => expectedParts.includes(part));

  if (!allValidWords) {
    showNameErrorText("wrong");
    return false;
  }

  // 2️⃣ Check correct order (subsequence check)
  let lastIndex = -1;
  let isInOrder = true;

  for (const part of inputParts) {
    const currentIndex = expectedParts.indexOf(part);

    if (currentIndex <= lastIndex) {
      isInOrder = false;
      break;
    }

    lastIndex = currentIndex;
  }

  if (isInOrder) {
    showNameErrorText("partial");
  } else {
    showNameErrorText("wrong");
  }

  return false
}

function showScreen(screenId) {
  document.getElementById("name-screen").classList.add("hidden");
  document.getElementById("question-screen").classList.add("hidden");
  document.getElementById("success-screen").classList.add("hidden");

  document.getElementById(screenId).classList.remove("hidden");
}

function submitName() {
  const input = document.getElementById("name-input");
  const userName = input.value.trim();

  if (!userName) {
    showNameErrorText("empty");
    return;
  }

  if (!validateUser(userName)) return;

  showScreen("question-screen");

  // Start music after user interaction
  const music = document.getElementById("bg-music");
  music.play().catch(() => { });
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