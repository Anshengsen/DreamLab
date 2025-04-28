let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 50;

// 加载数据
async function fetchData() {
  const response = await fetch('data.json');
  allData = await response.json();
  filteredData = allData;
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

document.getElementById('searchInput').addEventListener('input', e => {
  const keyword = e.target.value.trim().toLowerCase();
  filteredData = allData.filter(item => item.prompt.toLowerCase().includes(keyword));
  currentPage = 1;
  render();
});

fetchData();
