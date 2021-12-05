let nomeUsuario;
let destinatário = "Todos"
let privacidade = "message";
let tipoMensagem = "publicamente"

function renderPage (){
    return `
        <main class="secao-principal">
            <header>
                <img src="/assets/logo 1.png">
                <ion-icon name="people-sharp" onclick ="participantesAtivos()"> </ion-icon>
            </header>

            <section class="bate-papo"> </section>

            <nav class = "enviar-mensagem">
                <div class ="digitar-mensagem">
                    <input type="text" placeholder="Escreva aqui...">
                    <p class ='informacoes-mensagem'> Enviando para ${destinatário} (${tipoMensagem})</p>
                </div>
                <ion-icon name="paper-plane-outline" data-identifier="send-message" onclick="enviarMensagem()"></ion-icon>
            </nav>
        </main>
        
        <div class="ativos escondido" onclick = "participantesAtivos()"> </div>

        <nav class="informacoes escondido">
            <p id="título">Escolha um contato <br> para enviar mensagem:</p>

            <div class="participantes"> </div>

            <p id="visibilidade"> Escolha a visibilidade: </p>

            <div class="visibilidade-mensagem">
                <div class="opcoes publico" onclick ="checkPrivacidade(this)" data-identifier="visibility">
                    <ion-icon name="lock-open"></ion-icon>
                    Público
                    <div class = "check"> 
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>

                <div class="opcoes reservado" onclick = "checkPrivacidade(this)" data-identifier="visibility">
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

function loginPage() {
    const conteúdo = document.querySelector(".root")
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
    `
}

function entradaDoUsuario() {
    const inputEntrada = document.querySelector(".entrada input")
    nomeUsuario = inputEntrada.value;

    if (nomeUsuario !== "") {
        const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: nomeUsuario })
        promessa.then(entrando)
        promessa.catch(() => alert("Este nome já está em uso"), loginPage())
        return;
    }

    alert("Por favor, digite um nome válido!")
}

function entrando() {
    const paginaDeEntrada = document.querySelector(".entrada")
    const carregando = document.querySelector(".carregando")
    paginaDeEntrada.classList.add("escondido")
    carregando.classList.remove("escondido")

    const idManterConexao = setInterval(manterConexao, 5000)
    const idPegandoMensagens = setInterval(pegandoMensagens, 3000);
    const idBuscarParticipantes = setInterval(buscarPartipantesAtivos, 10000)

    setTimeout(() => {
        const root = document.querySelector(".root");
        root.innerHTML = ` ${renderPage()}`;
        buscarPartipantesAtivos()

        const inputMensagem = document.querySelector(".enviar-mensagem input")
        inputMensagem.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.querySelector(".enviar-mensagem ion-icon").click();
            }})
        }, 3000)
}

function pegandoMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(gerarMensagens)
}

function gerarMensagens({data}) {
    const enderecoBatePapo = document.querySelector(".bate-papo")
    enderecoBatePapo.innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        const {from, to, text, type, time} = data[i]

        if (type === "status") {
            enderecoBatePapo.innerHTML += `
            <article class="mensagem status" data-identifier="message">
                <p class = "texto"> <time>(${time})</time> <span> ${from} </span>  ${text}</p> 
            </article>`
        }

        if (type === "private_message" && (to === nomeUsuario || from === nomeUsuario)) {
            enderecoBatePapo.innerHTML += `
            <article class="mensagem privada" data-identifier="message">
                <p class = "texto"> <time>(${time})</time> <span> ${from} </span> reservadamente para <span> ${to} </span>:  ${text} </p>
            </article>`
        }

        if (type === "message") {
            enderecoBatePapo.innerHTML += ` 
            <article class="mensagem todos" data-identifier="message">
                <p class = "texto"><time>(${time})</time> <span> ${from} </span> para <span> ${to} </span>:   ${text} </p>
            </article>`
        }
    }

    const mensagens = document.querySelectorAll(".mensagem")
    const ultimaMensagem = mensagens[mensagens.length - 1]
    ultimaMensagem.scrollIntoView()
}

function manterConexao() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: nomeUsuario })
    promessa.catch(manterConexao)
}

function enviarMensagem() {
    const inputMensagem = document.querySelector(".enviar-mensagem input")
    const conteudoMensagem = inputMensagem.value;
    const objetoMensagem = {
        from: nomeUsuario,
        to: destinatário,
        text: conteudoMensagem,
        type: privacidade
    }

    if (conteudoMensagem !== "") {
        promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objetoMensagem)
        promessa.then(pegandoMensagens)
        promessa.catch(() => window.location.reload(true))
    }
    inputMensagem.value = "";
}

function participantesAtivos() {
    const endereçoAtivos = document.querySelector(".ativos")
    const enderecoInformacoes = document.querySelector(".informacoes")

    if (endereçoAtivos.classList.contains("escondido")) {
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
    promessa.catch((response) => console.log(response))
}

function gerarParticipantes({data}) {
    const participantes = document.querySelector(".participantes")
    participantes.innerHTML = `
        <div class="usuario " onclick = "checkDestino(this)">
            <ion-icon name="people-sharp"></ion-icon>
            <p> Todos </p>
            <div class = "check"> 
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
        </div>`

    for (let i = 0; i < data.length; i++) {
        if (data[i].name !== nomeUsuario) {
            participantes.innerHTML += `
                <div class="usuario" onclick = "checkDestino(this)" data-identifier="participant">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>${data[i].name}</p>
                    <div class = "check"> 
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>`
        }
    }
}

function checkDestino(item) {
    const selecionadoUsuario = document.querySelector(".participantes .selecionado")

    if (selecionadoUsuario !== null) {
        selecionadoUsuario.classList.remove("selecionado")
    }

    item.classList.add("selecionado")

    const paragrafo = item.querySelector("p")
    destinatário = paragrafo.innerHTML;

    const destinoInfo = document.querySelector(".digitar-mensagem .informacoes-mensagem")
    destinoInfo.innerHTML = `Enviando para ${destinatário} (${tipoMensagem})`
}

function checkPrivacidade(item) {
    const selecionadoOpcoes = document.querySelector(".visibilidade-mensagem .selecionado");

    if (selecionadoOpcoes !== null) {
        selecionadoOpcoes.classList.remove("selecionado");
    }

    item.classList.add("selecionado");

    if (item.classList.contains('publico')) {
        privacidade = "message";
        tipoMensagem = "publicamente";
    }

    if (item.classList.contains('reservado')) {
        privacidade = "private_message";
        tipoMensagem = "reservadamente";
    }

    const destinoInfo = document.querySelector(".digitar-mensagem .informacoes-mensagem");
    destinoInfo.innerHTML = `Enviando para ${destinatário} (${tipoMensagem})`;
}

loginPage()