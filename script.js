let currentTheme = 'dark';
let currentLanguage = 'eng';

const translations = {
    lat: {
        'nav.home': 'Početna',
        'nav.projects': 'Projekti',
        'nav.about': 'O meni',
        'hero.title': 'Dobrodošli na moj sajt',
        'hero.subtitle': 'Software Developer fokusiran na game development i skripting. Iskusan u Lua programskom jeziku, trenutno aktivno proširujem znanje u C, C++, C# i Unreal Engine-u.',
        'stats.members': 'članova',
        'stats.visits': 'poseta',
        'cta.code': 'Pogledaj kodove',
        'cta.roblox': 'Roblox statistike',
        'projects.title': 'Projekti',
        'projects.subtitle': 'Moji radovi i aktivnosti',
        'projects.code.title': 'Kodovi',
        'projects.code.description': 'Kodovi iz škola, domaćih zadataka i ličnih projekata. Organizovani po jezicima i temama.',
        'projects.roblox.title': 'Flisk Studios',
        'projects.roblox.description': 'Roblox grupa sa 450K članova i igra Streamer Life sa 18.5M poseta.',
        'projects.school.title': 'Školski radovi',
        'projects.school.description': 'Zadaci i projekti iz škole. C, C++ i C# programiranje.',
        'projects.personal.title': 'Lični projekti',
        'projects.personal.description': 'Eksperimenti, testovi i lični projekti.',
        'projects.status.active': 'aktivno',
        'projects.status.growing': 'raste',
        'projects.status.learning': 'učenje',
        'projects.status.experimental': 'eksperimentalno',
        'projects.view': 'Pogledaj',
        'footer.made': 'Napravljeno sa',
        'footer.by': 'od strane dasteee',
        'nav.back': 'Nazad',
        'kodovi.title': 'Kodovi',
        'kodovi.subtitle': 'Kodovi iz škola, domaćih zadataka i ličnih projekata. Organizovani po jezicima i temama.',
        'kodovi.language': 'jezik',
        'kodovi.explorer': 'File Explorer',
        'kodovi.explorer.subtitle': 'Izaberite folder ili fajl da vidite kod',
        'kodovi.folders': 'Folderi',
        'kodovi.welcome': 'Dobrodošli',
        'kodovi.welcome.title': 'Dobrodošli u File Explorer',
        'kodovi.welcome.text': 'Izaberite fajl iz levog panela da vidite kod. Svi fajlovi su organizovani po folderima:',
        'kodovi.folder.domaci': 'Domaći zadaci',
        'kodovi.folder.roblox': 'Roblox Code',
        'kodovi.folder.skola': 'Školski radovi',
        'kodovi.folder.personal': 'Lični projekti',
        'projects.roblox.category': 'Roblox projekti',
        'projects.web.category': 'Ostali projekti',
        'projects.bus.title': 'Bus Tracker (Kragujevac)',
        'projects.bus.card.description': 'Sistem za praćenje autobusa u realnom vremenu.',
        'projects.bus.description': 'Sistem za praćenje autobusa u realnom vremenu za javni prevoz u Kragujevcu. Napravljen reverse engineeringom eKG Bus aplikacije, koristi OpenStreetMap.',
        'projects.bus.feature1': 'Lokacija SVIH autobusa u Kragujevcu',
        'projects.bus.feature2': 'Poslednja lokacija autobusa koji više nisu u funkciji (arhiva)',
        'projects.bus.feature3': 'Sortiranje po prevozniku',
        'projects.bus.feature4': 'Pretraga vozila po garažnom broju/prevozniku',
        'projects.bus.feature5': 'Pretraga linija i trasa',
        'projects.bus.feature6': 'Prikaz svih vozila na liniji',
        'projects.bus.feature7': 'Iscrtane trase (crtanje na mapi kad se izabere linija)',
        'projects.bus.feature8': 'Status svih vozila (Aktivna, neaktivna 24+h, arhiva)',
        'projects.bus.featuresTitle': 'Mogućnosti',
        'projects.bus.link': 'Otvori aplikaciju',
        'projects.bus.card.link': 'Otvori aplikaciju',
        'projects.moovit.title': 'Moovit (Kragujevac)',
        'projects.moovit.card.title': 'Moovit (Kragujevac)',
        'projects.moovit.description': 'Počevši od 2024. godine, samoinicijativno sam se prijavio kao volonter da digitalizujem sistem javnog prevoza u Kragujevcu. Uspešno sam mapirao kompletnu mrežu gradskih autobusa, uključujući sve linije, stajališta i zvanične redove vožnje, čime su podaci postali dostupni svim građanima.',
        'projects.moovit.card.description': 'Mapirao kompletnu mrežu gradskih autobusa, uključujući sve linije, stajališta i zvanične redove vožnje, čime su podaci postali dostupni svim građanima.',
        'projects.moovit.link': 'Otvori Moovit',
        'projects.moovit.card.link': 'Otvori Moovit',
        'projects.moovit.feature1': 'Sve linije javnog prevoza u Kragujevcu',
        'projects.moovit.feature2': 'Kompletna mreža ruta i trasa',
        'projects.moovit.feature3': 'Detaljni redovi vožnje',
        'projects.moovit.feature4': 'Informacije o stajalištima',
        'projects.moovit.feature5': 'Integracija sa Moovit aplikacijom',
        'projects.moovit.feature6': 'Community volunteer projekat',
        'projects.moovit.featuresTitle': 'Mogućnosti',
        'projects.group.title': 'Flisk Studios (Grupa)',
        'projects.group.description': 'Zvanični community hub za sve moje Roblox projekte.',
        'projects.group.link': 'Otvori grupu',
        'projects.group.card.title': 'Flisk Studios (Grupa)',
        'projects.group.card.description': 'Zvanični community hub za sve moje Roblox projekte.',
        'projects.group.card.link': 'Otvori grupu',
        'projects.game.title': 'Streamer Life (Igra)',
        'projects.game.description': 'Moj glavni projekat, simulacija koju sam u potpunosti samostalno razvio.',
        'projects.game.link': 'Otvori igru',
        'projects.game.card.title': 'Streamer Life (Igra)',
        'projects.game.card.description': 'Moj glavni projekat, simulacija koju sam u potpunosti samostalno razvio.',
        'projects.game.card.link': 'Otvori igru',
        'projects.realtime': 'Uživo',
        'cta.viewProjects': 'Vidi projekte',
        'modal.title': 'Detalji projekta',
        'modal.techStack': 'Tehnologije',
        'modal.features': 'Karakteristike',
        'modal.viewProject': 'Otvori projekat',
        'modal.viewGroup': 'Otvori grupu',
        'modal.viewGame': 'Otvori igru',
        'button.moreDetails': 'Više detalja',
        'about.title': 'O meni',
        'about.subtitle': 'Upoznajte se sa mnom',
        'about.profile.title': 'Profil',
        'about.profile.name': 'David Stević',
        'about.profile.role': 'Software developer',
        'about.profile.bio': 'Zdravo, ja sam David Stević, 17-godišnji software developer iz Kragujevca. Programiranjem se bavim od 2017. godine, kada sam sa devet godina počeo da istražujem Roblox Studio.\n\nSpecijalizovao sam se za Lua skripting, što mi je omogućilo da 2023. osnujem Flisk Studios i samostalno lansiram igru Streamer Life. Kao jedini developer na projektu, bio sam zadužen za sve, od kompletnog skriptinga i UI/UX dizajna do menadžmenta. Danas, igra broji preko [[visits]] poseta, a Roblox grupa okuplja više od [[members]] članova.\n\nPored Robloxa, kao veliki fan simulacija vožnje, od oktobra 2024. bavim se modovanjem za The Bus (Unreal Engine). Samostalno modifikujem core sisteme igre, a moji tehnički modovi, poput "Better Mirrors", odmah su naišli na odličan prijem zajednice na Steam Workshop-u.\n\nMoje formalno obrazovanje (u srednjoj školi) dalo mi je osnovu u C jeziku, a od ove godine fokus mi je na Objektno-Orijentisanom Programiranju (OOP) kroz C#. Moj sledeći cilj je da to znanje, uz C++, primenim za dublji rad u Unreal Engine-u.',
        'about.skills.title': 'Veštine',
        'about.skills.skill1': 'Lua (najpoznatiji)',
        'about.skills.skill2': 'C (poznato)',
        'about.skills.skill3': 'Unreal Engine (poznato)',
        'about.skills.skill4': 'C++ (učim)',
        'about.skills.skill5': 'C# (učim)',
        'about.skills.skill6': 'Veština 6',
        'about.interests.title': 'Interesovanja',
        'about.interests.interest1': 'Razvoj igara',
        'about.interests.interest2': 'Simulacije transporta',
        'about.interests.interest3': 'Softverski dizajn',
        'about.interests.interest4': 'Muzika',
        'about.contact.title': 'Kontakt',
        'about.contact.intro': 'Ako želite da me kontaktirate, možete koristiti sledeće opcije:',
        'about.stats.title': 'Roblox statistike (uživo)',
        'about.stats.members': 'Članovi',
        'about.stats.visits': 'Posete',
        'about.stats.likes': 'Sviđanja',
        'about.stats.favorites': 'Omiljeno'
    },
    eng: {
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.about': 'About Me',
        'hero.title': 'Welcome to my website',
        'hero.subtitle': 'Software Developer focused on game development and scripting. Experienced in Lua, currently expanding my skills in C, C++, C#, and Unreal Engine.',
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
        'projects.web.category': 'Other projects',
        'projects.bus.title': 'Bus Tracker (Kragujevac)',
        'projects.bus.card.description': 'Real-time bus tracking system.',
        'projects.bus.description': 'Real-time bus tracking system for Kragujevac public transport. Built by reverse engineering eKG Bus app, uses OpenStreetMap.',
        'projects.bus.feature1': 'Location of ALL buses in Kragujevac',
        'projects.bus.feature2': 'Last location of buses no longer in service (archive)',
        'projects.bus.feature3': 'Sorting by operator',
        'projects.bus.feature4': 'Vehicle search by garage number/operator',
        'projects.bus.feature5': 'Route and line search',
        'projects.bus.feature6': 'Display all vehicles on a line',
        'projects.bus.feature7': 'Drawn routes (map drawing when line is selected)',
        'projects.bus.feature8': 'Status of all vehicles (Active, inactive 24+h, archive)',
        'projects.bus.featuresTitle': 'Features',
        'projects.bus.link': 'Open App',
        'projects.bus.card.link': 'Open App',
        'projects.moovit.title': 'Moovit (Kragujevac)',
        'projects.moovit.card.title': 'Moovit (Kragujevac)',
        'projects.moovit.description': 'Starting in 2024, I took the initiative as a community volunteer to digitize Kragujevac\'s public transport system. I successfully mapped the entire city bus network, including all lines, station stops, and official timetables, making accurate transit data accessible to all residents.',
        'projects.moovit.card.description': 'Mapped the entire city bus network, including all lines, station stops, and official timetables, making accurate transit data accessible to all residents.',
        'projects.moovit.link': 'Open Moovit',
        'projects.moovit.card.link': 'Open Moovit',
        'projects.moovit.feature1': 'All public transport lines in Kragujevac',
        'projects.moovit.feature2': 'Complete route network',
        'projects.moovit.feature3': 'Detailed timetables',
        'projects.moovit.feature4': 'Stop information',
        'projects.moovit.feature5': 'Moovit app integration',
        'projects.moovit.feature6': 'Community volunteer project',
        'projects.moovit.featuresTitle': 'Features',
        'projects.group.title': 'Flisk Studios (Group)',
        'projects.group.description': 'The official community hub for all my Roblox projects.',
        'projects.group.link': 'Open Group',
        'projects.group.card.title': 'Flisk Studios (Group)',
        'projects.group.card.description': 'The official community hub for all my Roblox projects.',
        'projects.group.card.link': 'Open Group',
        'projects.game.title': 'Streamer Life (Game)',
        'projects.game.description': 'My main project, a simulation game developed entirely solo.',
        'projects.game.link': 'Open Game',
        'projects.game.card.title': 'Streamer Life (Game)',
        'projects.game.card.description': 'My main project, a simulation game developed entirely solo.',
        'projects.game.card.link': 'Open Game',
        'projects.realtime': 'Live',
        'cta.viewProjects': 'View Projects',
        'modal.title': 'Project Details',
        'modal.techStack': 'Technology Stack',
        'modal.features': 'Features',
        'modal.viewProject': 'Open Project',
        'modal.viewGroup': 'Open Group',
        'modal.viewGame': 'Open Game',
        'button.moreDetails': 'More Details',
        'about.title': 'About Me',
        'about.subtitle': 'Get to know me',
        'about.profile.title': 'Profile',
        'about.profile.name': 'David Stević',
        'about.profile.role': 'Software developer',
        'about.profile.bio': 'Hi, I’m David Stević, a 17-year-old software developer from Kragujevac. I have been programming since 2017, when at nine I began exploring Roblox Studio.\n\nI specialized in Lua scripting, which enabled me to found Flisk Studios in 2023 and independently launch the game Streamer Life. As the sole developer, I handled everything from full scripting and UI/UX design to management. Today, the game has over [[visits]] visits, and the Roblox group has more than [[members]] members.\n\nBeyond Roblox, as a big fan of driving simulations, since October 2024 I’ve been modding The Bus (Unreal Engine). I independently modify the game’s core systems, and my technical mods, like “Better Mirrors,” were immediately well-received by the community on the Steam Workshop.\n\nMy formal education (high school) gave me a foundation in the C language, and this year my focus is on Object-Oriented Programming (OOP) with C#. My next goal is to apply that knowledge, along with C++, for deeper work in Unreal Engine.',
        'about.skills.title': 'Skills',
        'about.skills.skill1': 'Lua (most known)',
        'about.skills.skill2': 'C (known)',
        'about.skills.skill3': 'Unreal Engine (known)',
        'about.skills.skill4': 'C++ (learning)',
        'about.skills.skill5': 'C# (learning)',
        'about.skills.skill6': 'Skill 6',
        'about.interests.title': 'Interests',
        'about.interests.interest1': 'Game Dev',
        'about.interests.interest2': 'Transport Sim',
        'about.interests.interest3': 'Software Design',
        'about.interests.interest4': 'Music',
        'about.contact.title': 'Contact',
        'about.contact.intro': 'If you would like to contact me, you can use the following options:',
        'about.stats.title': 'Roblox stats (live)',
        'about.stats.members': 'Members',
        'about.stats.visits': 'Visits',
        'about.stats.likes': 'Likes',
        'about.stats.favorites': 'Favorites'
    }
}

