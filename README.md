## Configuração Recomendada da IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (e desative o Vetur).

## Configuração Recomendada do Navegador

- Navegadores baseados em Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Ative o "Custom Object Formatter" no Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Ative o "Custom Object Formatter" no Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Personalizar configuração

Consulte a Referência de Configuração do Vite.(https://vite.dev/config/).

## Configuração do Projeto

```sh
npm install
```

### Executar Localmente

```sh
npm run dev
```

Abra o aplicativo na URL local do Vite exibida no terminal.

### Gerar Versão de Produção (Build)

```sh
npm run build
```

### O que está incluído

- `src/views/Home.vue` — Catálogo de livros com busca, filtros de categoria e paginação
- `src/views/BookDetail.vue` — Página de detalhes do livro com download, link do leitor, curtidas e comentários
- `src/views/Reader.vue` — Leitor de PDF integrado para usuários autenticados
- `src/views/Login.vue` and `src/views/Register.vue` — Autenticação local simples usando o armazenamento do navegador (browser storage)
- `src/api/books.js` — Carregador de dados do catálogo com suporte  a API.
- `src/stores/books.js` — Store do Pinia para o estado do catálogo e interações
- `public/data/books.json` — Dados dos livros

### Adicionando seus próprios PDFs

Coloque os arquivos PDF em `public/pdfs/` e atualize o `public/data/books.json` para referenciá-los usando `/pdfs/your-file.pdf`.

### API remota

Utilizando as variáveis const ARCHIVE_SEARCH_URL = 'https://archive.org/advancedsearch.php' e const ARCHIVE_METADATA_URL = 'https://archive.org/metadata' no arquivo books.js na pasta 'api' para importar dados  de livros importantes  da litarartura russa em versão em português.
