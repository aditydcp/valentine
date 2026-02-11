let userName = "";

function showScreen(screenId) {
  document.getElementById("name-screen").classList.add("hidden");
  document.getElementById("question-screen").classList.add("hidden");
  document.getElementById("success-screen").classList.add("hidden");

  document.getElementById(screenId).classList.remove("hidden");
}

function submitName() {
  const input = document.getElementById("name-input");
  userName = input.value.trim();

  if (!userName) {
    alert("Please enter your name ❤️");
    return;
  }

  showScreen("question-screen");

  // Start music after user interaction
  const music = document.getElementById("bg-music");
  music.play().catch(() => { });
}

function answerYes() {
  showScreen("success-screen");

  const message = document.getElementById("personal-message");
  message.innerText = `Thank you, ${userName}. You just made me the happiest person alive ❤️`;
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