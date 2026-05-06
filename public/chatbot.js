const mascot = document.getElementById('mascot');
const chatWrap = document.getElementById('chatWrap');
const closeChat = document.getElementById('closeChat');
const inputMsg = document.getElementById('inputMsg');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');

document.addEventListener("DOMContentLoaded", () => {
  chatWrap.style.display = "none"; // Garante que começa fechado
});

let chatAberto = false;
let menuAtivo = false; // Controle de menu de interação
let opcao1Selecionada = false; // Controle para verificar se a opção 1 foi selecionada

// Alterna exibição do chat
mascot.addEventListener('click', () => {
  chatAberto = !chatAberto;
  chatWrap.style.display = chatAberto ? 'flex' : 'none';
});

// Fecha com o botão X
closeChat.addEventListener('click', () => {
  chatWrap.style.display = 'none';
  chatAberto = false;
});

// Envia mensagem
sendBtn.addEventListener('click', enviarMsg);
inputMsg.addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarMsg();
});

function enviarMsg() {
  const texto = inputMsg.value.trim();
  if (!texto) return;

  adicionarMsg('user', texto);
  inputMsg.value = '';

  setTimeout(() => {
    const resposta = responder(texto);
    adicionarMsg('bot', resposta);
  }, 400);
}

function adicionarMsg(tipo, texto) {
  const div = document.createElement('div');
  div.className = 'msg ' + tipo;
  div.innerHTML = texto;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Função principal de resposta
function responder(txt) {
  const t = txt.toLowerCase().trim();

  // Se for uma saudação:
  if (t.includes('oi') || t.includes('olá') || t.includes('bom dia') || t.includes('boa tarde') || t.includes('boa noite')) {
    menuAtivo = true;
    return 'Olá! Bem-vindo ao BGT (Bar Gastronomia, Turismo). Como posso ajudá-lo hoje? Escolha uma das opções abaixo para começar:<br><br>1️⃣ Procurar empresas próximas de você <br>2️⃣ Falar com nosso time de suporte <br>3️⃣ Encontre os Lugares por aqui mesmo!<br>4️⃣ Mais informações sobre nossos serviços';
  }

  // Se o menu estiver ativo, só aceita números
  if (menuAtivo) {
    if (t === '1') {
      if (!opcao1Selecionada) {
        opcao1Selecionada = true; // Marca que a opção 1 foi selecionada pela primeira vez
        return `
          Aqui estão três opções para encontrar empresas perto de você:<br><br>
          1️⃣ **Restaurantes e Bares**: Encontre os melhores locais para uma refeição ou happy hour em sua área.<br>
          2️⃣ **Academias e Centros de Bem-Estar**: Descubra academias, estúdios de yoga e mais, próximos de você.<br>
          3️⃣ **Lojas e Serviços Gerais**: Proximidade de lojas e empresas de serviços como manutenção e reparo.<br>
          Para continuar, me diga sua localização!
        `;
        
    } else {
    // Se o usuário pressionar 1 novamente, repete a mesma resposta
    return 'Desculpe a gente não desenvolveu esssa parte ainda Agradecimentos empresa BGT.'

  }
    }
    if (t === '2') return 'Você pode entrar em contato conosco através do e-mail: contato@bgtonline.com. Estamos à disposição para ajudar!';


    if (t === '3') return 'Porfavo,  ative sua localização! e digite o nome do local que deseja, que iremos procura-lo para você';

    else 'Desculpe ainda não está desenvolvido';

    if (t === '4') return 'Oferecemos serviços de gastronomia, turismo e consultoria empresarial. Caso queira mais detalhes sobre algum serviço específico, posso te ajudar!';

    return 'Desculpa, ainda estamos desenvolvendo essa aplicação. Agradecimentos BGT..';

  
  }
  

  // Caso o usuário tente conversar fora do menu
  return 'Digite "oi" para iniciar uma conversa ou escolha uma das opções de ajuda.';
}

