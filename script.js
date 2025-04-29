let data = [];

async function fetchData() {
    const response = await fetch('data.json');
    data = await response.json();
    renderCategories();
    renderGallery();
}

function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    const categories = [...new Set(data.map(item => item.category))];

    const ul = document.createElement('ul');

    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        li.onclick = () => filterByCategory(category);
        ul.appendChild(li);
    });

    categoryList.appendChild(ul);
}

function renderGallery(filteredData = null) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    (filteredData || data).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.prompt;

        const content = document.createElement('div');
        content.className = 'card-content';

        const promptText = document.createElement('div');
        promptText.className = 'hidden';
        promptText.textContent = item.prompt;

        const button = document.createElement('button');
        button.className = 'toggle-button';
        button.textContent = '展开查看';
        button.onclick = () => {
            promptText.classList.toggle('hidden');
            button.textContent = promptText.classList.contains('hidden') ? '展开查看' : '收起查看';
        };

        content.appendChild(button);
        content.appendChild(promptText);

        card.appendChild(img);
        card.appendChild(content);
        gallery.appendChild(card);
    });
}

function filterByCategory(category) {
    const filtered = data.filter(item => item.category === category);
    renderGallery(filtered);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = data.filter(item => item.prompt.toLowerCase().includes(keyword));
    renderGallery(filtered);
});

fetchData();
