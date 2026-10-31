const navMenuToggle = document.querySelector('.navbar-menu-toggle');
const navMenu = document.querySelector('.navbar-menu');

navMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});