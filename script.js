
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

  const precoCombustivel = parseFloat(document.getElementById("precoCombustivel").value);
  const codigo = document.getElementById("codigo").value;
  const regiao = document.getElementById("regiao").value;
  const distancia = parseFloat(document.getElementById("distancia").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const rastreamento = document.getElementById("rastreamento").checked;

  
  const codigoJaExiste = pedidos.some(p => p.codigo === codigo);
  if (codigoJaExiste) {
    alert("Esse código já foi cadastrado. Use outro.");
    return;
  }

  // 1. preço por peça de acordo com a região
  let precoPorPeca;
  if (regiao === "1") {
    precoPorPeca = 1.20;
  } else if (regiao === "2") {
    precoPorPeca = 1.30;
  } else if (regiao === "3") {
    precoPorPeca = 1.50;
  }

  // 2. valor das peças, com desconto de 12% acima de 1000
  let valorPecas;
  if (quantidade <= 1000) {
    valorPecas = quantidade * precoPorPeca;
  } else {
    const excedente = quantidade - 1000;
    const valorSemDesconto = 1000 * precoPorPeca;
    const valorComDesconto = excedente * precoPorPeca * 0.88; // 12% de desconto
    valorPecas = valorSemDesconto + valorComDesconto;
  }

  // 3. valor da distância
  const valorDistancia = distancia * precoCombustivel;

  // 4. rastreamento
  const valorRastreamento = rastreamento ? 200 : 0;

  // 5. total
  const total = valorPecas + valorDistancia + valorRastreamento;

  // guarda o pedido
  pedidos.push({ codigo, regiao, total });

  alert(`Valor total do frete: R$ ${total.toFixed(2)}`);

  e.target.reset();
  modalOverlay.classList.remove("active");
});

document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (pedidos.length === 0) {
    alert("Nenhum pedido cadastrado ainda.");
    return;
  }

  const totalPedidos = pedidos.length;

  const somaTotal = pedidos.reduce((acc, p) => acc + p.total, 0);
  const media = somaTotal / totalPedidos;

  let totalRegiao1 = 0;
  let totalRegiao2 = 0;
  let totalRegiao3 = 0;

  pedidos.forEach(p => {
    if (p.regiao === "1") totalRegiao1 += p.total;
    else if (p.regiao === "2") totalRegiao2 += p.total;
    else if (p.regiao === "3") totalRegiao3 += p.total;
  });

  let maisCaro = pedidos[0];
  let maisBarato = pedidos[0];

  pedidos.forEach(p => {
    if (p.total > maisCaro.total) maisCaro = p;
    if (p.total < maisBarato.total) maisBarato = p;
  });

  const relatorio = `
RELATÓRIO DE PEDIDOS

Total de pedidos: ${totalPedidos}
Valor médio por pedido: R$ ${media.toFixed(2)}

Total Sudeste: R$ ${totalRegiao1.toFixed(2)}
Total Sul: R$ ${totalRegiao2.toFixed(2)}
Total Centro-Oeste: R$ ${totalRegiao3.toFixed(2)}

Pedido mais caro: ${maisCaro.codigo} - R$ ${maisCaro.total.toFixed(2)}
Pedido mais barato: ${maisBarato.codigo} - R$ ${maisBarato.total.toFixed(2)}
  `;

  alert(relatorio);
});
