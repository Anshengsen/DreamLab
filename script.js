let data = [];
let filteredData = [];
let currentCategory = "";
let currentPage = 1;
const itemsPerPage = 50;

async function fetchData() {
  const res = await fetch("data.json");
  data = await res.json();
  filteredData = data;
  renderCategories();
  renderGallery();
  renderPagination();
}

function renderCategories() {
  const categories = [...new Set(data.map(item => item.category))];
  const list = document.getElementById("category-list");
  list.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.onclick = () => {
      currentCategory = cat;
      currentPage = 1;
      document.querySelectorAll(".sidebar li").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      filterData();
    };
    list.appendChild(li);
  });
}

function filterData() {
  filteredData = data.filter(item => {
    return (!currentCategory || item.category === currentCategory);
  });
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  if (keyword) {
    filteredData = filteredData.filter(item => item.prompt.toLowerCase().includes(keyword));
  }
  currentPage = 1;
  renderGallery();
  renderPagination();
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredData.slice(start, end);

  pageItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "Preview";

    img.onload = () => {
      img.classList.add("loaded");
    };

    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.textContent = item.prompt;

    const expandBtn = document.createElement("button");
    expandBtn.className = "expand-btn";
    expandBtn.textContent = "展开/收起提示词";
    expandBtn.onclick = () => {
      prompt.classList.toggle("expanded");
    };

    card.appendChild(img);
    card.appendChild(expandBtn);
    card.appendChild(prompt);
    gallery.appendChild(card);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.onclick = () => {
      currentPage = i;
      renderGallery();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

document.getElementById("search-input").addEventListener("input", filterData);

fetchData();
