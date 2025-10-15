// ===== KODOVI PAGE SPECIFIC JAVASCRIPT =====

// ===== GLOBAL VARIABLES =====
let currentFile = null;
let fileContents = {};
let isViewLoading = false;
let filesData = null;

// ===== FILE LOADING =====
async function loadFilesData() {
    try {
        const response = await fetch('files.json');
        filesData = await response.json();
        console.log('✅ Files data loaded:', filesData);
        buildFileTree();
        return true;
    } catch (error) {
        console.error('❌ Error loading files.json:', error);
        // Fallback to sample files
        return false;
    }
}

async function loadFileContent(filePath) {
    try {
        // Try to load from actual file
        const response = await fetch(filePath);
        if (response.ok) {
            const content = await response.text();
            return content;
        }
    } catch (error) {
        console.warn(`⚠️ Could not load ${filePath}:`, error);
    }
    
    // Fallback to sample files
    if (sampleFiles[filePath]) {
        return sampleFiles[filePath].content;
    }
    
    return `// Greška: Fajl ${filePath} nije pronađen`;
}

// ===== FILE TREE BUILDER =====
function buildFileTree() {
    if (!filesData || !filesData.structure) {
        console.warn('⚠️ No files data available');
        return;
    }
    
    const treeContent = document.querySelector('.tree-content');
    if (!treeContent) return;
    
    // Clear existing content
    treeContent.innerHTML = '';
    
    // Build tree from JSON data
    buildTreeItems(filesData.structure, treeContent);
    setupFileTreeEvents(); // Obavezno bindovanje eventa svaki put kad se promeni drvo
    
    console.log('✅ File tree built from JSON data');
}

function buildTreeItems(items, container, level = 0) {
    items.forEach(item => {
        if (item.type === 'folder') {
            // Create folder element
            const folderId = `folder-${item.name.replace(/[^a-zA-Z0-9]/g, '')}`;
            const folderDiv = document.createElement('div');
            folderDiv.className = 'tree-folder';
            
            folderDiv.innerHTML = `
                <div class="folder-header" onclick="toggleFolder('${folderId}')">
                    <i class="fas fa-chevron-right folder-arrow" id="arrow-${folderId}"></i>
                    <i class="${item.icon} folder-icon"></i>
                    <span class="folder-name">${item.name}</span>
                </div>
                <div class="folder-content" id="content-${folderId}" style="display: none;">
                </div>
            `;
            
            container.appendChild(folderDiv);
            
            // Add children
            if (item.children && item.children.length > 0) {
                const contentDiv = folderDiv.querySelector(`#content-${folderId}`);
                buildTreeItems(item.children, contentDiv, level + 1);
            }
        } else {
            // Create file element
            const fileDiv = document.createElement('div');
            fileDiv.className = 'tree-item file';
            fileDiv.setAttribute('data-file-path', item.path); // path je unikatan
            fileDiv.innerHTML = `
                <i class="${item.icon}"></i>
                <span class="tree-name">${item.name}</span>
            `;
            
            container.appendChild(fileDiv);
        }
    });
}

