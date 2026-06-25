// === SISTEMA DE ANIMAÇÕES DE FACÇÃO ===
function animarFaccao(faccao) {
    const overlay = document.getElementById('tela-animacao');
    const icone = document.getElementById('icone-animacao');
    const texto = document.getElementById('texto-animacao');

    // Limpa classes anteriores
    icone.className = "";

    if (faccao === 'jedi') {
        icone.classList.add('yoda-avatar');
        texto.innerText = "Yoda diz: 'Fazer ou não fazer. Tentativa não há!'";
    } else if (faccao === 'imperio') {
        icone.classList.add('reverencia-icone');
        texto.innerText = "*Sua lealdade ao Imperador foi registrada com reverência.*";
    } else if (faccao === 'mando') {
        icone.classList.add('capacete-mando');
        texto.innerText = "Mandaloriano diz: 'This is the Way. (Este é o Caminho)'";
    }

    overlay.style.display = 'flex';
}

function fecharAnimacao() {
    document.getElementById('tela-animacao').style.display = 'none';
}


// === SISTEMA DO DESAFIO (SALA SECRETA) ===
function verificarDesafio() {
    const resposta = document.getElementById('resposta-input').value.trim().toLowerCase();
    const erroElemento = document.getElementById('mensagem-erro');
    const salaSecreta = document.getElementById('sala-secreta');

    // Resposta correta: Vermelho (Esquadrão Vermelho / Red Squadron) ou apenas "vermelho"
    if (resposta === "vermelho" || resposta === "esquadrao vermelho" || resposta === "red" || resposta === "red squadron") {
        erroElemento.style.color = "#00ff00";
        erroElemento.innerText = "Acesso Concedido! O Holocron foi aberto.";
        salaSecreta.classList.remove('no-display');
        
        // Rola até o jogo automaticamente
        setTimeout(() => {
            salaSecreta.scrollIntoView({ behavior: 'smooth' });
            inicializarMotorJogo();
        }, 800);
    } else {
        erroElemento.style.color = "#ff3333";
        erroElemento.innerText = "Código incorreto! Sinta o conhecimento da Força e tente novamente. Dica: Uma cor quente.";
    }
}


// === ENGINE DO JOGO TIPO FLAPPY BIRD (FLAPPY SHIP) ===
let canvas, ctx;
let nave, obstaculos, frame, score, gameLoopId, jogoRodando = false;

function inicializarMotorJogo() {
    canvas = document.getElementById('canvasJogo');
    ctx = canvas.getContext('2d');
    
    // Captura comandos de pulo (Teclado e Clique)
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && jogoRodando) {
            nave.velocidade = -6;
            e.preventDefault();
        }
    });
    canvas.addEventListener('mousedown', function() {
        if (jogoRodando) nave.velocidade = -6;
    });

    reiniciarJogo();
}

function reiniciarJogo() {
    document.getElementById('tela-gameover').classList.add('no-display');
    
    nave = {
        x: 100,
        y: 180,
        largura: 34,
        altura: 24,
        gravidade: 0.35,
        velocidade: 0
    };
    
    obstaculos = [];
    frame = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    jogoRodando = true;

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    loop();
}

function loop() {
    if (!jogoRodando) return;

    atualizarEntidades();
    renderizarCena();

    frame++;
    gameLoopId = requestAnimationFrame(loop);
}

function atualizarEntidades() {
    // Física da Nave
    nave.velocidade += nave.gravidade;
    nave.y += nave.velocidade;

    // Colisão com teto ou chão
    if (nave.y + nave.altura > canvas.height || nave.y < 0) {
        finalizarJogo();
    }

    // Gerar obstaculos (Lasers e Pedras alternados)
    if (frame % 90 === 0) {
        let espaco = 120; // Espaço para passar entre as ameaças
        let alturaMinima = 40;
        let alturaMaxima = canvas.height - espaco - alturaMinima;
        let alturaTop = Math.floor(Math.random() * (alturaMaxima - alturaMinima + 1)) + alturaMinima;
        
        // Tipo do perigo: laser (vermelho) ou meteoro (cinza)
        let tipoObstaculo = Math.random() > 0.5 ? 'laser' : 'meteoro';

        obstaculos.push({
            x: canvas.width,
            top: alturaTop,
            bottom: canvas.height - (alturaTop + espaco),
            largura: 30,
            tipo: tipoObstaculo,
            passou: false
        });
    }

    // Movimentar e checar colisões dos obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let obs = obstaculos[i];
        obs.x -= 3.5; // Velocidade de avanço do cenário

        // Detecção de colisão por caixa (AABB)
        if (nave.x < obs.x + obs.largura &&
            nave.x + nave.largura > obs.x &&
            (nave.y < obs.top || nave.y + nave.altura > canvas.height - obs.bottom)) {
            finalizarJogo();
        }

        // Marcar ponto ao ultrapassar com sucesso
        if (!obs.passou && obs.x + obs.largura < nave.x) {
            obs.passou = true;
            score++;
            document.getElementById('score').innerText = score;
        }

        // Deleta obstáculos que saíram da tela
        if (obs.x + obs.largura < 0) {
            obstaculos.splice(i, 1);
        }
    }
}

function renderizarCena() {
    // Limpa a tela com fundo espacial preto
    ctx.fillStyle = '#030308';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha estrelas de fundo piscando de forma fixa baseada no frame
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
        let starX = (i * 77) % canvas.width;
        let starY = (i * 43) % canvas.height;
        ctx.fillRect(starX, starY, 2, 2);
    }

    // Desenha a Nave (Estilo Caça Triangular de Star Wars)
    ctx.fillStyle = '#bbb'; // Corpo cinza metalizado
    ctx.beginPath();
    ctx.moveTo(nave.x + nave.largura, nave.y + nave.altura / 2); // Ponta da frente
    ctx.lineTo(nave.x, nave.y); // Asa superior traseira
    ctx.lineTo(nave.x + 8, nave.y + nave.altura / 2); // Recorte traseiro
    ctx.lineTo(nave.x, nave.y + nave.altura); // Asa inferior traseira
    ctx.closePath();
    ctx.fill();
    
    // Propulsor da nave azul ativo
    ctx.fillStyle = '#4df';
    ctx.fillRect(nave.x - 5, nave.y + (nave.altura/2) - 3, 5, 6);

    // Desenha os Obstáculos
    obstaculos.forEach(obs => {
        if (obs.tipo === 'laser') {
            ctx.fillStyle = '#ff1133'; // Vermelho laser perigoso
        } else {
            ctx.fillStyle = '#55555d'; // Cinza meteoro
        }

        // Barreira Superior
        ctx.fillRect(obs.x, 0, obs.largura, obs.top);
        // Barreira Inferior
        ctx.fillRect(obs.x, canvas.height - obs.bottom, obs.largura, obs.bottom);
        
        // Brilho extra se for laser
        if(obs.tipo === 'laser') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff1133';
            ctx.fillStyle = '#ff9999';
            ctx.fillRect(obs.x + 12, 0, 6, obs.top);
            ctx.fillRect(obs.x + 12, canvas.height - obs.bottom, 6, obs.bottom);
            ctx.shadowBlur = 0; // reseta brilho
        }
    });
}

function finalizarJogo() {
    jogoRodando = false;
    document.getElementById('pontos-finais').innerText = score;
    document.getElementById('tela-gameover').classList.remove('no-display');
}