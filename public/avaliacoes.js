// Busca as avaliações já salvas ou cria uma lista vazia se for a primeira vez
let registroAvaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];

// Função para salvar no "HD" do navegador
function salvarNoRegistro() {
    localStorage.setItem('avaliacoes', JSON.stringify(registroAvaliacoes));
}
function adicionarAvaliacao(nome, nota, comentario) {
    const novaAvaliacao = {
        id: Date.now(), // Gera um ID único baseado no tempo
        usuario: nome,
        estrelas: nota,
        texto: comentario,
        data: new Date().toLocaleDateString('pt-BR')
    };

    registroAvaliacoes.push(novaAvaliacao); // Adiciona na lista
    salvarNoRegistro(); // Grava no localStorage
    renderizarAvaliacoes(); // Atualiza a tela
}
function renderizarAvaliacoes() {
    const container = document.querySelector("#lista-avaliacoes");
    container.innerHTML = ""; // Limpa para não duplicar

    registroAvaliacoes.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <strong>${item.usuario}</strong> - <span>${"⭐".repeat(item.estrelas)}</span>
                <p>${item.texto}</p>
                <small>Postado em: ${item.data}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

// Executa ao carregar a página para mostrar o que já estava salvo
renderizarAvaliacoes();
