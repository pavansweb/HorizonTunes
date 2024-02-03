const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const button = document.querySelectorAll('button')
signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// document.addEventListener('click', () => {
//     window.location.href = "https://pavansweb.github.io/UwU/webPage/homePage.html";
// });