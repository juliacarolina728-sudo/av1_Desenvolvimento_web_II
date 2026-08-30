
let esporte = [];

const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

document.getElementById("esporteForm").addEventListener("submit", (e) => {
  e.preventDefault();


    const cargaMaxima = parseFloat(document.getElementById("pontos").value);
    const codigo = document.getElementById("codigo").value;
    const jogador = document.getElementById("nome").value;
    const posicao = document.getElementById("posicao").value;
    const tipo = document.getElementById("tipo").value;
    const duracao = parseInt(document.getElementById("duracao").value);
    const intensidade = parseInt(document.getElementById("intensidade").value);

    // Verifica se o código já existe
    const codigoJaExiste = esporte.some(p => p.codigo === codigo);

    if (codigoJaExiste) {
        alert("Esse código já foi cadastrado. Use outro.");
        return;
    }

    // Validação da intensidade
    if (intensidade < 1 || intensidade > 10) {
        alert("A intensidade deve estar entre 1 e 10.");
        return;
    }

    // Multiplicador do tipo de treino
    let multiplicador;

    if (tipo === "F") {
        multiplicador = 1.5;
    }
    else if (tipo === "T") {
        multiplicador = 1.2;
    }
    else {
        multiplicador = 1.0;
    }

    // Cálculo da carga
    const carga = (duracao / 10) * intensidade * multiplicador;

    // Cadastra o treino
    esporte.push({
        cargaMaxima,
        codigo,
        jogador,
        posicao,
        tipo,
        duracao,
        intensidade,
        carga
    });

    alert("Treino cadastrado com sucesso!" +
        "\nCódigo: " + codigo +
        "\nJogador: " + jogador +
        "\nPosição: " + posicao +
        "\nTipo: " + tipo +
        "\nDuração: " + duracao + " minutos" +
        "\nIntensidade: " + intensidade +
        "\nCarga: " + carga.toFixed(2));

    e.target.reset();

    modalOverlay.classList.remove("active");
});


// RELATÓRIO
document.getElementById("btnRelatorio").addEventListener("click", () => {

    if (esporte.length === 0) {
        alert("Nenhum treino cadastrado ainda.");
        return;
    }

    // 1. Total de treinos
    const totalTreinos = esporte.length;


    // 2. Carga total por jogador
    let jogadores = [];

    esporte.forEach(t => {

        let jogadorExistente = jogadores.find(j => j.nome === t.jogador);

        if (jogadorExistente) {

            jogadorExistente.carga += t.carga;
            jogadorExistente.treinos++;

        } else {

            jogadores.push({
                nome: t.jogador,
                posicao: t.posicao,
                carga: t.carga,
                treinos: 1
            });

        }

    });


    // 3. Jogador com maior carga
    let maiorCarga = jogadores[0];

    // 4. Jogador com menor carga
    let menorCarga = jogadores[0];

    jogadores.forEach(j => {

        if (j.carga > maiorCarga.carga) {
            maiorCarga = j;
        }

        if (j.carga < menorCarga.carga) {
            menorCarga = j;
        }

    });


    // 5. Quantidade de jogadores com risco de lesão
    let jogadoresRisco = 0;

    jogadores.forEach(j => {

        if (j.carga > esporte[0].cargaMaxima) {
            jogadoresRisco++;
        }

    });


    // 6. Carga média por tipo de treino

    let cargaF = 0;
    let qtdF = 0;

    let cargaT = 0;
    let qtdT = 0;

    let cargaE = 0;
    let qtdE = 0;

    esporte.forEach(t => {

        if (t.tipo === "F") {
            cargaF += t.carga;
            qtdF++;
        }

        else if (t.tipo === "T") {
            cargaT += t.carga;
            qtdT++;
        }

        else {
            cargaE += t.carga;
            qtdE++;
        }

    });

    let mediaF = qtdF > 0 ? cargaF / qtdF : 0;
    let mediaT = qtdT > 0 ? cargaT / qtdT : 0;
    let mediaE = qtdE > 0 ? cargaE / qtdE : 0;


    // 7. Informações por posição

    let goleiros = [];
    let zagueiros = [];
    let meioCampos = [];
    let atacantes = [];

    esporte.forEach(t => {

        if (t.posicao === "G") {
            goleiros.push(t);
        }

        else if (t.posicao === "Z") {
            zagueiros.push(t);
        }

        else if (t.posicao === "M") {
            meioCampos.push(t);
        }

        else {
            atacantes.push(t);
        }

    });


    // Calcula média de carga de cada posição

    let cargaG = 0;
    goleiros.forEach(t => cargaG += t.carga);

    let cargaZ = 0;
    zagueiros.forEach(t => cargaZ += t.carga);

    let cargaM = 0;
    meioCampos.forEach(t => cargaM += t.carga);

    let cargaA = 0;
    atacantes.forEach(t => cargaA += t.carga);


    let mediaG = goleiros.length > 0 ? cargaG / goleiros.length : 0;
    let mediaZ = zagueiros.length > 0 ? cargaZ / zagueiros.length : 0;
    let mediaM = meioCampos.length > 0 ? cargaM / meioCampos.length : 0;
    let mediaA = atacantes.length > 0 ? cargaA / atacantes.length : 0;


    // Relatório final

    const relatorio = `

RELATÓRIO DE TREINOS ESPORTIVOS

Total de treinos cadastrados: ${totalTreinos}

JOGADORES:

${jogadores.map(j =>
    j.nome +
    " - Carga: " + j.carga.toFixed(2) +
    " - Treinos: " + j.treinos
).join("\n")}


JOGADOR COM MAIOR CARGA:

Nome: ${maiorCarga.nome}
Posição: ${maiorCarga.posicao}
Carga: ${maiorCarga.carga.toFixed(2)}
Nº de treinos: ${maiorCarga.treinos}


JOGADOR COM MENOR CARGA:

Nome: ${menorCarga.nome}
Posição: ${menorCarga.posicao}
Carga: ${menorCarga.carga.toFixed(2)}
Nº de treinos: ${menorCarga.treinos}


JOGADORES COM RISCO DE LESÃO: ${jogadoresRisco}


CARGA MÉDIA POR TIPO:

Físico: ${mediaF.toFixed(2)}
Técnico: ${mediaT.toFixed(2)}
Estratégico: ${mediaE.toFixed(2)}


POR POSIÇÃO:

Goleiros:
Total de treinos: ${goleiros.length}
Carga média: ${mediaG.toFixed(2)}

Zagueiros:
Total de treinos: ${zagueiros.length}
Carga média: ${mediaZ.toFixed(2)}

Meio-campo:
Total de treinos: ${meioCampos.length}
Carga média: ${mediaM.toFixed(2)}

Atacantes:
Total de treinos: ${atacantes.length}
Carga média: ${mediaA.toFixed(2)}

`;

    alert(relatorio);

}); 
