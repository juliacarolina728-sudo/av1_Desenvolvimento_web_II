let holerite = [];

const modalOverlay = document.getElementById("modalOverlay");


document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

document.getElementById("holeriteForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const horasTrabalhadas = parseFloat(document.getElementById("horasTrabalhadas").value);
  const categoria = document.getElementById("categoria").value;
  const turno = document.getElementById("turno").value;
  const codigo = document.getElementById("codigo").value;
  const avaliacao = parseFloat(document.getElementById("avaliacao").value);
  const salarioMinimo = parseFloat(document.getElementById("salarioMinimo").value);
  ;
  

    
let percentualHora;
  if (categoria === "F" && turno === "Matutino") {
      percentualHora = 0.10; }
  else if (categoria === "F" && turno === "Vespertino") {
      percentualHora = 0.15; }
  else if (categoria === "F" && turno === "Noturno") {
      percentualHora = 0.20; }
  else if (categoria === "G" && turno === "Matutino") {
      percentualHora = 0.30; }
  else if (categoria === "G" && turno === "Vespertino") {
      percentualHora = 0.35; }
  else if (categoria === "G" && turno === "Noturno") {
      percentualHora = 0.40; }
   
 const valorHora = percentualHora * salarioMinimo;

  // salário inicial
  const salarioInicial = valorHora * horasTrabalhadas;

  // auxílio-alimentação, baseado no salário inicial
  let auxilioAlimentacao;
  if (salarioInicial <= 800) {
      auxilioAlimentacao = salarioInicial * 0.25;
  } else if (salarioInicial > 800 && salarioInicial <= 1200) {
      auxilioAlimentacao = salarioInicial * 0.20;
  } else {
      auxilioAlimentacao = salarioInicial * 0.15;
  }

holerite.push({
      codigo,
      categoria,
      turno,
      horasTrabalhadas,
      salarioInicial,
      auxilioAlimentacao
  });

  alert("Holerite gerado com sucesso! Código: " + codigo + "\nCategoria: " + categoria + "\nTurno: " + turno + "\nHoras Trabalhadas: " + horasTrabalhadas + "\nSalário Inicial: R$" + salarioInicial.toFixed(2) + "\nAuxílio Alimentação: R$" + auxilioAlimentacao.toFixed(2));

e.target.reset();
modalOverlay.classList.remove("active");

});

document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (holerite.length === 0) {
    alert("Nenhum holerite gerado ainda.");
    return;
  }

  const relatorio = holerite.map(h => `Código: ${h.codigo}, Categoria: ${h.categoria}, Turno: ${h.turno}, Horas Trabalhadas: ${h.horasTrabalhadas}, Salário Base: R$${h.salarioBase.toFixed(2)}, Auxílio Alimentação: R$${h.auxilioAlimentacao.toFixed(2)}`).join("\n");
  alert("Relatório de Holerites:\n\n" + relatorio);
});
