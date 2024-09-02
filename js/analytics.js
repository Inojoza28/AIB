// Google Analytics
window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-Q9DX5FMXW7');

// Fim Google Analytics


// Benefícios do AI₿
function toggleBenefits() {
        const content = document.getElementById("benefits-content");
        const icon = document.getElementById("toggle-icon");
        if (content.style.display === "none" || content.style.display === "") {
            content.style.display = "block";
            icon.textContent = "−"; // Muda o ícone para menos
        } else {
            content.style.display = "none";
            icon.textContent = "+"; // Muda o ícone para mais
        }
    }