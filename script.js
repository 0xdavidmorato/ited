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
        tabela.innerHTML = "<tr><th>Item</th><th>Quantidade</th><th>Preço de Custo (€)</th><th>Margem (%)</th><th>Preço Unitário (€)</th><th>Valor Total (€)</th></tr>";
        
        sheet.slice(1).forEach(row => {
            if (row.length < 3) return;
            let tr = document.createElement("tr");
            
            for (let i = 0; i < 3; i++) {
                let td = document.createElement("td");
                td.innerHTML = `<input type='text' value='${row[i] || ''}' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            }
            
            ["number", "number", "span", "span"].forEach((type, j) => {
                let td = document.createElement("td");
                td.innerHTML = type === "span" ? `<span>0.00</span>` : `<input type='${type}' value='0' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            });
            
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
        
        let precoUnitario = precoCusto / (1 - (margem / 100));
        let total = quantidade * precoUnitario;
        
        spans[0].innerText = precoUnitario.toFixed(2);
        spans[1].innerText = total.toFixed(2);
        totalGeral += total;
    });
    document.getElementById("orcamento_final").innerText = totalGeral.toFixed(2);
}

function calcularMaoObra() {
    // ATE
    let qtd_ate = document.getElementById("qtd_ate").value;
    let dias_ate = document.getElementById("dias_ate").value;
    let valor_dia_ate = document.getElementById("valor_dia_ate").value;
    let total_ate = (qtd_ate * dias_ate * valor_dia_ate) || 0; // Garante que o valor seja 0 caso os campos estejam vazios ou inválidos
    document.getElementById("total_ate").innerText = total_ate.toFixed(2); // Atualiza o total

    // ATIS
    let qtd_atis = document.getElementById("qtd_atis").value;
    let dias_atis = document.getElementById("dias_atis").value;
    let valor_dia_atis = document.getElementById("valor_dia_atis").value;
    let total_atis = (qtd_atis * dias_atis * valor_dia_atis) || 0; // Garante que o valor seja 0 caso os campos estejam vazios ou inválidos
    document.getElementById("total_atis").innerText = total_atis.toFixed(2); // Atualiza o total

    // Bastidores
    let qtd_bastidores = document.getElementById("qtd_bastidores").value;
    let dias_bastidores = document.getElementById("dias_bastidores").value;
    let valor_dia_bastidores = document.getElementById("valor_dia_bastidores").value;
    let total_bastidores = (qtd_bastidores * dias_bastidores * valor_dia_bastidores) || 0; // Garante que o valor seja 0 caso os campos estejam vazios ou inválidos
    document.getElementById("total_bastidores").innerText = total_bastidores.toFixed(2); // Atualiza o total
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
