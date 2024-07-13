"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var socket = io();
  var loginForm = document.getElementById('login-form');
  var signupForm = document.getElementById('signup-form');
  var loginContainer = document.getElementById('login-container');
  var signupContainer = document.getElementById('signup-container');
  var chatContainer = document.getElementById('chat-container');
  var chatForm = document.getElementById('chat-form');
  var chatInput = document.getElementById('chat-input');
  var chatBox = document.getElementById('chat-box');
  var loginError = document.getElementById('login-error');
  var signupError = document.getElementById('signup-error');
  var logoutButton = document.getElementById('logout-button');
  var showSignupButton = document.getElementById('show-signup');
  var showLoginButton = document.getElementById('show-login');
  showSignupButton.addEventListener('click', function () {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
  });
  showLoginButton.addEventListener('click', function () {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });
  loginForm.addEventListener('submit', function _callee(e) {
    var username, password, response, data, errorData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            username = document.getElementById('username').value;
            password = document.getElementById('password').value;
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(fetch('http://localhost:3000/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            }));

          case 6:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 15;
              break;
            }

            _context.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            data = _context.sent;
            sessionStorage.setItem('username', data.username);
            showChat();
            _context.next = 19;
            break;

          case 15:
            _context.next = 17;
            return regeneratorRuntime.awrap(response.json());

          case 17:
            errorData = _context.sent;
            loginError.textContent = errorData.message;

          case 19:
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](3);
            loginError.textContent = 'Something went wrong. Please try again.';

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 21]]);
  });
  signupForm.addEventListener('submit', function _callee2(e) {
    var username, password, response, data, errorData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            username = document.getElementById('signup-username').value;
            password = document.getElementById('signup-password').value;
            _context2.prev = 3;
            _context2.next = 6;
            return regeneratorRuntime.awrap(fetch('http://localhost:3000/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            }));

          case 6:
            response = _context2.sent;

            if (!response.ok) {
              _context2.next = 15;
              break;
            }

            _context2.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            data = _context2.sent;
            sessionStorage.setItem('username', data.username);
            showChat();
            _context2.next = 19;
            break;

          case 15:
            _context2.next = 17;
            return regeneratorRuntime.awrap(response.json());

          case 17:
            errorData = _context2.sent;
            signupError.textContent = errorData.message;

          case 19:
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](3);
            signupError.textContent = 'Something went wrong. Please try again.';

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[3, 21]]);
  });
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var message = chatInput.value.trim();

    if (message) {
      socket.emit('chat message', {
        user: sessionStorage.getItem('username'),
        message: message
      });
      chatInput.value = '';
    }
  });
  logoutButton.addEventListener('click', function () {
    var username = sessionStorage.getItem('username');
    socket.emit('logout', username);
    sessionStorage.removeItem('username');
    showLogin();
  });
  socket.on('chat message', function (msg) {
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
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = "<p class=\"user\">".concat(user, "</p><p>").concat(message, "</p>");
    chatBox.appendChild(messageElement);
  } // Check if the user is already logged in


  if (sessionStorage.getItem('username')) {
    showChat();
  } else {
    showLogin();
  }
});