let allData = [];
let currentPage = 1;
const itemsPerPage = 50;
let currentFilter = () => false; // 默认不展示任何内容
let currentSearch = "";

async function fetchData() {
  const res = await fetch("data.json");
  allData = await res.json();
  renderSidebar();
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  const categoryMap = {};

  allData.forEach(item => {
    const parts = item.image.split('/');
    const cat = parts[1] || "未分类";
    const subcat = parts[2] || "默认";
    if (!categoryMap[cat]) categoryMap[cat] = new Set();
    categoryMap[cat].add(subcat);
  });

  sidebar.innerHTML = '';
  for (const [cat, subcats] of Object.entries(categoryMap)) {
    const header = document.createElement("div");
    header.className = "category-header";
    header.textContent = cat;
    header.addEventListener("click", () => {
      list.classList.toggle("show");
    });

    const list = document.createElement("div");
    list.className = "subcategory-list";

    subcats.forEach(sub => {
      const subItem = document.createElement("div");
      subItem.className = "subcategory";
      subItem.textContent = sub;
      subItem.addEventListener("click", () => {
        currentFilter = item => item.image.includes(`${cat}/${sub}`);
        currentPage = 1;
        renderGallery();
      });
      list.appendChild(subItem);
    });

    sidebar.appendChild(header);
    sidebar.appendChild(list);
  }
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  const pagination = document.getElementById("pagination");
  gallery.innerHTML = "";
  pagination.innerHTML = "";

  const filtered = allData.filter(currentFilter).filter(item =>
    item.prompt.toLowerCase().includes(currentSearch.toLowerCase())
  );

  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  pageItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = '图片加载失败';

    const content = document.createElement("div");
    content.className = "card-content";

    const button = document.createElement("button");
    button.className = "expand-btn";
    button.textContent = "展开查看";

    const prompt = document.createElement("div");
    prompt.className = "prompt hidden";
    prompt.textContent = item.prompt;

    button.addEventListener("click", () => {
      prompt.classList.toggle("hidden");
    });

    content.appendChild(button);
    content.appendChild(prompt);
    card.appendChild(img);
    card.appendChild(content);
    gallery.appendChild(card);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGallery();
    });
    pagination.appendChild(btn);
  }
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("search")?.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  currentPage = 1;
  renderGallery();
});

fetchData();
