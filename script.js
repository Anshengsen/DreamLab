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

    const toggle = document.createElement("div");
    toggle.className = "toggle-btn";
    toggle.textContent = "展开提示词";
    toggle.onclick = () => {
      prompt.classList.toggle("expanded");
      toggle.textContent = prompt.classList.contains("expanded") ? "收起提示词" : "展开提示词";
    };

    card.appendChild(img);
    card.appendChild(prompt);
    card.appendChild(toggle);
    gallery.appendChild(card);
  });
}
