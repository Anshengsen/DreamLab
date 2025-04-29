// 加载数据
async function loadCases() {
  const response = await fetch('data.json');
  const data = await response.json();

  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = item.image; // 这里的路径是webp格式！

    const content = document.createElement('div');
    content.className = 'card-content';

    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.textContent = '展开查看';

    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      if (expanded) {
        btn.textContent = item.prompt;
      } else {
        btn.textContent = '展开查看';
      }
    });

    content.appendChild(btn);
    card.appendChild(img);
    card.appendChild(content);
    gallery.appendChild(card);
  });
}

loadCases();

// 主题切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
