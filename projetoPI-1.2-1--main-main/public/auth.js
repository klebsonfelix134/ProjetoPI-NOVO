
// 1. EVENTO DE LOGIN NO FORMULÁRIO
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Falha no login');

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/'; 
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

// 2. FUNÇÕES AUXILIARES (DECODIFICAR TOKEN E VERIFICAR LOGIN)
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const container = document.getElementById('auth-container');
    if (usuario && usuario.logado && container) {
        container.innerHTML = `
            <div class="perfil-usuario" style="display:flex; align-items:center; gap:10px;">
                <img src="${usuario.foto}" style="width:35px; border-radius:50%; border:2px solid #6c5ce7;">
                <span style="color:white;">Olá, ${usuario.nome.split(' ')[0]}</span>
                <button onclick="logout()" style="background:none; border:none; color:#ff4757; cursor:pointer;">Sair</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload();
}
// Essa parte é minha do login google

// plantando o terreno colocando o  criando função colocando o meu client id e jogando os dados para handelcredentialresponse
function inicializarGoogle() {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "486274428059-fgv4l6589329ho76e0i3r5r94cdc73gb.apps.googleusercontent.com", 
            callback: handleCredentialResponse
        });
//criando a funcionalidade do botão  e ação dele que no caso é abrir aquele prompt do google para login com facil acesso
        const buttonDiv = document.getElementById("buttonDiv");
        if (buttonDiv) {
            google.accounts.id.renderButton(buttonDiv, { 
                theme: "filled_blue", 
                size: "large", 
                width: "100%", 
                text: "continue_with"
            });
        }
        google.accounts.id.prompt(); 
    } else {
        setTimeout(inicializarGoogle, 100);
    }
}
//essa função ela recebe os dados  e faz a estrutura e salva no json os dados cadastrados e depois de cadastrado volta para pagina  princiapl
function handleCredentialResponse(response) {
    const data = parseJwt(response.credential); 
    localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: data.name,
        foto: data.picture,
        email: data.email,
        logado: true,
        precisaSenha: true 
    }));
    window.location.href = "index.html";
}
//Ainda está incompleto so na terça-feira

function aoLogarComGoogle(user) {
    // 1. Pegue a URL da foto do perfil que o Google fornece
    const fotoUrl = user.photoURL; // No Firebase é photoURL, em outros pode ser .picture

    // 2. Selecione o botão no HTML
    const botao = document.getElementById('btn-login-google');

    // 3. Substitua o texto "Entrar" por uma tag de imagem
    if (fotoUrl) {
        botao.innerHTML = `<img src="${fotoUrl}" alt="Perfil" id="user-photo">`;
        
        // Opcional: Remover estilos de botão e deixar apenas a foto circular
        botao.style.background = 'none';
        botao.style.border = 'none';
        botao.style.padding = '0';
    }
}

/// Garante que o DOM está carregado antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
    verificarLogin();
    inicializarGoogle();

    // Seleciona o formulário ou botão de login
    const loginForm = document.querySelector('#login-form'); // Ajuste o ID conforme seu HTML
    const errorMessage = document.querySelector('#error-message'); // Ajuste o ID conforme seu HTML

    // Event listener já adicionado no topo do arquivo
});

// Sua função de trocar o texto por imagem (se não estiver em outro lugar)
function atualizarInterfaceUsuario(fotoUrl) {
    const botao = document.querySelector('#botao-entrar'); // Ajuste o ID
    if (fotoUrl && botao) {
        botao.innerHTML = `<img src="${fotoUrl}" alt="Perfil" id="user-photo" style="width:40px; border-radius:50%;">`;
        botao.style.background = 'none';
        botao.style.border = 'none';
        botao.style.padding = '0';
    }
}