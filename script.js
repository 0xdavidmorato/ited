document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".equip-qty").forEach(input => {
        input.addEventListener("input", calcularMaoObra);
    });
    document.getElementById("distancia").addEventListener("input", calcularDeslocacao);
});

function importarExcel() {
    let file = document.getElementById("fileInput").files[0];
    let reader = new FileReader();
    
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let sheetName = workbook.SheetNames[0];
        let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        
        let tabela = document.getElementById("materiaisTabela");
        // **Corrigimos o cabeçalho, incluindo "Preço Unitário (€)" antes de "Valor Total (€)"**
        tabela.innerHTML = "<tr><th>Item</th><th>Qtd</th><th>Custo</th><th>Marg %</th><th>P. Unit</th><th>Total (€)</th></tr>"; 
        
        sheet.slice(1).forEach(row => {
            if (row.length < 4) return;  // Esperamos pelo menos 4 colunas da planilha

            let tr = document.createElement("tr");

            // Criar células para "Item", "Quantidade" e "Preço de Custo" (colunas 1, 2 e 3)
            for (let i = 0; i < 3; i++) {
                let td = document.createElement("td");
                td.innerHTML = `<input type='text' value='${row[i] || ''}' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            }

            // Criar células para "Margem (%)", "Preço Unitário (€) (calculado)" e "Valor Total (€)"
            // Criar célula para "Margem (%)" com valor padrão de 25%
let margemTd = document.createElement("td");
margemTd.innerHTML = `<input type='number' value='25' oninput='calcularTotal()'>`; // Margem padrão 25%
tr.appendChild(margemTd);

// Criar célula para "Preço Unitário (€) (calculado)"
let precoUnitarioTd = document.createElement("td");
precoUnitarioTd.innerHTML = `<span>0.00</span>`; // Preço Unitário será calculado
tr.appendChild(precoUnitarioTd);

// Criar célula para "Valor Total (€) (calculado)"
let valorTotalTd = document.createElement("td");
valorTotalTd.innerHTML = `<span>0.00</span>`; // Valor Total será calculado
tr.appendChild(valorTotalTd);


            tabela.appendChild(tr);
        });
    };
    
    reader.readAsArrayBuffer(file);
}

function calcularTotal() {
    let totalGeral = 0;
    document.querySelectorAll("#materiaisTabela tr:not(:first-child)").forEach(row => {
        let inputs = row.querySelectorAll("input");
        let spans = row.querySelectorAll("span");

        let quantidade = parseFloat(inputs[1].value) || 0;
        let precoCusto = parseFloat(inputs[2].value) || 0;
        let margem = parseFloat(inputs[3].value) || 0;

        // Calcular preço unitário com base no preço de custo e margem
        let precoUnitario = precoCusto / (1 - (margem / 100));
        let total = quantidade * precoUnitario;

        // Atualizar os campos "Preço Unitário" e "Valor Total"
        spans[0].innerText = precoUnitario.toFixed(2);  // Atualiza o "Preço Unitário (€)"
        spans[1].innerText = total.toFixed(2);          // Atualiza o "Valor Total (€)"

        totalGeral += total;
    });

    document.getElementById("orcamento_final").innerText = totalGeral.toFixed(2);
}

function calcularMaoObra() {
    // ATE
    let qtd_ate = parseFloat(document.getElementById("qtd_ate").value) || 0;
    let dias_ate = parseFloat(document.getElementById("dias_ate").value) || 0;
    let valor_dia_ate = parseFloat(document.getElementById("valor_dia_ate").value) || 0;

    let total_ate = dias_ate * valor_dia_ate;
    document.getElementById("total_ate").innerText = total_ate.toFixed(2); // Atualiza o total ATE

    // ATIS
    let qtd_atis = parseFloat(document.getElementById("qtd_atis").value) || 0;
    let dias_atis = parseFloat(document.getElementById("dias_atis").value) || 0;
    let valor_dia_atis = parseFloat(document.getElementById("valor_dia_atis").value) || 0;

    let total_atis = dias_atis * valor_dia_atis;
    document.getElementById("total_atis").innerText = total_atis.toFixed(2); // Atualiza o total ATIS

    // Bastidores
    let qtd_bastidores = parseFloat(document.getElementById("qtd_bastidores").value) || 0;
    let dias_bastidores = parseFloat(document.getElementById("dias_bastidores").value) || 0;
    let valor_dia_bastidores = parseFloat(document.getElementById("valor_dia_bastidores").value) || 0;

    let total_bastidores = dias_bastidores * valor_dia_bastidores;
    document.getElementById("total_bastidores").innerText = total_bastidores.toFixed(2); // Atualiza o total Bastidores
}

function calcularDeslocacao() {
    let distancia = parseFloat(document.getElementById("distancia").value) || 0;
    let totalDeslocacao = distancia * 0.40;
    document.getElementById("total_deslocacao").innerText = totalDeslocacao.toFixed(2);
    calcularTotal();
}

function gerarPDF() {
    alert("Funcionalidade de exportação para PDF em breve!");
}
