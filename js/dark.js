const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

// Função para alternar o modo dark
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
    
    document.querySelectorAll('button').forEach(button => {
        button.classList.toggle('dark-mode');
    });

    document.querySelectorAll('input').forEach(input => {
        input.classList.toggle('dark-mode');
    });

    // Salvar o estado do modo dark no localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'true');
    } else {
        localStorage.setItem('dark-mode', 'false');
    }
}

// Função para verificar a posição da rolagem e mostrar/esconder o botão
function checkScrollPosition() {
    if (window.scrollY > 100) { // Ajuste o valor conforme necessário
        toggleButton.classList.add('show');
    } else {
        toggleButton.classList.remove('show');
    }
}

// Verifica se o modo dark está armazenado no localStorage
if (localStorage.getItem('dark-mode') === 'true') {
    toggleDarkMode();  // Ativa o modo dark se estiver salvo no localStorage
}

// Evento de clique para alternar o modo dark
toggleButton.addEventListener('click', toggleDarkMode);

// Evento de rolagem para controlar a visibilidade do botão
window.addEventListener('scroll', checkScrollPosition);

// Verifica a posição inicial ao carregar a página
checkScrollPosition();
