
// --- Theme Toggle Logic --- (KEEP THIS PART)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const sunIcon = document.querySelector('#theme-toggle .sun-icon');
const moonIcon = document.querySelector('#theme-toggle .moon-icon');

// Function to apply the theme
const applyTheme = (theme) => {
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(theme);
    localStorage.setItem('themePreference', theme);

    if (theme === 'light-mode') {
        sunIcon.style.opacity = '1';
        sunIcon.style.transform = 'translateY(0)';
        moonIcon.style.opacity = '0';
        moonIcon.style.transform = 'translateY(-10px)';
    } else {
        sunIcon.style.opacity = '0';
        sunIcon.style.transform = 'translateY(10px)';
        moonIcon.style.opacity = '1';
        moonIcon.style.transform = 'translateY(0)';
    }
};

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('themePreference');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Determine initial theme
let currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark-mode' : 'light-mode');

// Apply the initial theme
applyTheme(currentTheme);


// Add event listener to the toggle button
themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
    applyTheme(newTheme);
});

// Listen for changes in system preference (optional)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('themePreference')) {
        const newSystemTheme = e.matches ? 'dark-mode' : 'light-mode';
        applyTheme(newSystemTheme);
    }
});