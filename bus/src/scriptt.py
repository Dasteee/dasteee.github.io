import json
import os

def latin_to_cyrillic(text):
    """
    Konvertuje tekst sa latinice na ćirilicu, vodeći računa o digrafima.
    """
    # Mapa za konverziju. Digrafi (dž, lj, nj) moraju biti prvi.
    latin_cyrillic_map = {
        'Dž': 'Џ', 'dž': 'џ', 'Lj': 'Љ', 'lj': 'љ', 'Nj': 'Њ', 'nj': 'њ',
        'A': 'А', 'a': 'а', 'B': 'Б', 'b': 'б', 'V': 'В', 'v': 'в', 'G': 'Г', 'g': 'г',
        'D': 'Д', 'd': 'д', 'Đ': 'Ђ', 'đ': 'ђ', 'E': 'Е', 'e': 'е', 'Ž': 'Ж', 'ž': 'ж',
        'Z': 'З', 'z': 'з', 'I': 'И', 'i': 'и', 'J': 'Ј', 'j': 'ј', 'K': 'К', 'k': 'к',
        'L': 'Л', 'l': 'л', 'M': 'М', 'm': 'м', 'N': 'Н', 'n': 'н', 'O': 'О', 'o': 'о',
        'P': 'П', 'p': 'п', 'R': 'Р', 'r': 'р', 'S': 'С', 's': 'с', 'T': 'Т', 't': 'т',
        'Ć': 'Ћ', 'ć': 'ћ', 'U': 'У', 'u': 'у', 'F': 'Ф', 'f': 'ф', 'H': 'Х', 'h': 'х',
        'C': 'Ц', 'c': 'ц', 'Č': 'Ч', 'č': 'ч', 'Š': 'Ш', 'š': 'ш'
    }
    
    # Iterativno zamenjujemo karaktere
    for latin, cyrillic in latin_cyrillic_map.items():
        text = text.replace(latin, cyrillic)
        
    return text

def fix_eta_data(input_filename='eta_data_cleaned.json', output_filename='eta_data_popravljen.json'):
    """
    Učitava, popravlja i čuva ETA JSON podatke.
    """
    # Provera da li ulazni fajl postoji
    if not os.path.exists(input_filename):
        print(f"Greška: Fajl '{input_filename}' nije pronađen. Proveri da li se skripta nalazi u istom folderu.")
        return

    try:
        with open(input_filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Greška pri čitanju JSON fajla: {e}")
        return
    except Exception as e:
        print(f"Došlo je do neočekivane greške: {e}")
        return

    # Kreiranje nove strukture podataka
    new_data = {
        "_embedded": {
            "routes": []
        }
    }

    # Provera da li 'routes' ključ postoji
    if 'routes' not in data:
        print("Greška: Ulazni JSON fajl nema ključ 'routes'.")
        return

    # Iteracija kroz svaku rutu i primena ispravki
    for route in data['routes']:
        # Konvertovanje imena rute u ćirilicu
        if 'name' in route and isinstance(route['name'], str):
            route['name'] = latin_to_cyrillic(route['name'])

        # Procesiranje oba smera
        for direction_key in ['directionA', 'directionB']:
            if direction_key in route and route[direction_key]:
                direction = route[direction_key]

                # 1. Konvertovanje endpoint-a u ćirilicu
                if 'endPoint' in direction and isinstance(direction['endPoint'], str):
                    direction['endPoint'] = latin_to_cyrillic(direction['endPoint'])

                # 2. Dodavanje 'ordinal' ključa za svako stajalište
                if 'stops' in direction and isinstance(direction['stops'], list):
                    for i, stop in enumerate(direction['stops']):
                        stop['ordinal'] = i + 1

                # 3. Formatiranje vremena polaska
                if 'departures' in direction and isinstance(direction['departures'], list):
                    for departure in direction['departures']:
                        if 'time' in departure and isinstance(departure['time'], str) and len(departure['time']) > 5:
                            departure['time'] = departure['time'][:5]
        
        new_data["_embedded"]["routes"].append(route)

    # Čuvanje popravljenog JSON-a u novi fajl
    try:
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
        print(f"Uspešno popravljen fajl i sačuvan kao '{output_filename}'")
    except Exception as e:
        print(f"Greška pri čuvanju fajla: {e}")


# Pokretanje funkcije
if __name__ == "__main__":
    fix_eta_data()
