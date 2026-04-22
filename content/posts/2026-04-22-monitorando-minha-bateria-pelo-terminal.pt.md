+++
title = "Monitorando Minha Bateria Pelo Terminal"
date = 2026-04-22T12:31:59-03:00
description = ""
tags = ["off-grid", "energia eletrica", "energia solar", "desenvolvimento"]
categories = ["off-grid"]
draft = false
+++

![Dashboard da bateria no terminal](/img/monitorando-minha-bateria-pelo-terminal/dashboard.webp)

O sistema solar está evoluindo.

Comprei a bateria nova, uma bateria da Felicity Solar de lítio de 170Ah, um total de 4kWh de capacidade. E um bônus, ela tem wifi pra acompanhar pelo aplicativo de celular. Isso resolve um problema que sempre tive com as baterias anteriores: ligava algo e a luz caía, pois a bateria estava já no fim e eu não sabia.

Mas ainda assim é meio chato ter que abrir o aplicativo toda vez, então entrei em um rabbit hole: tentar fazer engenharia reversa do aplicativo pra entender como a bateria se comunica com ele e pegar esses dados diretamente pra usar onde e quando eu quiser.

A expectativa era encontrar um endpoint que retornava o status da bateria, então comecei com um port scan. E pra minha surpresa não encontrei nenhuma porta.

Mas a informação estava sendo transmitida de algum modo. O próximo passo foi interceptar o tráfego da rede pra pegar a informação em trânsito. Mas isso também não teve o sucesso esperado.

Tive que subir um servidor DNS local pra redirecionar todo tráfego pra minha máquina e só aí vi a informação sendo transportada, mas ainda assim ela não estava visível.

Era MQTT e não HTTP.

Então tive que subir um servidor MQTT local, configurar o DNS pra redirecionar o tráfego do servidor do fabricante pra minha máquina e só aí consegui ver a informação do status da bateria.

Aí foi uma sensação de sucesso, consegui os dados! Mas no mesmo instante veio a realização: pra deixar isso funcionando irei precisar deixar um dispositivo ligado 24/7 pra atuar como DNS e persistir e disponibilizar esses dados pra mim, o que gerou uma certa frustração.

Por que o fabricante não facilita a vida dos usuários e disponibiliza os dados brutos de forma aberta? Ao invés força o uso do aplicativo proprietário deles que requer acesso a internet, coisa que não é garantida num cenário off-grid?

Aí, aceitando a derrota: sem jeito de escapar de precisar de acesso a internet.

Então tentei o caminho contrário: pegar as informações do servidor.

Além do aplicativo mobile a Felicity disponibiliza um dashboard web. Aqui foi a parte fácil. Trabalhei 4 anos com scraping de dados, então analisar as requests desse dashboard, identificar a request de autenticação e a de coleta de informações, e programar um simples app em Go que fizesse elas sob demanda foi quase de olhos fechados. Sem mistério aqui.

Depois evolui a aplicação um pouco pra ela disponibilizar um endpoint público com o status da bateria pra mim poder adicionar o status da carga no meu terminal e também armazenar os dados históricos pra futura referência.

Agora tenho duas opções de onde continuar pra atingir o objetivo original de acessar os dados sem precisar de internet: colocar um raspberry pi com um servidor DNS local interceptando as requests do servidor da Felicity, ou usar um ESP-32 com um módulo RS485 conectado na porta de dados da bateria e pegar essas informações por ali.

Mas esses dois caminhos envolvem hardwares novos que não tenho a disposição no momento, então isso vai ficar para uma outra hora, uma v2.

E apesar de não conseguir fazer exatamente como queria, tive sucesso. Agora tenho a informação da situação da bateria onde e quando quiser.

E um desses lugares é o terminal:

![Porcentagem da bateria no prompt do terminal](/img/monitorando-minha-bateria-pelo-terminal/terminal.webp)

Como desenvolvedor passo grande parte do meu tempo no terminal e assim tenho a informação de quanto de energia elétrica tenho disponível sem precisar fazer nada, só olhar ali no canto direito da tela.

Apesar de todos os tropeços, foi um final feliz.

E caso tenha curiosidade de ver o código final ou tenha uma bateria do mesmo fabricante e queira fazer algo parecido, o código está disponível no GitHub: [[felicity-battery-api](https://github.com/marcosvpj/felicity-battery-api)](https://github.com/marcosvpj/felicity-battery-api)
