let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
const suggestions = document.getElementById("suggestions"); // Adicionado para referenciar as orientações diretamente
let tempAmount = 0;

// Set Budget Functions

totalAmountButton.addEventListener("click", () => {
    tempAmount = parseFloat(totalAmount.value);
    // Bad input
    if (isNaN(tempAmount) || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        // Set budget
        amount.innerHTML = tempAmount.toFixed(2); // Mostrar o valor com duas casas decimais
        updateBalance(); // Atualiza o saldo
        // Clear input
        totalAmount.value = "";
    }
});

// Disable edit and delete button function

const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Modify list elements function

const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText);
    if (edit) {
        let parentText = parentDiv.querySelector(".product").innerText;
        productTitle.value = parentText;
        userAmount.value = parentAmount.toFixed(2); // Mostrar o valor com duas casas decimais
        disableButtons(true);
    }

    parentDiv.remove();

    updateBalance(); // Atualiza o saldo
    updateSuggestions(); // Atualiza as orientações
};

// Create list function

const listCreator = (expenseName, expenseValue) => {
    if (tempAmount === 0) {
        // Verifica se o valor do orçamento está definido
        errorMessage.classList.remove("hide");
        return;
    }

    let subListContent = document.createElement("div");
    subListContent.classList.add("sublist-content", "flex-space");
    list.appendChild(subListContent);
    subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "1.2em";
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "1.2em";
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });
    subListContent.appendChild(editButton);
    subListContent.appendChild(deleteButton);

    updateBalance(); // Atualiza o saldo
    updateSuggestions(); // Atualiza as orientações

    document.getElementById("list").appendChild(subListContent);

    // Limpa os campos de digitação da despesa e do valor
    productTitle.value = "";
    userAmount.value = "";
};

// Função para atualizar o saldo e os valores relacionados
const updateBalance = () => {
    let totalExpenses = 0;
    let listItems = document.querySelectorAll(".sublist-content");
    listItems.forEach((item) => {
        totalExpenses += parseFloat(item.querySelector(".amount").innerText);
    });
    expenditureValue.innerText = totalExpenses.toFixed(2); // Atualizar com duas casas decimais

    let totalBalance = tempAmount - totalExpenses;
    balanceValue.innerText = totalBalance.toFixed(2); // Atualizar com duas casas decimais
};

// Função para atualizar as orientações
const updateSuggestions = () => {
    let totalExpenses = parseFloat(expenditureValue.innerText);
    let totalBalance = parseFloat(balanceValue.innerText);

    // Verifica se o saldo ficou negativo
    if (totalBalance < 0) {
        // Se o saldo for negativo, exibe uma orientação para parar de gastar e revisar os gastos
        suggestions.innerText = "Seu saldo ficou negativo. É hora de parar de gastar e revisar seus gastos para se ajustar ao orçamento.";
        return;
    }

    // Verifica se o orçamento está zerado
    if (totalBalance === 0) {
        // Calcula o valor da parcela
        let installmentAmount = (totalExpenses / 12).toFixed(2);
        // Exibe a mensagem de saldo zerado com sugestão de parcelamento
        suggestions.innerText = `Seu saldo está zerado. Considere economizar mais nas suas futuras despesas, use um parcelamento para não se prejudicar. Valor da parcela em 12x: R$ ${installmentAmount}`;
        return;
    }

    // Verifica se a lista está vazia
    if (list.children.length === 0) {
        // Se a lista estiver vazia, limpa as orientações
        suggestions.innerText = "";
        return;
    }

    // Verifica se o total de despesas está nos últimos 20% do orçamento
    let twentyPercent = tempAmount * 0.2;
    if (totalExpenses >= (tempAmount - twentyPercent)) {
        // Mostra orientações sobre controlar gastos ou parcelamento
        suggestions.innerText = "Você está nos últimos 20% do seu orçamento. Considere controlar mais os gastos ou utilizar o parcelamento para evitar problemas financeiros.";

        // Opções de parcelamento
        if (totalExpenses > totalBalance) {
            let numberOfInstallments = Math.min(Math.floor(totalExpenses / totalBalance), 12); // Limita o número de parcelas a 12 e arredonda para baixo
            let installmentAmount = (totalExpenses / numberOfInstallments).toFixed(2);
            let suggestionText = `Você pode parcelar suas despesas em ${numberOfInstallments} vezes de ${installmentAmount} cada.`;

            // Verifica se já há sugestões exibidas
            let existingSuggestions = suggestions.innerText;
            if (existingSuggestions !== "") {
                // Se já houver sugestões, adiciona a nova sugestão em uma nova linha
                suggestions.innerText += "\n" + suggestionText;
            } else {
                // Se não houver sugestões, exibe a nova sugestão normalmente
                suggestions.innerText = suggestionText;
            }
        }
    } else if (totalExpenses >= tempAmount / 2) {
        // Adiciona uma orientação quando o orçamento passa da metade
        suggestions.innerText = "Cuidado! Você já gastou mais da metade do seu orçamento. Continue acompanhando seus gastos para não exceder o limite.";
    } else {
        // Limpa as sugestões se não estiver nos últimos 20% do orçamento
        suggestions.innerText = "";
    }
};

// Event Listener for checking and adding expenses
checkAmountButton.addEventListener("click", () => {
    // Check empty
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        return false;
    }

    // Expense
    let expenditure = parseFloat(userAmount.value);

    // Create list
    listCreator(productTitle.value, expenditure.toFixed(2)); // Atualizar com duas casas decimais
});




//Começo do codígo da animação de Inicio

particlesJS("particles", {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.8,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onHover: {
                enable: true,
                mode: "push"
            },
            onClick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
    });
}

window.addEventListener('scroll', function () {
    var scrollTopButton = document.querySelector('.scroll-top');
    if (this.window.pageYOffset > 200) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
});

//Fim do codígo da animação de Inicio

