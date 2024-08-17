let score = 0;
let quizIndex = 0;
let totalQuestions = 0;
let answer = "";

// toggle theme
const toggleDarkMode = document.getElementById("toggle-dark-mode");
const iconSunDark = document.getElementById("sun-dark");
const iconSunLight = document.getElementById("sun-light");
const iconMoonDark = document.getElementById("moon-dark");
const iconMoonLight = document.getElementById("moon-light");

// quiz menu
const quizMenu = document.querySelector(".quiz__menu");
const quizMenuOptions = document.getElementById("quiz-menu-options");

// quiz questions
let quizTopic = "";
const alphabetOptions = ["A", "B", "C", "D"];
const quizTopicShow = document.querySelector(".quiz__nav__start");
const questionNumber = document.getElementById("question-number");
const totalQuestionElement = document.getElementById("total-question");
const quizQuestion = document.querySelector(".quiz__question");
const quizQuestionText = document.querySelector(".quiz__question__text");
const quizProgressBar = document.querySelector(
  ".quiz__question__progress__loaded"
);
const quizAnswerChoices = document.querySelector(".quiz__answer__choices");
const submitButton = document.querySelector(".quiz__answer__submit");
const nextButton = document.querySelector(".quiz__answer__next");
const noAnswerWarning = document.querySelector(".quiz__warning__no-answer");

// quiz completed
const quizCompleted = document.querySelector(".quiz__completed");
const quizCompletedTopic = document.querySelector(".quiz__completed__topic");
const quizCompletedIcon = document.getElementById("icon-quiz-completed");
const quizResultScore = document.querySelector(".quiz__result__score");
const quizCompletedTotal = document.getElementById("quiz-completed-total");
const quizPlayAgain = document.querySelector(".quiz__play__again");

async function fetchQuizData() {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function showMenuSection() {
  fetchQuizData().then((data) => {
    const quizData = data;
    const quizzes = quizData.quizzes;
    let quizTopic = "";
    let quizMenuOptionsContent = "";
    quizzes.forEach((quiz) => {
      quizMenuOptionsContent += `<li class="quiz__menu__option quiz__option"><div class="img-${quiz.title}"><img src=${quiz.icon} alt=${quiz.title}></div><span>${quiz.title}</span></li>`;
    });
    quizMenuOptions.innerHTML = quizMenuOptionsContent;

    quizMenuOptionsListElements = quizMenuOptions.children;

    Array.from(quizMenuOptionsListElements).forEach((el) => {
      el.addEventListener("click", function () {
        quizTopic = el.textContent;
        const topicImageContainer = document.querySelector(`.img-${quizTopic}`);
        const topicImageUrl = topicImageContainer.querySelector("img").src;
        totalQuestions = quizzes.find((quiz) => quiz.title === quizTopic)
          .questions.length;
        showQuestionSection(quizTopic, quizzes);
        setCompletedQuizTopic(quizTopic, topicImageUrl, totalQuestions);
      });
    });

    nextButton.addEventListener("click", nextQuestion);
    function nextQuestion() {
      quizIndex += 1;
      const { quizzes } = quizData;
      const quiz = getQuestion(quizzes, quizTopic, quizIndex);
      if (!quiz) {
        showResult();
        return;
      }
      showQuestionSection(quizTopic, quizzes);
      nextButton.classList.add("hidden");
      submitButton.classList.remove("hidden");
    }
  });
}

showMenuSection();

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  iconSunDark.classList.toggle("hidden");
  iconSunLight.classList.toggle("hidden");
  iconMoonDark.classList.toggle("hidden");
  iconMoonLight.classList.toggle("hidden");
}

toggleDarkMode.addEventListener("input", toggleTheme);

function showQuizProgress(quizIndex, totalQuestions) {
  const width = ((quizIndex + 1) / totalQuestions) * 100 + "%";
  quizProgressBar.style.width = width;
  console.log(quizProgressBar.style);
}

