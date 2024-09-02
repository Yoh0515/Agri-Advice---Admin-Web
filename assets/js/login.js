const firebaseConfig = {
  apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
  authDomain: "final-database-9493d.firebaseapp.com",
  databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
  projectId: "final-database-9493d",
  storageBucket: "final-database-9493d.appspot.com",
  messagingSenderId: "798360016853",
  appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function loginUser(email, password) {
  showLoading();
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      user.reload().then(() => {
        hideLoading();
        if (user.emailVerified) {
          showToast("Successfully Logged In.", "success");
          sessionStorage.setItem("isLoggedIn", "true");
          setTimeout(() => {
            window.location.href = "index1.html";
          }, 1500);
        } else {
          sessionStorage.setItem("isLoggedIn", "false");
          showToast("Please check your email for verification and proceed to Login.", "warning");
        }
      });
    })
    .catch((error) => {
      hideLoading();
      sessionStorage.setItem("isLoggedIn", "false");
      showToast("Login failed: Please check your email for verification.", "error");
    });
}

function showLoading() {
  const button = document.getElementById('submit');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('buttonText');

  spinner.classList.remove('hidden');
  buttonText.textContent = "Logging In...";
  button.disabled = true;
}

function hideLoading() {
  const button = document.getElementById('submit');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('buttonText');

  spinner.classList.add('hidden');
  buttonText.textContent = "Login";
  button.disabled = false;
}

function showToast(message, type) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-lg shadow-lg 
    ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`;
  
  toast.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-opacity-75">
      ${type === 'success' ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' 
      : type === 'warning' ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>' 
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'}
    </div>
    <div class="ml-3 text-sm font-medium">${message}</div>
  `;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var email = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  loginUser(email, password);
});