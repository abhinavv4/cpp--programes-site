    document.addEventListener('DOMContentLoaded', () => {
        const main = document.querySelector('main');
        const toc = document.getElementById('toc');
        const children = Array.from(main.children);
        const newContent = document.createDocumentFragment();

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName === 'SPAN') {
                const h3 = child.querySelector('h3');
                if (h3) {
                    // Create Section
                    const section = document.createElement('div');
                    section.className = 'program-section';
                    
                    // Process Title & ID
                    const rawTitle = h3.innerText.replace(/:/g, '').trim();
                    const id = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    section.id = id;
                    
                    // Add to TOC
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="#${id}">${rawTitle}</a>`;
                    toc.appendChild(li);

                    // Create Header for Section
                    const headerDiv = document.createElement('h3');
                    headerDiv.innerText = rawTitle;
                    
                    // Check for Code Block
                    if (children[i+1] && children[i+1].tagName === 'PRE') {
                        const pre = children[i+1];
                        pre.querySelector('code').classList.add('language-cpp');
                        
                        // Copy Button
                        const btn = document.createElement('button');
                        btn.className = 'copy-btn';
                        btn.innerHTML = '<i class="far fa-copy"></i> Copy';
                        btn.onclick = () => {
                            const code = pre.querySelector('code').innerText;
                            navigator.clipboard.writeText(code);
                            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            btn.classList.add('copied');
                            setTimeout(() => { btn.innerHTML = '<i class="far fa-copy"></i> Copy'; btn.classList.remove('copied'); }, 2000);
                        };
                        
                        // Append button to pre
                        pre.appendChild(btn);
                        
                        section.appendChild(headerDiv);
                        section.appendChild(pre);
                        i++; // Skip pre
                    } else {
                        section.appendChild(headerDiv);
                    }
                    newContent.appendChild(section);
                }
            }
        }
        
        main.innerHTML = '';
        main.appendChild(newContent);

        // Mobile Toggle
        document.getElementById('sidebar-header').addEventListener('click', () => {
            if(window.innerWidth <= 900) {
                toc.classList.toggle('show');
            }
        });

        // Search Filter
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = toc.querySelectorAll('li');
            
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(term) ? 'block' : 'none';
            });
        });

        // Initialize Syntax Highlighting
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    });
