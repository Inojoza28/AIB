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
const suggestions = document.getElementById("suggestions"); 
const planodeacaoContent = document.getElementById("planodeacao-content"); // Nova adição
let tempAmount = 0;

// Set Budget Functions

totalAmountButton.addEventListener("click", () => {
    tempAmount = parseFloat(totalAmount.value);
    if (isNaN(tempAmount) || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = tempAmount.toFixed(2);
        updateBalance();
        totalAmount.value = "";
        planodeacaoContent.classList.remove("hide"); // Mostra a mensagem de economizar 20%
        let savingAmount = (tempAmount * 0.2).toFixed(2); // Calcula o valor a economizar
        planodeacaoContent.innerText = `- Economize R$ ${savingAmount} (20% do seu orçamento inicial) para garantir sua segurança financeira.`; // Mostra o valor a economizar na mensagem
        suggestions.innerText = ""; // Limpa as sugestões
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
        userAmount.value = parentAmount.toFixed(2); 
        disableButtons(true);
    }

    parentDiv.remove();

    updateBalance(); 
    updateSuggestions(); 
};

// Create list function

const listCreator = (expenseName, expenseValue) => {
    if (tempAmount === 0) {
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

    updateBalance(); 
    updateSuggestions(); 

    document.getElementById("list").appendChild(subListContent);

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
    expenditureValue.innerText = totalExpenses.toFixed(2); 

    let totalBalance = tempAmount - totalExpenses;
    balanceValue.innerText = totalBalance.toFixed(2); 
};

// Função para atualizar as orientações
const updateSuggestions = () => {
    let totalExpenses = parseFloat(expenditureValue.innerText);
    let totalBalance = parseFloat(balanceValue.innerText);

    if (totalBalance < 0) {
        suggestions.innerText = "Seu saldo ficou negativo. É hora de parar de gastar e revisar seus gastos para se ajustar ao orçamento.";
        return;
    }

    if (totalBalance === 0) {
        let installmentAmount = (totalExpenses / 12).toFixed(2);
        suggestions.innerText = `Seu saldo está zerado. Considere economizar mais nas suas futuras despesas, use um parcelamento para não se prejudicar. Valor da parcela em 12x: R$ ${installmentAmount}`;
        return;
    }

    if (list.children.length === 0) {
        suggestions.innerText = "";
        return;
    }

    let twentyPercent = tempAmount * 0.2;
    if (totalExpenses >= (tempAmount - twentyPercent)) {
        suggestions.innerText = "Você está nos últimos 20% do seu orçamento. Considere controlar mais os gastos ou utilizar o parcelamento para evitar problemas financeiros.";

        if (totalExpenses > totalBalance) {
            let numberOfInstallments = Math.min(Math.floor(totalExpenses / totalBalance), 12);
            let installmentAmount = (totalExpenses / numberOfInstallments).toFixed(2);
            let suggestionText = `Você pode parcelar suas despesas em ${numberOfInstallments} vezes de ${installmentAmount} cada.`;

            let existingSuggestions = suggestions.innerText;
            if (existingSuggestions !== "") {
                suggestions.innerText += "\n" + suggestionText;
            } else {
                suggestions.innerText = suggestionText;
            }
        }
    } else if (totalExpenses >= tempAmount / 2) {
        suggestions.innerText = "Cuidado! Você já gastou mais da metade do seu orçamento. Continue acompanhando seus gastos para não exceder o limite.";
    } else {
        suggestions.innerText = "";
    }
};

// Event Listener for checking and adding expenses
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        productCostError.classList.remove("hide");
        return false;
    }
    let expenditure = parseFloat(userAmount.value);
    listCreator(productTitle.value, expenditure.toFixed(2));
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



// // Array de frases
// var frases = [
//     "A liberdade financeira não é a ausência de dívidas, mas a capacidade de viver a vida que você deseja. <br><br> - Grant Sabatier",
//     "Planejar o futuro não é adivinhar o que vai acontecer, mas criar o que você deseja que aconteça. <br><br> - Peter Drucker",
//     "Cada centavo que você economiza hoje é um centavo que você não precisa trabalhar para ganhar amanhã. <br><br> - J. L. Collins",
//     "O sucesso é a soma de pequenos esforços repetidos dia após dia. - Robert Collier"
// ];

// function escolherFrase() {
//     var index = Math.floor(Math.random() * frases.length);
//     return frases[index];
// }

// function atualizarFrase() {
//     var frase = escolherFrase();
//     document.getElementById("frase").innerHTML = frase;
// }

// window.onload = atualizarFrase;

// // fim do Array de frases