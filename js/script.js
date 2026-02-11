let userName = "";

function submitName() {
  const input = document.getElementById("name-input");
  userName = input.value.trim();

  if (!userName) {
    alert("Please enter your name ❤️");
    return;
  }

  document.getElementById("name-screen").classList.add("hidden");
  document.getElementById("question-screen").classList.remove("hidden");

  // Start music after user interaction
  const music = document.getElementById("bg-music");
  music.play().catch(() => {});
}

function answerYes() {
  document.getElementById("question-screen").classList.add("hidden");
  document.getElementById("success-screen").classList.remove("hidden");

  const message = document.getElementById("personal-message");
  message.innerText = `Thank you, ${userName}. You just made me the happiest person alive ❤️`;
}

function moveNoButton() {
  const button = document.getElementById("no-button");

  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 50);

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}