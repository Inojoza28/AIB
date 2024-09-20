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

    let reportContent = "Relatório de Planejamento com Base no Saldo (AIB Finance)\n\n";
    reportContent += `Saldo Atual: ${currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
    reportContent += "----------------------------------------------\n\n";

    if (currentBalance < 1000) {
        const emergencyAmount = currentBalance * 0.20;
        reportContent += `Como o seu saldo atual é menor que R$ 1.000, recomendamos um foco especial em segurança financeira.\n`;
        reportContent += `Sugerimos que você direcione 20% do seu saldo para um Fundo de Emergência, o que ajuda a cobrir despesas imprevistas e garantir estabilidade financeira.\n\n`;
        reportContent += `Fundo de Emergência (20% do Saldo): ${emergencyAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += "----------------------------------------------\n\n";
        reportContent += "Dicas:\n";
        reportContent += "- Mantenha este fundo acessível para cobrir emergências inesperadas.\n";
        reportContent += "- Evite usar este fundo para despesas não essenciais.\n";
        reportContent += "- Continue contribuindo para aumentar a segurança financeira.\n\n";
    } else {
        const saveAmount = currentBalance * 0.20;
        const investAmount = saveAmount * 0.60;
        const emergencyAmount = saveAmount * 0.40;

        reportContent += `Como o seu saldo é maior que R$ 1.000, sugerimos uma abordagem equilibrada entre investimentos e segurança financeira.\n\n`;
        reportContent += `Recomendamos direcionar 20% do seu saldo para planejamento financeiro, que inclui uma combinação de investimento e fundo de emergência.\n\n`;
        reportContent += `Detalhamento do Planejamento:\n\n`;
        reportContent += `20% do Saldo Total: ${saveAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `- Investimento (60% do Valor Economizado): ${investAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `  Objetivo: Aumentar o patrimônio e buscar rendimentos maiores a longo prazo.\n\n`;
        reportContent += `- Fundo de Emergência (40% do Valor Economizado): ${emergencyAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `  Objetivo: Proteger-se contra imprevistos financeiros e manter a segurança do orçamento.\n`;
        reportContent += "----------------------------------------------\n\n";
        reportContent += "Dicas:\n";
        reportContent += "- Diversifique seus investimentos para equilibrar risco e retorno.\n";
        reportContent += "- Revise regularmente o seu fundo de emergência para mantê-lo adequado às suas necessidades.\n";
        reportContent += "- Busque orientações financeiras para otimizar seus investimentos.\n\n";
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
