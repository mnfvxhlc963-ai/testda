let selectedTest = null;
let questions = [];
let currentIndex = 0;
let timer;
let timeLeft = 60;
let correctCount = 0;

const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const timeDisplay = document.getElementById("time");
const backBtn = document.getElementById("back-btn");
const questionCount = document.getElementById("question-count");

// TEST TANLASH
document.querySelectorAll(".test-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".test-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedTest = btn.dataset.json;
  });
});

// BOSHLASH
startBtn.addEventListener("click", async () => {
  if (!selectedTest) {
    alert("Iltimos, test turini tanlang!");
    return;
  }
  const response = await fetch(`data/${selectedTest}`);
  questions = await response.json();
  questions = shuffleArray(questions);
  correctCount = 0;
  currentIndex = 0;
  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  showQuestion();
});

// SAVOLNI KO‘RSATISH
function showQuestion() {
  resetState();
  const q = questions[currentIndex];
  questionText.textContent = q.question;
  questionCount.textContent = `Savol: ${currentIndex + 1} / ${questions.length}`;

  const answers = [q.answer1, q.answer2, q.answer3, q.answer4].filter(a => a && a.trim() !== "");
  const shuffled = shuffleArray(answers);

  shuffled.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => selectAnswer(btn, q.correct_answer));
    answersDiv.appendChild(btn);
  });

  startTimer();
}

// TIMER
function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timeDisplay.textContent = timeLeft;
  timeDisplay.style.color = "#555";

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 10) timeDisplay.style.color = "#ff4b4b";
    if (timeLeft <= 0) {
      clearInterval(timer);
      lockAnswers();
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function lockAnswers() {
  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(b => b.disabled = true);
}

// TANLASH
function selectAnswer(btn, correct) {
  clearInterval(timer);
  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add("correct");
    else if (b === btn && b.textContent !== correct) b.classList.add("wrong");
  });
  if (btn.textContent === correct) correctCount++;
  nextBtn.classList.remove("hidden");
}

// KEYINGI SAVOL
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) showQuestion();
  else showResult();
});

// NATIJA
function showResult() {
  clearInterval(timer);
  const percent = Math.round((correctCount / questions.length) * 100);
  quizContainer.innerHTML = `
    <div class="result-container">
      <div class="circle" style="--percent: ${percent};">
        <div class="number">${percent}%</div>
      </div>
      <h2>Test yakunlandi ✅</h2>
      <p>Siz ${questions.length} tadan <strong>${correctCount}</strong> tasini to‘g‘ri topdingiz!</p>
      <button onclick="location.reload()">Qayta boshlash</button>
    </div>
  `;
}

// TOZALASH
function resetState() {
  nextBtn.classList.add("hidden");
  answersDiv.innerHTML = "";
  clearInterval(timer);
  timeLeft = 60;
  timeDisplay.textContent = timeLeft;
}

// ARALASHTIRISH
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ORTGA
backBtn.addEventListener("click", () => {
  clearInterval(timer);
  quizContainer.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
