+++
title = "Quantos episodios de séries ainda cabem na bateria"
date = 2026-08-17
description = ""
tags = ["off-grid", "energia eletrica", "energia solar", "desenvolvimento"]
categories = ["off-grid"]
draft = false
+++
Morando off-grid e trabalhando remoto, gerenciar meu consumo de energia elétrica é uma necessidade constante.

No verão, quando o sol energiza os painéis solares a partir das 6-7 da manhã, não tenho muitos problemas. Mas no inverno, dependendo do clima, o sol só aparece pra recarregar as baterias por volta das 9-10 da manhã.

Isso faz a decisão de assistir mais um episódio de uma série antes de dormir ser a diferença entre ter ou não energia elétrica para trabalhar nos próximos dias nublados.

Pra saber então se posso ficar tranquilo e assistir mais um episódio ou se é melhor ler um livro e economizar bateria, tenho que acessar o aplicativo da bateria, ver a carga atual, acessar o site de previsão do tempo e ver se os próximos dias vão ser de sol ou não.

Dois aplicativos diferentes, precisando navegar em várias telas diferentes. E ainda correndo o risco de uma notificação aparecer a qualquer momento, me distrair, e eu acabar gastando energia justamente quando deveria estar economizando bateria.

Como um bom programador nerd, resolvi desenvolver um dashboard que consulta os dados da bateria e uma API de previsão do tempo e exibe tudo em um display que embuti na parede da minha sala.

![Display embutido na parede mostrando a carga da bateria e a previsão do tempo](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/display-na-parede.webp)

Agora basta eu olhar pro lado e consigo ver quanto tenho de bateria, a previsão de quanto tempo ela vai levar pra descarregar com o meu consumo atual de energia e a previsão do tempo para os próximos 3 dias.

![Detalhe da tela: 80% de carga, tensão e corrente, previsão de geração e histórico das últimas 24h](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/tela-detalhe.webp)

Tudo bem organizado, usando padrões de cores pra nem precisar pensar muito no que os números significam. Na foto acima é um dia tranquilo: 80% de carga, entrando 22 ampéres, previsão de 3,4 kWh de geração amanhã e o gráfico das últimas 24 horas só subindo. Tudo em ciano e branco, então posso assistir o que quiser. Quando algum desses números aparece em amarelo ou vermelho, é dia de desligar a internet mais cedo pra não correr o risco de ficar sem luz no meio do trabalho.

Por trás não tem muito mistério. O display é uma dessas placas ESP32 que já vêm com uma tela TFT de 2.8 polegadas soldada na mesma plaquinha laranja: liga no wifi, busca os dados prontos da [API que fiz pra bateria]({{< ref "2026-04-22-monitorando-minha-bateria-pelo-terminal.pt.md" >}}) e da API de previsão do tempo, e só desenha na tela.

![Parte de trás do display: placa ESP32 com tela TFT integrada, encaixada na caixa](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/placa-esp32.webp)

A parte mais trabalhosa não foi o código, foi a caixa. Aproveitei uma caixa de embutir de parede pra esconder a fonte e a fiação, e assim o que fica aparecendo na sala é só a tela, sem cabo pendurado nem gambiarra à vista.

![Interior da caixa embutida na parede, com a fonte e a fiação](/img/quantos-episodios-de-series-ainda-cabem-na-bateria/caixa-embutida.webp)

Agora o problema não é mais problema. A decisão não depende mais de informações escondidas em múltiplos aplicativos: basta olhar de relance pro display na parede e imediatamente sei como está minha situação energética — e se posso ficar até tarde assistindo série ou não.
