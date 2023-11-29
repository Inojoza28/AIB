const socket = io();

function calculateBalance() {
    const incomeInput = document.getElementById('income');
    const expenseInput = document.getElementById('expense');

    const income = parseFloat(incomeInput.value) || 0;
    const expense = parseFloat(expenseInput.value) || 0;

    const userData = { income, expense };

    fetch('http://localhost:3000/api/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        updateDisplay(data);
    });
}

function updateDisplay(data) {
    updateBalanceDisplay(data);
    updateChart(data);
    updateSuggestion(data);
}

function updateBalanceDisplay(data) {
    const balanceElement = document.getElementById('balance');
    const incomeDisplay = document.getElementById('income-display');
    const expenseDisplay = document.getElementById('expense-display');

    balanceElement.innerText = `Saldo Atual: R$${data.balance.toFixed(2)}`;
    balanceElement.style.color = data.balance >= 0 ? '#4CAF50' : '#FF5252';

    incomeDisplay.innerText = `Renda Mensal: R$${data.income.toFixed(2)}`;
    expenseDisplay.innerText = `Despesas Mensais: R$${data.expense.toFixed(2)}`;
}

function updateChart(data) {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    
    if(window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Renda', 'Despesas'],
            datasets: [{
                label: 'Renda vs Despesas',
                data: [data.income, -data.expense],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function updateSuggestion(data) {
    const savingsPercentage = 10; // Porcentagem sugerida para poupança
    const savingsAmount = (data.balance * savingsPercentage) / 100;

    let suggestion = '';

    if (data.balance > 0) {
        suggestion = `Você tem um saldo positivo. Considere economizar ou investir. Além disso, tente juntar ${savingsPercentage}% do seu saldo atual (R$${savingsAmount.toFixed(2)}).`;

        // Sugestão adicional com base na proporção gasta
        const expensePercentage = (data.expense / data.income) * 100;
        if (expensePercentage > 50) {
            suggestion += ' Você está gastando mais da metade da sua renda em despesas. Reveja seus gastos para economizar mais.';
        }
    } else if (data.balance < 0) {
        suggestion = 'Seu saldo está negativo. Reveja suas despesas e encontre maneiras de economizar.';
    } else {
        suggestion = 'Seu saldo está zerado. Planeje suas despesas e metas financeiras.';
    }

    document.getElementById('suggestion').innerText = suggestion;
}

// Adicione o seguinte código para receber as atualizações em tempo real via Socket.io
socket.on('updateData', updateDisplay);

// Execute a função de atualização ao carregar a página
window.onload = function () {
    fetch('http://localhost:3000/api/user')
    .then(response => response.json())
    .then(updateDisplay);
};
