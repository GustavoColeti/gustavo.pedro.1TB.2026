// Textos completos dos artigos guardados na memória do site
const textosArtigos = {
    jedi: {
        titulo: "O Caminho dos Jedi",
        texto: "<p>Os Jedi são os guardiões da paz e da justiça na galáxia de Star Wars. Eles utilizam o Lado Luminoso da Força, que se baseia em conhecimento, serenidade e autodisciplina.</p><br><p>Seu código proíbe o apego emocional e o egoísmo, focando na proteção dos inocentes através de suas habilidades e seus icônicos sabres de luz azuis ou verdes.</p>"
    },
    imperio: {
        titulo: "A Ascensão do Império",
        texto: "<p>O Império Galáctico surgiu das cinzas da antiga República, orquestrado secretamente por Sheev Palpatine (Darth Sidious). Com uma forte presença militar e controle rígido, o império subjugou milhares de sistemas planetários.</p><br><p>Sua força de elite contava com os Stormtroopers e a figura imponente de Darth Vader para esmagar qualquer sinal de rebelião ou dissidência.</p>"
    }
};

// Função que faz o botão abrir o artigo correto na tela
function abrirArtigo(idArtigo) {
    const modal = document.getElementById('modal-artigo');
    const titulo = document.getElementById('modal-titulo');
    const texto = document.getElementById('modal-texto');
    
    // Insere o título e texto correspondentes
    titulo.innerText = textosArtigos[idArtigo].titulo;
    texto.innerHTML = textosArtigos[idArtigo].texto;
    
    // Mostra a janela na tela
    modal.style.display = 'flex';
}

// Função para fechar a janela ao clicar no "X"
function fecharArtigo() {
    const modal = document.getElementById('modal-artigo');
    modal.style.display = 'none';
}

// Fecha a janela se o usuário clicar fora da caixinha preta
window.onclick = function(event) {
    const modal = document.getElementById('modal-artigo');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}