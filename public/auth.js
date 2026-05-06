
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

function aoLogarComGoogle(data) {
    // 1. Pega a URL da foto (ajustado para o padrão comum do Google/Firebase)
    const fotoUrl = data.picture;

    // 2. Seleciona o botão usando o ID que corrigimos no HTML
    const botao = document.getElementById('btn-login-google');

    localStorage.setItem('userPhoto', fotoUrl);
    
        window.location.href = "index.html";

    
    if (fotoUrl && botao) {
        // 3. Substitui o texto pela imagem com um estilo para não quebrar o design
        botao.innerHTML = `<img src="${fotoUrl}" alt="Perfil" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`;

        // 4. Remove estilos de botão para manter apenas a foto circular
       
        
    }
    
}

/// Garante que o DOM está carregado antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
    verificarLogin();
    inicializarGoogle();
    aoLogarComGoogle()

    // Seleciona o formulário ou botão de login
    
    // Event listener já adicionado no topo do arquivo
});

// Sua função de trocar o texto por imagem (se não estiver em outro lugar)



//console.log("Dados do usuário:", JSON.parse(localStorage.getItem('usuarioLogado')));