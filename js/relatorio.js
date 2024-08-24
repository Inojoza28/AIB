// Função para baixar o relatório txt
const downloadReport = () => {
    if (tempAmount === 0) {
        alert("Por favor, defina o orçamento antes de baixar o relatório.");
        return;
    }

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];

    const totalAmountValue = parseFloat(amount.innerText.replace("R$ ", ""));
    const expenditureTotal = parseFloat(expenditureValue.innerText.replace("R$ ", ""));
    const balanceTotal = parseFloat(balanceValue.innerText.replace("R$ ", ""));
    const expenses = Array.from(document.querySelectorAll(".sublist-content")).map(item => {
        const product = item.querySelector(".product").innerText;
        const amount = parseFloat(item.querySelector(".amount").innerText.replace("R$ ", ""));
        return `${product}: R$ ${amount.toFixed(2)}`;
    });
    const guidance = suggestions.innerText;
    const actionPlan = planodeacaoContent.innerText;

    let reportContent = `RELATÓRIO DE DESPESAS (AIB) - ${currentMonth}\n\n`;
    reportContent += "------------------------------\n\n";
    reportContent += `*Orçamento Total:* R$ ${totalAmountValue.toFixed(2)}\n\n`;
    reportContent += "*Lista de Despesas:*\n\n";
    reportContent += `${expenses.join("\n")}\n\n`;
    reportContent += `*Total de Despesas:* R$ ${expenditureTotal.toFixed(2)}\n`;
    reportContent += `*Saldo:* R$ ${balanceTotal.toFixed(2)}\n\n`;
    reportContent += "*Orientações:*\n\n";
    reportContent += `${guidance}\n\n`;
    reportContent += "*Plano de Ação:*\n\n";
    reportContent += `${actionPlan}`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_despesas_${currentMonth}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadReport);

// Fim da Função para baixar o relatório txt