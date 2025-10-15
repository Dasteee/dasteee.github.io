// ===== GLOBAL VARIABLES =====
let currentTheme = 'dark';
let currentLanguage = 'lat';

// ===== LANGUAGE TRANSLATIONS =====
const translations = {
    cyr: {
        'nav.home': 'Почетна',
        'nav.projects': 'Пројекти',
        'nav.contact': 'Контакт',
        'hero.title': 'Добродошли на мој сајт',
        'hero.subtitle': 'Ученик који учи C, C++ и C# програмирање. Такође радим Lua за Roblox са групом од 450K чланова.',
        'stats.members': 'чланова',
        'stats.visits': 'посета',
        'cta.code': 'Погледај кодове',
        'cta.roblox': 'Roblox статистике',
        'projects.title': 'Пројекти',
        'projects.subtitle': 'Моји радови и активности',
        'projects.code.title': 'Кодови',
        'projects.code.description': 'Кодови из школа, домаћих задатака и личних пројеката. Организовани по језицима и темама.',
        'projects.roblox.title': 'Flisk Studios',
        'projects.roblox.description': 'Roblox група са 450K чланова и игра Streamer Life са 18.5M посета.',
        'projects.school.title': 'Школски радови',
        'projects.school.description': 'Задаци и пројекти из школе. C, C++ и C# програмирање.',
        'projects.personal.title': 'Лични пројекти',
        'projects.personal.description': 'Експерименти, тестови и лични пројекти.',
        'projects.status.active': 'активно',
        'projects.status.growing': 'расте',
        'projects.status.learning': 'учење',
        'projects.status.experimental': 'експериментално',
        'projects.view': 'Погледај',
        'footer.made': 'Направљено са',
        'footer.by': 'од стране dasteee',
        'nav.back': 'Назад',
        'kodovi.title': 'Кодови',
        'kodovi.subtitle': 'Кодови из школа, домаћих задатака и личних пројеката. Организовани по језицима и темама.',
        'kodovi.language': 'језик',
        'kodovi.explorer': 'File Explorer',
        'kodovi.explorer.subtitle': 'Изаберите фолдер или фајл да видите код',
        'kodovi.folders': 'Фолдери',
        'kodovi.welcome': 'Добродошли',
        'kodovi.welcome.title': 'Добродошли у File Explorer',
        'kodovi.welcome.text': 'Изаберите фајл из левог панела да видите код. Сви фајлови су организовани по фолдерима:',
        'kodovi.folder.domaci': 'Домаћи задаци',
        'kodovi.folder.roblox': 'Roblox Code',
        'kodovi.folder.skola': 'Школски радови',
        'kodovi.folder.personal': 'Лични пројекти',
        'projects.roblox.category': 'Roblox пројекти',
        'projects.code.category': 'Кодови и школа',
        'projects.realtime': 'Realtime статистике',
        'cta.viewProjects': 'Види пројекте'
    },
    lat: {
        'nav.home': 'Pocetna',
        'nav.projects': 'Projekti',
        'nav.contact': 'Kontakt',
        'hero.title': 'Dobrodosli na moj sajt',
        'hero.subtitle': 'Ucenik koji uci C, C++ i C# programiranje. Takodje radim Lua za Roblox sa grupom od 450K clanova.',
        'stats.members': 'clanova',
        'stats.visits': 'poseta',
        'cta.code': 'Pogledaj kodove',
        'cta.roblox': 'Roblox statistike',
        'projects.title': 'Projekti',
        'projects.subtitle': 'Moji radovi i aktivnosti',
        'projects.code.title': 'Kodovi',
        'projects.code.description': 'Kodovi iz skola, domacih zadataka i licnih projekata. Organizovani po jezicima i temama.',
        'projects.roblox.title': 'Flisk Studios',
        'projects.roblox.description': 'Roblox grupa sa 450K clanova i igra Streamer Life sa 18.5M poseta.',
        'projects.school.title': 'Skolski radovi',
        'projects.school.description': 'Zadaci i projekti iz skole. C, C++ i C# programiranje.',
        'projects.personal.title': 'Licni projekti',
        'projects.personal.description': 'Eksperimenti, testovi i licni projekti.',
        'projects.status.active': 'aktivno',
        'projects.status.growing': 'raste',
        'projects.status.learning': 'ucenje',
        'projects.status.experimental': 'eksperimentalno',
        'projects.view': 'Pogledaj',
        'footer.made': 'Napravljeno sa',
        'footer.by': 'od strane dasteee',
        'nav.back': 'Nazad',
        'kodovi.title': 'Kodovi',
        'kodovi.subtitle': 'Kodovi iz skola, domacih zadataka i licnih projekata. Organizovani po jezicima i temama.',
        'kodovi.language': 'jezik',
        'kodovi.explorer': 'File Explorer',
        'kodovi.explorer.subtitle': 'Izaberite folder ili fajl da vidite kod',
        'kodovi.folders': 'Folderi',
        'kodovi.welcome': 'Dobrodosli',
        'kodovi.welcome.title': 'Dobrodosli u File Explorer',
        'kodovi.welcome.text': 'Izaberite fajl iz levog panela da vidite kod. Svi fajlovi su organizovani po folderima:',
        'kodovi.folder.domaci': 'Domaci zadaci',
        'kodovi.folder.roblox': 'Roblox Code',
        'kodovi.folder.skola': 'Skolski radovi',
        'kodovi.folder.personal': 'Licni projekti',
        'projects.roblox.category': 'Roblox projekti',
        'projects.code.category': 'Kodovi i skola',
        'projects.realtime': 'Realtime statistike',
        'cta.viewProjects': 'Vidi projekte'
    },
    eng: {
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        'hero.title': 'Welcome to my website',
        'hero.subtitle': 'Student learning C, C++ and C# programming. Also working with Lua for Roblox with a group of 450K members.',
        'stats.members': 'members',
        'stats.visits': 'visits',
        'cta.code': 'View code',
        'cta.roblox': 'Roblox stats',
        'projects.title': 'Projects',
        'projects.subtitle': 'My work and activities',
        'projects.code.title': 'Code',
        'projects.code.description': 'Code from school, homework and personal projects. Organized by languages and topics.',
        'projects.roblox.title': 'Flisk Studios',
        'projects.roblox.description': 'Roblox group with 450K members and Streamer Life game with 18.5M visits.',
        'projects.school.title': 'School work',
        'projects.school.description': 'Tasks and projects from school. C, C++ and C# programming.',
        'projects.personal.title': 'Personal projects',
        'projects.personal.description': 'Experiments, tests and personal projects.',
        'projects.status.active': 'active',
        'projects.status.growing': 'growing',
        'projects.status.learning': 'learning',
        'projects.status.experimental': 'experimental',
        'projects.view': 'View',
        'footer.made': 'Made with',
        'footer.by': 'by dasteee',
        'nav.back': 'Back',
        'kodovi.title': 'Code',
        'kodovi.subtitle': 'Code from school, homework and personal projects. Organized by languages and topics.',
        'kodovi.language': 'language',
        'kodovi.explorer': 'File Explorer',
        'kodovi.explorer.subtitle': 'Select a folder or file to view code',
        'kodovi.folders': 'Folders',
        'kodovi.welcome': 'Welcome',
        'kodovi.welcome.title': 'Welcome to File Explorer',
        'kodovi.welcome.text': 'Select a file from the left panel to view code. All files are organized by folders:',
        'kodovi.folder.domaci': 'Homework',
        'kodovi.folder.roblox': 'Roblox Code',
        'kodovi.folder.skola': 'School work',
        'kodovi.folder.personal': 'Personal projects',
        'projects.roblox.category': 'Roblox Projects',
        'projects.code.category': 'Code & School',
        'projects.realtime': 'Realtime stats',
        'cta.viewProjects': 'View projects'
    }
};

