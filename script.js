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
        
        // Verificar os dados importados
        console.log("Dados importados da planilha:", sheet);
        
        let tabela = document.getElementById("materiaisTabela");
        
        // Definir cabeçalho da tabela
        tabela.innerHTML = "<tr><th>Item</th><th>Quantidade</th><th>Preço de Custo (€)</th><th>Margem (%)</th><th>Preço Unitário (€)</th><th>Valor Total (€)</th></tr>";
        
        // Verificar se a planilha contém dados
        if (sheet.length < 2) {
            console.error("Planilha não contém dados suficientes.");
            return;
        }
        
        // Iterar pelas linhas da planilha, ignorando o cabeçalho
        sheet.slice(1).forEach(row => {
            if (row.length < 4) return;  // Garantir que há pelo menos 4 dados para preencher a linha
            
            let tr = document.createElement("tr");
            
            // Preencher as 4 primeiras células (Item, Quantidade, Preço de Custo, Margem)
            for (let i = 0; i < 4; i++) {
                let td = document.createElement("td");
                td.innerHTML = `<input type='text' value='${row[i] || ''}' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            }
            
            // Preencher as células para "Preço Unitário" (calculado) e "Valor Total"
            ["number", "span"].forEach((type, j) => {
                let td = document.createElement("td");
                td.innerHTML = type === "span" ? `<span>0.00</span>` : `<input type='${type}' value='0' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            });
            
            // Adicionar a linha à tabela
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
        
        // Calcular o Preço Unitário com base no Custo e na Margem
        let precoUnitario = precoCusto / (1 - (margem / 100));
        let total = quantidade * precoUnitario;
        
        // Atualizar os campos de "Preço Unitário" e "Valor Total"
        spans[0].innerText = precoUnitario.toFixed(2);  // Preço Unitário (€)
        spans[1].innerText = total.toFixed(2);          // Valor Total (€)
        
        totalGeral += total;
    });
    
    // Exibir o total geral
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
