# Modelo de estimativa

## Equação

Cada trecho usa um fator médio expresso em quilogramas de CO₂ equivalente por passageiro-quilômetro:

```text
distância efetiva (km) = distância informada × (2 se ida e volta, caso contrário 1)
emissões do trecho (kg CO₂e) = distância efetiva × fator do meio × número de viajantes
emissões da viagem = soma das emissões de todos os trechos
```

O resultado principal representa a soma estimada para o grupo informado. A comparação de alternativas usa a distância total de todos os trechos e mostra o resultado por passageiro, sem multiplicar pelo grupo.

## Fatores padrão da demonstração

| Meio | Fator (kg CO₂e/passageiro-km) |
| --- | ---: |
| Carro | 0,171 |
| Ônibus | 0,105 |
| Avião | 0,255 |
| Trem / metrô | 0,041 |
| Motocicleta | 0,113 |
| Balsa | 0,115 |
| Bicicleta / a pé | 0 |

Esses valores são **ilustrativos e não validados para uso factual**. Foram escolhidos como valores iniciais de demonstração do produto. Categorias amplas como “avião” ou “carro” não descrevem adequadamente diferenças de distância, ocupação, tecnologia, combustível e operação. O fator zero para caminhar ou pedalar é uma simplificação de emissões operacionais diretas e não contabiliza fabricação, alimentação ou infraestrutura.

Antes de uso público como ferramenta quantitativa, substitua cada valor por fatores rastreáveis e adequados ao contexto geográfico e temporal. Registre fonte, ano, unidade, escopo, gases incluídos, premissas de ocupação e versão. Quando necessário, permita escolher classe de veículo, combustível, rota aérea, ocupação e eletricidade. Evite misturar fatores de fronteiras de sistema diferentes.

## Limitações e interpretação

- A distância é informada pela pessoa; a aplicação não verifica rota nem distingue distância em linha reta de distância efetivamente percorrida.
- As médias não são previsão de consumo real nem medição da emissão de uma viagem específica.
- Passageiros multiplicam o total do grupo; o fator por passageiro já representa uma média de ocupação. O campo não altera o fator unitário individual.
- Não são incluídos efeitos climáticos não-CO₂ da aviação, salvo se incorporados à fonte do fator (os fatores demonstrativos não têm essa validação).
- Não são estimadas emissões de produção de veículos, infraestrutura, hospedagem, alimentação, compensações ou mudanças de demanda.
- Arredondamento é apenas visual; os cálculos usam os valores decimais definidos no catálogo em `src/app.js`.

## Manutenção do catálogo

Os fatores e nomes estão no objeto `MODES` no início de `src/app.js`. Para cada atualização futura, mantenha a tabela deste documento sincronizada e anote a fonte e sua versão. A comparação e a estimativa de trechos devem ler o mesmo catálogo.