// ===== DOM ELEMENTS =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const html = document.documentElement;

// ===== THEME TOGGLE FUNCTIONALITY =====
function initTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Add rotation animation to icon
    themeIcon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeIcon.style.transform = '';
    }, 300);
}

// ===== LANGUAGE SWITCHER FUNCTIONALITY =====
function initLanguage() {
    // Check for saved language preference or default to lat
    const savedLanguage = localStorage.getItem('language') || 'lat';
    setLanguage(savedLanguage);
}

function setLanguage(lang) {
    currentLanguage = lang;
    html.setAttribute('data-lang', lang);
    localStorage.setItem('language', lang);
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    updateTranslations();
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

function switchLanguage(lang) {
    setLanguage(lang);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== MATRIX BACKGROUND EFFECT =====
function createMatrixEffect() {
    const matrixBg = document.querySelector('.matrix-bg');
    if (!matrixBg) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '-100px';
        column.style.left = i * 20 + 'px';
        column.style.fontFamily = 'JetBrains Mono, monospace';
        column.style.fontSize = '14px';
        column.style.color = 'rgba(88, 166, 255, 0.1)';
        column.style.animation = `matrix-fall ${Math.random() * 3 + 2}s linear infinite`;
        column.style.animationDelay = Math.random() * 2 + 's';
        
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixBg.appendChild(column);
    }
}

// Add matrix animation keyframes
function addMatrixKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            0% {
                transform: translateY(-100vh);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== TERMINAL CURSOR MOVEMENT =====
function initTerminalCursor() {
    const cursor = document.querySelector('.terminal-cursor');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.1;
        cursorY += diffY * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.matrix-bg');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== TERMINAL COMMAND SIMULATION =====
function simulateTerminalCommands() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    // Add some random terminal commands periodically
    setInterval(() => {
        const commands = [
            'git status',
            'npm install',
            'python --version',
            'ls -la',
            'pwd',
            'echo "Hello World"',
            'node --version',
            'git log --oneline -5'
        ];
        
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        const currentTime = new Date().toLocaleTimeString();
        
        // Create new terminal line
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `
            <span class="prompt">$</span>
            <span class="command">${randomCommand}</span>
        `;
        
        // Add output
        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.innerHTML = `<span class="output-text">[${currentTime}] Command executed</span>`;
        
        terminalBody.appendChild(newLine);
        terminalBody.appendChild(output);
        
        // Keep only last 10 lines to prevent overflow
        const lines = terminalBody.querySelectorAll('.terminal-line, .terminal-output');
        if (lines.length > 10) {
            lines[0].remove();
            lines[1].remove();
        }
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
    }, 10000); // Every 10 seconds
}

// ===== PROJECT CARD INTERACTIONS =====
function initProjectCardInteractions() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 0 30px rgba(88, 166, 255, 0.3)';
            
            // Animate tech tags
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.1)';
                    tag.style.background = 'var(--accent-primary)';
                    tag.style.color = 'white';
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove glow effect
            card.style.boxShadow = '';
            
            // Reset tech tags
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'scale(1)';
                tag.style.background = 'var(--bg-tertiary)';
                tag.style.color = 'var(--text-secondary)';
            });
        });
        
        // Add click effect
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                const link = card.querySelector('.card-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Escape to reset terminal
        if (e.key === 'Escape') {
            const terminalBody = document.querySelector('.terminal-body');
            if (terminalBody) {
                terminalBody.innerHTML = `
                    <div class="terminal-line">
                        <span class="prompt">$</span>
                        <span class="command">clear</span>
                    </div>
                    <div class="terminal-line">
                        <span class="prompt">$</span>
                        <span class="cursor-blink">_</span>
                    </div>
                `;
            }
        }
        
        // Ctrl/Cmd + L to clear terminal
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const terminalBody = document.querySelector('.terminal-body');
            if (terminalBody) {
                terminalBody.innerHTML = `
                    <div class="terminal-line">
                        <span class="prompt">$</span>
                        <span class="cursor-blink">_</span>
                    </div>
                `;
            }
        }
    });
}

