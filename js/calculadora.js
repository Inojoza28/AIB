// Calculadora

// Obtém o elemento de exibição da calculadora
const display = document.getElementById("calc-display");
// Obtém todos os botões da calculadora
const buttons = document.querySelectorAll("button");
// Obtém o elemento da calculadora
const calculator = document.getElementById("calculator");
// Obtém o botão de alternar calculadora
const toggleCalculatorButton = document.getElementById("toggle-calculator");

// Adiciona um evento de clique a cada botão
buttons.forEach(button => {
    button.addEventListener("click", () => {
        // Verifica se o botão é um dígito ou operador
        if (button.classList.contains("digit") || button.classList.contains("operator")) {
            // Substitui a divisão por ÷ e a multiplicação por x antes de adicionar ao visor
            let buttonText = button.textContent;
            if (buttonText === "÷") {
                buttonText = "/";
            } else if (buttonText === "x") {
                buttonText = "*";
            }
            display.value += buttonText;
        } else if (button.classList.contains("equal")) {
            // Se o botão for de igual, calcula o resultado da expressão
            try {
                display.value = eval(display.value);
            } catch (error) {
                display.value = "Error";
            }
        } else if (button.classList.contains("function")) {
            // Se o botão for de uma função especial, manipula a função
            handleFunction(button.id);
        }
    });
});

// Função para manipular funções especiais
function handleFunction(id) {
    switch (id) {
        case "clear":
            display.value = "";
            break;
        case "backspace":
            display.value = display.value.slice(0, -1);
            break;
        case "percentage":
            display.value = eval(display.value) / 100;
            break;
        default:
            break;
    }
}

// Adiciona um evento de clique ao botão de alternar calculadora
toggleCalculatorButton.addEventListener("click", () => {
    if (calculator.style.display === "none") {
        calculator.style.display = "block";
        toggleCalculatorButton.innerHTML = "<i class='bx bxs-x-circle'></i>";
    } else {
        calculator.style.display = "none";
        toggleCalculatorButton.innerHTML = "<i class='bx bxs-calculator'></i>";
    }
});

// Adiciona um evento de rolagem para mostrar ou ocultar o botão de alternar calculadora
window.addEventListener('scroll', function () {
    var scrollTopButton = document.querySelector('.scroll-top');
    var toggleCalculatorButton = document.getElementById('toggle-calculator');
    if (this.window.pageYOffset > 200) {
        toggleCalculatorButton.classList.add('show');
        scrollTopButton.style.display = 'block';
    } else {
        toggleCalculatorButton.classList.remove('show');
        scrollTopButton.style.display = 'none';
    }
});

// Fim Calculadora