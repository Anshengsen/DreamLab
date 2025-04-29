async function loadCases() {
  const response = await fetch('data.json');
  const data = await response.json();

  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  // 分类分组
  const categories = {};
  data.forEach(item => {
    const parts = item.image.split('/');
    const category = parts.length > 1 ? parts[1] : '默认分类';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });

  // 生成分类栏
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  Object.entries(categories).forEach(([category, items]) => {
    const group = document.createElement('div');
    group.className = 'category-group';

    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = category;

    const list = document.createElement('div');
    list.className = 'category-list';

    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'category-item';
      itemEl.textContent = item.prompt.slice(0, 20) || '无标题';
      itemEl.title = item.prompt;

      itemEl.addEventListener('click', () => {
        gallery.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = item.image;

        const content = document.createElement('div');
        content.className = 'card-content';

        const btn = document.createElement('button');
        btn.className = 'expand-btn';
        btn.textContent = '展开查看';

        let expanded = false;
        btn.addEventListener('click', () => {
          expanded = !expanded;
          btn.textContent = expanded ? item.prompt : '展开查看';
        });

        content.appendChild(btn);
        card.appendChild(img);
        card.appendChild(content);
        gallery.appendChild(card);
      });

      list.appendChild(itemEl);
    });

    header.addEventListener('click', () => {
      list.classList.toggle('show');
    });

    group.appendChild(header);
    group.appendChild(list);
    sidebar.appendChild(group);
  });

  // 默认加载全部
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = item.image;

    const content = document.createElement('div');
    content.className = 'card-content';

    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.textContent = '展开查看';

    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      btn.textContent = expanded ? item.prompt : '展开查看';
    });

    content.appendChild(btn);
    card.appendChild(img);
    card.appendChild(content);
    gallery.appendChild(card);
  });
}
