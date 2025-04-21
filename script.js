let data = [];
let currentCategory = "";

async function fetchData() {
  const res = await fetch("data.json");
  data = await res.json();
  renderCategories();
  renderGallery();
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
      document.querySelectorAll(".sidebar li").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      renderGallery();
    };
    list.appendChild(li);
  });
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  const filtered = currentCategory ? data.filter(d => d.category === currentCategory) : data;
  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "Preview";

    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.textContent = item.prompt;

    card.appendChild(img);
    card.appendChild(prompt);
    gallery.appendChild(card);
  });
}

fetchData();
