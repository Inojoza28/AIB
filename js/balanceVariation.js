// Função para calcular e exibir a variação de saldo na página
function displayBalanceVariation() {
    // Obtendo o histórico de saldo do Local Storage
    const balanceHistory = JSON.parse(localStorage.getItem("balanceHistory")) || [];

    // Verificando se há pelo menos dois registros no histórico para calcular a variação
    if (balanceHistory.length < 2) {
        console.log("Dados insuficientes para calcular a variação de saldo.");
        return;
    }

    // Obtendo o saldo atual e o saldo anterior
    const currentBalance = balanceHistory[balanceHistory.length - 1].balance; // Último saldo salvo
    const previousBalance = balanceHistory[balanceHistory.length - 2].balance; // Penúltimo saldo salvo

    // Calculando a variação de saldo
    const balanceVariation = currentBalance - previousBalance;

    // Selecionando o elemento para exibir a variação de saldo
    const balanceVariationElement = document.getElementById("balanceVariation");

    // Verifica se o elemento existe
    if (!balanceVariationElement) {
        console.error("Elemento com ID 'balanceVariation' não encontrado.");
        return;
    }

    // Exibindo a variação de saldo formatada
    balanceVariationElement.innerText = `Variação de Saldo: ${balanceVariation.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

    // Alterando a cor do texto com base na variação (verde para positivo, vermelho para negativo)
    balanceVariationElement.style.color = balanceVariation >= 0 ? '#0aac0a' : 'red';
}

// Função para monitorar mudanças no balanceHistory e atualizar a variação de saldo sem recarregar a página
function monitorBalanceHistoryUpdates() {
    // Sobrescrevendo a função padrão de setItem para capturar alterações no balanceHistory
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments); // Chama a função original
        if (key === 'balanceHistory') {
            displayBalanceVariation(); // Atualiza a variação de saldo sempre que o balanceHistory é atualizado
        }
    };
}

// Inicializa a exibição da variação e configura o monitoramento de atualizações
document.addEventListener('DOMContentLoaded', () => {
    displayBalanceVariation();  // Exibe a variação inicialmente
    monitorBalanceHistoryUpdates(); // Inicia o monitoramento de mudanças no histórico
});
