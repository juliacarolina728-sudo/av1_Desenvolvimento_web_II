let hotel=[];

const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

document.getElementById("hotelForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const base = parseFloat(document.getElementById("base").value);
  const codigo = document.getElementById("codigo").value;
  const temporada = document.getElementById("temporada").value;
  const quarto = document.getElementById("quarto").value;
  const diaria = parseFloat(document.getElementById("diaria").value);
  const numero = parseInt(document.getElementById("numero").value);
  const manha = document.getElementById("manha").checked;

  const codigoJaExiste = hotel.some(p => p.codigo === codigo);
  if (codigoJaExiste) {
    alert("Esse código já foi cadastrado. Use outro.");
    return;
  }

  let precoQuarto;
  if (quarto==="s") {
    precoQuarto = base * 1;
  }
 else if (quarto==="l") {
    precoQuarto = base * 1.5;
 }
else {
    precoQuarto = base * 2
}

let tempoRada;
if (temporada === "b"){
    tempoRada = precoQuarto
}
else if (temporada=== "a"){
    tempoRada = precoQuarto * 1.25
}

else {
    tempoRada = precoQuarto * 1.4
}
const valorCafe = parseFloat(document.getElementById("cafe").value);
const cafeTotal = valorCafe * numero * diaria;
const valorTotal = (tempoRada * diaria) + cafeTotal;

hotel.push({base, codigo, temporada, quarto, diaria, numero, manha, valorTotal});

alert("Reserva cadastrada com sucesso!" +
  "\nCódigo: " + codigo +
  "\nQuarto: " + quarto +
  "\nTemporada: " + temporada +
  "\nDiárias: " + diaria +
  "\nnumero: " + numero +
  "\nmanha: " + (manha ? "Sim" : "Não") +
  "\nValor total: R$" + valorTotal.toFixed(2));

e.target.reset();
modalOverlay.classList.remove("active");
})
document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (hotel.length === 0) {
    alert("Nenhuma reserva cadastrada ainda.");
    return;
  }

  // 1. total de reservas
  const totalReservas = hotel.length;

  // 2. média geral
  const somaTotal = hotel.reduce((acc, h) => acc + h.valorTotal, 0);
  const mediaGeral = somaTotal / totalReservas;

  // 3 e 4. acumuladores por tipo de quarto e por temporada
  let totalS = 0, totalL = 0, totalP = 0;
  let totalB = 0, totalA = 0, totalF = 0;

  // 6. contadores de café
  let comCafe = 0, semCafe = 0;

  // 7. ocupação total
  let ocupacaoTotal = 0;

  hotel.forEach(h => {
    // por tipo de quarto
    if (h.quarto === "s") totalS += h.valorTotal;
    else if (h.quarto === "l") totalL += h.valorTotal;
    else totalP += h.valorTotal;

    // por temporada
    if (h.temporada === "b") totalB += h.valorTotal;
    else if (h.temporada === "a") totalA += h.valorTotal;
    else totalF += h.valorTotal;

    // café incluso ou não
    if (h.manha) comCafe++;
    else semCafe++;

    // ocupação (diárias x hóspedes)
    ocupacaoTotal += h.diaria * h.numero;
  });

  // 5. reserva mais cara e mais barata
  let maisCara = hotel[0];
  let maisBarata = hotel[0];

  hotel.forEach(h => {
    if (h.valorTotal > maisCara.valorTotal) maisCara = h;
    if (h.valorTotal < maisBarata.valorTotal) maisBarata = h;
  });

  // 8. valor médio por hóspede
  const somaHospedes = hotel.reduce((acc, h) => acc + h.numero, 0);
  const mediaPorHospede = somaTotal / somaHospedes;

  const relatorio = `
RELATÓRIO DE RESERVAS

Total de reservas: ${totalReservas}
Valor médio por reserva: R$ ${mediaGeral.toFixed(2)}

Total por tipo de quarto:
  Standard: R$ ${totalS.toFixed(2)}
  Luxo: R$ ${totalL.toFixed(2)}
  Premium: R$ ${totalP.toFixed(2)}

Total por temporada:
  Baixa: R$ ${totalB.toFixed(2)}
  Alta: R$ ${totalA.toFixed(2)}
  Feriado: R$ ${totalF.toFixed(2)}

Reserva mais cara: ${maisCara.codigo} - R$ ${maisCara.valorTotal.toFixed(2)}
Reserva mais barata: ${maisBarata.codigo} - R$ ${maisBarata.valorTotal.toFixed(2)}

Com café incluso: ${comCafe}
Sem café incluso: ${semCafe}

Ocupação total (diárias x hóspedes): ${ocupacaoTotal}
Valor médio por hóspede: R$ ${mediaPorHospede.toFixed(2)}
  `;

  alert(relatorio);
});