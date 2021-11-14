let nome;
let tipoSelecionado = 0;
let participanteSelecionado = 0;

function carregarPage() {
    const conteúdo = document.querySelector("body")
    conteúdo.innerHTML = `
    <div class="entrada">
        <img src="/assets/logo 1.png">
        <input type="text" placeholder="Digite seu nome"  data-identifier="enter-name">
        <button onclick="entradaDoUsuario()" data-identifier="start"> Entrar </button>
    </div>

    <div class="carregando escondido ">
        <img src="/assets/logo 1.png">
        <img src="/assets/load.gif" id="gif">
        Entrando...
    </div>

    <main class="secao-principal escondido">
        <header>
            <img src="/assets/logo 1.png">
            <ion-icon name="people-sharp" onclick ="participantesAtivos()"> </ion-icon>
        </header>
        <section class="bate-papo"> </section>
        <nav class = "enviar-mensagem">
            <input type="text" name="" id="" placeholder="Escreva aqui...">
            <ion-icon name="paper-plane-outline" data-identifier="send-message" onclick="enviarMensagem()"></ion-icon>
        </nav>

    </main>
    
    <div class="ativos escondido" onclick = "participantesAtivos()">
    </div>
    <nav class="informacoes escondido">
        <p id="título">Escolha um contato <br> para enviar mensagem:</p>
        <div class="participantes">
        
        </div>
        <p id="visibilidade">
            Escolha a visibilidade:
        </p>
        <div class="visibilidade-mensagem">
            <div class="opcoes" onclick ="checkTipo(this)">
                <ion-icon name="lock-open"></ion-icon>
                Público
                <div class = "check"> 
                    <ion-icon name="checkmark-sharp"></ion-icon>
                </div>
            </div>
            <div class="opcoes" onclick = "checkTipo(this)">
                <ion-icon name="lock-closed"></ion-icon>
                Reservadamente
                <div class = "check"> 
                    <ion-icon name="checkmark-sharp"></ion-icon>
                </div>
            </div>
        </div>

    </nav>
   `
    
}
function entradaDoUsuario() {
    const inputEntrada = document.querySelector(".entrada input")
    nome = inputEntrada.value
    
    
    if (nome !== ""){
        const promessa = axios.post ("https://mock-api.driven.com.br/api/v4/uol/participants", {name: nome} )
        promessa.then(entrando)
        promessa.catch(() => alert("Este nome já está em uso"), carregarPage())
        return ;
    }
    alert("Por favor, digite um nome válido!")
    
}
function entrando(resposta) {
    const entrada = document.querySelector(".entrada")
    const carregando = document.querySelector(".carregando")
    entrada.classList.add("escondido")
    carregando.classList.remove("escondido")
    
    const idManterConexao= setInterval (manterConexao,5000)
    const idPegandoMensagens = setInterval(pegandoMensagens,3000);
    const idBuscarParticipantes = setInterval(buscarPartipantesAtivos, 10000)
    setTimeout (() => carregando.classList.add("escondido"), 3000)
    
}
function pegandoMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(gerarMensagens)
}

function gerarMensagens(resposta) {
    const secaoPrincipal = document.querySelector(".secao-principal")
    if (secaoPrincipal.classList.contains("escondido")){
        secaoPrincipal.classList.remove ("escondido")
    }

    const enderecoBatePapo = document.querySelector(".bate-papo")
    enderecoBatePapo.innerHTML = ""

    const data = resposta.data;
     
    for (let i = 0; i < data.length; i++) {
        let from = data[i].from
        let to = data[i].to
        let text = data[i].text
        let type = data[i].type
        let time = data[i].time

        if (type === "status") {
            enderecoBatePapo.innerHTML += `<article class="mensagem status" data-identifier="message">
            <p class = "texto"> <time>(${time})</time> <span> ${from} </span>  ${text}</p> 
         </article>`
        }
        if (type === "private_message" && to === nome) {
            enderecoBatePapo.innerHTML += `<article class="mensagem privada" data-identifier="message">
            <p class = "texto"> <time>(${time})</time> <span> ${from} </span> reservadamente para <span> ${to} </span>:  ${text} </p>
         </article>`
        }
        if (type === "message") {
            enderecoBatePapo.innerHTML += ` <article class="mensagem todos" data-identifier="message">
            <p class = "texto"><time>(${time})</time> <span> ${from} </span> para <span> ${to} </span>:   ${text} </p>
        </article>`

        }
        
    }

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
    promessa.catch(() => window.location.reload(true))
}
function participantesAtivos() {
    const endereçoAtivos = document.querySelector(".ativos")
    const enderecoInformacoes = document.querySelector(".informacoes")

    if (endereçoAtivos.classList.contains("escondido")){
        endereçoAtivos.classList.remove("escondido")
        enderecoInformacoes.classList.remove("escondido")
    } else {
        endereçoAtivos.classList.add("escondido")
        enderecoInformacoes.classList.add("escondido")
    }
    
}
function buscarPartipantesAtivos() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promessa.then(gerarParticipantes)
}
function gerarParticipantes(resposta) {
    const participantes = document.querySelector(".participantes")
    const data = resposta.data
    participantes.innerHTML = `
    <div class="usuario" onclick = "checkUsuario(this)">
        <ion-icon name="people-sharp"></ion-icon>
        Todos
        <div class = "check"> 
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>
    </div>`
    for (let i = 0; i < data.length; i++) {
        participantes.innerHTML += `
                <div class="usuario" onclick = "checkUsuario(this)">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>${data[i].name}</p>
                    <div class = "check"> 
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>`
    }
}
function checkUsuario(item) {
    const selecionadoUsuario = document.querySelector(".participantes .selecionado")
    
    if (selecionadoUsuario !== null) {
        selecionadoUsuario.classList.remove("selecionado")
    }
    
    item.classList.add("selecionado")
    
}
function checkTipo(item) {
    const selecionadoOpcoes = document.querySelector(".visibilidade-mensagem .selecionado")
    
    if (selecionadoOpcoes !== null) {
        selecionadoOpcoes.classList.remove ("selecionado")
       
    }

    item.classList.add("selecionado")
}

carregarPage()


