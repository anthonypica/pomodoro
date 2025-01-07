let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');
const themeSystemBtn = document.getElementById('theme-system');
const addTimeButton = document.getElementById('add-time');
const timerTitle = document.getElementById('timer-title');
const taskInput = document.getElementById('task-input');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const mode = isWorkTime ? 'Work' : 'Break';
    const task = timerTitle.textContent !== 'Pomodoro Timer' ? ` - ${timerTitle.textContent}` : '';
    document.title = `${timeString} - ${mode}${task}`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleModeButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    updateDisplay();
}

function startTimer() {
    if (timerId !== null) return;
    
    // If timer hasn't been started yet, prompt for task
    if (timerTitle.textContent === 'Pomodoro Timer') {
        const task = prompt('What are you focusing on?');
        if (task && task.trim()) {
            timerTitle.textContent = task.trim();
        }
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
            alert(isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);
    
    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    modeText.textContent = 'Work Time';
    startButton.textContent = 'Start';
    updateDisplay();
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    const savedPreference = theme;
    if (theme === 'system') {
        theme = getSystemTheme();
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', savedPreference);
    
    // Update active states
    themeLightBtn.classList.toggle('active', savedPreference === 'light');
    themeDarkBtn.classList.toggle('active', savedPreference === 'dark');
    themeSystemBtn.classList.toggle('active', savedPreference === 'system');
}

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes (300 seconds)
    updateDisplay();
}

function showTaskInput() {
    const currentText = timerTitle.textContent;
    timerTitle.style.display = 'none';
    taskInput.style.display = 'block';
    taskInput.value = currentText === 'Pomodoro Timer' ? '' : currentText;
    taskInput.focus();
}

function hideTaskInput() {
    if (taskInput.value.trim()) {
        timerTitle.textContent = taskInput.value.trim();
    }
    timerTitle.style.display = 'block';
    taskInput.style.display = 'none';
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

toggleModeButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    
    switchMode();
});

themeLightBtn.addEventListener('click', () => setTheme('light'));
themeDarkBtn.addEventListener('click', () => setTheme('dark'));
themeSystemBtn.addEventListener('click', () => setTheme('system'));

addTimeButton.addEventListener('click', addFiveMinutes);

timerTitle.addEventListener('click', showTaskInput);

taskInput.addEventListener('blur', hideTaskInput);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        hideTaskInput();
    }
});

// Initialize display
updateDisplay();

// Initialize theme
const savedTheme = localStorage.getItem('theme-preference') || 'system';
setTheme(savedTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme-preference') === 'system') {
        setTheme('system');
    }
}); 