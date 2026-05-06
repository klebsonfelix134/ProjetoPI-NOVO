
  const mascot = document.getElementById('mascot');
  const chatWrap = document.getElementById('chatWrap');
  const closeChat = document.getElementById('closeChat');
  const inputMsg = document.getElementById('inputMsg');
  const sendBtn = document.getElementById('sendBtn');
  const chatBody = document.getElementById('chatBody');
  document.addEventListener("DOMContentLoaded", () => {
  chatWrap.style.display = "none"; // garante que começa fechado
});

  let chatAberto = false;
  let menuAtivo = false; // controla se o menu já foi enviado

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
    if (t.includes('oi') || t.includes('Oi') || t.includes('olá') || t.includes('bom dia') || t.includes('boa tarde') || t.includes('boa noite') || t.includes('ola')) {
      menuAtivo = true;
      return 'Opa!<br> <br> Como posso ajudar? 😄Escolha uma opção abaixo:<br><br>1️⃣ <br>2️⃣ Contato<br>3️⃣ Horários<br>4️⃣ Sobre o site';
    }

    // Se o menu estiver ativo, só aceita números
    if (menuAtivo) {
      if (t === '1') return '🛠️ Suporte: entre em contato pelo WhatsApp (11) 99999-0000.';
      if (t === '2') return '📞 Contato: envie um e-mail para contato@seudominio.com.';
      if (t === '3') return '⏰ Horário de atendimento: Segunda a Sexta, das 8h às 18h.';
      if (t === '4') return '💡 Somos um site de exemplo com mascote e chat local.';
      if (t === '5') return ''
      return 'Por favor, digite apenas o número da opção desejada (1 a 4).';
    }

    // Caso o usuário tente conversar fora do menu
    return 'Digite "oi" para ver as opções de ajuda 😄';

  }

  async function getGoogleHours(nominatimPlace) {
  const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Ative e cole aqui
  if (!API_KEY || API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
    return getFallbackHours(nominatimPlace); // Fallback com dados reais
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(nominatimPlace.display_name)}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.results.length === 0) return getFallbackHours(nominatimPlace);

    const placeId = searchData.results[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    return detailsData.result.opening_hours || getFallbackHours(nominatimPlace);
  } catch (err) {
    console.error('Erro Google Places:', err);
    return getFallbackHours(nominatimPlace);
  }
}
