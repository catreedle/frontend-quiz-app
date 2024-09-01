const initialQuizState = {
  topic: "",
  questions: [],
  score: 0,
  quizIndex: 0,
  totalQuestions: 0,
  imageSource: "",
};

let quizState = { ...initialQuizState };

const toggleThemeElement = document.getElementById("toggle-theme");
const quizMenuSection = document.querySelector(".quiz__menu");
const quizMenuOptions = document.getElementById("quiz-menu-options");
const quizQuestionSection = document.querySelector(".quiz__question");
const quizCompletedSection = document.querySelector(".quiz__completed");
const submitButton = document.querySelector(".quiz__answer__submit");
const nextButton = document.querySelector(".quiz__answer__next");
const viewResultButton = document.querySelector(".quiz__result");
const playAgainButton = document.querySelector(".quiz__play__again");

window.addEventListener("DOMContentLoaded", () => {
  fetchQuizData()
    .then((data) => {
      initializeApp(data);
    })
    .catch((error) => {
      console.error("Error fetching quiz data:", error);
    });
});

function handleToggleTheme() {
  const iconSunDark = document.getElementById("sun-dark");
  const iconSunLight = document.getElementById("sun-light");
  const iconMoonDark = document.getElementById("moon-dark");
  const iconMoonLight = document.getElementById("moon-light");
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);

  iconSunDark.classList.toggle("hidden");
  iconSunLight.classList.toggle("hidden");
  iconMoonDark.classList.toggle("hidden");
  iconMoonLight.classList.toggle("hidden");
}

toggleThemeElement.addEventListener("input", handleToggleTheme);
toggleKeyPress();

function initializeApp(quizData) {
  showMenuSection(quizData);
  attachMenuEventListener(quizData);
}

async function fetchQuizData() {
  try {
    const response = await fetch("/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow to be handled in the .catch() of the calling function
  }
}

// menu section
function showMenuSection(quizData) {
  const quizzes = quizData.quizzes;

  let quizMenuOptionsContent = "";
  quizzes.forEach((quiz) => {
    quizMenuOptionsContent += `
        <li class="quiz__menu__option quiz__option clickable" tabindex="0">
          <div class="img-${quiz.title}">
            <img src=${quiz.icon} alt="title-${quiz.title}">
          </div>
          <span>${quiz.title}</span>
        </li>`;
  });
  quizMenuOptions.innerHTML = quizMenuOptionsContent;
}

function attachMenuEventListener(quizData) {
  const quizMenuOptionsListItems = Array.from(quizMenuOptions.children);

  quizMenuOptionsListItems.forEach((li) => {
    li.addEventListener("click", (event) =>
      handleMenuItemClick(event, quizData)
    );
  });

  selectOnKeyPress(); //
}

function handleMenuItemClick(event, quizData) {
  const quizTopic = getQuizTopic(event);
  const quizzes = getQuizzesByTopic(quizTopic, quizData);
  quizState = createQuizStateFromQuizzes(initialQuizState, quizzes);
  quizState = updateImageSource(quizState, quizzes);
  showQuestionSection(quizState);
}

// question section
function getQuizTopic(event) {
  return event.currentTarget.innerText;
}

function getQuizzesByTopic(quizTopic, quizData) {
  const { quizzes } = quizData;
  const selectedTopicQuizzes = quizzes.find((data) => data.title === quizTopic);
  return selectedTopicQuizzes;
}

function createQuizStateFromQuizzes(initialQuizState, quizzes) {
  return {
    ...initialQuizState,
    topic: quizzes.title,
    questions: quizzes.questions,
    totalQuestions: quizzes.questions.length,
  };
}

function updateImageSource(quizState, selectedQuizzes) {
  return {
    ...quizState,
    imageSource: selectedQuizzes.icon,
  };
}

function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
}

function showQuestionSection(quizState) {
  toggleSectionsVisibility();
  updateQuizContent(quizState);
}

function toggleSectionsVisibility() {
  toggleVisibility(quizMenuSection, false);
  toggleVisibility(quizQuestionSection, true);
}

function updateQuizContent(quizState) {
  setHeader(quizState.topic);
  setQuestion(quizState);
  setOptions(quizState);
  setNumber(quizState);
  setProgress(quizState);
  setSubmitButton(quizState);
  attachOptionEventListener();
}

