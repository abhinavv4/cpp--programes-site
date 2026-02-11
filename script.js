document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const main = document.querySelector('main');
  const toc = document.getElementById('toc');
  const searchInput = document.getElementById('search-input');
  const sidebarHeader = document.getElementById('sidebar-header');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const programCount = document.getElementById('program-count');

  const uniqueIds = new Set();

  const slugify = (value) => {
    const base = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'program';

    if (!uniqueIds.has(base)) {
      uniqueIds.add(base);
      return base;
    }

    let i = 2;
    while (uniqueIds.has(`${base}-${i}`)) i += 1;
    const nextId = `${base}-${i}`;
    uniqueIds.add(nextId);
    return nextId;
  };

  const nodes = Array.from(main.children);
  const fragment = document.createDocumentFragment();
  const sections = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.tagName !== 'SPAN') continue;

    const heading = node.querySelector('h3');
    if (!heading) continue;

    const title = heading.textContent.replace(/:+$/g, '').trim();
    const id = slugify(title);

    const section = document.createElement('section');
    section.className = 'program-section';
    section.id = id;

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    const nextNode = nodes[i + 1];
    if (nextNode && nextNode.tagName === 'PRE') {
      const code = nextNode.querySelector('code');
      if (code) code.classList.add('language-cpp');

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.type = 'button';
      copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
      copyBtn.addEventListener('click', async () => {
        const text = code ? code.textContent : '';
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const helper = document.createElement('textarea');
          helper.value = text;
          document.body.appendChild(helper);
          helper.select();
          document.execCommand('copy');
          helper.remove();
        }

        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
          copyBtn.classList.remove('copied');
        }, 1200);
      });

      nextNode.appendChild(copyBtn);
      section.appendChild(nextNode);
      i += 1;
    }

    fragment.appendChild(section);

    const tocItem = document.createElement('li');
    tocItem.innerHTML = `<a href="#${id}">${title}</a>`;
    toc.appendChild(tocItem);
    sections.push(section);
  }

  main.innerHTML = '';
  main.appendChild(fragment);
  programCount.textContent = String(sections.length);

  const links = Array.from(toc.querySelectorAll('a'));
  const closeMenu = () => body.classList.remove('menu-open');
  const toggleMenu = () => body.classList.toggle('menu-open');

  sidebarToggle.addEventListener('click', toggleMenu);
  mobileMenuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  sidebarHeader.addEventListener('click', (event) => {
    if (window.innerWidth <= 980 && event.target.closest('#sidebar-header h2')) {
      toggleMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 980) closeMenu();
    });
  });

  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();

    sections.forEach((section) => {
      const match = section.querySelector('h3').textContent.toLowerCase().includes(term);
      section.style.display = match ? '' : 'none';
    });

    links.forEach((link) => {
      const match = link.textContent.toLowerCase().includes(term);
      link.parentElement.style.display = match ? '' : 'none';
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  const savedTheme = localStorage.getItem('cpp-theme');
  if (savedTheme === 'dark') body.classList.add('dark');

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('cpp-theme', body.classList.contains('dark') ? 'dark' : 'light');
  });

  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
});

