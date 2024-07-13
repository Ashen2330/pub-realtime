document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    const logoutButton = document.getElementById('logout-button');
    const showSignupButton = document.getElementById('show-signup');
    const showLoginButton = document.getElementById('show-login');

    showSignupButton.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    showLoginButton.addEventListener('click', () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('username', data.username);
                showChat();
            } else {
                const errorData = await response.json();
                loginError.textContent = errorData.message;
            }
        } catch (error) {
            loginError.textContent = 'Something went wrong. Please try again.';
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('username', data.username);
                showChat();
            } else {
                const errorData = await response.json();
                signupError.textContent = errorData.message;
            }
        } catch (error) {
            signupError.textContent = 'Something went wrong. Please try again.';
        }
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();

        if (message) {
            socket.emit('chat message', {
                user: sessionStorage.getItem('username'),
                message: message
            });
            chatInput.value = '';
        }
    });

    logoutButton.addEventListener('click', () => {
        const username = sessionStorage.getItem('username');
        socket.emit('logout', username);
        sessionStorage.removeItem('username');
        showLogin();
    });

    socket.on('chat message', (msg) => {
        addMessage(msg.user, msg.message);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    function showChat() {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'none';
        chatContainer.style.display = 'block';
    }

    function showLogin() {
        chatContainer.style.display = 'none';
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }

    function addMessage(user, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<p class="user">${user}</p><p>${message}</p>`;
        chatBox.appendChild(messageElement);
    }

    // Check if the user is already logged in
    if (sessionStorage.getItem('username')) {
        showChat();
    } else {
        showLogin();
    }
});
