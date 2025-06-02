# BramarLog App
Aplicação web de exibição sequencial de informações com transição automática entre páginas, visualização de metas e monitoramento em tempo real de pontos de ônibus.

## Funcionalidades
- Transição automática entre telas a cada 10 segundos.
- Gráfico de metas previsto vs. realizado, alimentado por planilha Google.
- Informações ao vivo dos pontos de ônibus da RMTC Goiânia.

## Tecnologias
- HTML, CSS e JS puro
- Chart.js
- Google Sheets (CSV)
- AllOrigins (proxy para CORS)

## Como publicar no GitHub Pages
1. Crie um repositório no GitHub e envie os arquivos.
2. Vá em Settings > Pages, escolha branch `main` e diretório `/ (root)`.
3. Após salvar, o site estará disponível em:  
   `https://<usuario>.github.io/<repositorio>/`

/bramarlog-information
├── public/
│   ├── images/           # (Home.png, Info.png, Meta.png)
│   ├── index.html        # Página principal
│   └── style.css         # Estilização
├── src/
│   ├── script.js         # Lógica de transição e fetch
│   └── server.js         # Backend para scraping (Node.js + Express)
├── .gitignore
├── package.json
└── README.md
