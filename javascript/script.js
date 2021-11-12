let nome;
setInterval(manterConexao, 5000)
function carregarPage() {
    const conteúdo = document.querySelector("body")
    conteúdo.innerHTML = `
    <div class="entrada">
        <img src="/assets/logo 1.png">
        <input type="text" placeholder="Digite seu nome"  data-identifier="enter-name">
        <button onclick="entradaDoUsuario()" data-identifier="start"> Entrar </button>
    </div>
    `
}
function entradaDoUsuario() {
    const inputEntrada = document.querySelector(".entrada input")
    nome = inputEntrada.value

    const promessa = axios.post ("https://mock-api.driven.com.br/api/v4/uol/participants", {name: nome} )
    promessa.then(entrando)
    promessa.catch(carregarPage)
}
function entrando(resposta) {
    const conteúdo = document.querySelector("body");
    conteúdo.innerHTML = `
    <div class="carregando ">
        <img src="/assets/logo 1.png">
        <img src="/assets/load.gif" id="gif">
        Entrando...
    </div>`

    setInterval(pegandoMensagens,3000)
    setTimeout (conteúdoBatePapo, 1000)
}
function conteúdoBatePapo() {
    const conteúdo = document.querySelector("body")
    conteúdo.innerHTML =  `
    <main class="secao-principal">
        <header>
            <img src="/assets/logo 1.png">
            <ion-icon name="people-sharp"></ion-icon>
        </header>
        <section class="bate-papo">
            
        </section>
        <nav class = "enviar-mensagem">
            <input type="text" name="" id="" placeholder="Escreva aqui...">
            <ion-icon name="paper-plane-outline" data-identifier="send-message" onclick="enviarMensagem()"></ion-icon>
        </nav>
    </main>`
}
function pegandoMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(gerarMensagens)
}
function gerarMensagens(resposta) {
    const conteúdo = document.querySelector(".bate-papo")
    conteúdo.innerHTML = ""
    
    const data = resposta.data;
    const enderecoBatePapo = document.querySelector(".bate-papo")
    
    for (let i = 0; i < data.length; i++) {
        let from = data[i].from
        let to = data[i].to
        let text = data[i].text
        let type = data[i].type
        let time = data[i].time

        if (type === "status") {
            enderecoBatePapo.innerHTML += `<article class="mensagem status" data-identifier="message">
            <p> <time>(${time})</time> <span> ${from} </span>  ${text}</p> 
         </article>`
        }
        if (type === "private_message") {
            enderecoBatePapo.innerHTML += `<article class="mensagem privada" data-identifier="message">
            <p> <time>(${time})</time> <span> ${from} </span> reservadamente para <span> ${to} </span>:  ${text} </p>
         </article>`
        }
        if (type === "message") {
            enderecoBatePapo.innerHTML += ` <article class="mensagem todos" data-identifier="message">
            <p><time>(${time})</time> <span> ${from} </span> para <span> ${to} </span>:   ${text} </p>
        </article>`

        }
        
    }

    // está fazendo a última mensagem aparecer
    const mensagens = document.querySelectorAll(".mensagem")
    const ultimaMensagem = mensagens[mensagens.length -1] 
    ultimaMensagem.scrollIntoView()
    
}
function manterConexao() {
    const promessa = axios.post ("https://mock-api.driven.com.br/api/v4/uol/status", {name: nome} )
    promessa.catch(manterConexao)
}
function enviarMensagem() {
    const inputMensagem = document.querySelector(".enviar-mensagem input")
    const mensagem = inputMensagem.value
    const objetoMensagem = {from: nome, to: "Todos", text: mensagem, type: "message"}

    promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objetoMensagem)
    
    promessa.then(pegandoMensagens)
    promessa.catch(tratarErro)
}
function tratarErro(erro) {
    console.log(erro.response)
    window.location.reload(true)
}

carregarPage()
