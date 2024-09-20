// Função para baixar o relatório txt e calcular a variação do saldo
const downloadReport = () => {
    if (tempAmount === 0) {
        alert("Por favor, defina o orçamento antes de baixar o relatório.");
        return;
    }

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    // Formatação adequada para valores monetários
    const totalAmountValue = parseFloat(amount.innerText.replace("R$ ", "")).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const expenditureTotal = parseFloat(expenditureValue.innerText.replace("R$ ", "")).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const balanceTotal = parseFloat(balanceValue.innerText.replace("R$ ", "")).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    
    // Coleta de despesas formatadas
    const expenses = Array.from(document.querySelectorAll(".sublist-content")).map(item => {
        const product = item.querySelector(".product").innerText;
        const amount = parseFloat(item.querySelector(".amount").innerText.replace("R$ ", "")).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        return `${product}: ${amount}`;
    });

    const guidance = suggestions.innerText;
    const actionPlan = planodeacaoContent.innerText;

    let reportContent = `RELATÓRIO DE DESPESAS (AIB) - ${currentMonth} ${currentYear}\n`;
    reportContent += "------------------------------------\n\n";
    reportContent += `*Orçamento Total:* ${totalAmountValue}\n\n`;
    reportContent += "*Lista de Despesas:*\n\n";
    reportContent += `${expenses.join("\n")}\n\n`;
    reportContent += `*Total de Despesas:* ${expenditureTotal}\n`;
    reportContent += `*Saldo:* ${balanceTotal}\n\n`;

    // Obtendo o saldo anterior do Local Storage
    const previousBalance = parseFloat(localStorage.getItem("previousBalance")) || 0;

    if (!localStorage.getItem("previousBalance")) {
        // Caso seja o primeiro relatório
        reportContent += "*Orientações:*\n\n";
        reportContent += `${guidance}\n\n`;
        reportContent += `\n------------------------------\n\n`;
        reportContent += "*Plano de Ação:*\n\n";
        reportContent += `${actionPlan}\n\n`;
        reportContent += "*Mensagem de Boas-Vindas:*\n\n";
        reportContent += "Bem-vindo ao AIB! Sucesso para sua nova jornada de controle financeiro.\n\n";
    } else {
        // Cálculo da variação do saldo
        const balanceVariation = parseFloat(balanceValue.innerText.replace("R$ ", "")) - previousBalance;
        let feedbackMessage = "";

        if (balanceVariation > 0) {
            feedbackMessage = `Parabéns! Seu saldo aumentou em R$ ${balanceVariation.toFixed(2)} desde a última vez. Isso indica que você está fazendo um bom trabalho ao controlar seus gastos. Continue assim para alcançar suas metas financeiras!`;
        } else if (balanceVariation < 0) {
            feedbackMessage = `Parabéns pelo esforço! Embora seu saldo tenha diminuído em R$ ${Math.abs(balanceVariation).toFixed(2)}, é importante identificar onde você pode ajustar seus gastos para melhorar sua situação financeira. Considere revisar suas despesas e buscar áreas onde pode economizar.`;
        } else {
            feedbackMessage = "Seu saldo não mudou desde a última vez. Isso significa que você está mantendo o controle, mas sempre há espaço para melhorar e aumentar suas economias.";
        }

        reportContent += "*Resumo do Saldo:*\n\n";
        reportContent += `Saldo anterior: R$ ${previousBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        reportContent += `Saldo atual: ${balanceTotal}\n`;
        reportContent += `Variação de Saldo: R$ ${balanceVariation.toFixed(2)}\n\n`;
        reportContent += "*Orientações:*\n\n";
        reportContent += `${guidance}\n\n`;
        reportContent += `\n------------------------------\n\n`;
        reportContent += "*Plano de Ação:*\n\n";
        reportContent += `${actionPlan}\n\n`;
        reportContent += `\n------------------------------\n\n`;
        reportContent += "*Mensagem Personalizada:*\n\n";
        reportContent += `${feedbackMessage}\n\n`;
        reportContent += `\n------------------------------\n\n`;
        reportContent += "📝 NOTA: A variação de saldo reflete a diferença entre o saldo anterior e o atual, facilitando o monitoramento financeiro e auxiliando no alcance de metas financeiras.";
    }


// Salvando o saldo atual, orçamento total e despesas no Local Storage
localStorage.setItem("previousBalance", parseFloat(balanceValue.innerText.replace("R$ ", "")));
localStorage.setItem("totalBudget", parseFloat(amount.innerText.replace("R$ ", "")));
localStorage.setItem("totalExpenditure", parseFloat(expenditureValue.innerText.replace("R$ ", "")));

// Salvando o histórico de saldos, orçamentos e despesas no Local Storage
let balanceHistory = JSON.parse(localStorage.getItem("balanceHistory")) || [];
balanceHistory.push({ 
    date: new Date().toISOString(), 
    balance: parseFloat(balanceValue.innerText.replace("R$ ", "")),
    totalBudget: parseFloat(amount.innerText.replace("R$ ", "")),
    totalExpenditure: parseFloat(expenditureValue.innerText.replace("R$ ", ""))
});
localStorage.setItem("balanceHistory", JSON.stringify(balanceHistory));


    // Gerando o arquivo para download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_despesas_${currentMonth}_${currentYear}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// Event listener para o botão de download
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadReport);