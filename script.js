// script.js — versão corrigida e mais robusta
document.addEventListener("DOMContentLoaded", () => {
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

  // Tipos de animação (mapeados para keyframes JS)
  const animTypes = ["fadeInSlide", "zoomIn", "rotateIn", "bounceIn"];

  // armazenar timeouts para cancelar se necessário
  let activeTimeouts = [];
  function clearActiveTimeouts() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  // keyframes para cada animação
  const keyframeMap = {
    fadeInSlide: [
      { transform: "translateY(20px) scale(0.98)", opacity: 0 },
      { transform: "translateY(0) scale(1)", opacity: 1 }
    ],
    zoomIn: [
      { transform: "scale(0.6)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 }
    ],
    rotateIn: [
      { transform: "rotate(-160deg) scale(0.4)", opacity: 0 },
      { transform: "rotate(0deg) scale(1)", opacity: 1 }
    ],
    bounceIn: [
      { transform: "translateY(60px)", opacity: 0 },
      { transform: "translateY(-12px)", opacity: 1 },
      { transform: "translateY(0)", opacity: 1 }
    ]
  };

  // animação de saída (fade para cima)
  function animateOut(duration = 450) {
    // retorna uma Promise para aguardar o fim se precisar
    return mensagemElemento.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-20px)" }],
      { duration, easing: "ease-in", fill: "forwards" }
    );
  }

  // função que aplica animação de entrada por tipo
  function animateIn(type, duration = 700) {
    const keyframes = keyframeMap[type] || keyframeMap.fadeInSlide;
    // remove qualquer animação inline anterior
    mensagemElemento.getAnimations().forEach(a => a.cancel());
    // garante visibilidade imediata
    mensagemElemento.style.opacity = "1";
    mensagemElemento.animate(keyframes, { duration, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
  }

  // função máquina de escrever (com possibilidade de cancelar)
  function typeText(text, onComplete) {
    mensagemElemento.textContent = "";
    let i = 0;

    function step() {
      if (i < text.length) {
        mensagemElemento.textContent += text.charAt(i);
        i++;
        const t = setTimeout(step, 45 + Math.random() * 35); // leve aleatoriedade
        activeTimeouts.push(t);
      } else {
        if (onComplete) onComplete();
      }
    }

    step();
  }

  // rotina principal para mostrar mensagens em loop
  function showNext() {
    clearActiveTimeouts();
    // garantir elemento limpo antes de começar
    mensagemElemento.textContent = "";
    // escolher texto
    const texto = mensagens[index];
    index = (index + 1) % mensagens.length;

    // cor aleatória (evita cor = fundo)
    const coresMsg = ["#FF1493"];
    mensagemElemento.style.color = coresMsg[Math.floor(Math.random() * coresMsg.length)];
    mensagemElemento.style.willChange = "transform, opacity";

    // escolher animação aleatória
    const anim = animTypes[Math.floor(Math.random() * animTypes.length)];
    animateIn(anim);

    // iniciar digitação logo em seguida (pequeno delay para sincronizar)
    const startDelay = 100;
    const startTimer = setTimeout(() => {
      typeText(texto, () => {
        // após terminar de digitar espera um pouco e some, então chama próxima
        const waitAfterTyping = 1800;
        const waitTimer = setTimeout(() => {
          // animação de saída e ao terminar chama showNext novamente
          const outAnim = animateOut(450);
          // usar onfinish do efeito retornado
          outAnim.onfinish = () => {
            // reset visual
            mensagemElemento.textContent = "";
            mensagemElemento.style.opacity = "0";
            // um pequeno atraso antes de mostrar a próxima
            const nextTimer = setTimeout(showNext, 220);
            activeTimeouts.push(nextTimer);
          };
        }, waitAfterTyping);
        activeTimeouts.push(waitTimer);
      });
    }, startDelay);
    activeTimeouts.push(startTimer);
  }

  // inicializa com opacidade 0 (caso o CSS tenha setado algo diferente)
  mensagemElemento.style.opacity = "0";
  showNext();

  // --------------------------
  // Balões animados com Canvas
  // --------------------------
  const canvas = document.getElementById("confeteCanvas");
  const ctx = canvas.getContext("2d");

  function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", ajustarCanvas);
  ajustarCanvas();

  const coresBaloes = [
    "#FF0A54", "#FF477E", "#FF7096", "#FF85A1",
    "#FBB1B9", "#F9BEC7", "#C1FFD7", "#B5FFFC"
  ];
  const baloes = [];

  function Balao() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 200;
    this.width = 20 + Math.random() * 20;
    this.height = 30 + Math.random() * 30;
    this.speed = 0.5 + Math.random() * 1.5;
    this.color = coresBaloes[Math.floor(Math.random() * coresBaloes.length)];
    this.angle = Math.random() * Math.PI * 2;
  }

  for (let i = 0; i < 50; i++) baloes.push(new Balao());

  function drawBaloes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    baloes.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + b.height / 2);
      ctx.lineTo(b.x, b.y + b.height / 2 + 20);
      ctx.stroke();

      b.y -= b.speed;
      b.x += Math.sin(b.angle) * 0.3;
      b.angle += 0.01;

      if (b.y + b.height < 0) {
        b.y = canvas.height + Math.random() * 100;
        b.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(drawBaloes);
  }

  drawBaloes();
});