// ===== PERFORMANCE MONITOR =====
function initPerformanceMonitor() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`🚀 Page loaded in ${loadTime}ms`);
                console.log(`🎨 Theme: ${currentTheme}`);
                console.log(`💻 User Agent: ${navigator.userAgent}`);
            }, 1000);
        });
    }
}

// ===== RESPONSIVE HANDLING =====
function initResponsiveHandling() {
    function handleResize() {
        // Update matrix columns on resize
        const matrixBg = document.querySelector('.matrix-bg');
        if (matrixBg && window.innerWidth > 768) {
            const columns = Math.floor(window.innerWidth / 20);
            const currentColumns = matrixBg.children.length;
            
            if (columns !== currentColumns) {
                matrixBg.innerHTML = '';
                createMatrixEffect();
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Number keys for language switching
        if (e.key === '1') {
            e.preventDefault();
            switchLanguage('cyr');
        } else if (e.key === '2') {
            e.preventDefault();
            switchLanguage('lat');
        } else if (e.key === '3') {
            e.preventDefault();
            switchLanguage('eng');
        }
    });
}

// ===== INITIALIZATION =====
function init() {
    console.log('🚀 Initializing dasteee.github.io...');
    
    // Core functionality
    initTheme();
    initLanguage();
    initScrollAnimations();
    initSmoothScrolling();
    initKeyboardShortcuts();
    initRealtimeCounter();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    console.log('✅ Initialization complete!');
    console.log('💡 Try Ctrl/Cmd + K to toggle theme');
    console.log('💡 Try 1/2/3 to switch languages');
}

// ===== REALTIME COUNTER =====
function initRealtimeCounter() {
    const memberCountElement = document.getElementById('memberCount');
    const visitCountElement = document.getElementById('visitCount');
    
    if (!memberCountElement || !visitCountElement) return;
    
    // Helper: fetch with timeout and no-store cache
    async function fetchJson(url) {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 8000);
        try {
            const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } finally {
            clearTimeout(to);
        }
    }
    
    // Initialize to 0 for nice count-up effect
    memberCountElement.textContent = formatNumber(0);
    visitCountElement.textContent = formatNumber(0);
    const likeElInit = document.getElementById('likeCount');
    const favoriteElInit = document.getElementById('favoriteCount');
    if (likeElInit) likeElInit.textContent = formatNumber(0);
    if (favoriteElInit) favoriteElInit.textContent = formatNumber(0);

    // Animation helper
    function animateCount(el, to, duration = 1200) {
        const from = 0;
        const start = performance.now();
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            const val = Math.round(from + (to - from) * eased);
            el.textContent = formatNumber(val);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    let didInitialAnimate = false;

    function setNumber(el, value) {
        if (!el) return;
        if (!didInitialAnimate) {
            animateCount(el, value);
        } else {
            el.textContent = formatNumber(value);
        }
    }

    async function updateCounters() {
        try {
            // Group members via RoProxy
            const group = await fetchJson('https://groups.roproxy.com/v1/groups/16201023');
            const members = group && typeof group.memberCount === 'number' ? group.memberCount : null;
            if (members != null) {
                setNumber(memberCountElement, members);
            }
            
            // Visits: place -> universe -> game stats via RoProxy
            const uni = await fetchJson('https://apis.roproxy.com/universes/v1/places/12218138312/universe');
            const universeId = uni && uni.universeId ? uni.universeId : null;
            if (universeId) {
                const games = await fetchJson(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
                const game = games && Array.isArray(games.data) ? games.data[0] : null;
                const visits = game && typeof game.visits === 'number' ? game.visits : null;
                if (visits != null) {
                    setNumber(visitCountElement, visits);
                }

                // Favorites (field name varies: favorites or favoritedCount)
                const favoriteEl = document.getElementById('favoriteCount');
                if (favoriteEl && game) {
                    const favs = typeof game.favorites === 'number' ? game.favorites
                              : typeof game.favoritedCount === 'number' ? game.favoritedCount
                              : null;
                    if (favs != null) setNumber(favoriteEl, favs);
                }

                // Likes via votes endpoint
                const likeEl = document.getElementById('likeCount');
                if (likeEl) {
                    try {
                        const votes = await fetchJson(`https://games.roproxy.com/v1/games/votes?universeIds=${universeId}`);
                        const v = votes && Array.isArray(votes.data) ? votes.data[0] : null;
                        const up = v && typeof v.upVotes === 'number' ? v.upVotes : null;
                        if (up != null) {
                            setNumber(likeEl, up);
                        } else {
                            // hide likes if not available
                            const likeWrap = likeEl.closest('.mini-stat');
                            if (likeWrap) likeWrap.style.display = 'none';
                        }
                    } catch (e) {
                        // hide likes on errors (e.g., 403)
                        const likeWrap = likeEl.closest('.mini-stat');
                        if (likeWrap) likeWrap.style.display = 'none';
                    }
                }
            }
            
            // Subtle animation on update
            memberCountElement.style.transform = 'scale(1.05)';
            visitCountElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                memberCountElement.style.transform = 'scale(1)';
                visitCountElement.style.transform = 'scale(1)';
            }, 200);

            // First successful update done
            didInitialAnimate = true;
        } catch (e) {
            console.warn('Roblox realtime counters unavailable:', e);
        }
    }
    
    // Load logos via RoProxy thumbnails API
    async function updateLogos() {
        try {
            const groupLogoEl = document.getElementById('groupLogo');
            const gameLogoEl = document.getElementById('gameLogo');
            
            if (groupLogoEl) {
                const thumbs = await fetchJson('https://thumbnails.roproxy.com/v1/groups/icons?groupIds=16201023&size=150x150&format=Png&isCircular=true');
                const url = thumbs && thumbs.data && thumbs.data[0] ? thumbs.data[0].imageUrl : null;
                if (url) groupLogoEl.src = url;
            }
            
            if (gameLogoEl) {
                const thumbs = await fetchJson('https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=12218138312&size=150x150&format=Png&isCircular=true');
                const url = thumbs && thumbs.data && thumbs.data[0] ? thumbs.data[0].imageUrl : null;
                if (url) gameLogoEl.src = url;
            }
        } catch (e) {
            console.warn('Roblox thumbnails unavailable:', e);
        }
    }

    // Start only when projects section enters view
    function startCounters() {
        // Avoid duplicate starts
        if (startCounters.started) return;
        startCounters.started = true;
        updateLogos();
        updateCounters();
        setInterval(updateCounters, 60000);
    }
    const target = document.querySelector('#projects');
    if ('IntersectionObserver' in window && target) {
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                startCounters();
                io.disconnect();
            }
        }, { threshold: 0.2 });
        io.observe(target);
    } else {
        // Fallback: start immediately
        startCounters();
    }
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', init);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('❌ Error:', e.error);
});

// ===== SERVICE WORKER (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 SW registered:', registration);
            })
            .catch(registrationError => {
                console.log('🔧 SW registration failed:', registrationError);
            });
    });
}