// ===== SAMPLE CODE DATA =====
const sampleFiles = {
    'test/test.c': {
        language: 'c',
        content: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    },
    'DomaciStringoviC_C++.c': {
        language: 'c',
        content: `#include <stdio.h>
#include <string.h>

// Funkcija za brojanje karaktera u stringu
int brojKaraktera(char str[]) {
    int brojac = 0;
    while (str[brojac] != '\\0') {
        brojac++;
    }
    return brojac;
}

// Funkcija za obrtanje stringa
void obrniString(char str[]) {
    int duzina = strlen(str);
    for (int i = 0; i < duzina / 2; i++) {
        char temp = str[i];
        str[i] = str[duzina - 1 - i];
        str[duzina - 1 - i] = temp;
    }
}

// Glavna funkcija
int main() {
    char tekst[100];
    
    printf("Unesite tekst: ");
    fgets(tekst, sizeof(tekst), stdin);
    
    // Ukloni novi red na kraju
    tekst[strcspn(tekst, "\\n")] = 0;
    
    printf("Originalni tekst: %s\\n", tekst);
    printf("Broj karaktera: %d\\n", brojKaraktera(tekst));
    
    obrniString(tekst);
    printf("Obrnuti tekst: %s\\n", tekst);
    
    return 0;
}`
    },
    'DomaciC#15Oktobar.cs': {
        language: 'csharp',
        content: `using System;

namespace DomaciZadatak
{
    class Program
    {
        // Klasa za rad sa nizovima
        public class NizManager
        {
            private int[] niz;
            
            public NizManager(int velicina)
            {
                niz = new int[velicina];
            }
            
            // Popuni niz random brojevima
            public void PopuniNiz()
            {
                Random rand = new Random();
                for (int i = 0; i < niz.Length; i++)
                {
                    niz[i] = rand.Next(1, 101);
                }
            }
            
            // Pronadji najveci element
            public int NajveciElement()
            {
                int max = niz[0];
                foreach (int broj in niz)
                {
                    if (broj > max)
                        max = broj;
                }
                return max;
            }
            
            // Izracunaj prosek
            public double Prosek()
            {
                int suma = 0;
                foreach (int broj in niz)
                {
                    suma += broj;
                }
                return (double)suma / niz.Length;
            }
            
            // Prikazi niz
            public void PrikaziNiz()
            {
                Console.WriteLine("Niz: [" + string.Join(", ", niz) + "]");
            }
        }
        
        static void Main(string[] args)
        {
            Console.WriteLine("=== Domaći zadatak C# - 15. Oktobar ===");
            
            NizManager manager = new NizManager(10);
            manager.PopuniNiz();
            manager.PrikaziNiz();
            
            Console.WriteLine($"Najveci element: {manager.NajveciElement()}");
            Console.WriteLine($"Prosek: {manager.Prosek():F2}");
        }
    }
}`
    },
    'StreamerLifeScript.lua': {
        language: 'lua',
        content: `-- Streamer Life Script za Roblox
-- Glavni skript za igru Streamer Life

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()

-- Moduli
local StreamerModule = require(ReplicatedStorage.Modules.StreamerModule)
local MoneyModule = require(ReplicatedStorage.Modules.MoneyModule)
local HouseModule = require(ReplicatedStorage.Modules.HouseModule)

-- Promenljive
local streamerData = {
    followers = 0,
    subscribers = 0,
    views = 0,
    money = 1000,
    level = 1,
    isStreaming = false
}

-- Funkcija za početak stream-a
function startStream()
    if not streamerData.isStreaming then
        streamerData.isStreaming = true
        print("Stream je počeo!")
        
        -- Simuliraj gledaoce
        local connection
        connection = RunService.Heartbeat:Connect(function()
            if streamerData.isStreaming then
                -- Dodaj random broj gledalaca
                local newViewers = math.random(1, 10)
                streamerData.views = streamerData.views + newViewers
                
                -- Šansa za nove followere
                if math.random(1, 100) <= 5 then
                    streamerData.followers = streamerData.followers + 1
                end
                
                -- Šansa za nove subscribere
                if math.random(1, 100) <= 2 then
                    streamerData.subscribers = streamerData.subscribers + 1
                    MoneyModule.addMoney(10) -- $10 za svakog subscribera
                end
            end
        end)
    end
end

-- Funkcija za završetak stream-a
function endStream()
    if streamerData.isStreaming then
        streamerData.isStreaming = false
        print("Stream je završen!")
        print("Ukupno gledalaca: " .. streamerData.views)
    end
end

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "StreamerGUI"
ScreenGui.Parent = Player.PlayerGui

-- Stream button
local streamButton = Instance.new("TextButton")
streamButton.Size = UDim2.new(0, 200, 0, 50)
streamButton.Position = UDim2.new(0, 10, 0, 10)
streamButton.BackgroundColor3 = Color3.fromRGB(100, 200, 100)
streamButton.Text = "Počni Stream"
streamButton.TextColor3 = Color3.new(1, 1, 1)
streamButton.TextSize = 18
streamButton.Font = Enum.Font.GothamBold
streamButton.Parent = ScreenGui

streamButton.MouseButton1Click:Connect(function()
    if streamerData.isStreaming then
        endStream()
        streamButton.Text = "Počni Stream"
        streamButton.BackgroundColor3 = Color3.fromRGB(100, 200, 100)
    else
        startStream()
        streamButton.Text = "Završi Stream"
        streamButton.BackgroundColor3 = Color3.fromRGB(200, 100, 100)
    end
end)

-- Stats display
local statsFrame = Instance.new("Frame")
statsFrame.Size = UDim2.new(0, 250, 0, 150)
statsFrame.Position = UDim2.new(0, 10, 0, 70)
statsFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
statsFrame.BorderSizePixel = 0
statsFrame.Parent = ScreenGui

local statsLabel = Instance.new("TextLabel")
statsLabel.Size = UDim2.new(1, 0, 1, 0)
statsLabel.BackgroundTransparency = 1
statsLabel.Text = "Followers: 0\\nSubscribers: 0\\nViews: 0\\nMoney: $1000"
statsLabel.TextColor3 = Color3.new(1, 1, 1)
statsLabel.TextSize = 16
statsLabel.Font = Enum.Font.Gotham
statsLabel.TextXAlignment = Enum.TextXAlignment.Left
statsLabel.TextYAlignment = Enum.TextYAlignment.Top
statsLabel.Parent = statsFrame

-- Update stats svake sekunde
RunService.Heartbeat:Connect(function()
    statsLabel.Text = string.format(
        "Followers: %d\\nSubscribers: %d\\nViews: %d\\nMoney: $%d",
        streamerData.followers,
        streamerData.subscribers,
        streamerData.views,
        MoneyModule.getMoney()
    )
end)`
    },
    'zadatak2.js': {
        language: 'javascript',
        content: `// Primer JavaScript koda za domaći zadatak
class Student {
    constructor(ime, prezime, godina) {
        this.ime = ime;
        this.prezime = prezime;
        this.godina = godina;
        this.ocene = [];
    }
    
    dodajOcenu(ocena) {
        if (ocena >= 1 && ocena <= 10) {
            this.ocene.push(ocena);
            return true;
        }
        return false;
    }
    
    izracunajProsek() {
        if (this.ocene.length === 0) return 0;
        const suma = this.ocene.reduce((acc, ocena) => acc + ocena, 0);
        return suma / this.ocene.length;
    }
    
    toString() {
        const prosek = this.izracunajProsek();
        return \`\${this.ime} \${this.prezime} (\${this.godina}. godina) - Prosek: \${prosek.toFixed(2)}\`;
    }
}

// Kreiranje instance studenta
const student = new Student("Dasteee", "Student", 3);

// Dodavanje ocena
student.dodajOcenu(9);
student.dodajOcenu(8);
student.dodajOcenu(10);
student.dodajOcenu(7);

// Prikaz rezultata
console.log(student.toString());

// Dodatni primeri
const studenti = [
    new Student("Ana", "Anić", 2),
    new Student("Marko", "Markić", 3),
    new Student("Jovana", "Jovanović", 4)
];

studenti.forEach(student => {
    // Dodaj random ocene
    for (let i = 0; i < 5; i++) {
        student.dodajOcenu(Math.floor(Math.random() * 5) + 6);
    }
    console.log(student.toString());
});`
    },
    'zadatak3.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domaći zadatak - HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        }
        
        button {
            background: #ff6b6b;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        
        button:hover {
            transform: translateY(-2px);
        }
        
        .result {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 Forma za domaći zadatak</h1>
        
        <form id="studentForm">
            <div class="form-group">
                <label for="ime">Ime:</label>
                <input type="text" id="ime" name="ime" required>
            </div>
            
            <div class="form-group">
                <label for="prezime">Prezime:</label>
                <input type="text" id="prezime" name="prezime" required>
            </div>
            
            <div class="form-group">
                <label for="godina">Godina studija:</label>
                <select id="godina" name="godina" required>
                    <option value="">Izaberite godinu</option>
                    <option value="1">1. godina</option>
                    <option value="2">2. godina</option>
                    <option value="3">3. godina</option>
                    <option value="4">4. godina</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="komentar">Komentar:</label>
                <textarea id="komentar" name="komentar" rows="4" placeholder="Ostavite komentar..."></textarea>
            </div>
            
            <button type="submit">Pošalji</button>
        </form>
        
        <div class="result" id="result">
            <h3>Rezultat:</h3>
            <p id="resultText"></p>
        </div>
    </div>
    
    <script>
        document.getElementById('studentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const result = \`Zdravo \${data.ime} \${data.prezime}! 
            Vi ste \${data.godina}. godina student. 
            Komentar: \${data.komentar || 'Nema komentara'}\`;
            
            document.getElementById('resultText').textContent = result;
            document.getElementById('result').style.display = 'block';
        });
    </script>
</body>
</html>`
    },
    'zadatak4.css': {
        language: 'css',
        content: `/* Primer CSS koda za domaći zadatak */

/* Reset i osnovni stilovi */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: #ff6b6b;
}

/* Cards */
.card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    margin: 1rem 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card h3 {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.card p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1.5rem;
}

/* Buttons */
.btn {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 0.8rem 1.5rem;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Grid */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease forwards;
}

/* Responsive */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
    
    .card {
        padding: 1.5rem;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    
    .card {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }
}`
    }
};

// ===== FOLDER FUNCTIONS =====
function toggleFolder(folderId) {
    const arrow = document.getElementById(`arrow-${folderId}`);
    const content = document.getElementById(`content-${folderId}`);
    const header = arrow.parentElement;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        header.classList.add('open');
        arrow.style.transform = 'rotate(90deg)';
    } else {
        content.style.display = 'none';
        header.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
    }
}

async function loadFile(filePath) {
    if (isViewLoading) return;
    
    isViewLoading = true;
    currentFile = filePath;
    
    // Update active file
    document.querySelectorAll('.tree-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-file-path') === filePath) {
            item.classList.add('active');
        }
    });
    
    // Show loading state
    const welcomeMessage = document.getElementById('welcomeMessage');
    const codeContent = document.getElementById('codeContent');
    const pre = codeContent.parentElement;
    
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    pre.style.display = 'block';
    pre.classList.add('loading');
    
    try {
        // Load file content
        const content = await loadFileContent(filePath);
        
        // Determine language from file extension or file data
        let language = 'text';
        if (filesData && filesData.structure) {
            const fileInfo = findFileInStructure(filesData.structure, filePath);
            if (fileInfo && fileInfo.language) {
                language = fileInfo.language;
            }
        } else if (sampleFiles[filePath]) {
            language = sampleFiles[filePath].language;
        }
        
        updateCodeContent(content, language);
        updateActiveTab(filePath);
        
    } catch (error) {
        console.error('Error loading file:', error);
        updateCodeContent(`// Greška pri učitavanju fajla: ${filePath}\n// ${error.message}`, 'text');
    }
    
    // Remove loading state
    pre.classList.remove('loading');
    isViewLoading = false;
}

