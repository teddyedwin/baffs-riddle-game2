const question = document.getElementById('question');
const prompt = document.getElementById('prompt');
const answerOptions = document.getElementById('answerOptions');
const restartButton = document.getElementById('restartButton');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const passwordInput = document.getElementById('passwordInput');
const loginStatus = document.getElementById('loginStatus');
const resetLoginButton = document.getElementById('resetLoginButton');
const loginPanel = document.getElementById('loginPanel');
const quizPanel = document.getElementById('quizPanel');
const logoutButton = document.getElementById('logoutButton');
const headerNote = document.getElementById('headerNote');
const profileAvatar = document.getElementById('profileAvatar');
const profileDrawer = document.getElementById('profileDrawer');
const profileBackdrop = document.getElementById('profileBackdrop');
const closeProfileDrawer = document.getElementById('closeProfileDrawer');
const drawerLeaderboardLink = document.getElementById('drawerLeaderboardLink');
const profileDrawerName = document.getElementById('profileDrawerName');
const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileYearInput = document.getElementById('profileYearInput');
const profileStatus = document.getElementById('profileStatus');
const profileGuestNote = document.getElementById('profileGuestNote');
const howToPlay = document.getElementById('howToPlay');
const howToPlayBackdrop = document.getElementById('howToPlayBackdrop');
const closeHowToPlay = document.getElementById('closeHowToPlay');
const howToPlayLink = document.querySelector('.wordmark');
const slideImage = document.getElementById('slideImage');
const photoCarousel = document.querySelector('.photo-carousel');
const slideIndicators = [...document.querySelectorAll('.slide-indicator')];
const difficultySelect = document.getElementById('difficultySelect');
let playerName = '';

const slides = [
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Chess_game_Staunton_No._6_perfil_view_8.jpg/1280px-Chess_game_Staunton_No._6_perfil_view_8.jpg',
    alt: 'Chess pieces set up on a board',
  },
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Chess_board_with_pieces.jpg/1280px-Chess_board_with_pieces.jpg',
    alt: 'Chess board and pieces',
  },
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Dartboard_with_darts.jpg/1280px-Dartboard_with_darts.jpg',
    alt: 'Darts thrown into a dartboard',
  },
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Darts_in_a_dartboard.jpg/1280px-Darts_in_a_dartboard.jpg',
    alt: 'Darts in a dartboard at a game venue',
  }
];

