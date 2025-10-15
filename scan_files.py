#!/usr/bin/env python3
"""
File Scanner za dasteee.github.io
Skenira /kodovi/ folder i generiše files.json sa strukturom fajlova
"""

import os
import json
from pathlib import Path

def get_file_icon(filename):
    """Vraća ikonu na osnovu ekstenzije fajla"""
    ext = Path(filename).suffix.lower()
    icon_map = {
        '.c': 'fab fa-cuttlefish',
        '.cpp': 'fas fa-plus',
        '.cs': 'fas fa-hashtag',
        '.lua': 'fas fa-cube',
        '.js': 'fab fa-js',
        '.py': 'fab fa-python',
        '.java': 'fab fa-java',
        '.html': 'fab fa-html5',
        '.css': 'fab fa-css3-alt',
        '.json': 'fas fa-code',
        '.txt': 'fas fa-file-alt',
        '.md': 'fab fa-markdown'
    }
    return icon_map.get(ext, 'fas fa-file')

def get_language_from_ext(filename):
    """Vraća jezik za syntax highlighting na osnovu ekstenzije"""
    ext = Path(filename).suffix.lower()
    lang_map = {
        '.c': 'c',
        '.cpp': 'cpp',
        '.cs': 'csharp',
        '.lua': 'lua',
        '.js': 'javascript',
        '.py': 'python',
        '.java': 'java',
        '.html': 'html',
        '.css': 'css',
        '.json': 'json',
        '.txt': 'text',
        '.md': 'markdown'
    }
    return lang_map.get(ext, 'text')

def scan_directory(path, skip_root_files=False):
    """Skenira direktorijum i vraća strukturu fajlova
    skip_root_files: ako je True, preskoči fajlove u root folderu"""
    structure = []
    items = sorted(os.listdir(path), key=lambda x: (os.path.isfile(os.path.join(path, x)), x.lower()))
    for item in items:
        item_path = os.path.join(path, item)
        # Preskoči skrivene fajlove i __pycache__
        if item.startswith('.') or item == '__pycache__':
            continue
        if os.path.isdir(item_path):
            # Rekurzivno skeniraj poddirektorijum
            subfolder = {
                'type': 'folder',
                'name': item,
                'path': os.path.relpath(item_path, 'kodovi').replace('\\', '/'),
                'icon': 'fas fa-folder',
                'children': scan_directory(item_path)
            }
            structure.append(subfolder)
        elif not skip_root_files:
            # Fajl (samo u podfolderima, ne u rootu ako je skip_root_files)
            file_info = {
                'type': 'file',
                'name': item,
                'path': os.path.relpath(item_path, 'kodovi').replace('\\', '/'),
                'icon': get_file_icon(item),
                'language': get_language_from_ext(item),
                'size': os.path.getsize(item_path)
            }
            structure.append(file_info)
    return structure

def read_file_content(file_path):
    """Čita sadržaj fajla"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Pokušaj sa latin-1 encoding
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except:
            return f"// Greška pri čitanju fajla: {file_path}"
    except Exception as e:
        return f"// Greška pri čitanju fajla: {str(e)}"

def generate_files_json():
    """Generiše files.json sa strukturom fajlova, ali samo iz podfoldera"""
    kodovi_path = os.path.join(os.getcwd(), 'kodovi')
    print(f"🔍 Skeniranje direktorijuma: {kodovi_path}")
    # Samo folderi i njihovi fajlovi (ne root-fajlovi)
    structure = []
    for item in sorted(os.listdir(kodovi_path)):
        item_path = os.path.join(kodovi_path, item)
        if os.path.isdir(item_path) and not item.startswith('.'):
            # Skeniraj samo podfoldere
            structure.append({
                'type': 'folder',
                'name': item,
                'path': os.path.relpath(item_path, 'kodovi').replace('\\', '/'),
                'icon': 'fas fa-folder',
                'children': scan_directory(item_path)
            })
    # Generiši files.json
    files_data = {
        'last_updated': os.path.getmtime(kodovi_path) if os.path.exists(kodovi_path) else 0,
        'structure': structure
    }
    json_path = os.path.join(os.getcwd(), 'kodovi', 'files.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(files_data, f, indent=2, ensure_ascii=False)
    print(f"✅ Generisan files.json sa {len(structure)} foldera")
    # Ispis foldera
    def print_structure(items, indent=0):
        for item in items:
            prefix = "  " * indent
            if item['type'] == 'folder':
                print(f"{prefix}📁 {item['name']}")
                if item['children']:
                    print_structure(item['children'], indent + 1)
            else:
                print(f"{prefix}📄 {item['name']} ({item['language']})")
    print("\n📂 Struktura fajlova:")
    print_structure(structure)
    return files_data

if __name__ == "__main__":
    generate_files_json()
