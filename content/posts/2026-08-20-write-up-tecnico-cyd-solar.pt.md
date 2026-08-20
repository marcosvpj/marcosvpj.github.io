+++
title = "Write Up Tecnico Cyd Solar"
date = 2026-08-20
description = ""
tags = ["off-grid", "energia eletrica", "energia solar", "desenvolvimento"]
categories = ["off-grid"]
draft = false
+++
No [último post](/posts/quantos-episodios-de-s%C3%A9ries-ainda-cabem-na-bateria/) mostrei o dashboard que uso pra monitorar a carga da minha bateria solar. Aqui a ideia é fazer um write-up do processo.

![Display embutido na parede mostrando a carga da bateria e a previsão do tempo](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/display-na-parede.webp)

## Limitações do cenário off-grid

Um detalhe sobre o projeto e as decisões de design e arquitetura: elas foram todas baseadas na minha maior limitação — não tenho internet disponível 24h.

Limitação derivada de não ter uma geração de energia constante, e que justamente esse projeto busca quantificar e deixar visível.

Então, todo o sistema teria que ser projetado pra funcionar com ou sem acesso à internet.

## Onde comecei

Meu ponto de partida foi ver o que eu tinha em mãos.

- dados da bateria via aplicativo mobile
- APIs públicas de previsão do tempo
- hardware barato e de baixo consumo de energia

Pra esses 3 componentes se comunicarem eu precisava de uma rede wifi ativa — e, quando possível, de internet. O problema é que eu sempre usei o próprio roteador da Starlink: com ela desligada, eu não ficava só sem internet, ficava sem rede nenhuma.

Isso trouxe a necessidade de um hardware adicional: um roteador wifi simples, que funcionasse 24h por dia, independente da Starlink. Um roteador Intelbras tirado do fundo do armário resolveu esse primeiro problema. Ele fica responsável por disponibilizar uma rede wifi exclusiva para a bateria e pro display, e é conectado via cabo ethernet à Starlink, dando acesso à internet para esses dispositivos caso ela esteja online.

## Os dados

Conseguir os dados da bateria foi um longo processo de exploração que levou algumas semanas.
Eu sabia que deveria ter algum modo de acessar os dados, pois a bateria enviava eles para o aplicativo do celular do fabricante.

Na primeira exploração, apesar de ter identificado a bateria na rede, não consegui identificar nenhum serviço aberto e rodando no IP dela. Depois de alguns caminhos sem saída descompilando e fazendo engenharia reversa do aplicativo, monitorando o tráfego da minha rede, e nada, apenas dias de frustração.
Esgotadas todas as minhas ideias, decidi fazer o caminho inverso e pegar os dados do aplicativo ao invés da bateria.
Não era o caminho que eu queria, pois assim só teria acesso aos dados quando estivesse com internet, mas tomei essa decisão pra não travar o projeto antes mesmo dele sair do papel.

Com esses dados em mãos, implementei a primeira versão da tela mostrando apenas o estado de carga da bateria e um cálculo de estimativa de carga e descarga.

Com tudo isso rodando estava com a v0 do projeto funcionando.

Satisfeito com essa vitória, e passadas algumas semanas usando o dashboard, decidi fazer um segundo round de exploração pra conseguir os dados sem precisar de internet.
Afinal, não faz sentido pra mim ter que acessar um servidor na China pra ler os dados de um dispositivo que está a 20 metros de distância de mim, na mesma rede local que eu.

Depois de muita pesquisa e leitura de várias versões diferentes de manuais, achei uma funcionalidade escondida no aplicativo que possibilita ele acessar os dados da bateria sem internet, se conectando diretamente a ela. Descoberta promissora.

A partir dessa nova descoberta, instalei diversos aplicativos de monitoramento de rede no meu celular e gravei o tráfego de rede enquanto utilizava o aplicativo da bateria.

Sobre os logs e pacotes de rede: eu sabia que a informação que eu queria estava ali, mas rede não é meu forte. Analisar tudo aquilo manualmente levaria muito tempo e eu correria o risco de deixar algo passar. Então usei o Claude Code pra analisar os logs, passando pra ele quais ações eu tinha feito enquanto gravava — e viva o mundo moderno, o Claude identificou pra mim exatamente quais requests traziam os dados que eu estava vendo no app.

Alguns scripts Python a mais e eu já estava conseguindo replicar as requests sem depender do app do fabricante da bateria.