const riddlesByDifficulty = {
  easy: [
    { question: 'What has hands but cannot clap?', answer: 'A clock', options: ['A statue', 'A clock', 'A glove', 'A mannequin'] },
    { question: 'What gets wetter the more it dries?', answer: 'A towel', options: ['A towel', 'A sponge', 'A cloud', 'A river'] },
    { question: 'What has a neck but no head?', answer: 'A bottle', options: ['A shirt', 'A giraffe', 'A bottle', 'A guitar'] },
    { question: 'What has many teeth but cannot bite?', answer: 'A comb', options: ['A shark', 'A zipper', 'A comb', 'A saw'] },
    { question: 'What has one eye but cannot see?', answer: 'A needle', options: ['A camera', 'A needle', 'A storm', 'A potato'] }
  ],
  medium: [
    { question: 'What has keys but no locks?', answer: 'A piano', options: ['A map', 'A piano', 'A treasure chest', 'A keyboard lock'] },
    { question: 'What can be broken but never held?', answer: 'A promise', options: ['A glass', 'A secret', 'A promise', 'A rule'] },
    { question: 'What goes up but never comes down?', answer: 'Your age', options: ['A balloon', 'Smoke', 'Your age', 'An elevator'] },
    { question: 'What has cities, but no houses; forests, but no trees; and water, but no fish?', answer: 'A map', options: ['A map', 'A painting', 'A globe', 'A book'] },
    { question: 'What has many words but never speaks?', answer: 'A book', options: ['A parrot', 'A radio', 'A book', 'A teacher'] }
  ],
  hard: [
    { question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', answer: 'An echo', options: ['An echo', 'A cloud', 'A kite', 'A whistle'] },
    { question: 'The more you take, the more you leave behind. What are they?', answer: 'Footsteps', options: ['Memories', 'Footsteps', 'Photographs', 'Coins'] },
    { question: 'What can travel around the world while staying in one corner?', answer: 'A stamp', options: ['A stamp', 'A compass', 'A shadow', 'A postcard'] },
    { question: 'What disappears as soon as you say its name?', answer: 'Silence', options: ['A secret', 'Silence', 'An echo', 'A dream'] },
    { question: 'What has 13 hearts but no other organs?', answer: 'A deck of cards', options: ['A deck of cards', 'A hospital', 'A calendar', 'A family'] }
  ]
};

let questionIndex = 0;
let slideIndex = 0;
let gameSaved = false;

// Active riddle set and difficulty.
let currentRiddles = [...riddlesByDifficulty.medium];
let selectedDifficulty = 'medium';
const pointsPerCorrectAnswer = { easy: 10, medium: 20, hard: 30 };
const leaderboardStorageKey = 'justAskLeaderboard';
const playerStorageKey = 'justAskPlayerName';
const passwordCredentialKey = 'justAskPasswordCredential';
const playerYearStorageKey = 'justAskPlayerYear';
const passwordHashIterations = 50000;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildRiddleSet(difficulty) {
  selectedDifficulty = Object.prototype.hasOwnProperty.call(riddlesByDifficulty, difficulty)
    ? difficulty
    : 'medium';
  const levelRiddles = [...riddlesByDifficulty[selectedDifficulty]];
  return selectedDifficulty === 'hard' ? shuffle(levelRiddles) : levelRiddles;
}

function saveCompletedGame() {
  if (gameSaved) return;

  const score = currentRiddles.length * pointsPerCorrectAnswer[selectedDifficulty];
  const result = {
    name: playerName,
    score,
    difficulty: selectedDifficulty,
    completedAt: new Date().toISOString()
  };

  try {
    const savedResults = JSON.parse(localStorage.getItem(leaderboardStorageKey) || '[]');
    if (!Array.isArray(savedResults)) {
      throw new Error('Leaderboard data is not a list.');
    }
    savedResults.push(result);
    localStorage.setItem(leaderboardStorageKey, JSON.stringify(savedResults));
    gameSaved = true;
    return score;
  } catch (error) {
    console.error('Could not save the completed game to the leaderboard.', error);
    return null;
  }
}

function getSavedPasswordCredential() {
  const savedCredential = localStorage.getItem(passwordCredentialKey);
  if (!savedCredential) return null;

  const credential = JSON.parse(savedCredential);
  if (
    !credential
    || typeof credential.name !== 'string'
    || typeof credential.salt !== 'string'
    || typeof credential.passwordHash !== 'string'
    || !/^[0-9a-f]{32}$/i.test(credential.salt)
    || !/^[0-9a-f]{64}$/i.test(credential.passwordHash)
  ) {
    throw new Error('Saved password credential is invalid.');
  }
  return credential;
}

async function hashPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Secure password hashing is unavailable in this browser context.');
  }

  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: passwordHashIterations,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createPasswordSalt() {
  if (!window.crypto || !window.crypto.getRandomValues) {
    throw new Error('Secure password generation is unavailable in this browser.');
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function passwordsMatch(first, second) {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
}

function setHeaderGreeting() {
  const initials = playerName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  profileAvatar.textContent = initials || '?';
  profileAvatar.setAttribute('aria-label', `Open ${playerName}'s profile menu`);
  profileDrawerName.textContent = playerName;
  profileNameInput.value = playerName;
  profileYearInput.value = localStorage.getItem(playerYearStorageKey) || '';
  headerNote.replaceChildren(
    headerNote.querySelector('.status-dot'),
    document.createTextNode(` Good luck, ${playerName}!`)
  );
}

function openProfileDrawer() {
  const isLoggedIn = !quizPanel.hidden;
  profileForm.hidden = !isLoggedIn;
  profileGuestNote.hidden = isLoggedIn;
  drawerLeaderboardLink.hidden = !isLoggedIn;
  logoutButton.hidden = !isLoggedIn;
  if (isLoggedIn) {
    profileNameInput.value = playerName;
    profileYearInput.value = localStorage.getItem(playerYearStorageKey) || '';
    profileStatus.textContent = '';
  }
  profileDrawer.hidden = false;
  profileBackdrop.hidden = false;
  profileDrawer.setAttribute('aria-hidden', 'false');
  profileAvatar.setAttribute('aria-expanded', 'true');
  closeProfileDrawer.focus();
}

function dismissProfileDrawer() {
  profileDrawer.hidden = true;
  profileBackdrop.hidden = true;
  profileDrawer.setAttribute('aria-hidden', 'true');
  profileAvatar.setAttribute('aria-expanded', 'false');
  profileAvatar.focus();
}

profileAvatar.addEventListener('click', openProfileDrawer);
closeProfileDrawer.addEventListener('click', dismissProfileDrawer);
profileBackdrop.addEventListener('click', dismissProfileDrawer);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !profileDrawer.hidden) {
    dismissProfileDrawer();
    return;
  }
  if (event.key === 'Tab' && !profileDrawer.hidden) {
    const focusableElements = [...profileDrawer.querySelectorAll(
      'a[href]:not([hidden]), button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden])'
    )].filter((element) => element.getClientRects().length > 0);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const updatedName = profileNameInput.value.trim();
  const updatedYear = profileYearInput.value.trim();
  if (!updatedName) {
    profileStatus.textContent = 'Please enter a name.';
    profileNameInput.focus();
    return;
  }
  if (updatedYear && (Number(updatedYear) < 1900 || Number(updatedYear) > 2100)) {
    profileStatus.textContent = 'Enter a year between 1900 and 2100.';
    profileYearInput.focus();
    return;
  }

  const oldName = playerName;
  let oldCredential;
  let oldStoredName;
  let oldStoredYear;
  let oldLeaderboard;
  try {
    oldCredential = localStorage.getItem(passwordCredentialKey);
    if (!oldCredential) throw new Error('Saved account credential is missing.');
    oldStoredName = localStorage.getItem(playerStorageKey);
    oldStoredYear = localStorage.getItem(playerYearStorageKey);
    oldLeaderboard = localStorage.getItem(leaderboardStorageKey);

    const credential = getSavedPasswordCredential();
    const updatedCredential = { ...credential, name: updatedName };
    const savedScores = oldLeaderboard === null ? [] : JSON.parse(oldLeaderboard);
    if (!Array.isArray(savedScores)) {
      throw new Error('Leaderboard data is not a list.');
    }
    const renamedScores = savedScores.map((entry) => (
      entry && typeof entry.name === 'string'
      && entry.name.toLocaleLowerCase() === oldName.toLocaleLowerCase()
        ? { ...entry, name: updatedName }
        : entry
    ));

    localStorage.setItem(passwordCredentialKey, JSON.stringify(updatedCredential));
    localStorage.setItem(playerStorageKey, updatedName);
    if (updatedYear) {
      localStorage.setItem(playerYearStorageKey, updatedYear);
    } else {
      localStorage.removeItem(playerYearStorageKey);
    }
    localStorage.setItem(leaderboardStorageKey, JSON.stringify(renamedScores));

    playerName = updatedName;
    setHeaderGreeting();
    profileStatus.textContent = 'Profile saved.';
  } catch (error) {
    console.error('Could not save profile changes.', error);
    try {
      if (oldCredential !== undefined) localStorage.setItem(passwordCredentialKey, oldCredential);
      if (oldStoredName === null) localStorage.removeItem(playerStorageKey);
      else if (oldStoredName !== undefined) localStorage.setItem(playerStorageKey, oldStoredName);
      if (oldStoredYear === null) localStorage.removeItem(playerYearStorageKey);
      else if (oldStoredYear !== undefined) localStorage.setItem(playerYearStorageKey, oldStoredYear);
      if (oldLeaderboard === null) localStorage.removeItem(leaderboardStorageKey);
      else if (oldLeaderboard !== undefined) localStorage.setItem(leaderboardStorageKey, oldLeaderboard);
    } catch (rollbackError) {
      console.error('Could not roll back partially saved profile changes.', rollbackError);
    }
    profileStatus.textContent = 'Profile could not be saved. Please try again.';
  }
});

