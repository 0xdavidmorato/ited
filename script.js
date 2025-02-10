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
    const equipamentos = {
        "qtd_ate": 3, "qtd_atis": 10, "qtd_bastidores": 3, "qtd_rj45": 100,
        "qtd_utp": 6, "qtd_pigtail": 30, "qtd_certificacao": 100, "qtd_derivadores": 10,
        "qtd_tv": 60, "qtd_coaxiais": 6, "qtd_antenas": 1
    };
    
    let totalMaoObra = 0;
    Object.keys(equipamentos).forEach(id => {
        let qtd = parseFloat(document.getElementById(id).value) || 0;
        let dias = qtd > 0 ? Math.ceil(qtd / equipamentos[id]) : 0;
        document.getElementById("dias_" + id.split("_")[1]).value = dias;
        totalMaoObra += dias * 260; // Valor fixo do dia no Porto (pode ser ajustado para Lisboa)
    });
    document.getElementById("total_mao_obra").innerText = totalMaoObra.toFixed(2);
    calcularTotal();
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
