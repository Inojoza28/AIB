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
const planodeacaoContent = document.getElementById("planodeacao-content");
let tempAmount = 0;
let expenseCount = 0;

// Encontrar a despesa de menor valor que, ao ser removida, tornaria o saldo positivo
const findExpenseToRemove = (totalExpenses, listItems) => {
    let removeExpense = null;
    let currentBalance = tempAmount - totalExpenses;

    // Ordenar as despesas em ordem crescente de valor
    let sortedExpenses = Array.from(listItems).sort((a, b) => {
        let amountA = parseFloat(a.querySelector(".amount").innerText);
        let amountB = parseFloat(b.querySelector(".amount").innerText);
        return amountA - amountB;
    });

    // Tentar remover as despesas uma a uma até encontrar a primeira que torne o saldo positivo
    for (let i = 0; i < sortedExpenses.length; i++) {
        let currentExpense = parseFloat(sortedExpenses[i].querySelector(".amount").innerText);
        let newBalance = currentBalance + currentExpense;
        if (newBalance >= 0) {
            removeExpense = sortedExpenses[i].querySelector(".product").innerText;
            break;
        }
    }
    return removeExpense;
};

// Calcular o valor das parcelas de acordo com o total de despesas
const calculateInstallments = (totalExpenses, numberOfInstallments) => {
    let installmentAmount = totalExpenses / numberOfInstallments;
    return installmentAmount.toFixed(2);
};


// Definir funções de orçamento
totalAmountButton.addEventListener("click", () => {
    tempAmount = parseFloat(totalAmount.value);
    if (isNaN(tempAmount) || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = tempAmount.toFixed(2);
        updateBalance();
        totalAmount.value = "";
        planodeacaoContent.classList.remove("hide");
        let savingAmount = (tempAmount * 0.2).toFixed(2);
        planodeacaoContent.innerText = `Economize R$ ${savingAmount} (20% do seu orçamento inicial) para garantir sua segurança financeira.`;
        suggestions.innerText = "";
    }
});

// Desative a função do botão editar e excluir
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Função modificar elementos da lista
const modifyElement = (element, edit = false) => {
    // Obtém o elemento pai do botão (o item da lista)
    let parentDiv = element.parentElement;
    // Obtém o valor da despesa atual
    let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText);
    // Se o parâmetro 'edit' for verdadeiro, significa que estamos editando o elemento
    if (edit) {
        // Obtém o nome da despesa atual
        let parentText = parentDiv.querySelector(".product").innerText;
        // Define os valores dos campos de entrada como o nome e o valor da despesa atual
        productTitle.value = parentText;
        userAmount.value = parentAmount.toFixed(2);
    }

    // Remove o elemento da lista
    parentDiv.remove();
    // Atualiza o saldo e as sugestões exibidas na página
    updateBalance();
    updateSuggestions();
};