function updateLoginInstructions() {
  try {
    const credential = getSavedPasswordCredential();
    if (credential) {
      passwordInput.autocomplete = 'current-password';
      passwordInput.placeholder = 'Enter your saved password';
      loginStatus.textContent = `This browser already has a login for ${credential.name}. Enter that name and its password, or reset the saved login.`;
      resetLoginButton.hidden = false;
      return;
    }

    passwordInput.autocomplete = 'new-password';
    passwordInput.placeholder = 'Create a 4–8 character password';
    resetLoginButton.hidden = true;
    loginStatus.textContent = '';
  } catch (error) {
    console.error('Could not read the saved password credential.', error);
    resetLoginButton.hidden = true;
    loginStatus.textContent = 'Saved password data could not be read. Please check browser storage.';
  }
}

function restorePlayerLogin() {
  try {
    updateLoginInstructions();
    const savedName = localStorage.getItem(playerStorageKey);
    if (!savedName || !savedName.trim()) {
      headerNote.hidden = false;
      return;
    }

    const credential = getSavedPasswordCredential();
    if (!credential || credential.name.toLocaleLowerCase() !== savedName.trim().toLocaleLowerCase()) {
      updateLoginInstructions();
      return;
    }

    playerName = credential.name;
    selectedDifficulty = difficultySelect ? difficultySelect.value : 'medium';
    currentRiddles = buildRiddleSet(selectedDifficulty);
    setHeaderGreeting();
    loginPanel.hidden = true;
    quizPanel.hidden = false;
    logoutButton.hidden = false;
  } catch (error) {
    console.error('Could not restore the saved login from this browser.', error);
    loginStatus.textContent = 'Could not restore the saved login. Please enter your name again.';
    headerNote.hidden = false;
  }
}

