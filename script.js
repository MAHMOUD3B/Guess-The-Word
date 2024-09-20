// setting the game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Mahmoud Mohamed Abbas`;

// setting game options
const numberOfTries = 5;
const numberOfInputs = 6;
let numberOfHints = 2;
let currentTry = 1;

function generateInput() {
  const inputContainer = document.querySelector(".inputs");
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    if (i !== 1) tryDiv.classList.add("disabled-inputs");
    for (let j = 1; j <= numberOfInputs; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `geuss-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputContainer.appendChild(tryDiv);
  }

  // focus on first input
  inputContainer.children[0].children[1].focus();

  // disable all inputs except first one
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      // convert letter to uppercase
      this.value = this.value.toUpperCase();
      // focus on the next input
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const checkBtn = document.querySelector(".check");
const hintBtn = document.querySelector(".hint");
checkBtn.addEventListener("click", handleCheck);

// manage words
let wordToGeuss = "";
const words = [
  "create",
  "update",
  "delete",
  "master",
  "branch",
  "school",
  "hassan",
];
wordToGeuss = words[Math.floor(Math.random() * words.length)].toLowerCase();

// manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
let hintsBtn = document.querySelector(".hint");
hintBtn.addEventListener("click", getHint);

// handle backspace
function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.focus();
      prevInput.value = "";
    }
  }
}
document.addEventListener("keydown", handleBackspace);

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    hintBtn.classList.add("disabled");
  }

  const otherTryInputs = document.querySelectorAll(`input`);
  otherTryInputs.forEach((input) => {
    input.disabled = true;
  });
  const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
  nextTryInputs.forEach((input) => {
    input.disabled = false;
  });
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  console.log(enabledInputs);

  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGeuss[indexToFill].toUpperCase();
    }
  }
}

function handleCheck() {
  let successGeuss = true;
  for (let i = 1; i <= numberOfInputs; i++) {
    const inputField = document.querySelector(
      `#geuss-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGeuss[i - 1];

    // game logic
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGeuss.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGeuss = false;
    } else {
      inputField.classList.add("no");
      successGeuss = false;
    }
  }

  // check if the user win or lose
  let message = document.querySelector(".message");
  if (successGeuss) {
    message.innerHTML = `you win the word is <span>${wordToGeuss}</span>!`;

    // add disabled class to all inputs & control buttons
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((trydiv) => {
      trydiv.classList.add("disabled-inputs");
    });
    checkBtn.classList.add("disabled");
    hintBtn.classList.add("disabled");
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => {
      input.disabled = false;
    });
    const el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      checkBtn.classList.add("disabled");
      hintBtn.classList.add("disabled");
      message.innerHTML = `you lose the word is <span>${wordToGeuss}</span>!`;
    }
  }
}

window.onload = function () {
  generateInput();
};
