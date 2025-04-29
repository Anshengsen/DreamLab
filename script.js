let currentPage = 1;
const itemsPerPage = 50;
let fullData = [];

async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();
  fullData = data;
  return data;
}

function renderSidebar(data) {
  const sidebar = document.getElementById("sidebar");
  const categories = {};

  data.forEach(item => {
    const parts = item.image.split("/");
    if (parts.length < 3) return;

    const category = parts[1];
    const subcategory = parts[2];

    if (!categories[category]) categories[category] = new Set();
    categories[category].add(subcategory);
  });

  for (const [category, subcategories] of Object.entries(categories)) {
    const header = document.createElement("div");
    header.className = "category-header";
    header.textContent = category;

    const list = document.createElement("div");
    list.className = "subcategory-list";

    subcategories.forEach(sub => {
      const item = document.createElement("div");
      item.className = "subcategory";
      item.textContent = sub;
      item.onclick = () => {
        currentPage = 1;
        const filtered = fullData.filter(d => d.image.includes(`${category}/${sub}`));
        renderMain(filtered);
      };
      list.appendChild(item);
    });

    header.addEventListener("click", () => {
      list.classList.toggle("show");
    });

    sidebar.appendChild(header);
    sidebar.appendChild(list);
  }
}

function renderMain(data) {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;

    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.textContent = item.prompt;

    const expandButton = document.createElement("button");
    expandButton.className = "expand-button";
    expandButton.textContent = "展开查看";
    expandButton.onclick = () => {
      prompt.style.display = prompt.style.display === "none" ? "block" : "none";
    };

    card.appendChild(img);
    card.appendChild(expandButton);
    card.appendChild(prompt);
    main.appendChild(card);
  });

  renderPagination(data);
}

function renderPagination(data) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(data.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === currentPage) {
      button.style.fontWeight = "bold";
    }
    button.onclick = () => {
      currentPage = i;
      renderMain(data);
    };
    pagination.appendChild(button);
  }
}

function setupSearch(data) {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const results = data.filter(item => item.prompt.toLowerCase().includes(keyword));
    currentPage = 1;
    renderMain(results);
  });
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

(async function init() {
  const data = await loadData();
  renderSidebar(data);
  renderMain(data);
  setupSearch(data);
  setupThemeToggle();
})();
