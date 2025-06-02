// Transição de telas
let current = 0;
const screens = document.querySelectorAll('.screen');
const intervalTime = 1000;
function showScreen(index) {
  screens.forEach((el, i) => el.classList.toggle('active', i === index));
}
function nextScreen() {
  current = (current + 1) % screens.length;
  showScreen(current);
}
showScreen(current);
setInterval(nextScreen, intervalTime);

// Carrega gráfico de metas da planilha do Google
async function carregarGrafico() {
  const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTiim0grc6c7zGJV0iNnCPDwoXUSY2nqwWFqdUVvXQp7xh9UPblAXEnJtDXvqqRSXDfF30BmFsYOQJh/pubhtml');
  const csv = await response.text();
  const linhas = csv.trim().split('\n').slice(1);
  const datas = [], previsto = [], realizado = [];
  linhas.forEach(linha => {
    const [data, p, r] = linha.split(',');
    datas.push(data);
    previsto.push(+p);
    realizado.push(+r);
  });
  const ctx = document.getElementById('grafico').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datas,
      datasets: [
        { label: 'Previsto', data: previsto, backgroundColor: 'rgba(125, 89, 255, 0.8)' },
        { label: 'Realizado', data: realizado, backgroundColor: 'rgba(255, 210, 44, 0.9)' }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Carrega informações dos pontos de ônibus
async function carregarPontos() {
  const ids = ['2591', '7036'];
  const baseUrl = 'hhttps://www.rmtcgoiania.com.br/index.php/pontos-embarque-desembarque?query=2591&uid=6839e0f127239
Ponto 2591 ';
  const infoDiv = document.getElementById('bus-info');
  const fragment = document.createDocumentFragment();
  for (const id of ids) {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl + id)}`);
    const { contents } = await res.json();
    const doc = new DOMParser().parseFromString(contents, 'text/html');
    const ponto = doc.querySelector('.pontoParada-titulo')?.innerText || `Ponto ${id}`;
    const linhas = doc.querySelectorAll('.linha-item');
    const container = document.createElement('div');
    container.innerHTML = `<h3>${ponto}</h3><ul></ul>`;
    const ul = container.querySelector('ul');
    linhas.forEach(item => {
      const numero = item.querySelector('.linha')?.innerText || '';
      const destino = item.querySelector('.destino')?.innerText || '';
      const tempos = item.querySelectorAll('.previsao-tempo');
      const t1 = tempos[0]?.innerText || '--';
      const t2 = tempos[1]?.innerText || '--';
      const li = document.createElement('li');
      li.innerHTML = `<strong>${numero}</strong> ${destino} - ${t1} / ${t2}`;
      ul.appendChild(li);
    });
    fragment.appendChild(container);
  }
  infoDiv.innerHTML = '';
  infoDiv.appendChild(fragment);
}
carregarGrafico();
carregarPontos();
