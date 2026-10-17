# EcoTrip — simulador de impacto ambiental de viagens

<p align="center">
  <a href="https://www.dio.me/" title="DIO — Digital Innovation One">
    <img src="https://hermes.dio.me/assets/diome/logo.png" alt="DIO — Digital Innovation One" width="112">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://github.com/features/copilot" title="GitHub Copilot">
    <img src="https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Copilot_%282025%29.svg" alt="GitHub Copilot" width="210">
  </a>
</p>

Aplicação web estática, em português, para estimar emissões de gases de efeito estufa de viagens e comparar meios de transporte. Não requer instalação, conta ou serviço externo para funcionar. Inclui temas claro e escuro, com preferência salva localmente, e animações discretas que respeitam a configuração de movimento reduzido do dispositivo.

## Começar

Abra `index.html` em um navegador moderno. Também pode servir a pasta do projeto com qualquer servidor estático. A interface se adapta a celular e desktop; os cálculos precisam de JavaScript habilitado.

## Documentação

- [Objetivos e escopo](doc/objetivos.md)
- [Modelo de cálculo e fatores](doc/modelo.md)
- [Arquitetura web e evolução](doc/arquitetura.md)

## Estrutura

```text
index.html       ponto de entrada da aplicação
src/             estilos e comportamento do simulador
doc/             objetivos, modelo e arquitetura, documentados separadamente
images/arquives/ assets visuais do projeto
```

O perfil GitHub do projeto está no rodapé: [github.com/mnl-nox](https://github.com/mnl-nox).

## Acessibilidade

A interface usa HTML semântico, rótulos associados aos controles, navegação por teclado, foco visível, atalho para pular ao conteúdo, anúncios de resultados atualizados e suporte à preferência por movimento reduzido. O significado não depende somente de cor. O contraste e o uso com tecnologias assistivas ainda devem ser verificados com usuários e ferramentas dedicadas antes de uma declaração formal de conformidade.

## Limites

Os fatores incluídos são valores de referência ilustrativos para demonstrar o funcionamento do simulador. Eles não representam uma inventariação oficial, rota específica, companhia aérea, modelo de veículo, consumo real ou eletricidade local. Consulte `doc/modelo.md` antes de usar números em relatórios ou decisões operacionais.
