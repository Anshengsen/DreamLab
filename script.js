async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();
  const gallery = document.getElementById('gallery');
  const categories = document.getElementById('categories');

  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  for (const cat in grouped) {
    const li = document.createElement('li');
    li.textContent = cat;
    li.style.cursor = 'pointer';
    li.onclick = () => {
      gallery.innerHTML = '';
      grouped[cat].forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
          <img src="\${item.image}" alt="Image" />
          <div class="prompt">\${item.prompt}</div>
        \`;
        gallery.appendChild(card);
      });
    };
    categories.appendChild(li);
  }
}
loadData();
