# Arquitetura web

## Visão geral

O EcoTrip é uma aplicação cliente estática dividida por responsabilidade. Não existe backend, persistência, dependência de framework ou chamada de rede necessária ao cálculo.

```text
Pessoa
  └── index.html       estrutura semântica e ponto de entrada
        └── src/
              ├── styles.css  layout, identidade visual e foco
              └── app.js      estado, cálculo e renderização
                    └── MODES  catálogo de fatores compartilhado
doc/                   objetivos, modelo e arquitetura
images/arquives/       pasta reservada para assets visuais
```

## Camadas desacopladas

### Conteúdo e estrutura — `index.html`

Define as regiões da página, títulos, formulário-modelo de trecho, áreas de resultado e links de documentação. O `<template>` descreve a estrutura repetida de um trecho. Os campos identificam distância, transporte e passageiros; não contêm regras de cálculo.

### Apresentação — `src/styles.css`

Controla tipografia, temas claro e escuro, estados de foco, animações, composição visual e pontos de quebra. Não contém lógica de negócio. A preferência de tema é guardada no navegador; o layout reduz colunas em telas estreitas e respeita `prefers-reduced-motion`.

### Comportamento e cálculo — `src/app.js`

Mantém os trechos no DOM como estado da sessão, lê os valores, calcula o resultado e atualiza as regiões de saída. A função `getLegData` normaliza os campos; `updateResults` agrega os trechos; `renderBreakdown` e `renderComparison` apresentam cada perspectiva. `MODES` é a fonte compartilhada de nomes, ícones e fatores.

### Documentação — `doc/`

Objetivos, premissas quantitativas e arquitetura vivem em arquivos separados para que escopo e responsabilidades sejam consultados sem depender do código da interface.

## Fluxo de dados

1. A pessoa adiciona ou edita um trecho no formulário.
2. Eventos `input` e `change` acionam a atualização.
3. O app normaliza distância, passageiros e ida/volta.
4. O fator correspondente é aplicado e os trechos ativos são somados.
5. O DOM recebe o total, o detalhamento e a comparação, com anúncio das áreas dinâmicas.

Os dados permanecem no navegador e são perdidos ao recarregar a página. Origem e destino são rótulos livres e nunca são interpretados como HTML.

## Decisões e evolução

- **Sem framework ou build:** reduz barreira para executar e inspecionar o protótipo. Pode ser servido diretamente por hospedagem estática.
- **Sem API:** garante que o cálculo seja local e evita coleta de dados pessoais nesta versão.
- **Catálogo único:** mantém os fatores iguais no cálculo por trecho e no comparativo.
- **Evolução:** caso a aplicação passe a usar fontes de fatores atualizáveis, separar catálogo e funções puras de cálculo em módulos; adicionar testes de unidade, versionamento das fontes, validação de formulário e revisão de acessibilidade antes de introduzir API ou armazenamento.

## Pontos a validar antes de produção

Verificar cálculos com fatores de fontes reconhecidas e contexto definido; auditar navegação por teclado e leitores de tela; avaliar contraste; definir tratamento de distâncias inválidas e limites; testar os navegadores e dispositivos suportados; e estabelecer política de versão do modelo. Os fatores atuais são exclusivamente demonstrativos.