// Criar função de lista
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
    expenseCount++;

    if (expenseCount === 2) {
        planodeacaoContent.innerText = "Continue controlando seus gastos!";
    }
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

    // Verificar se o saldo é menor ou igual a 0 e alterar a cor correspondente
    if (totalBalance <= 0) {
        balanceValue.style.color = "red"; // Definir a cor do saldo como vermelha
    } else {
        balanceValue.style.color = ""; // Resetar a cor do saldo se for positivo
    }

    // Verifica o saldo e atualiza a mensagem do plano de ação
    if (totalBalance < 0) {
        let expenseToRemove = findExpenseToRemove(totalExpenses, listItems);
        if (listItems.length === 1) {
            planodeacaoContent.innerHTML = `Você só tem uma despesa que excede o saldo. Recomendamos não realizar essa compra e organizar melhor suas finanças.<br><br>`;
        } else {
            planodeacaoContent.innerHTML = `Seu saldo está negativo. Remova a despesa "${expenseToRemove}" para equilibrar suas finanças.<br><br>`;
        }
        if (tempAmount >= 150) {
            let installment6x = calculateInstallments(totalExpenses, 6);
            let installment12x = calculateInstallments(totalExpenses, 12);
            planodeacaoContent.innerHTML += `Para facilitar seu orçamento, você pode parcelar suas despesas em 6x ou 12x. Considere essa opção para melhor gerenciar seus gastos.<br><br>- Parcelamento em 6x: R$ ${installment6x} por mês<br>- Parcelamento em 12x: R$ ${installment12x} por mês`;
        }
    } else if (totalBalance === 0) {
        if (tempAmount >= 150) {
            let installment6x = calculateInstallments(totalExpenses, 6);
            let installment12x = calculateInstallments(totalExpenses, 12);
            planodeacaoContent.innerHTML = `Seu saldo está zerado. É hora de economizar e planejar seus gastos com mais cuidado.<br><br>- Parcelamento em 6x: R$ ${installment6x} por mês<br>- Parcelamento em 12x: R$ ${installment12x} por mês.`;
        } else {
            planodeacaoContent.innerText = "Seu saldo está zerado. É hora de economizar e planejar seus gastos com mais cuidado.";
        }
        suggestions.innerText = "";
    } else if (totalExpenses >= tempAmount * 0.8) {
        if (tempAmount >= 150) {
            let numberOfInstallments = Math.min(Math.floor(totalExpenses / totalBalance), 12);
            let installmentAmount = (totalExpenses / numberOfInstallments).toFixed(2);
            planodeacaoContent.innerText = `Você está nos últimos 20% do seu orçamento. \n \n • Você pode parcelar suas despesas em ${numberOfInstallments} vezes de ${installmentAmount} R$ cada. \n \n  1. Antes de parcelar, avalie sua capacidade financeira e evite múltiplas compras parceladas. \n \n  2. Além disso, é importante ler atentamente os termos do parcelamento para evitar custos adicionais. \n \n O parcelamento pode ser útil, mas é crucial evitar o endividamento excessivo e manter controle financeiro.`;
            // Alterar a cor do saldo para amarelo
            balanceValue.style.color = "#FFCF04";

            // Limpar a caixa de entrada de despesas quando estiver nos últimos 20% do orçamento
            productTitle.value = "";
            userAmount.value = "";
        }
    } else if (listItems.length <= 1) {
        planodeacaoContent.innerText = `Economize R$ ${tempAmount * 0.2} (20% do seu orçamento inicial) para garantir sua segurança financeira.`;
        suggestions.innerText = "";
        // Resetar a cor do saldo se não estiver nos últimos 20%
        balanceValue.style.color = "";
    } else {
        planodeacaoContent.innerText = "Continue controlando seus gastos!";
        suggestions.innerText = "";
        // Resetar a cor do saldo se não estiver nos últimos 20%
        balanceValue.style.color = "";
    }
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
        suggestions.innerText = `Seu saldo está zerado. Quando o orçamento atinge o zero, é hora de reavaliar estratégias e aprender com a experiência para evitar situações similares no futuro. \n Considere optar por parcelamento para evitar impactos negativos em suas finanças.`;
        return;
    }

    if (list.children.length === 0) {
        suggestions.innerText = "";
        return;
    }

    let twentyPercent = tempAmount * 0.2;
    if (totalExpenses >= tempAmount - twentyPercent) {
        suggestions.innerText = "Estamos nos últimos 20% do seu orçamento. 📊 \n \n Reserve um tempo mensal para revisar seus gastos, especialmente os últimos 20% do seu orçamento. Isso ajudará a entender seus hábitos de consumo e tomar decisões mais conscientes. \n \n Planejar suas despesas mensais ajuda a antecipar gastos futuros e garantir que seus últimos 20% de orçamento cubram necessidades essenciais, evitando gastos desnecessários.";

        if (totalExpenses > totalBalance && tempAmount >= 150) {
            let numberOfInstallments = Math.min(Math.floor(totalExpenses / totalBalance), 12);
            let installmentAmount = (totalExpenses / numberOfInstallments).toFixed(2);

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

// Event Listener para verificar e adicionar despesas
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

// Fim do codígo da animação de Inicio 



// Função para baixar o relatório txt
const downloadReport = () => {
    // Verifica se o orçamento foi definido
    if (tempAmount === 0) {
        alert("Por favor, defina o orçamento antes de baixar o relatório.");
        return;
    }

    // Obtém todas as informações necessárias
    const totalAmountValue = parseFloat(amount.innerText);
    const expenditureTotal = parseFloat(expenditureValue.innerText);
    const balanceTotal = parseFloat(balanceValue.innerText);
    const expenses = Array.from(document.querySelectorAll(".sublist-content")).map(item => {
        return `${item.querySelector(".product").innerText}: ${item.querySelector(".amount").innerText}`;
    });
    const guidance = suggestions.innerText;
    const actionPlan = planodeacaoContent.innerText;

    // Formata as informações em um único texto
    let reportContent = `Orçamento Total: R$ ${totalAmountValue.toFixed(2)}\n\n`;
    reportContent += "Lista de Despesas:\n\n";
    reportContent += expenses.join("\n");
    reportContent += `\n\nTotal de Despesas: R$ ${expenditureTotal.toFixed(2)}\n`;
    reportContent += `Saldo: R$ ${balanceTotal.toFixed(2)}\n\n`;
    reportContent += "Orientações:\n" + guidance + "\n\n";
    reportContent += "Plano de Ação:\n" + actionPlan;

    // Cria um objeto Blob com o conteúdo do relatório
    const blob = new Blob([reportContent], { type: "text/plain" });

    // Cria um link temporário para o Blob
    const url = window.URL.createObjectURL(blob);

    // Cria um elemento <a> temporário
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_despesas.txt";

    // Anexa o elemento <a> ao documento
    document.body.appendChild(a);

    // Clica no elemento <a> para iniciar o download
    a.click();

    // Remove o elemento <a> do documento
    document.body.removeChild(a);

    // Limpa o objeto URL
    window.URL.revokeObjectURL(url);
};

// Cria um botão para baixar o relatório
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadReport);
