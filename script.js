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
        
        for (let i = 1; i < sheet.length; i++) {
            let row = sheet[i];
            if (row.length < 3) continue;
            let tr = document.createElement("tr");
            
            // Criando os campos de input para as 3 primeiras colunas (Item, Quantidade, Preço de Custo)
            for (let j = 0; j < 3; j++) {
                let td = document.createElement("td");
                td.innerHTML = `<input type='text' value='${row[j]}' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            }
            
            // Criando os campos de input para as 3 últimas colunas (Margem, Preço Unitário, Valor Total)
            for (let j = 3; j < 6; j++) {
                let td = document.createElement("td");
                if (j === 3) {
                    td.innerHTML = `<input type='number' value='0' oninput='calcularTotal()'>`; // Margem
                } else {
                    td.innerHTML = `<span>0.00</span>`; // Preço Unitário e Valor Total
                }
                tr.appendChild(td);
            }
            
            tabela.appendChild(tr);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function calcularTotal() {
    let linhas = document.querySelectorAll("#materiaisTabela tr");
    
    // Loop para cada linha da tabela, exceto a primeira (cabeçalho)
    for (let i = 1; i < linhas.length; i++) {
        let inputs = linhas[i].querySelectorAll("input");
        let spans = linhas[i].querySelectorAll("span");

        // Obtendo os valores dos campos de entrada
        let quantidade = parseFloat(inputs[1].value) || 0;
        let precoCusto = parseFloat(inputs[2].value) || 0;
        let margem = parseFloat(inputs[3].value) || 0;

        // Calculando o preço unitário (preço de custo + margem)
        let precoUnitario = precoCusto + (precoCusto * margem / 100);
        let total = quantidade * precoUnitario; // Calculando o valor total

        // Atualizando os campos de preço unitário e valor total
        spans[0].innerText = precoUnitario.toFixed(2);
        spans[1].innerText = total.toFixed(2);
    }
    
    // Atualizando o total geral (soma de todos os valores totais)
    let totalGeral = 0;
    for (let i = 1; i < linhas.length; i++) {
        let spans = linhas[i].querySelectorAll("span");
        totalGeral += parseFloat(spans[1].innerText) || 0;
    }

    document.getElementById("orcamento_final").innerText = totalGeral.toFixed(2);
}

function gerarPDF() {
    alert("Funcionalidade de exportação para PDF em breve!");
}
