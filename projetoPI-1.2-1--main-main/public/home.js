// /public/home.js

// 1. Pega os dados da API (chama o backend)
async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:3000/api/locations');
        if (!response.ok) {
            throw new Error('Falha ao buscar locais');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return []; 
    }
}

// 2. Cria o HTML para um único local (layout da sua imagem)
function createLocationCard(location) {
    let category = "Geral";
    if (location.tags?.vibe?.length > 0) {
        category = location.tags.vibe[0].replace('_', ' ');
    } else if (location.tags?.occasion?.length > 0) {
        category = location.tags.occasion[0].replace('_', ' ');
    }
    // CORREÇÃO: Use o caminho diretamente, sem Jinja
    const imageSrc = location.tags.image_path || '/data/img/default.png';

    return `
        <div class="location-card">
            <img src="${imageSrc}" alt="Imagem do Local"  class="location-avatar" onerror="this.src='/data/img/default.png'">
            <div class="location-card-main">
                <div class="location-info">
                    <h3>${location.name}</h3>
                    <p>${category}</p>
                </div>
                <div class="location-actions">
                    <button class="btn-action">⭐ Favoritos</button>
                  <a href= "avaliacoes.html" class="location-actions "> <button  class="btn-action">📊 Avaliações</button> </a> 

                   <a href="comentarios.html"class="location-actions"> <button class="btn-action">💬 Comentários</button> </a>

                    <button class="btn-action">💬 Comentários</button>

                    <button class="btn-action" data-location-id="${location.id}">📍 Localização</button>
                </div>
            </div>
        </div>
    `;
}

// 3. Renderiza todos os locais na página
async function renderLocations() {
    const container = document.getElementById('locations-list-container');
    if (!container) return;
    
    container.innerHTML = "<p>Carregando locais...</p>";
    
    const locations = await fetchLocations();
    
    if (locations.length === 0) {
        container.innerHTML = "<p>Nenhum local cadastrado no banco de dados.</p>";
        return;
    }
    
    // Preenche a div com os cards
    container.innerHTML = locations.map(createLocationCard).join('');
    
    // Adiciona listeners para os botões de localização
    document.querySelectorAll('[data-location-id]').forEach(button => {
        button.addEventListener('click', (e) => {
            const locationId = e.target.dataset.locationId;
            // Redireciona para a página do mapa com o ID como parâmetro
            window.location.href = `/localizacao.html?id=${locationId}`;
        });
    });
    // No final do createLocationCard ou render
        document.querySelectorAll('[data-location-id]').forEach(btn => {
            btn.addEventListener('click', () => {
            const id = btn.dataset.locationId;
            window.location.href = `/localizacao.html?id=${id}`;
        });
    });
}

// 4. Inicia o processo quando a página carregar

document.addEventListener('DOMContentLoaded', renderLocations);

let restauranteAtivo = "";

function abrirPainelComentarios(nome) {
    restauranteAtivo = nome;
    document.getElementById('nomeEstabelecimento').innerText = nome;
    document.getElementById('painelComentarios').style.display = "block";
    renderizarComentarios();
}

function fecharPainel() {
    document.getElementById('painelComentarios').style.display = "none";
}

function enviarComentario() {
    const campo = document.getElementById('textoNovoComentario');
    const texto = campo.value.trim();

    if (texto !== "") {
        // Busca comentários antigos no localStorage ou cria lista nova
        let bancoDados = JSON.parse(localStorage.getItem('comentarios_bgt')) || {};
        
        if (!bancoDados[restauranteAtivo]) bancoDados[restauranteAtivo] = [];
        
        bancoDados[restauranteAtivo].push({
            texto: texto,
            data: new Date().toLocaleDateString()
        });

        localStorage.setItem('comentarios_bgt', JSON.stringify(bancoDados));
        campo.value = ""; // Limpa o campo
        renderizarComentarios();
    }
}

function renderizarComentarios() {
    const lista = document.getElementById('listaComentarios');
    let bancoDados = JSON.parse(localStorage.getItem('comentarios_bgt')) || {};
    const comentarios = bancoDados[restauranteAtivo] || [];

    lista.innerHTML = comentarios.map(c => `
        <div class="comentario-card">
            <small style="color: #a0a0c0;">${c.data}</small>
            <p style="margin-top: 5px;">${c.texto}</p>
        </div>
    `).reverse().join('') || "<p>Ainda não há comentários. Seja o primeiro!</p>";
}

document.addEventListener('DOMContentLoaded', renderLocations);

