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
            
            for (let j = 0; j < 3; j++) {
                let td = document.createElement("td");
                td.innerHTML = `<input type='text' value='${row[j]}' oninput='calcularTotal()'>`;
                tr.appendChild(td);
            }
            
            for (let j = 3; j < 6; j++) {
                let td = document.createElement("td");
                td.innerHTML = `<span>0.00</span>`;
                tr.appendChild(td);
            }
            
            tabela.appendChild(tr);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function calcularTotal() {
    let linhas = document.querySelectorAll("#materiaisTabela tr");
    let totalGeral = 0;
    
    for (let i = 1; i < linhas.length; i++) {
        let inputs = linhas[i].querySelectorAll("input");
        let spans = linhas[i].querySelectorAll("span");

        let quantidade = parseFloat(inputs[1].value) || 0;
        let precoCusto = parseFloat(inputs[2].value) || 0;
        let margem = parseFloat(inputs[3].value) || 0;

        let precoUnitario = precoCusto + (precoCusto * margem / 100);
        let total = quantidade * precoUnitario;

        spans[0].innerText = precoUnitario.toFixed(2);
        spans[1].innerText = total.toFixed(2);
        
        totalGeral += total;
    }
    
    document.getElementById("orcamento_final").innerText = totalGeral.toFixed(2);
}

function gerarPDF() {
    alert("Funcionalidade de exportação para PDF em breve!");
}
