let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `${timeString} - ${mode} Time`;
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

// Initialize display
updateDisplay(); 