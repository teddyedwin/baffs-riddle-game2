const question = document.getElementById('question');
const prompt = document.getElementById('prompt');
const answerOptions = document.getElementById('answerOptions');
const restartButton = document.getElementById('restartButton');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const loginPanel = document.getElementById('loginPanel');
const quizPanel = document.getElementById('quizPanel');
const headerNote = document.getElementById('headerNote');
const howToPlay = document.getElementById('howToPlay');
const howToPlayBackdrop = document.getElementById('howToPlayBackdrop');
const closeHowToPlay = document.getElementById('closeHowToPlay');
const howToPlayLink = document.querySelector('.wordmark');
const slideImage = document.getElementById('slideImage');
const slideCaption = document.getElementById('slideCaption');
const previousSlide = document.getElementById('previousSlide');
const nextSlide = document.getElementById('nextSlide');
const slideIndicators = [...document.querySelectorAll('.slide-indicator')];
let playerName = '';

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
    alt: 'Friends enjoying time together',
    caption: 'Ask something.'
  },
  {
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85',
    alt: 'Friends celebrating together',
    caption: 'Think together.'
  },
  {
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85',
    alt: 'Friends sharing a meal around a table',
    caption: 'Have a laugh.'
  }
];

const riddles = [
  { question: 'What is always coming but never arrives?', answer: 'Tomorrow', options: ['Yesterday', 'Tomorrow', 'The weekend', 'Sunrise'] },
  { question: 'What gets wetter the more it dries?', answer: 'A towel', options: ['A towel', 'A sponge', 'A cloud', 'A river'] },
  { question: 'What can be broken but never held?', answer: 'A promise', options: ['A glass', 'A secret', 'A promise', 'A rule'] },
  { question: 'What has keys but no locks?', answer: 'A piano', options: ['A map', 'A piano', 'A treasure chest', 'A keyboard lock'] },
  { question: "What has hands but can't clap?", answer: 'A clock', options: ['A statue', 'A clock', 'A glove', 'A mannequin'] },
  { question: 'What has a neck but no head?', answer: 'A bottle', options: ['A shirt', 'A giraffe', 'A bottle', 'A guitar'] },
  { question: 'What has many teeth but cannot bite?', answer: 'A comb', options: ['A shark', 'A zipper', 'A comb', 'A saw'] },
  { question: 'What goes up but never comes down?', answer: 'Your age', options: ['A balloon', 'Smoke', 'Your age', 'An elevator'] }
];

let questionIndex = 0;
let slideIndex = 0;

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex];
  slideImage.src = slide.src;
  slideImage.alt = slide.alt;
  slideCaption.textContent = slide.caption;
  slideIndicators.forEach((indicator, indicatorIndex) => {
    const active = indicatorIndex === slideIndex;
    indicator.classList.toggle('is-active', active);
    if (active) {
      indicator.setAttribute('aria-current', 'true');
    } else {
      indicator.removeAttribute('aria-current');
    }
  });
}

previousSlide.addEventListener('click', () => showSlide(slideIndex - 1));
nextSlide.addEventListener('click', () => showSlide(slideIndex + 1));
slideIndicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => showSlide(index));
});
showSlide(0);

function openHowToPlay() {
  howToPlay.hidden = false;
  howToPlayBackdrop.hidden = false;
  howToPlay.setAttribute('aria-hidden', 'false');
  closeHowToPlay.focus();
}

function dismissHowToPlay() {
  howToPlay.hidden = true;
  howToPlayBackdrop.hidden = true;
  howToPlay.setAttribute('aria-hidden', 'true');
  howToPlayLink.focus();
}

howToPlayLink.addEventListener('click', (event) => {
  event.preventDefault();
  openHowToPlay();
});
closeHowToPlay.addEventListener('click', dismissHowToPlay);
howToPlayBackdrop.addEventListener('click', dismissHowToPlay);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !howToPlay.hidden) {
    dismissHowToPlay();
  }
});

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  playerName = nameInput.value.trim();
  if (!playerName) {
    nameInput.focus();
    return;
  }

  headerNote.replaceChildren(
    headerNote.querySelector('.status-dot'),
    document.createTextNode(` Good luck, ${playerName}!`)
  );
  loginPanel.hidden = true;
  quizPanel.hidden = false;
  showQuestion();
});

function showQuestion() {
  question.textContent = riddles[questionIndex].question;
  answerOptions.replaceChildren();
  riddles[questionIndex].options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'answer-button answer-choice';
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(option));
    answerOptions.appendChild(button);
  });
  const message = 'Solve the riddle to unlock the next question.';
  prompt.dataset.message = message;
  prompt.textContent = playerName ? `${playerName}, ${message}` : message;
  prompt.classList.remove('answer-correct', 'answer-wrong');
  question.parentElement.style.animation = 'none';
  void question.parentElement.offsetWidth;
  question.parentElement.style.animation = '';
}

function checkAnswer(answer) {
  // A wrong answer keeps the current riddle on screen so the player can try again.
  if (answer !== riddles[questionIndex].answer) {
    prompt.dataset.message = 'we ni mjinga kumbaff !! shenzi';
    prompt.textContent = `${playerName}, ${prompt.dataset.message}`;
    prompt.classList.remove('answer-correct');
    prompt.classList.add('answer-wrong');
    return;
  }

  prompt.classList.remove('answer-wrong');
  // A correct answer advances to the next riddle in the list.
  questionIndex += 1;

  if (questionIndex === riddles.length) {
    question.textContent = "Brilliant! You've solved all the riddles.";
    answerOptions.hidden = true;
    restartButton.hidden = false;
    prompt.dataset.message = 'You got every answer right!';
    prompt.textContent = `${playerName}, ${prompt.dataset.message}`;
    prompt.classList.add('answer-correct');
    return;
  }

  showQuestion();
  prompt.dataset.message = 'Correct! Here comes the next riddle.';
  prompt.textContent = `${playerName}, ${prompt.dataset.message}`;
  prompt.classList.add('answer-correct');
}

restartButton.addEventListener('click', () => {
  questionIndex = 0;
  answerOptions.hidden = false;
  restartButton.hidden = true;
  prompt.classList.remove('answer-correct', 'answer-wrong');
  showQuestion();
});

showQuestion();
