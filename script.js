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


// Permitir adicionar orçamento pressionando Enter
totalAmount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        totalAmountButton.click();
    }
});

// Permitir adicionar despesa pressionando Enter
userAmount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkAmountButton.click();
    }
});

productTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkAmountButton.click();
    }
});


// Função para encontrar a despesa de menor valor que, ao ser removida, tornaria o saldo positivo
const findExpenseToRemove = (totalExpenses, listItems) => {
    let removeExpense = null;
    let currentBalance = tempAmount - totalExpenses;

    // Ordenar as despesas em ordem crescente de valor
    let sortedExpenses = Array.from(listItems).sort((a, b) => {
        let amountA = parseFloat(a.querySelector(".amount").innerText.replace("R$ ", ""));
        let amountB = parseFloat(b.querySelector(".amount").innerText.replace("R$ ", ""));
        return amountA - amountB;
    });

    // Tentar remover as despesas uma a uma até encontrar a primeira que torne o saldo positivo
    for (let i = 0; i < sortedExpenses.length; i++) {
        let currentExpense = parseFloat(sortedExpenses[i].querySelector(".amount").innerText.replace("R$ ", ""));
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
        amount.innerHTML = `R$ ${tempAmount.toFixed(2)}`; // Adicionado o cifrão aqui
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
    let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText.replace("R$ ", ""));
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
    subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">R$ ${expenseValue}</p>`;
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
        totalExpenses += parseFloat(item.querySelector(".amount").innerText.replace("R$ ", ""));
    });
    expenditureValue.innerText = `R$ ${totalExpenses.toFixed(2)}`;

    let totalBalance = tempAmount - totalExpenses;
    balanceValue.innerText = `R$ ${totalBalance.toFixed(2)}`;

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
            planodeacaoContent.innerText = `Você está nos últimos 20% do seu orçamento. \n \n • Você pode parcelar suas despesas em ${numberOfInstallments} vezes de R$ ${installmentAmount} cada. \n \n  1. Antes de parcelar, avalie sua capacidade financeira e evite múltiplas compras parceladas. \n \n  2. Além disso, é importante ler atentamente os termos do parcelamento para evitar custos adicionais. \n \n O parcelamento pode ser útil, mas é crucial evitar o endividamento excessivo e manter controle financeiro.`;
            // Alterar a cor do saldo para amarelo
            balanceValue.style.color = "#FFCF04";

            // Limpar a caixa de entrada de despesas quando estiver nos últimos 20% do orçamento
            productTitle.value = "";
            userAmount.value = "";
        }
    } else if (listItems.length <= 1) {
        planodeacaoContent.innerText = `Economize R$ ${(tempAmount * 0.2).toFixed(2)} (20% do seu orçamento inicial) para garantir sua segurança financeira.`;
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
    let totalExpenses = parseFloat(expenditureValue.innerText.replace("R$ ", ""));
    let totalBalance = parseFloat(balanceValue.innerText.replace("R$ ", ""));

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
        let messages = [
            "Estamos nos últimos 20% do seu orçamento. 📊 \n \n Reserve um tempo mensal para revisar seus gastos, especialmente os últimos 20% do seu orçamento. Isso ajudará a entender seus hábitos de consumo e tomar decisões mais conscientes. \n \n Planejar suas despesas mensais ajuda a antecipar gastos futuros e garantir que seus últimos 20% de orçamento cubram necessidades essenciais, evitando gastos desnecessários.",
            "Você está nos últimos 20% do seu orçamento. 📊 \n \n Com 80% do seu orçamento já gasto, é o momento de reavaliar suas prioridades. Foque nos gastos essenciais e evite qualquer compra desnecessária. Use os 20% restantes com sabedoria para garantir que você tenha flexibilidade para o que ainda precisa fazer.",
            "Você está nos últimos 20% do seu orçamento. 📊 \n \n Com 80% do orçamento já gasto, é hora de pisar no freio. Reavalie suas despesas, corte o que não for essencial e use os 20% restantes com muita cautela. Priorize o que realmente importa e guarde um pouco para imprevistos.",
            "Você está nos últimos 20% do seu orçamento. 📊 \n \n Agora é o momento ideal para revisar suas despesas recentes e priorizar gastos essenciais. Planeje com atenção para garantir que o restante do seu orçamento cubra apenas o necessário, evitando gastos desnecessários. Uma análise cuidadosa pode ajudar a ajustar seus planos e alcançar suas metas financeiras.",
            "Você está nos últimos 20% do seu orçamento. 📊 \n \n Agora é o momento de priorizar suas despesas e revisar seus gastos. Foque em necessidades essenciais e evite compras impulsivas. Planeje com cuidado para garantir que esses últimos 20% sejam usados de forma eficiente e ajudem você a alcançar suas metas financeiras."
        ];
    
        // Seleciona uma mensagem aleatoriamente
        let randomMessage = messages[Math.floor(Math.random() * messages.length)];
        suggestions.innerText = randomMessage;
    
        if (totalExpenses > totalBalance && tempAmount >= 150) {
            let numberOfInstallments = Math.min(Math.floor(totalExpenses / totalBalance), 12);
            let installmentAmount = (totalExpenses / numberOfInstallments).toFixed(2);
    
            let existingSuggestions = suggestions.innerText;
            if (existingSuggestions !== "") {
                // suggestions.innerText += "\n" + `Você pode parcelar suas despesas em ${numberOfInstallments} vezes de R$ ${installmentAmount} cada.`;
            } else {
                // suggestions.innerText = `Você pode parcelar suas despesas em ${numberOfInstallments} vezes de R$ ${installmentAmount} cada.`;
            }
        }
    } else if (totalExpenses >= tempAmount / 2) {
        suggestions.innerText = "Cuidado! Você já gastou mais da metade do seu orçamento. Continue acompanhando seus gastos para não exceder o limite.";
    } else {
        suggestions.innerText = "";

    }};


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






