document.addEventListener('DOMContentLoaded', () => {

    const loginFormContainer = document.getElementById('login-form-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const errorMessage = document.getElementById('error-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const userEmailElement = document.getElementById('user-email');

    let usersData = [];

    async function loadUsersData() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }
            usersData = await response.json();
            console.log('Данные пользователей загружены:', usersData);
        } catch (error) {
            console.error('Не удалось загрузить или разобрать users.json:', error);
            errorMessage.textContent = 'Ошибка загрузки данных. Попробуйте позже.';
        }
    }

    function switchInterface(showDashboard, user = null) {
        if (showDashboard) {

            loginFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('active');
            
            if (user) {
                welcomeMessage.textContent = `Добро пожаловать, ${user.name}!`;
                userEmailElement.textContent = user.email;
            }

            setTimeout(() => {
                loginFormContainer.style.display = 'none';
                dashboardContainer.style.display = 'flex';
                setTimeout(() => {
                     dashboardContainer.classList.remove('hidden');
                     dashboardContainer.classList.add('active');
                }, 50);
            }, 500);
            
        } else {
            dashboardContainer.classList.add('hidden');
            dashboardContainer.classList.remove('active');
            
            setTimeout(() => {
                dashboardContainer.style.display = 'none';
                loginFormContainer.style.display = 'flex'; 
                setTimeout(() => {
                    loginFormContainer.classList.remove('hidden');
                    loginFormContainer.classList.add('active');
                    loginForm.reset();
                    errorMessage.textContent = '';
                }, 50);
            }, 500);
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        const user = usersData.find(u => 
            u.username === usernameInput && u.password === passwordInput
        );

        if (user) {
            errorMessage.textContent = '';
            switchInterface(true, user);
        } else {
            errorMessage.textContent = 'Неверный логин или пароль.';
        }
    });

    logoutButton.addEventListener('click', () => {
        switchInterface(false);
    });

    loadUsersData();
});