function findFileInStructure(structure, filePath) {
    for (const item of structure) {
        if (item.type === 'file' && item.path === filePath) {
            return item;
        } else if (item.type === 'folder' && item.children) {
            const found = findFileInStructure(item.children, filePath);
            if (found) return found;
        }
    }
    return null;
}

function updateCodeContent(content, language) {
    const codeElement = document.getElementById('codeContent');
    if (codeElement) {
        codeElement.textContent = content;
        codeElement.className = `language-${language}`;
        
        // Re-highlight syntax
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
    }
}

function updateActiveTab(fileName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-file') === fileName) {
            tab.classList.add('active');
        }
    });
}

// ===== INITIALIZATION =====
async function initKodoviPage() {
    console.log('🚀 Initializing kodovi page...');
    
    // Load files data first
    const filesLoaded = await loadFilesData();
    
    if (!filesLoaded) {
        console.log('⚠️ Using fallback file tree');
        // Initialize file contents
        fileContents = { ...sampleFiles };
        // Setup file tree events for fallback
        setupFileTreeEvents();
    }
    
    // Setup event listeners
    setupActionButtons();
    // Auto-open first file if available
    openFirstFileIfAny();
    
    console.log('✅ Kodovi page initialized!');
}

// ===== FILE TREE EVENTS =====
function setupFileTreeEvents() {
    const treeItems = document.querySelectorAll('.tree-item.file');
    
    treeItems.forEach(item => {
        item.addEventListener('click', () => {
            const filePath = item.getAttribute('data-file-path');
            selectFile(filePath);
        });
    });
}