E pra quem ficou curioso sobre como isso funciona por baixo dos panos, ou também tem uma bateria da Felicity e quer fazer algo parecido, tenho o protocolo documentado no [repositório do GitHub](https://github.com/marcosvpj/felicity-cyd/blob/main/docs/PROTOCOL.md), onde tem todos os passos pra acessar diretamente os dados que a bateria disponibiliza.

Agora tinha tudo em mãos pra fazer uma v1, satisfazendo a limitação principal, que era não ter dependência de acesso à internet.

## Temos o hoje, mas e amanhã?

Sucesso. Tudo funcionando e consegui responder a questão de hoje: qual a situação atual da bateria.
Agora ficou a questão do amanhã. Vai ter sol e posso esbanjar? Ou o clima não vai cooperar e preciso economizar energia?

![Detalhe da tela: 80% de carga, tensão e corrente, previsão de geração e histórico das últimas 24h](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/tela-detalhe.webp)

Depois de comparar diferentes APIs, decidi utilizar a Open-Meteo. Melhor que previsão do tempo, ela disponibiliza a previsão de radiação solar — uma métrica bem mais precisa pro meu problema do que "nublado", "sol" ou "chuva".

E aqui esbarrei novamente na limitação do acesso à internet, e também do hardware utilizado pro display.

A solução mais simples seria fazer o próprio display consultar a API e exibir o resultado na tela. Mas aí eu teria que implementar em C várias redundâncias e caches pra lidar com possíveis indisponibilidades de internet ou da própria API. Então acabei decidindo por uma solução um pouco mais complexa, mas que no longo prazo deixa as manutenções e alterações mais simples.

A solução foi ter um serviço em Go rodando na minha VPS pegando os dados da API, aplicando uma camada de cache pra possíveis indisponibilidades da API, fazendo os cálculos e transformações necessárias pra deixar a informação pronta pro display apenas exibir, e disponibilizando tudo isso em um arquivo JSON estático. A escolha de usar um arquivo estático ao invés de um endpoint de uma API foi por conveniência e também segurança: o serviço Go nunca fica disponível na internet, ele apenas é executado de hora em hora e, conseguindo acessar dados novos no Open-Meteo, sobrescreve o arquivo JSON. E se a API retornou algum erro, ele simplesmente não faz nada — o próprio arquivo vira a camada de cache.

No display, faço uma requisição pra esse arquivo. Se der erro, continuo mostrando as últimas informações que tinha. Se a request retornou os dados, comparo a data deles com o que tenho em memória e atualizo o que está sendo exibido. E pra falhas de conexão não gerarem dados defasados silenciosamente, exibo também no display há quantas horas aconteceu a última atualização com sucesso.

## Instalação

Pra simplificar a instalação, aproveitei uma tomada com adaptador USB: assim foi só ligar os fios 220v na tomada e ligar o CYD na saída USB dela, ficando tudo em uma única peça. Removi as outras entradas da tomada, aumentei o buraco do espelho e embuti o CYD dentro da caixa.

<div class="gallery">
  <figure>
    <img loading="lazy" src="/img/quantos-episodios-de-series-ainda-cabem-na-bateria/placa-esp32.webp" alt="Parte de trás do display: placa ESP32 com tela TFT integrada, encaixada na caixa">
    <figcaption>Parte de trás do display: placa ESP32 com tela TFT integrada</figcaption>
  </figure>
  <figure>
    <img loading="lazy" src="/img/quantos-episodios-de-series-ainda-cabem-na-bateria/caixa-embutida.webp" alt="Interior da caixa embutida na parede, com a fonte e a fiação">
    <figcaption>Interior da caixa embutida na parede, com a fonte e a fiação</figcaption>
  </figure>
</div>

Instalar ele ficou simples como instalar qualquer outra tomada.

## Repositório

[https://github.com/marcosvpj/felicity-cyd](https://github.com/marcosvpj/felicity-cyd)

## Conclusão

Não é porque moro off-grid, no alto de uma montanha, que não posso usar tecnologia pra melhorar a minha vida. A principal questão é entender as limitações vigentes e trabalhar com elas e ao redor delas.

E isso é algo que serve pra tudo. Muitas vezes queremos fazer as coisas do melhor modo possível, com a melhor arquitetura possível, quando simplesmente disponibilizar um arquivo JSON estático já resolve.