resetLoginButton.addEventListener('click', () => {
  if (!window.confirm('Reset the saved login on this browser? Your leaderboard scores will remain.')) {
    return;
  }

  let oldCredential;
  let oldStoredName;
  try {
    oldCredential = localStorage.getItem(passwordCredentialKey);
    oldStoredName = localStorage.getItem(playerStorageKey);
    localStorage.removeItem(passwordCredentialKey);
    localStorage.removeItem(playerStorageKey);
    nameInput.value = '';
    passwordInput.value = '';
    updateLoginInstructions();
    loginStatus.textContent = 'Saved login reset. Enter your name and create a new password.';
    nameInput.focus();
  } catch (error) {
    console.error('Could not reset the saved login in this browser.', error);
    try {
      if (oldCredential === null) localStorage.removeItem(passwordCredentialKey);
      else if (oldCredential !== undefined) localStorage.setItem(passwordCredentialKey, oldCredential);
      if (oldStoredName === null) localStorage.removeItem(playerStorageKey);
      else if (oldStoredName !== undefined) localStorage.setItem(playerStorageKey, oldStoredName);
    } catch (rollbackError) {
      console.error('Could not roll back the saved login reset.', rollbackError);
    }
    loginStatus.textContent = 'Could not reset the saved login. Please check browser storage.';
  }
});

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex];
  slideImage.src = slide.src;
  slideImage.alt = slide.alt;
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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let slideTimer;
let carouselPaused = false;

function startSlideshow() {
  window.clearInterval(slideTimer);
  if (carouselPaused || prefersReducedMotion.matches) return;
  slideTimer = window.setInterval(() => showSlide(slideIndex + 1), 5000);
}

function pauseSlideshow() {
  carouselPaused = true;
  window.clearInterval(slideTimer);
}

function resumeSlideshow() {
  carouselPaused = false;
  startSlideshow();
}

slideIndicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    showSlide(index);
    startSlideshow();
  });
});
photoCarousel.addEventListener('mouseenter', pauseSlideshow);
photoCarousel.addEventListener('mouseleave', resumeSlideshow);
photoCarousel.addEventListener('focusin', pauseSlideshow);
photoCarousel.addEventListener('focusout', (event) => {
  if (!photoCarousel.contains(event.relatedTarget)) resumeSlideshow();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    window.clearInterval(slideTimer);
  } else {
    startSlideshow();
  }
});
prefersReducedMotion.addEventListener('change', startSlideshow);
showSlide(0);
startSlideshow();

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

nameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const enteredName = nameInput.value.trim();
  const password = passwordInput.value;
  if (!enteredName) {
    nameInput.focus();
    return;
  }
  if (password.length < 4 || password.length > 8) {
    loginStatus.textContent = 'Password must be between 4 and 8 characters.';
    passwordInput.focus();
    return;
  }

  const submitButton = nameForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  nameInput.disabled = true;
  passwordInput.disabled = true;
  loginStatus.textContent = 'Checking password...';
  try {
    const credential = getSavedPasswordCredential();
    if (credential) {
      if (credential.name.toLocaleLowerCase() !== enteredName.toLocaleLowerCase()) {
        loginStatus.textContent = `This browser has a saved login for ${credential.name}. Enter that name, or reset the saved login.`;
        return;
      }

      const salt = Uint8Array.from(
        credential.salt.match(/.{2}/g) || [],
        (byte) => Number.parseInt(byte, 16)
      );
      if (salt.length !== 16) {
        throw new Error('Saved password salt is invalid.');
      }
      const enteredHash = await hashPassword(password, salt);
      if (!passwordsMatch(enteredHash, credential.passwordHash)) {
        loginStatus.textContent = 'That password does not match the saved login. Try again or reset the saved login.';
        return;
      }
    } else {
      const saltHex = createPasswordSalt();
      const salt = Uint8Array.from(
        saltHex.match(/.{2}/g),
        (byte) => Number.parseInt(byte, 16)
      );
      const passwordHash = await hashPassword(password, salt);
      localStorage.setItem(passwordCredentialKey, JSON.stringify({
        name: enteredName,
        salt: saltHex,
        passwordHash
      }));
    }

    playerName = enteredName;
    localStorage.setItem(playerStorageKey, playerName);
  } catch (error) {
    console.error('Could not verify or save the password credential.', error);
    loginStatus.textContent = 'Could not save or verify this login in your browser.';
    return;
  } finally {
    submitButton.disabled = false;
    nameInput.disabled = false;
    passwordInput.disabled = false;
  }

  const chosen = difficultySelect ? difficultySelect.value : 'medium';
  currentRiddles = buildRiddleSet(chosen);
  gameSaved = false;
  loginStatus.textContent = 'Login saved in this browser.';
  setHeaderGreeting();
  headerNote.hidden = false;
  loginPanel.hidden = true;
  quizPanel.hidden = false;
  logoutButton.hidden = false;
  questionIndex = 0;
  showQuestion();
});

function showQuestion() {
  const r = currentRiddles[questionIndex];
  question.textContent = r.question;
  answerOptions.replaceChildren();
  r.options.forEach((option) => {
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
  if (answer !== currentRiddles[questionIndex].answer) {
    prompt.dataset.message = 'try again';
    prompt.textContent = `${playerName}, ${prompt.dataset.message}`;
    prompt.classList.remove('answer-correct');
    prompt.classList.add('answer-wrong');
    return;
  }

  prompt.classList.remove('answer-wrong');
  // A correct answer advances to the next riddle in the list.
  questionIndex += 1;

  if (questionIndex === currentRiddles.length) {
    question.textContent = "Brilliant! You've solved all the riddles.";
    answerOptions.hidden = true;
    restartButton.hidden = false;
    const score = saveCompletedGame();
    prompt.dataset.message = score === null
      ? 'You completed the riddles, but your score could not be saved on this device.'
      : `You got every answer right and earned ${score} points!`;
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
  // restart using the same difficulty the player chose
  currentRiddles = buildRiddleSet(difficultySelect ? difficultySelect.value : selectedDifficulty);
  gameSaved = false;
  questionIndex = 0;
  answerOptions.hidden = false;
  restartButton.hidden = true;
  prompt.classList.remove('answer-correct', 'answer-wrong');
  showQuestion();
});

if (difficultySelect) {
  difficultySelect.addEventListener('change', () => {
    selectedDifficulty = difficultySelect.value;
    currentRiddles = buildRiddleSet(selectedDifficulty);
    gameSaved = false;
    questionIndex = 0;
    answerOptions.hidden = false;
    restartButton.hidden = true;
    prompt.classList.remove('answer-correct', 'answer-wrong');
    showQuestion();
  });
}

logoutButton.addEventListener('click', () => {
  try {
    localStorage.removeItem(playerStorageKey);
  } catch (error) {
    console.error('Could not remove the saved login from this browser.', error);
    prompt.textContent = 'Could not log out because the saved login could not be removed.';
    prompt.classList.add('answer-wrong');
    return;
  }

  playerName = '';
  nameInput.value = '';
  passwordInput.value = '';
  selectedDifficulty = 'medium';
  if (difficultySelect) difficultySelect.value = selectedDifficulty;
  currentRiddles = buildRiddleSet(selectedDifficulty);
  questionIndex = 0;
  gameSaved = false;
  answerOptions.hidden = false;
  restartButton.hidden = true;
  profileStatus.textContent = '';
  profileDrawerName.textContent = '';
  profileNameInput.value = '';
  profileYearInput.value = '';
  dismissProfileDrawer();
  profileAvatar.textContent = '?';
  profileAvatar.setAttribute('aria-label', 'Player profile');
  loginPanel.hidden = false;
  quizPanel.hidden = true;
  logoutButton.hidden = true;
  showQuestion();
  headerNote.replaceChildren(
    headerNote.querySelector('.status-dot'),
    document.createTextNode(' A little question game')
  );
  headerNote.hidden = false;
  updateLoginInstructions();
  nameInput.focus();
});

restorePlayerLogin();
showQuestion();