function setHeader(topic) {
  const quizHeader = document.querySelector(".quiz__nav__start");
  quizHeader.innerHTML = `<img class="img-${topic}" src="${quizState.imageSource}" alt="topic-${topic}"><span>${topic}</span>`;
}

function setQuestion(quizState) {
  const { questions, quizIndex } = quizState;
  const questionElement = document.querySelector(".quiz__question__text");
  questionElement.textContent = questions[quizIndex].question;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateOptionHtml(option, index, alphabetOptions) {
  const escapedOption = escapeHtml(option);
  return `
      <li class="quiz__option quiz__answer__option clickable" id="answer__${escapedOption}" tabindex="0">
        <label for="${escapedOption}">
          <input style="display: none" name="option" id="${escapedOption}" type="radio" value="${escapedOption}">
          <span class="quiz__option__alphabet">${alphabetOptions[index]}</span>
          ${escapedOption}
          <img src="/assets/images/icon-correct.svg" alt="icon-correct" class="quiz__option__correct hidden">
          <img src="/assets/images/icon-error.svg" alt="icon-error" class="quiz__option__error hidden">
        </label>
      </li>`;
}

function setOptions(quizState) {
  const { questions, quizIndex } = quizState;
  const optionsElement = document.querySelector(".quiz__answer__choices");
  const options = questions[quizIndex].options;
  const alphabetOptions = ["A", "B", "C", "D"];

  const optionsContent = options
    .map((option, index) => generateOptionHtml(option, index, alphabetOptions))
    .join("");

  optionsElement.innerHTML = optionsContent;
}

function setNumber(quizState) {
  const { quizIndex, totalQuestions } = quizState;
  const questionNumberElement = document.getElementById("question-number");
  const totalQuestionElement = document.getElementById("total-question");
  questionNumberElement.textContent = quizIndex + 1;
  totalQuestionElement.textContent = totalQuestions;
}

function setProgress(quizState) {
  const { quizIndex, totalQuestions } = quizState;
  const quizProgressBar = document.querySelector(
    ".quiz__question__progress__loaded"
  );
  const width = ((quizIndex + 1) / totalQuestions) * 100 + "%";
  quizProgressBar.style.width = width;
}

function setNextButton(quizState) {
  if (nextButton.handleClick) {
    nextButton.removeEventListener("click", nextButton.handleClick);
  }

  nextButton.handleClick = (event) => handleClickNext(quizState, event);

  nextButton.addEventListener("click", nextButton.handleClick);
}

function handleSubmitAnswer(quizState, event) {
  const checkedOptionElement = document.querySelector(
    'input[name="option"]:checked'
  );
  if (!checkedOptionElement) {
    return toggleNoAnswerWarning(true);
  }

  toggleNoAnswerWarning(false);

  const checkedOption = checkedOptionElement.value;
  const isCorrect = checkAnswer(quizState, checkedOption);
  showCorrectAnswer(quizState);
  if (!isCorrect) {
    showIncorrectAnswer(checkedOption);
  }
  updateScore(isCorrect, quizState);
  updateQuizIndex(quizState);
  if (quizState.quizIndex < quizState.totalQuestions) {
    toggleVisibility(submitButton, false);
    toggleVisibility(nextButton, true);
    setNextButton(quizState);
  } else {
    toggleVisibility(submitButton, false);
    toggleVisibility(viewResultButton, true);
    setViewResultButton(quizState);
  }
}

function setSubmitButton(quizState) {
  if (submitButton.handleSubmit) {
    submitButton.removeEventListener("click", submitButton.handleSubmit);
  }

  submitButton.handleSubmit = (event) => handleSubmitAnswer(quizState, event);
  submitButton.addEventListener("click", submitButton.handleSubmit);
}

function checkAnswer(quizState, chosenOption) {
  const { questions, quizIndex } = quizState;
  const answer = questions[quizIndex].answer;
  return answer === chosenOption;
}

function applyAnswerStyles({
  optionElement,
  borderClass,
  alphabetClass,
  iconElement,
}) {
  optionElement.classList.add(borderClass);
  if (alphabetClass) {
    const alphabetElement = optionElement.querySelector("span");
    alphabetElement.classList.add(alphabetClass);
  }
  toggleVisibility(iconElement, true);
}

function showCorrectAnswer(quizState) {
  const { quizIndex, questions } = quizState;
  const answer = questions[quizIndex].answer;
  const correctOptionElement = document.getElementById(`answer__${answer}`);
  const correctIconElement = correctOptionElement.querySelector(
    ".quiz__option__correct"
  );

  applyAnswerStyles({
    optionElement: correctOptionElement,
    borderClass: "quiz__correct-answer-border",
    alphabetClass: "quiz__correct-answer-alphabet",
    iconElement: correctIconElement,
  });
}

function showIncorrectAnswer(chosenOption) {
  const incorrectOptionElement = document.getElementById(
    `answer__${chosenOption}`
  );
  const wrongIconElement = incorrectOptionElement.querySelector(
    ".quiz__option__error"
  );

  applyAnswerStyles({
    optionElement: incorrectOptionElement,
    borderClass: "quiz__incorrect-answer-border",
    alphabetClass: "quiz__incorrect-answer-alphabet",
    iconElement: wrongIconElement,
  });
}

function toggleNoAnswerWarning(showWarning) {
  const noAnswerWarning = document.querySelector(".quiz__warning__no-answer");
  toggleVisibility(noAnswerWarning, showWarning);
}

function updateScore(isCorrect, quizState) {
  if (isCorrect) {
    quizState.score += 1;
  }
}

function selectQuizOption(el) {
  toggleNoAnswerWarning(false);
  checkRadioInput(el);
}

function checkRadioInput(el) {
  const radioInputs = document.querySelectorAll('input[name="option"]');
  const checkedInput = Array.from(radioInputs).find(
    (input) => input.value === el.id.split("__")[1]
  );
  checkedInput.checked = true;
}

function attachOptionEventListener() {
  const quizOptions = document.querySelectorAll(".quiz__answer__option");
  quizOptions.forEach((el) => {
    el.addEventListener("click", () => selectQuizOption(el));
  });

  selectOnKeyPress();
}

function handleClickNext(quizState) {
  updateQuizContent(quizState);
  toggleVisibility(nextButton, false);
  toggleVisibility(submitButton, true);
}

function updateQuizIndex(quizState) {
  quizState.quizIndex += 1;
}

function setViewResultButton(quizState) {
  if (viewResultButton.handleClick) {
    viewResultButton.removeEventListener("click", viewResultButton.handleClick);
  }

  viewResultButton.handleClick = (event) => handleViewResult(quizState, event);
  viewResultButton.addEventListener("click", viewResultButton.handleClick);
}

function handleViewResult(quizState, event) {
  showResultSection();
  updateResultContent(quizState);
}

function showResultSection() {
  toggleVisibility(quizCompletedSection, true);
  toggleVisibility(quizQuestionSection, false);
}

function updateResultContent(quizState) {
  const { topic, imageSource, score, totalQuestions } = quizState;
  const quizCompletedTopic = document.querySelector(".quiz__completed__topic");
  const quizCompletedIcon = document.getElementById("icon-quiz-completed");
  const quizResultScore = document.querySelector(".quiz__result__score");
  const quizCompletedTotal = document.getElementById("quiz-completed-total");

  quizCompletedTopic.textContent = topic;
  quizCompletedIcon.src = imageSource;
  quizResultScore.textContent = score;
  quizCompletedTotal.textContent = totalQuestions;
}

function playAgain(quizState) {
  resetState(quizState);
  toggleVisibility(quizCompletedSection, false);
  toggleVisibility(quizMenuSection, true);
  resetQuestionButton(quizState);
}

function resetState(quizState) {
  Object.assign(quizState, initialQuizState);
}

function resetQuestionButton(quizState) {
  toggleVisibility(viewResultButton, false);
  toggleVisibility(submitButton, true);
  setSubmitButton(quizState);
}

playAgainButton.addEventListener("click", () => playAgain(quizState));

function selectOnKeyPress() {
  document.querySelectorAll(".clickable").forEach((el) => {
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        el.click(); // Simulate a click
      }
    });
  });
}

function toggleKeyPress() {
  const toggleThemeLabel = document.querySelector(".quiz__nav__label");
  toggleThemeLabel.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      toggleThemeLabel.click(); // Simulate a click
    }
  });
}
