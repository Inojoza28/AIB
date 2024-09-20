// Funções para gerar relatórios
const downloadReportBudget = () => {
    if (tempAmount === 0) {
        alert("Por favor, defina o orçamento antes de baixar o relatório.");
        return;
    }

    const totalBudget = tempAmount;
    const savingOptions = {
        "20% do Orçamento": totalBudget * 0.20,
        "15% do Orçamento": totalBudget * 0.15,
        "10% do Orçamento": totalBudget * 0.10,
    };

    const investPercentage = 0.60;
    const emergencyPercentage = 0.40;

    let reportContent = "Relatório de Planejamento com base no Orçamento Total (AIB Finance)\n\n";
    reportContent += `Orçamento Total: R$ ${totalBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;

    Object.keys(savingOptions).forEach(option => {
        const saveAmount = savingOptions[option];
        const investAmount = saveAmount * investPercentage;
        const emergencyAmount = saveAmount * emergencyPercentage;

        reportContent += `${option}: R$ ${saveAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `- Investimento (60%): R$ ${investAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `- Fundo de Emergência (40%): R$ ${emergencyAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;
    });

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Relatorio_Orcamento_Total.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

const downloadReportBalance = () => {
    if (tempAmount === 0) {
        alert("Por favor, defina o orçamento antes de baixar o relatório.");
        return;
    }

    const currentBalance = parseFloat(balanceValue.innerText.replace("R$ ", "").replace(",", ""));
    let reportContent = "Relatório de Planejamento com base no Saldo (AIB Finance)\n\n";
    reportContent += `Saldo Atual: R$ ${currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;

    if (currentBalance < 1000) {
        const emergencyAmount = currentBalance * 0.20;
        reportContent += `Como o saldo é menor que R$ 1000, sugerimos que você direcione 20% do saldo para o fundo de emergência:\n`;
        reportContent += `Fundo de Emergência (20%): ${emergencyAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;
    } else {
        const saveAmount = currentBalance * 0.20;
        const investAmount = saveAmount * 0.60;
        const emergencyAmount = saveAmount * 0.40;

        reportContent += `20% do saldo total: R$ ${saveAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `- 60% para Investimento: R$ ${investAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `- 40% para Fundo de Emergência: R$ ${emergencyAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;
    }

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Relatorio_Saldo.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// Adicionar Event Listeners para os botões de download
document.getElementById("downloadBudgetButton").addEventListener("click", downloadReportBudget);
document.getElementById("downloadBalanceButton").addEventListener("click", downloadReportBalance);

// Função de atualização de saldo e orçamento
totalAmountButton.addEventListener("click", () => {
    tempAmount = parseFloat(totalAmount.value);
    if (isNaN(tempAmount) || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = `R$ ${tempAmount.toFixed(2)}`;
        updateBalance();
        totalAmount.value = "";
        planodeacaoContent.classList.remove("hide");
        let savingAmount = (tempAmount * 0.2).toFixed(2);
        planodeacaoContent.innerText = `Economize R$ ${savingAmount} (20% do seu orçamento inicial) para garantir sua segurança financeira.`;
        suggestions.innerText = "";
    }
});