function openFirstFileIfAny() {
    // Prefer DOM-first approach so it works for both JSON and fallback modes
    const firstItem = document.querySelector('.tree-item.file');
    if (firstItem) {
        const filePath = firstItem.getAttribute('data-file-path');
        if (filePath) {
            selectFile(filePath);
            return;
        }
    }
    // If DOM not ready for some reason, try from filesData
    if (filesData && Array.isArray(filesData.structure)) {
        const firstPath = findFirstFilePath(filesData.structure);
        if (firstPath) selectFile(firstPath);
    } else {
        // Fallback sample files
        const keys = Object.keys(fileContents || {});
        if (keys.length > 0) selectFile(keys[0]);
    }
}

function findFirstFilePath(structure) {
    for (const item of structure) {
        if (item.type === 'file') return item.path;
        if (item.type === 'folder' && item.children) {
            const res = findFirstFilePath(item.children);
            if (res) return res;
        }
    }
    return null;
}

function selectFile(filePath) {
    // Update active tree item
    document.querySelectorAll('.tree-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const selectedItem = Array.from(document.querySelectorAll('.tree-item')).find(
        item => item.getAttribute('data-file-path') === filePath
    );
    
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Load file content
    loadFile(filePath);
}

// ===== TAB EVENTS =====
function setupTabEvents() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const fileName = tab.getAttribute('data-file');
            if (fileName) {
                selectFile(fileName);
            }
        });
        
        // Close tab functionality
        const closeBtn = tab.querySelector('.tab-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(tab);
            });
        }
    });
}

