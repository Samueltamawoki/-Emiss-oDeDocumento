function adicionarLinha() {
    const tbody = document.getElementById('corpo-itens');
    const tr = document.createElement('tr');
    tr.className = 'linha-item';
    tr.innerHTML = `
        <td><input type="text" class="item-nome" placeholder="Produto/Serviço"></td>
        <td><input type="number" class="item-qtd" value="1"></td>
        <td><input type="number" class="item-valor" value="0"></td>
        <td><button onclick="removerLinha(this)" class="btn-del">x</button></td>
    `;
    tbody.appendChild(tr);
}

function removerLinha(btn) {
    const linhas = document.querySelectorAll('.linha-item');
    if (linhas.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert("O pedido deve ter pelo menos um item.");
    }
}

function gerar(pdf = false, print = false) {
    try {
        // Preencher Cabeçalhos (IDs devem bater com o HTML)
        document.getElementById('r1').textContent = document.getElementById('c1').value || "Empresa não informada";
        document.getElementById('r2').textContent = document.getElementById('c2').value || "--/--/----";
        document.getElementById('r7').textContent = document.getElementById('c7').value || "A definir";
        document.getElementById('r8').textContent = document.getElementById('c8').value || "Sem observações.";

        // Processar Itens
        const listaItens = document.querySelectorAll('.linha-item');
        const rItens = document.getElementById('r-itens');
        rItens.innerHTML = '';
        let totalGeral = 0;

        listaItens.forEach(linha => {
            const nome = linha.querySelector('.item-nome').value;
            const qtd = Number(linha.querySelector('.item-qtd').value);
            const valor = Number(linha.querySelector('.item-valor').value);
            const subtotal = qtd * valor;
            totalGeral += subtotal;

            if (nome) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${nome}</td>
                    <td>${qtd}</td>
                    <td>R$ ${valor.toFixed(2)}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                `;
                rItens.appendChild(tr);
            }
        });

        document.getElementById('r-total-geral').textContent = `R$ ${totalGeral.toFixed(2)}`;

        const relatorio = document.getElementById('relatorio');
        relatorio.style.visibility = 'visible';
        relatorio.style.position = 'static';

        if (pdf) {
            const opt = {
                margin: 10,
                filename: 'pedido_compra.pdf',
                html2canvas: { scale: 2, width: 800 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(relatorio).save();
        } else if (print) {
            window.print();
        }
    } catch (e) {
        console.error("Erro ao gerar documento:", e);
        alert("Certifique-se de que todos os campos estão presentes.");
    }
}

// Inicia com uma linha ao carregar
document.addEventListener('DOMContentLoaded', adicionarLinha);

// Garante que o formulário comece com pelo menos um item
document.addEventListener('DOMContentLoaded', () => {
    adicionarLinha();
});