// Função para buscar repositórios no GitHub
async function searchRepositories(query) {
    const endpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Erro ao buscar repositórios');
        }
        const data = await response.json();
        return data.items; // Retorna a lista de repositórios
    } catch (error) {
        console.error(error);
        alert('Não foi possível realizar a busca. Tente novamente.');
        return [];
    }
}

// Função para renderizar os resultados da pesquisa
function renderResults(repositories) {
    const resultsList = document.getElementById('results-list');
    const resultsSection = document.getElementById('results-section');
    
    resultsList.innerHTML = ''; // Limpa resultados antigos
    
    if (repositories.length === 0) {
        resultsList.innerHTML = '<li>Nenhum repositório encontrado.</li>';
        resultsSection.style.display = 'block'; // Exibe a seção mesmo se não houver resultados
        return;
    }

    repositories.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || 'Sem descrição'}</p>
            <button class="view-details" data-repo='${JSON.stringify(repo)}'>Ver Detalhes</button>
        `;
        resultsList.appendChild(listItem);
    });
    
    resultsSection.style.display = 'block'; // Exibe a seção de resultados
}

// Função para mostrar o modal com detalhes do repositório
function showModal(repo) {
    const modal = document.getElementById('repo-details-modal');
    document.getElementById('repo-name').innerText = repo.name;
    document.getElementById('repo-description').innerText = repo.description || 'Sem descrição';
    document.getElementById('repo-url').href = repo.html_url;

    modal.style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('repo-details-modal').style.display = 'none';
}

// Manipulador de evento para o formulário de busca
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        const repositories = await searchRepositories(query);
        renderResults(repositories);
    }
});

// Manipulador de evento para o botão de fechamento do modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Manipulador de evento para os botões de ver detalhes
document.getElementById('results-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('view-details')) {
        const repo = JSON.parse(event.target.dataset.repo);
        showModal(repo);
    }
});