function closeTab(tab) {
    tab.remove();
    
    // If this was the active tab, switch to first available tab
    if (tab.classList.contains('active')) {
        const remainingTabs = document.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            const fileName = remainingTabs[0].getAttribute('data-file');
            selectFile(fileName);
        }
    }
}

// ===== ACTION BUTTONS =====
function setupActionButtons() {
    // Copy all code button
    const copyBtn = document.querySelector('[onclick="copyAllCode()"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAllCode);
    }
    
    // Download code button
    const downloadBtn = document.querySelector('[onclick="downloadCode()"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCode);
    }
    
    // Format code button
    const formatBtn = document.querySelector('[onclick="formatCode()"]');
    if (formatBtn) {
        formatBtn.addEventListener('click', formatCode);
    }
}

// (Removed duplicate FILE LOADING and helper functions. Using async loadFile(filePath) defined earlier.)

// ===== ACTION FUNCTIONS =====
function copyAllCode() {
    const codeElement = document.getElementById('codeContent');
    if (codeElement) {
        const codeText = codeElement.textContent;
        
        navigator.clipboard.writeText(codeText).then(() => {
            showNotification('📋 Kod je kopiran u clipboard!', 'success');
            
            // Update button state
            const copyBtn = document.querySelector('[onclick="copyAllCode()"]');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Greška pri kopiranju:', err);
            showNotification('❌ Greška pri kopiranju koda!', 'error');
        });
    }
}

