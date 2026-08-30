let pedidos = [];

const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

document.getElementById("pedidoForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const quantidadeProduzida = parseInt(document.getElementById("quantidadeProduzida").value);
  const codigoOrdem = document.getElementById("codigoOrdem").value;
  const codigoProduto = document.getElementById("codigoProduto").value;
  const custoUnitario = parseFloat(document.getElementById("custoUnitario").value);
  const estoqueInicial = parseInt(document.getElementById("estoqueInicial").value);
  let tipoProduto = document.getElementById("tipoProduto").value;

  // valida código da ordem único
  const codigoJaExiste = pedidos.some(p => p.codigoOrdem === codigoOrdem);
  if (codigoJaExiste) {
    alert("Esse código de ordem já foi cadastrado. Use outro.");
    return;
  }

  // valida tipo de produto com switch + while
  let tipoValido = false;
  let custoUnitarioAjustado;

  while (!tipoValido) {
    switch (tipoProduto) {
      case "1":
        custoUnitarioAjustado = custoUnitario;
        tipoValido = true;
        break;
      case "2":
        custoUnitarioAjustado = custoUnitario * 1.10;
        tipoValido = true;
        break;
      case "3":
        custoUnitarioAjustado = custoUnitario * 1.20;
        tipoValido = true;
        break;
      default:
        tipoProduto = prompt("Tipo de produto inválido! Digite 1 (Padrão), 2 (Premium) ou 3 (Sob encomenda):");
    }
  }

  // estoque final
  const estoqueFinal = estoqueInicial + quantidadeProduzida;

  // alerta de estoque
  let alertaEstoque = "normal";
  if (estoqueFinal > 5000) {
    alertaEstoque = "alto";
  } else if (estoqueFinal < 500) {
    alertaEstoque = "critico";
  }

  // custo total da ordem
  const custoTotal = quantidadeProduzida * custoUnitarioAjustado;

  // salva a ordem
  pedidos.push({
    codigoOrdem,
    codigoProduto,
    tipoProduto,
    quantidadeProduzida,
    custoUnitario,
    custoUnitarioAjustado,
    estoqueInicial,
    estoqueFinal,
    alertaEstoque,
    custoTotal
  });

  alert("Ordem cadastrada com sucesso!" +
    "\nCódigo da ordem: " + codigoOrdem +
    "\nProduto: " + codigoProduto +
    "\nEstoque final: " + estoqueFinal +
    "\nAlerta: " + alertaEstoque +
    "\nCusto total: R$" + custoTotal.toFixed(2));

  e.target.reset();
  modalOverlay.classList.remove("active");
});

document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (pedidos.length === 0) {
    alert("Nenhuma ordem cadastrada ainda.");
    return;
  }

  // total de ordens
  const totalOrdens = pedidos.length;

  // estoque total final por tipo de produto
  let estoquePadrao = 0, estoquePremium = 0, estoqueSobEncomenda = 0;

  // alertas
  let qtdAlertaAlto = 0, qtdAlertaCritico = 0;

  // agrupamento por código de produto
  const produtos = {};

  pedidos.forEach(p => {
    // estoque por tipo
    if (p.tipoProduto === "1") estoquePadrao += p.estoqueFinal;
    else if (p.tipoProduto === "2") estoquePremium += p.estoqueFinal;
    else if (p.tipoProduto === "3") estoqueSobEncomenda += p.estoqueFinal;

    // contagem de alertas
    if (p.alertaEstoque === "alto") qtdAlertaAlto++;
    else if (p.alertaEstoque === "critico") qtdAlertaCritico++;

    // agrupamento por produto
    if (!produtos[p.codigoProduto]) {
      produtos[p.codigoProduto] = { estoqueFinal: 0, valorTotal: 0 };
    }
    produtos[p.codigoProduto].estoqueFinal += p.estoqueFinal;
    produtos[p.codigoProduto].valorTotal += p.custoTotal;
  });

  // média de custo total por ordem
  const somaCustoTotal = pedidos.reduce((acc, p) => acc + p.custoTotal, 0);
  const mediaCustoTotal = somaCustoTotal / totalOrdens;

  // maior e menor custo total
  let maiorCusto = pedidos[0];
  let menorCusto = pedidos[0];

  pedidos.forEach(p => {
    if (p.custoTotal > maiorCusto.custoTotal) maiorCusto = p;
    if (p.custoTotal < menorCusto.custoTotal) menorCusto = p;
  });

  // monta o texto do consolidado por produto
  let textoProdutos = "";
  for (const codigo in produtos) {
    textoProdutos += `\n  Produto ${codigo}: estoque final ${produtos[codigo].estoqueFinal}, valor investido R$${produtos[codigo].valorTotal.toFixed(2)}`;
  }

  const relatorio = `
RELATÓRIO DE PRODUÇÃO

Total de ordens registradas: ${totalOrdens}

Estoque total final por tipo:
  Padrão: ${estoquePadrao}
  Premium: ${estoquePremium}
  Sob encomenda: ${estoqueSobEncomenda}

Média de custo total por ordem: R$ ${mediaCustoTotal.toFixed(2)}

Ordem com maior custo total: ${maiorCusto.codigoOrdem} - R$ ${maiorCusto.custoTotal.toFixed(2)}
Ordem com menor custo total: ${menorCusto.codigoOrdem} - R$ ${menorCusto.custoTotal.toFixed(2)}

Ordens com alerta de estoque alto: ${qtdAlertaAlto}
Ordens com alerta de estoque crítico: ${qtdAlertaCritico}

Consolidado por produto:${textoProdutos}
  `;

  alert(relatorio);
});