let lastMembers = null;
let lastVisits = null;

function renderAboutDynamicBio() {
    const bioEl = document.querySelector('[data-key="about.profile.bio"]');
    if (!bioEl) return;
    const tmpl = translations[currentLanguage] && translations[currentLanguage]['about.profile.bio']
        ? translations[currentLanguage]['about.profile.bio']
        : bioEl.textContent || '';

    const memberDom = document.getElementById('memberCount');
    const visitDom = document.getElementById('visitCount');
    function parseNumeric(input) {
        const n = Number(String(input || '').replace(/[^0-9]/g, ''));
        return Number.isFinite(n) ? n : 0;
    }
    const membersVal = lastMembers != null
        ? formatDisplayNumber(lastMembers)
        : (memberDom && memberDom.textContent ? formatDisplayNumber(parseNumeric(memberDom.textContent)) : '450,000');
    const visitsVal = lastVisits != null
        ? formatDisplayNumber(lastVisits)
        : (visitDom && visitDom.textContent ? formatDisplayNumber(parseNumeric(visitDom.textContent)) : '15,000,000');

    const rendered = tmpl
        .replaceAll('[[members]]', membersVal)
        .replaceAll('[[visits]]', visitsVal);
    bioEl.textContent = rendered;
}

const themeToggle = document.getElementById('themeToggle');
let themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const html = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (!themeIcon) {
        const t = document.getElementById('themeToggle');
        themeIcon = t ? t.querySelector('i') : null;
    }
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (themeIcon) {
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = '';
        }, 300);
    }
}

function initLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'eng';
    setLanguage(savedLanguage);
}

function setLanguage(lang) {
    currentLanguage = lang;
    html.setAttribute('data-lang', lang);
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
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
    renderAboutDynamicBio();
}

function switchLanguage(lang) {
    setLanguage(lang);
}

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
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

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
    
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

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

function simulateTerminalCommands() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
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
        
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `
            <span class="prompt">$</span>
            <span class="command">${randomCommand}</span>
        `;
        
        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.innerHTML = `<span class="output-text">[${currentTime}] Command executed</span>`;
        
        terminalBody.appendChild(newLine);
        terminalBody.appendChild(output);
        
        const lines = terminalBody.querySelectorAll('.terminal-line, .terminal-output');
        if (lines.length > 10) {
            lines[0].remove();
            lines[1].remove();
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
    }, 10000);
}

function initProjectCardInteractions() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 30px rgba(88, 166, 255, 0.3)';
            
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
            card.style.boxShadow = '';
            
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'scale(1)';
                tag.style.background = 'var(--bg-tertiary)';
                tag.style.color = 'var(--text-secondary)';
            });
        });
        
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

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleTheme();
        }
        
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

function initResponsiveHandling() {
    function handleResize() {
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

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleTheme();
        }
        
        if (e.key === '1') {
            e.preventDefault();
            switchLanguage('lat');
        } else if (e.key === '2') {
            e.preventDefault();
            switchLanguage('eng');
        }
    });
}

