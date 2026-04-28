// Joke Generator API Integration
let jokeCount = 0;
let currentJoke = '';

const jokeBox = document.getElementById('jokeBox');
const nextBtn = document.getElementById('nextBtn');
const copyBtn = document.getElementById('copyBtn');
const categorySelect = document.getElementById('categorySelect');
const errorBox = document.getElementById('error');
const feedback = document.getElementById('feedback');
const jokeCountDisplay = document.getElementById('jokeCount');

// API endpoints
const JOKE_APIS = {
    any: 'https://official-joke-api.appspot.com/random_joke',
    general: 'https://official-joke-api.appspot.com/jokes/general/random',
    programming: 'https://official-joke-api.appspot.com/jokes/programming/random',
    'knock-knock': 'https://official-joke-api.appspot.com/jokes/knock-knock/random'
};

// Fetch and display a joke
async function fetchJoke() {
    const category = categorySelect.value;
    const apiUrl = JOKE_APIS[category];

    // Show loading state
    jokeBox.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading a funny joke...</p>
        </div>
    `;
    
    errorBox.classList.remove('show');
    hideFeeback();

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Build the joke text
        let jokeText = '';
        
        if (data.setup && data.punchline) {
            // Two-part joke
            jokeText = `${data.setup}\n\n${data.punchline}`;
        } else if (data.joke) {
            // Single-line joke
            jokeText = data.joke;
        } else {
            throw new Error('Unexpected API response format');
        }

        currentJoke = jokeText;
        displayJoke(jokeText);
        jokeCount++;
        jokeCountDisplay.textContent = jokeCount;

    } catch (error) {
        console.error('Error fetching joke:', error);
        displayError(`Oops! ${error.message}. Please try again.`);
    }
}

// Display joke in the UI
function displayJoke(joke) {
    jokeBox.innerHTML = `<div class="joke-text">${escapeHtml(joke).replace(/\n\n/g, '<br><br>')}</div>`;
    jokeBox.style.animation = 'none';
    setTimeout(() => {
        jokeBox.style.animation = 'fadeIn 0.6s ease';
    }, 10);
}

// Display error message
function displayError(message) {
    errorBox.textContent = message;
    errorBox.classList.add('show');
    jokeBox.innerHTML = `
        <div class="loading">
            <p>😞 Failed to load joke</p>
        </div>
    `;
}

// Hide feedback message
function hideFeeback() {
    feedback.classList.remove('success');
}

// Copy joke to clipboard
function copyToClipboard() {
    if (!currentJoke) {
        displayError('No joke to copy! Generate one first.');
        return;
    }

    navigator.clipboard.writeText(currentJoke).then(() => {
        feedback.classList.add('success');
        setTimeout(() => {
            feedback.classList.remove('success');
        }, 2000);
    }).catch(err => {
        displayError('Failed to copy to clipboard');
        console.error('Copy error:', err);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Event listeners
nextBtn.addEventListener('click', fetchJoke);
copyBtn.addEventListener('click', copyToClipboard);
categorySelect.addEventListener('change', fetchJoke);

// Load initial joke on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchJoke();
});

console.log('🎉 Joke Generator loaded successfully!');