function downloadCode() {
    const fileData = fileContents[currentFile];
    if (fileData) {
        const blob = new Blob([fileData.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('💾 Fajl je preuzet!', 'success');
    }
}

function formatCode() {
    const codeElement = document.getElementById('codeContent');
    if (codeElement) {
        // Simple formatting (can be enhanced with proper formatters)
        let formattedCode = codeElement.textContent;
        
        // Basic indentation fix for Python
        if (currentFile.endsWith('.py')) {
            const lines = formattedCode.split('\n');
            const formattedLines = lines.map(line => {
                // Remove extra spaces but preserve indentation
                return line.replace(/^(\s*)/, (match, spaces) => {
                    return ' '.repeat(Math.floor(spaces.length / 4) * 4);
                });
            });
            formattedCode = formattedLines.join('\n');
        }
        
        codeElement.textContent = formattedCode;
        
        // Re-highlight
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
        
        showNotification('✨ Kod je formatiran!', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
async function refreshFiles() {
    showNotification('🔄 Osvežavanje fajlova...', 'info');
    
    try {
        // Reload files data
        const filesLoaded = await loadFilesData();
        
        if (filesLoaded) {
            showNotification('✅ Fajlovi su osveženi iz JSON-a!', 'success');
        } else {
            showNotification('⚠️ Koristi se fallback', 'warning');
        }
        
        // Show refresh indicator
        const refreshBtn = document.querySelector('.tree-btn[onclick="refreshFiles()"]');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Error refreshing files:', error);
        showNotification('❌ Greška pri osvežavanju', 'error');
    }
}

function toggleView() {
    const fileBrowser = document.querySelector('.file-browser');
    if (fileBrowser) {
        const isGrid = fileBrowser.style.gridTemplateColumns === '1fr 1fr';
        fileBrowser.style.gridTemplateColumns = isGrid ? '1fr' : '1fr 1fr';
        
        showNotification(isGrid ? '📋 Lista prikaz' : '📂 Grid prikaz', 'info');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#3fb950',
        error: '#f85149',
        info: '#58a6ff',
        warning: '#d29922'
    };
    notification.style.background = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + C to copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            copyAllCode();
        }
        
        // Ctrl/Cmd + S to download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadCode();
        }
        
        // Ctrl/Cmd + F to format
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            formatCode();
        }
        
        // Number keys to switch files
        const fileNames = Object.keys(fileContents);
        const num = parseInt(e.key);
        if (num >= 1 && num <= fileNames.length) {
            e.preventDefault();
            selectFile(fileNames[num - 1]);
        }
    });
}

// ===== AUTO-SAVE FUNCTIONALITY =====
function setupAutoSave() {
    // Simulate auto-save every 30 seconds
    setInterval(() => {
        const fileData = fileContents[currentFile];
        if (fileData) {
            // In a real app, this would save to server
            console.log(`💾 Auto-saving ${currentFile}...`);
        }
    }, 30000);
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearch() {
    // Add search input to page
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Pretraži kod...';
    searchInput.className = 'search-input';
    
    // Style search input
    Object.assign(searchInput.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '0.5rem 1rem',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        zIndex: '1000',
        display: 'none'
    });
    
    document.body.appendChild(searchInput);
    
    // Show/hide search on Ctrl+F
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
            if (searchInput.style.display === 'block') {
                searchInput.focus();
            }
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const codeElement = document.getElementById('codeContent');
        
        if (codeElement && searchTerm) {
            const content = codeElement.textContent.toLowerCase();
            if (content.includes(searchTerm)) {
                // Highlight found text (simplified)
                codeElement.style.background = 'rgba(255, 255, 0, 0.1)';
                setTimeout(() => {
                    codeElement.style.background = '';
                }, 1000);
            }
        }
    });
}

// ===== INITIALIZE WHEN DOM IS LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    initKodoviPage();
    setupKeyboardShortcuts();
    setupAutoSave();
    setupSearch();
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.copyAllCode = copyAllCode;
window.downloadCode = downloadCode;
window.formatCode = formatCode;
window.refreshFiles = refreshFiles;
window.toggleView = toggleView;
window.loadFile = loadFile;
window.loadFilesData = loadFilesData;
window.buildFileTree = buildFileTree;
