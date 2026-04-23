function renderizarComentarios() {
    const lista = document.getElementById('listaComentarios');
    const idAtual = document.getElementById('restauranteId').value;
    
    const filtrados = db_comentarios.filter(c => c.restauranteId === idAtual);

    if (filtrados.length === 0) {
        lista.innerHTML = '<p style="color:#6272a4; text-align:center;">Nenhum comentário ainda.</p>';
        return;
    }

    lista.innerHTML = filtrados.map(c => `
        <div class="item-comentario">
            <div class="avatar-fake" style="background:#44475a; width:30px; height:30px; font-size:12px;">G</div>
            <div class="comentario-corpo">
                <strong>Visitante</strong>
                <p>${c.texto}</p>
                <span class="comentario-meta">${c.data}</span>
            </div>
        </div>
    `).join('');
}