function showQuestionSection(quizTopic, quizzes) {
  startQuiz();
  const imageSource = quizzes.find((quiz) => quiz.title === quizTopic).icon;
  quizTopicShow.innerHTML = `<img class="img-${quizTopic}" src="${imageSource}" alt="${quizTopic}"><span>${quizTopic}</span>`;
  const quiz = getQuestion(quizzes, quizTopic, quizIndex);
  answer = quiz.answer;
  quizQuestionText.textContent = quiz.question;
  showQuizProgress(quizIndex, totalQuestions);

  let options = "";
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;") // & becomes &amp;
      .replace(/</g, "&lt;") // < becomes &lt;
      .replace(/>/g, "&gt;") // > becomes &gt;
      .replace(/"/g, "&quot;") // " becomes &quot;
      .replace(/'/g, "&#039;"); // ' becomes &#039;
  }
  quiz.options.forEach((option, index) => {
    option = escapeHtml(option);
    options += `<li class="quiz__option quiz__answer__option" id="answer-${option}">
                  <label for="${option}">
                        <input style="display: none" name="option" id="${option}" type="radio" value="${option}">
                        <span class="quiz__option__alphabet">${alphabetOptions[index]}
                        </span>${option}
                        <img src="/assets/images/icon-correct.svg" alt="icon-correct" class="quiz__option__correct hidden">
                        <img src="/assets/images/icon-error.svg" alt="icon-error" class="quiz__option__error hidden">
                  </label>
              </li>`;
  });

  quizAnswerChoices.innerHTML = options;

  const quizOption = document.querySelectorAll(".quiz__answer__option");
  quizOption.forEach((el) => {
    el.addEventListener("click", function () {
      noAnswerWarning.classList.add("hidden");
    });
  });
}

function getQuestion(quizData, topic, number) {
  const chosenTopicQuizzes = quizData.find((data) => data.title === topic);

  questionNumber.textContent = quizIndex + 1;
  totalQuestionElement.textContent = chosenTopicQuizzes.questions.length;
  const quiz = chosenTopicQuizzes.questions[number];

  return quiz;
}

function startQuiz() {
  quizMenu.classList.add("hidden");
  quizQuestion.classList.remove("hidden");
}

function submitAnswer() {
  const checkedOptionElement = document.querySelector(
    'input[name="option"]:checked'
  );

  if (!checkedOptionElement) {
    noAnswerWarning.classList.remove("hidden");
    return;
  }

  const checkedOption = checkedOptionElement.value;
  const correctOption = document.getElementById(`answer-${answer}`);
  const correctAlphabetElement = correctOption.querySelector("span");
  const correctIconElement = correctOption.querySelector(
    ".quiz__option__correct"
  );

  correctOption.style.border = "3px solid var(--color-green)";
  correctAlphabetElement.style.color = "var(--color-pure-white)";
  correctAlphabetElement.style.backgroundColor = "var(--color-green)";
  correctIconElement.classList.remove("hidden");

  const isCorrect = checkAnswer(checkedOption, answer);

  const chosenAnswer = document.getElementById(`answer-${checkedOption}`);
  const alphabetElement = chosenAnswer.querySelector("span");

  if (isCorrect) {
    score += 1;
  } else {
    const wrongIconElement = chosenAnswer.querySelector(".quiz__option__error");
    chosenAnswer.style.border = "3px solid var(--color-red)";
    alphabetElement.style.color = "var(--color-pure-white)";
    alphabetElement.style.backgroundColor = "var(--color-red)";
    wrongIconElement.classList.remove("hidden");
  }

  const radioOptions = quizAnswerChoices.querySelectorAll('input[type="radio"');

  radioOptions.forEach((radio) => (radio.disabled = true));

  submitButton.classList.add("hidden");
  nextButton.classList.remove("hidden");
}

function checkAnswer(option, answer) {
  return option === answer;
}

function showResult() {
  quizQuestion.classList.add("hidden");
  quizCompleted.classList.remove("hidden");
  quizResultScore.textContent = score;
}

function playAgain() {
  score = 0;
  quizIndex = 0;
  quizCompleted.classList.add("hidden");
  quizMenu.classList.remove("hidden");
  nextButton.classList.add("hidden");
  submitButton.classList.remove("hidden");
  showMenuSection();
}

function setCompletedQuizTopic(topic, iconQuizUrl, totalQuiz) {
  quizCompletedTopic.textContent = topic;
  quizCompletedIcon.src = iconQuizUrl;
  quizCompletedIcon.classList.add(`img-${topic}`);
  quizCompletedTotal.textContent = totalQuiz;
}

submitButton.addEventListener("click", submitAnswer);

quizPlayAgain.addEventListener("click", playAgain);
