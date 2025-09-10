// Nome da amiga
const nomeAmiga = "Denize";

// Mensagens animadas
const mensagens = [
  `Feliz aniversário, ${nomeAmiga}! 🎉`,
  "Que todos os seus sonhos se realizem!",
  "Te desejo muitos anos de vida!",
  "Você merece tudo de melhor!",
  "Que Deus abençoe sua vida imensamente!"
];


let index = 0;
const mensagemElemento = document.getElementById("mensagem");

function mostrarMensagem() {
  mensagemElemento.textContent = mensagens[index];

  const cores = ["#FF1493"];
  mensagemElemento.style.color = cores[Math.floor(Math.random() * cores.length)];

  mensagemElemento.style.opacity = 0;
  mensagemElemento.style.animation = "fadeInSlide 1s forwards";

  index = (index + 1) % mensagens.length; // volta para 0 quando chega no final

  setTimeout(mostrarMensagem, 2000); // repete continuamente
}

mostrarMensagem();



// Balões animados com Canvas
const canvas = document.getElementById("confeteCanvas");
const ctx = canvas.getContext("2d");

function ajustarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

const cores = ["#FF0A54","#FF477E","#FF7096","#FF85A1","#FBB1B9","#F9BEC7","#C1FFD7","#B5FFFC"];
const baloes = [];

function Balao() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + Math.random() * 200;
  this.width = 20 + Math.random() * 20;
  this.height = 30 + Math.random() * 30;
  this.speed = 0.5 + Math.random() * 1.5; // velocidade mais suave
  this.color = cores[Math.floor(Math.random() * cores.length)];
  this.angle = Math.random() * Math.PI * 2;
}

for(let i=0; i<50; i++) baloes.push(new Balao());

function drawBaloes() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  baloes.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.width/2, b.height/2, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.height/2);
    ctx.lineTo(b.x, b.y + b.height/2 + 20);
    ctx.stroke();

    b.y -= b.speed;
    b.x += Math.sin(b.angle) * 0.3;
    b.angle += 0.01;

    if(b.y + b.height < 0) {
      b.y = canvas.height + Math.random() * 100;
      b.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(drawBaloes);
}

drawBaloes();
