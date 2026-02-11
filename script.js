document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const main = document.querySelector('main');
  const toc = document.getElementById('toc');
  const searchInput = document.getElementById('search-input');
  const searchStatus = document.getElementById('search-status');
  const sidebar = document.getElementById('sidebar');
  const sidebarHeader = document.getElementById('sidebar-header');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const programCount = document.getElementById('program-count');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const uniqueIds = new Set();
  const isMobileViewport = () => window.innerWidth <= 980;
  let lastMenuTrigger = null;

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
    section.dataset.title = title.toLowerCase();

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
      copyBtn.title = `Copy code for ${title}`;
      copyBtn.setAttribute('aria-label', `Copy code for ${title}`);
      copyBtn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i> Copy';
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

        copyBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied';
        copyBtn.classList.add('copied');
        copyBtn.setAttribute('aria-label', `Copied code for ${title}`);
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i> Copy';
          copyBtn.classList.remove('copied');
          copyBtn.setAttribute('aria-label', `Copy code for ${title}`);
        }, 1200);
      });

      nextNode.appendChild(copyBtn);
      section.appendChild(nextNode);
      i += 1;
    }

    fragment.appendChild(section);

    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    tocLink.href = `#${id}`;
    tocLink.textContent = title;
    tocItem.appendChild(tocLink);
    toc.appendChild(tocItem);
    sections.push(section);
  }

  main.innerHTML = '';
  main.appendChild(fragment);
  programCount.textContent = String(sections.length);

  const links = Array.from(toc.querySelectorAll('a'));

  const syncThemeState = () => {
    const isDark = body.classList.contains('dark');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#111f35' : '#0f6ddf');
    }
  };

  const syncMenuState = () => {
    const mobile = isMobileViewport();
    const isOpen = mobile && body.classList.contains('menu-open');

    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    sidebarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    sidebarToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close topics list' : 'Open topics list');

    if (mobile) {
      sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    } else {
      sidebar.removeAttribute('aria-hidden');
      body.classList.remove('menu-open');
    }
  };

  const openMenu = (trigger = null) => {
    if (!isMobileViewport()) return;
    lastMenuTrigger = trigger;
    body.classList.add('menu-open');
    syncMenuState();
    searchInput.focus();
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    body.classList.remove('menu-open');
    syncMenuState();
    if (returnFocus && lastMenuTrigger) {
      lastMenuTrigger.focus();
    }
  };

  const toggleMenu = (trigger = null) => {
    if (!isMobileViewport()) return;
    if (body.classList.contains('menu-open')) {
      closeMenu();
      return;
    }
    openMenu(trigger);
  };

  const updateSearchStatus = (visibleCount, term) => {
    if (!searchStatus) return;
    const label = visibleCount === 1 ? 'program' : 'programs';
    if (term) {
      searchStatus.textContent = `${visibleCount} ${label} found for "${term}".`;
      return;
    }
    searchStatus.textContent = `${visibleCount} ${label} available.`;
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem('cpp-theme');
    } catch {
      return null;
    }
  };

  const setSavedTheme = (value) => {
    try {
      localStorage.setItem('cpp-theme', value);
    } catch {
      // Ignore storage write failures (private mode or disabled storage).
    }
  };

  sidebarToggle.addEventListener('click', () => toggleMenu(sidebarToggle));
  mobileMenuBtn.addEventListener('click', () => toggleMenu(mobileMenuBtn));
  overlay.addEventListener('click', () => closeMenu({ returnFocus: true }));

  sidebarHeader.addEventListener('click', (event) => {
    if (isMobileViewport() && event.target.closest('#sidebar-header h2')) {
      toggleMenu(sidebarToggle);
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobileViewport()) closeMenu();
    });
  });

  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach((section) => {
      const match = section.dataset.title.includes(term);
      section.hidden = !match;
      if (match) visibleCount += 1;
    });

    links.forEach((link) => {
      const match = link.textContent.toLowerCase().includes(term);
      link.parentElement.hidden = !match;
    });

    if (visibleCount === 0) {
      links.forEach((link) => link.classList.remove('active'));
    }

    updateSearchStatus(visibleCount, term);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.hidden) return;
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  const savedTheme = getSavedTheme();
  const preferredDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && preferredDarkTheme)) {
    body.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    setSavedTheme(body.classList.contains('dark') ? 'dark' : 'light');
    syncThemeState();
  });

  syncThemeState();
  syncMenuState();
  updateSearchStatus(sections.length, '');

  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
  }

  window.addEventListener('resize', syncMenuState);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu({ returnFocus: true });
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const main = document.querySelector('main');
  const toc = document.getElementById('toc');
  const searchInput = document.getElementById('search-input');
  const searchStatus = document.getElementById('search-status');
  const sidebar = document.getElementById('sidebar');
  const sidebarHeader = document.getElementById('sidebar-header');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const programCount = document.getElementById('program-count');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const uniqueIds = new Set();
  const isMobileViewport = () => window.innerWidth <= 980;
  let lastMenuTrigger = null;

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
    section.dataset.title = title.toLowerCase();

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
      copyBtn.title = `Copy code for ${title}`;
      copyBtn.setAttribute('aria-label', `Copy code for ${title}`);
      copyBtn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i> Copy';
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

        copyBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied';
        copyBtn.classList.add('copied');
        copyBtn.setAttribute('aria-label', `Copied code for ${title}`);
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i> Copy';
          copyBtn.classList.remove('copied');
          copyBtn.setAttribute('aria-label', `Copy code for ${title}`);
        }, 1200);
      });

      nextNode.appendChild(copyBtn);
      section.appendChild(nextNode);
      i += 1;
    }

    fragment.appendChild(section);

    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    tocLink.href = `#${id}`;
    tocLink.textContent = title;
    tocItem.appendChild(tocLink);
    toc.appendChild(tocItem);
    sections.push(section);
  }

  main.innerHTML = '';
  main.appendChild(fragment);
  programCount.textContent = String(sections.length);

  const links = Array.from(toc.querySelectorAll('a'));

  const syncThemeState = () => {
    const isDark = body.classList.contains('dark');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#111f35' : '#0f6ddf');
    }
  };

  const syncMenuState = () => {
    const mobile = isMobileViewport();
    const isOpen = mobile && body.classList.contains('menu-open');

    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    sidebarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    sidebarToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close topics list' : 'Open topics list');

    if (mobile) {
      sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    } else {
      sidebar.removeAttribute('aria-hidden');
      body.classList.remove('menu-open');
    }
  };

  const openMenu = (trigger = null) => {
    if (!isMobileViewport()) return;
    lastMenuTrigger = trigger;
    body.classList.add('menu-open');
    syncMenuState();
    searchInput.focus();
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    body.classList.remove('menu-open');
    syncMenuState();
    if (returnFocus && lastMenuTrigger) {
      lastMenuTrigger.focus();
    }
  };

  const toggleMenu = (trigger = null) => {
    if (!isMobileViewport()) return;
    if (body.classList.contains('menu-open')) {
      closeMenu();
      return;
    }
    openMenu(trigger);
  };

  const updateSearchStatus = (visibleCount, term) => {
    if (!searchStatus) return;
    const label = visibleCount === 1 ? 'program' : 'programs';
    if (term) {
      searchStatus.textContent = `${visibleCount} ${label} found for "${term}".`;
      return;
    }
    searchStatus.textContent = `${visibleCount} ${label} available.`;
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem('cpp-theme');
    } catch {
      return null;
    }
  };

  const setSavedTheme = (value) => {
    try {
      localStorage.setItem('cpp-theme', value);
    } catch {
      // Ignore storage write failures (private mode or disabled storage).
    }
  };

  sidebarToggle.addEventListener('click', () => toggleMenu(sidebarToggle));
  mobileMenuBtn.addEventListener('click', () => toggleMenu(mobileMenuBtn));
  overlay.addEventListener('click', () => closeMenu({ returnFocus: true }));

  sidebarHeader.addEventListener('click', (event) => {
    if (isMobileViewport() && event.target.closest('#sidebar-header h2')) {
      toggleMenu(sidebarToggle);
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobileViewport()) closeMenu();
    });
  });

  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach((section) => {
      const match = section.dataset.title.includes(term);
      section.hidden = !match;
      if (match) visibleCount += 1;
    });

    links.forEach((link) => {
      const match = link.textContent.toLowerCase().includes(term);
      link.parentElement.hidden = !match;
    });

    if (visibleCount === 0) {
      links.forEach((link) => link.classList.remove('active'));
    }

    updateSearchStatus(visibleCount, term);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.hidden) return;
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  const savedTheme = getSavedTheme();
  const preferredDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && preferredDarkTheme)) {
    body.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    setSavedTheme(body.classList.contains('dark') ? 'dark' : 'light');
    syncThemeState();
  });

  syncThemeState();
  syncMenuState();
  updateSearchStatus(sections.length, '');

  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
  }

  window.addEventListener('resize', syncMenuState);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu({ returnFocus: true });
    }
  });
});
