
let vendas = [];


const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

document.getElementById("comissaoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const meta = parseFloat(document.getElementById("meta").value);
  const percentualBaseInput = parseFloat(document.getElementById("comissao").value) / 100;
  const codigoVendedor = document.getElementById("codigovendedor").value.trim();
  const codigoVenda = document.getElementById("codigovenda").value.trim();
  const regiao = document.getElementById("regiao").value; // "1", "2", "3", "4"
  const valorVenda = parseFloat(document.getElementById("valorvenda").value);
  const tipoCliente = document.getElementById("tipocliente").value;



const comissaoBase = valorVenda * percentualBaseInput;

  // Bônus por tipo de cliente
  let bonusCliente = 0;
  if (tipoCliente === "pf") {
    bonusCliente = valorVenda * 0.02;
  } else if (tipoCliente === "pj") {
    bonusCliente = valorVenda * 0.03;
  }

  // Bônus por região (1–Norte, 2–Nordeste, 3–Sudeste, 4–Sul)
  let bonusRegiao = 0;
  if (regiao === "1" || regiao === "2") {
    bonusRegiao = valorVenda * 0.01;
  } else if (regiao === "4") {
    bonusRegiao = valorVenda * 0.005;
  } // Sudeste ("3") = 0%

  const comissaoTotalVenda = comissaoBase + bonusCliente + bonusRegiao;

  // Guarda a venda no array
  vendas.push({
    codigoVenda,
    codigoVendedor,
    regiao,
    valorVenda,
    tipoCliente,
    comissaoTotalVenda,
    meta
  });

  alert(`Venda cadastrada com sucesso! Comissão desta venda: R$ ${comissaoTotalVenda.toFixed(2)}`);

  e.target.reset();
  modalOverlay.classList.remove("active");
});

// Botão de relatório (caso precise criar o botão no HTML com o id="btnRelatorio")
document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (vendas.length === 0) {
    alert("Nenhuma venda cadastrada ainda.");
    return;
  }

  const totalVendasRegistradas = vendas.length;

  // Acumuladores por região
  let valorRegiao1 = 0;
  let valorRegiao2 = 0;
  let valorRegiao3 = 0;
  let valorRegiao4 = 0;

  // Acumuladores por tipo de cliente
  let valorPF = 0;
  let valorPJ = 0;

  // Para cálculo de comissão média por região
  let comissaoRegiao1 = { soma: 0, qtd: 0 };
  let comissaoRegiao2 = { soma: 0, qtd: 0 };
  let comissaoRegiao3 = { soma: 0, qtd: 0 };
  let comissaoRegiao4 = { soma: 0, qtd: 0 };

  let somaComissoesGeral = 0;

  // Agrupamento por vendedor
  let vendedoresMap = {};

  vendas.forEach(v => {
    somaComissoesGeral += v.comissaoTotalVenda;

    // Por região (Valor)
    if (v.regiao === "1") {
      valorRegiao1 += v.valorVenda;
      comissaoRegiao1.soma += v.comissaoTotalVenda;
      comissaoRegiao1.qtd++;
    } else if (v.regiao === "2") {
      valorRegiao2 += v.valorVenda;
      comissaoRegiao2.soma += v.comissaoTotalVenda;
      comissaoRegiao2.qtd++;
    } else if (v.regiao === "3") {
      valorRegiao3 += v.valorVenda;
      comissaoRegiao3.soma += v.comissaoTotalVenda;
      comissaoRegiao3.qtd++;
    } else if (v.regiao === "4") {
      valorRegiao4 += v.valorVenda;
      comissaoRegiao4.soma += v.comissaoTotalVenda;
      comissaoRegiao4.qtd++;
    }

    // Por tipo de cliente (Valor)
    if (v.tipoCliente === "pf") {
      valorPF += v.valorVenda;
    } else if (v.tipoCliente === "pj") {
      valorPJ += v.valorVenda;
    }

    // Consolidar por vendedor
    if (!vendedoresMap[v.codigoVendedor]) {
      vendedoresMap[v.codigoVendedor] = {
        totalVendido: 0,
        comissaoTotal: 0,
        meta: v.meta
      };
    }
    vendedoresMap[v.codigoVendedor].totalVendido += v.valorVenda;
    vendedoresMap[v.codigoVendedor].comissaoTotal += v.comissaoTotalVenda;
  });

  // Encontrar recordistas e metas batidas
  let maiorVendedorVendas = "";
  let maiorValorVendas = -1;

  let maiorVendedorComissao = "";
  let maiorValorComissao = -1;

  let qtdBateramMeta = 0;

  for (let cod in vendedoresMap) {
    let dados = vendedoresMap[cod];

    if (dados.totalVendido > maiorValorVendas) {
      maiorValorVendas = dados.totalVendido;
      maiorVendedorVendas = cod;
    }

    if (dados.comissaoTotal > maiorValorComissao) {
      maiorValorComissao = dados.comissaoTotal;
      maiorVendedorComissao = cod;
    }

    if (dados.totalVendido >= dados.meta) {
      qtdBateramMeta++;
    }
  }

  const comissaoMediaGeral = somaComissoesGeral / totalVendasRegistradas;
  const mediaRegiao1 = comissaoRegiao1.qtd > 0 ? comissaoRegiao1.soma / comissaoRegiao1.qtd : 0;
  const mediaRegiao2 = comissaoRegiao2.qtd > 0 ? comissaoRegiao2.soma / comissaoRegiao2.qtd : 0;
  const mediaRegiao3 = comissaoRegiao3.qtd > 0 ? comissaoRegiao3.soma / comissaoRegiao3.qtd : 0;
  const mediaRegiao4 = comissaoRegiao4.qtd > 0 ? comissaoRegiao4.soma / comissaoRegiao4.qtd : 0;

  const relatorio = `
RELATÓRIO DE VENDAS E PERFORMANCE

Total de vendas registradas: ${totalVendasRegistradas}

Valor total vendido por região:
- Norte: R$ ${valorRegiao1.toFixed(2)}
- Nordeste: R$ ${valorRegiao2.toFixed(2)}
- Sudeste: R$ ${valorRegiao3.toFixed(2)}
- Sul: R$ ${valorRegiao4.toFixed(2)}

Valor total vendido por tipo de cliente:
- Pessoa Física (PF): R$ ${valorPF.toFixed(2)}
- Pessoa Jurídica (PJ): R$ ${valorPJ.toFixed(2)}

Maior vendedor (por valor de vendas): Vendedor ${maiorVendedorVendas} (R$ ${maisCaroOuBaratoFormatado(maiorValorVendas)})
Maior vendedor (por comissão total): Vendedor ${maiorVendedorComissao} (R$ ${maiorValorComissao.toFixed(2)})

Vendedores que bateram a meta: ${qtdBateramMeta}
Comissão média geral: R$ ${comissaoMediaGeral.toFixed(2)}

Comissão média por região:
- Norte: R$ ${mediaRegiao1.toFixed(2)}
- Nordeste: R$ ${mediaRegiao2.toFixed(2)}
- Sudeste: R$ ${mediaRegiao3.toFixed(2)}
- Sul: R$ ${mediaRegiao4.toFixed(2)}
  `;

  alert(relatorio);
});

function maisCaroOuBaratoFormatado(val) {
  return val.toFixed(2);
}