function init() {
    console.log('🚀 Initializing dasteee.github.io...');
    
    initTheme();
    initLanguage();
    initScrollAnimations();
    initSmoothScrolling();
    initKeyboardShortcuts();
    initRealtimeCounter();
    initProjectModal();
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    console.log('✅ Initialization complete!');
    console.log('💡 Try Ctrl/Cmd + K to toggle theme');
    console.log('💡 Try 1/2 to switch languages');
}

function initRealtimeCounter() {
    const memberCountElement = document.getElementById('memberCount');
    const visitCountElement = document.getElementById('visitCount');
    
    if (!memberCountElement || !visitCountElement) return;
    
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
    
    memberCountElement.textContent = formatNumber(0);
    visitCountElement.textContent = formatNumber(0);
    const likeElInit = document.getElementById('likeCount');
    const favoriteElInit = document.getElementById('favoriteCount');
    if (likeElInit) likeElInit.textContent = formatNumber(0);
    if (favoriteElInit) favoriteElInit.textContent = formatNumber(0);

    function animateCount(el, to, duration = 1200) {
        const from = 0;
        const start = performance.now();
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
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
        if (el.id === 'memberCount') lastMembers = value;
        if (el.id === 'visitCount') lastVisits = value;
    }

    async function updateCounters() {
        try {
            const group = await fetchJson('https://groups.roproxy.com/v1/groups/16201023');
            const members = group && typeof group.memberCount === 'number' ? group.memberCount : null;
            if (members != null) {
                setNumber(memberCountElement, members);
            }
            
            const uni = await fetchJson('https://apis.roproxy.com/universes/v1/places/12218138312/universe');
            const universeId = uni && uni.universeId ? uni.universeId : null;
            if (universeId) {
                const games = await fetchJson(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
                const game = games && Array.isArray(games.data) ? games.data[0] : null;
                const visits = game && typeof game.visits === 'number' ? game.visits : null;
                if (visits != null) {
                    setNumber(visitCountElement, visits);
                }

                const favoriteEl = document.getElementById('favoriteCount');
                if (favoriteEl && game) {
                    const favs = typeof game.favorites === 'number' ? game.favorites
                              : typeof game.favoritedCount === 'number' ? game.favoritedCount
                              : null;
                    if (favs != null) setNumber(favoriteEl, favs);
                }

                const likeEl = document.getElementById('likeCount');
                if (likeEl) {
                    try {
                        const votes = await fetchJson(`https://games.roproxy.com/v1/games/votes?universeIds=${universeId}`);
                        const v = votes && Array.isArray(votes.data) ? votes.data[0] : null;
                        const up = v && typeof v.upVotes === 'number' ? v.upVotes : null;
                        if (up != null) {
                            setNumber(likeEl, up);
                        } else {
                            const likeWrap = likeEl.closest('.mini-stat');
                            if (likeWrap) likeWrap.style.display = 'none';
                        }
                    } catch (e) {
                        const likeWrap = likeEl.closest('.mini-stat');
                        if (likeWrap) likeWrap.style.display = 'none';
                    }
                }
            }
            
            memberCountElement.style.transform = 'scale(1.05)';
            visitCountElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                memberCountElement.style.transform = 'scale(1)';
                visitCountElement.style.transform = 'scale(1)';
            }, 200);

            didInitialAnimate = true;

            renderAboutDynamicBio();
        } catch (e) {
            console.warn('Roblox realtime counters unavailable:', e);
        }
    }
    
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

    function startCounters() {
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
        startCounters();
    }
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

