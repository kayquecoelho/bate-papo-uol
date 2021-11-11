function entradaDoUsuario() {
    const inputEntrada = document.querySelector (".entrada input")
    const nome = inputEntrada.value 
    console.log (nome)

    const enderecoEntrada = document.querySelector (".entrada")
    enderecoEntrada.classList.add("escondido")
    const enderecoCarregando = document.querySelector(".carregando")
    enderecoCarregando.classList.remove("escondido")
    
}
