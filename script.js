let allData = [];
let currentPage = 1;
const itemsPerPage = 50;

async function fetchData() {
  const res = await fetch("data.json");
  const data = await res.json();
  allData = data;
  renderSidebar(data);
  renderPage();
}

function renderSidebar(data) {
  const sidebar = document.getElementById("sidebar");
  const categoryMap = {};

  data.forEach(item => {
    const parts = item.image.split('/');
    const cat = parts[1] || "未分类";
    const subcat = parts[2] || "默认";
    if (!categoryMap[cat]) categoryMap[cat] = new Set();
    categoryMap[cat].add(subcat);
  });

  sidebar.innerHTML = '';
  for (const [cat, subs] of Object.entries(categoryMap)) {
    const group = document.createElement("div");
    group.className = "category-group";

    const header = document.createElement("div");
    header.className = "category-header";
    header.textContent = cat;
    header.addEventListener("click", () => {
      list.classList.toggle("hidden");
    });

    const list = document.createElement("div");
    subs.forEach(sub => {
      const item = document.createElement("div");
      item.className = "subcategory";
      item.textContent = sub;
      item.addEventListener("click", () => {
        currentPage = 1;
        renderPage(item => item.image.includes(`${cat}/${sub}`));
      });
      list.appendChild(item);
    });

    group.appendChild(header);
    group.appendChild(list);
    sidebar.appendChild(group);
  }
}

function renderPage(filterFn = () => true) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const filtered = allData.filter(filterFn).filter(item =>
    item.prompt.toLowerCase().includes(document.getElementById("search").value.toLowerCase())
  );

  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  pageItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;

    const content = document.createElement("div");
    content.className = "card-content";

    const btn = document.createElement("button");
    btn.className = "expand-btn";
    btn.textContent = "展开查看";

    const prompt = document.createElement("div");
    prompt.className = "prompt hidden";
    prompt.textContent = item.prompt;

    btn.addEventListener("click", () => {
      prompt.classList.toggle("hidden");
    });

    content.appendChild(btn);
    content.appendChild(prompt);
    card.appendChild(img);
    card.appendChild(content);
    gallery.appendChild(card);
  });

  renderPagination(filtered.length);
}

function renderPagination(total) {
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";
  const totalPages = Math.ceil(total / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage();
    });
    pag.appendChild(btn);
  }
}

document.getElementById("search").addEventListener("input", () => {
  currentPage = 1;
  renderPage();
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

fetchData();