function displayRound(num) {
    const n = Number(num) || 0;
    if (n >= 100000) return Math.floor(n / 100000) * 100000;
    return n;
}

function formatDisplayNumber(num) {
    return formatNumber(displayRound(num));
}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalImageContainer = document.getElementById('modalImageContainer');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalViewBtn = document.getElementById('modalViewBtn');
    const modalClose = document.getElementById('modalClose');

    if (!modal || !modalTitle || !modalDescription || !modalImageContainer || !modalFeatures || !modalTechStack || !modalViewBtn || !modalClose) {
        return;
    }

    function openModal(projectCard) {
        const titleKey = projectCard.dataset.titleKey;
        const descriptionKey = projectCard.dataset.descriptionKey;
        const featuresKey = projectCard.dataset.featuresKey;
        const tech = projectCard.dataset.tech ? projectCard.dataset.tech.split(',') : [];
        const url = projectCard.dataset.url;
        const type = projectCard.dataset.type || 'webapp';
        const image = projectCard.querySelector('img')?.src || '/bus/public/logo192.png';

        const title = translations[currentLanguage][titleKey] || titleKey;
        const description = translations[currentLanguage][descriptionKey] || descriptionKey;

        modalTitle.textContent = translations[currentLanguage]['modal.title'];
        
        modalImageContainer.innerHTML = `<img src="${image}" alt="${title}" style="max-width:200px;max-height:200px;width:auto;height:auto;border-radius:12px;margin:0 auto;display:block;object-fit:contain;" />`;

        modalDescription.innerHTML = `<h3 style="margin-top:16px;margin-bottom:8px;font-size:24px;">${title}</h3><p style="color:var(--text-secondary);line-height:1.6;">${description}</p>`;

        modalFeatures.innerHTML = '';
        
        if (type === 'group') {
            const memberCount = document.getElementById('memberCount')?.textContent || '0';
            modalFeatures.innerHTML = `
                <div style="display:flex;gap:24px;margin-top:20px;flex-wrap:wrap;">
                    <div class="modal-stat">
                        <i class="fas fa-users" style="font-size:24px;color:var(--accent-primary);"></i>
                        <div>
                            <div style="font-size:24px;font-weight:600;">${memberCount}</div>
                            <div style="color:var(--text-secondary);font-size:14px;">${translations[currentLanguage]['stats.members']}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'game') {
            const visitCount = document.getElementById('visitCount')?.textContent || '0';
            const likeCount = document.getElementById('likeCount')?.textContent || '0';
            const favoriteCount = document.getElementById('favoriteCount')?.textContent || '0';
            modalFeatures.innerHTML = `
                <div style="display:flex;gap:24px;margin-top:20px;flex-wrap:wrap;">
                    <div class="modal-stat">
                        <i class="fas fa-gamepad" style="font-size:24px;color:var(--accent-primary);"></i>
                        <div>
                            <div style="font-size:24px;font-weight:600;">${visitCount}</div>
                            <div style="color:var(--text-secondary);font-size:14px;">${translations[currentLanguage]['stats.visits']}</div>
                        </div>
                    </div>
                    ${likeCount !== '0' ? `
                    <div class="modal-stat">
                        <i class="fas fa-thumbs-up" style="font-size:24px;color:var(--accent-primary);"></i>
                        <div>
                            <div style="font-size:24px;font-weight:600;">${likeCount}</div>
                            <div style="color:var(--text-secondary);font-size:14px;">Likes</div>
                        </div>
                    </div>
                    ` : ''}
                    ${favoriteCount !== '0' ? `
                    <div class="modal-stat">
                        <i class="fas fa-star" style="font-size:24px;color:var(--accent-primary);"></i>
                        <div>
                            <div style="font-size:24px;font-weight:600;">${favoriteCount}</div>
                            <div style="color:var(--text-secondary);font-size:14px;">Favorites</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            `;
        } else if (type === 'webapp' && featuresKey) {
            const featureKeys = featuresKey.split(',');
            const featuresTitle = translations[currentLanguage]['projects.bus.featuresTitle'] || 'Features';
            modalFeatures.innerHTML = `<h4 style="margin-top:24px;margin-bottom:16px;font-size:18px;font-weight:600;color:var(--text-primary);">${featuresTitle}:</h4>`;
            modalFeatures.innerHTML += '<div style="display:flex;flex-direction:column;gap:12px;">';
            featureKeys.forEach(key => {
                const featureText = translations[currentLanguage][key.trim()] || key.trim();
                modalFeatures.innerHTML += `
                    <div class="modal-feature" style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px;border:1px solid var(--border-color);">
                        <i class="fas fa-check-circle" style="color:var(--accent-primary);font-size:18px;margin-top:2px;flex-shrink:0;"></i>
                        <span style="font-size:15px;line-height:1.5;color:var(--text-primary);">${featureText}</span>
                    </div>
                `;
            });
            modalFeatures.innerHTML += '</div>';
        }

        if (tech.length > 0 && type === 'webapp') {
            modalTechStack.innerHTML = `<h4 style="margin-top:24px;margin-bottom:12px;font-size:16px;">${translations[currentLanguage]['modal.techStack']}</h4>`;
            modalTechStack.innerHTML += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
            tech.forEach(techItem => {
                if (techItem.trim()) {
                    modalTechStack.innerHTML += `
                        <span class="tech-tag" style="padding:6px 12px;background:var(--bg-tertiary);border-radius:6px;font-size:14px;">
                            <i class="fas fa-code"></i>
                            ${techItem.trim()}
                        </span>
                    `;
                }
            });
            modalTechStack.innerHTML += '</div>';
        } else {
            modalTechStack.innerHTML = '';
        }

        const buttonKey = type === 'group' ? 'modal.viewGroup' : type === 'game' ? 'modal.viewGame' : 'modal.viewProject';
        modalViewBtn.onclick = () => window.open(url, '_blank');
        modalViewBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> ${translations[currentLanguage][buttonKey]}`;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.querySelectorAll('.project-card[data-project]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            openModal(card);
        });

        card.style.cursor = 'pointer';
    });

    document.querySelectorAll('.card-footer button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            if (card && card.dataset.project) {
                openModal(card);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('error', (e) => {
    console.error('❌ Error:', e.error);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const resp = await fetch('/sw.js', { method: 'HEAD', cache: 'no-store' });
            if (resp.ok) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('🔧 SW registered:', registration);
                    })
                    .catch(registrationError => {
                        console.log('🔧 SW registration failed:', registrationError);
                    });
            } else {
                console.log('🔧 SW not found (skipping registration).');
            }
        } catch (e) {
            console.log('🔧 SW check failed (skipping registration).');
        }
    });
}
