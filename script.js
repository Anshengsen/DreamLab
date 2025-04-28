let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 50;
let categories = new Set();

// 加载数据
async function fetchData() {
  const response = await fetch('data.json');
  allData = await response.json();
  allData.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  filteredData = allData;
  renderCategories();
  render();
}

function render() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);

  pageData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.image}" alt="案例图片">
      <div class="prompt-container">
        <span class="toggle-btn">展开提示词</span>
        <div class="prompt-text">${item.prompt}</div>
      </div>
    `;

    gallery.appendChild(card);
  });

  renderPagination();
  setupToggleButtons();
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('span');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      render();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(btn);
  }
}

function setupToggleButtons() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const prompt = btn.nextElementSibling;
      if (prompt.style.display === 'block') {
        prompt.style.display = 'none';
        btn.textContent = '展开提示词';
      } else {
        prompt.style.display = 'block';
        btn.textContent = '收起提示词';
      }
    };
  });
}

function renderCategories() {
  const list = document.getElementById('categoryList');
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.dataset.category = cat;
    li.onclick = handleCategoryClick;
    list.appendChild(li);
  });
}

function handleCategoryClick(e) {
  document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
  e.target.classList.add('active');

  const selected = e.target.dataset.category;
  if (selected === '全部') {
    filteredData = allData;
  } else {
    filteredData = allData.filter(item => item.category === selected);
  }
  currentPage = 1;
  render();
}

document.getElementById('searchInput').addEventListener('input', e => {
  const keyword = e.target.value.trim().toLowerCase();
  filteredData = allData.filter(item => item.prompt.toLowerCase().includes(keyword));
  currentPage = 1;
  render();
});

fetchData();
