// script.js

// Índice da tela atual
let current = 0;

// Seleciona todas as seções com a classe 'screen'
const screens = document.querySelectorAll('.screen');

// Tempo de exibição de cada tela (10 segundos)
const intervalTime = 10000;

// Mostra a tela com base no índice fornecido
function showScreen(index) {
  screens.forEach((el, i) => {
    el.classList.toggle('active', i === index); // Ativa a tela atual e desativa as demais
  });
}

// Avança para a próxima tela, reiniciando se chegar ao fim
function nextScreen() {
  current = (current + 1) % screens.length;
  showScreen(current);
}

// Inicializa mostrando a primeira tela e define o intervalo de troca automática
showScreen(current);
setInterval(nextScreen, intervalTime);

// -------------------
// Carregamento do gráfico com dados da planilha do Google
// -------------------
async function carregarGrafico() {
  const dados = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTiim0grc6c7zGJV0iNnCPDwoXUSY2nqwWFqdUVvXQp7xh9UPblAXEnJtDXvqqRSXDfF30BmFsYOQJh/pubhtml?gid=0&single=true')
    .then(resp => resp.text())
    .then(csv => {
      // Divide o CSV em linhas e ignora o cabeçalho
      const linhas = csv.trim().split('\n').slice(1);
      const datas = [], previsto = [], realizado = [];

      // Extrai os dados de cada linha
      linhas.forEach(linha => {
        const [data, p, r] = linha.split(',');
        datas.push(data); // Data
        previsto.push(+p); // Valor previsto (convertido para número)
        realizado.push(+r); // Valor realizado (convertido para número)
      });

      return { datas, previsto, realizado }; // Retorna os dados estruturados
    });

  // Cria o gráfico usando a biblioteca Chart.js
  const ctx = document.getElementById('grafico').getContext('2d');
  new Chart(ctx, {
    type: 'bar', // Tipo de gráfico: barras
    data: {
      labels: dados.datas,
      datasets: [
        {
          label: 'Previsto',
          data: dados.previsto,
          backgroundColor: 'rgba(125, 89, 255, 0.8)' // Barra "Previsto"
        },
        {
          label: 'Realizado',
          data: dados.realizado,
          backgroundColor: 'rgba(255, 210, 44, 0.9)' // Barra "Realizado"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: {
          beginAtZero: true // Eixo Y começa no zero
        }
      }
    }
  });
}

// -------------------
// Coleta e exibição de informações dos pontos de ônibus
// -------------------
async function carregarPontos() {
  const ids = ['2591', '7036']; // IDs dos pontos de ônibus
  const baseUrl = 'https://www2.rmtcgoiania.com.br/pontoparada/';
  const infoDiv = document.getElementById('bus-info');

  for (const id of ids) {
    // Usa um proxy para contornar CORS
    const numero = linha.querySelector('.linha').innerText;
    const destino = linha.querySelector('.destino').innerText;
    const json = await res.json();
    const html = json.contents;

    // Converte HTML recebido em um DOM parseável
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extrai o nome do ponto de ônibus
    const ponto = doc.querySelector('.pontoParada-titulo').innerText;

    // Lista de linhas (ônibus) que passam no ponto
    const linhas = doc.querySelectorAll('.linha-item');

    // Monta bloco HTML com os dados
    let bloco = `<h3>${ponto}</h3><ul>`;
    linhas.forEach(linha => {
      const numero = linha.querySelector('.linha').innerText;
      const destino = linha.querySelector('.destino').innerText;
      const tempos = linha.querySelectorAll('.previsao-tempo');
      const t1 = tempos[0]?.innerText || '--';
      const t2 = tempos[1]?.innerText || '--';

      // Adiciona item com número, destino e horários
      bloco += `<li><strong>${numero}</strong> ${destino} - ${t1} / ${t2}</li>`;
    });
    bloco += '</ul>';

    // Insere o bloco no HTML da página
    infoDiv.innerHTML += bloco;
  }
}

// Executa o carregamento inicial do gráfico e dos pontos de ônibus
carregarGrafico();
carregarPontos();
