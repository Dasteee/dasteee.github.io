import requests
import json
import os
import traceback

# Definišemo URL i headere koje smo otkrili
API_URL = 'https://kg-mobile-api.busplus.rs/bus-data/get-bus-stops/-1/-1/-1'
AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfdHlwZSI6IkVLR19NT0JJTEVfQVBQIiwiaWF0IjoxNzQ0ODAwOTc0fQ.Ni2RKLQSSd2u1CBQv4yn2pNMXgRKJUmpMWR4qRSEQzw'

# Definišemo imena izlaznih fajlova
OUTPUT_FILES = {
    'busStopData': 'stanice.json',
    'busStopWithLinesData': 'linije_i_stanice.json',
    'scheduledDepartures': 'red_voznje.json'
}

def fetch_and_process_data():
    """
    Dobavlja i obrađuje podatke sa API-ja.
    """
    print(">>> Pokušavam da dobavim podatke sa servera...")

    # Učitavamo Device ID iz environment variable.
    # Ovo je važno da ne bismo čuvali tvoj ID direktno u kodu.
    device_id = os.getenv("X_DEVICE_ID")
    if not device_id:
        print("!!! GREŠKA: Environment variable 'X_DEVICE_ID' nije postavljena.")
        print("!!! Molim te, postavi je pre pokretanja skripte.")

    headers = {
        'Authorization': AUTH_TOKEN,
        'X-Device-Id': device_id,
        'Content-Type': 'application/json'
    }

    try:
        # Šaljemo zahtev serveru
        response = requests.get(API_URL, headers=headers, timeout=20)
        response.raise_for_status()  # Proverava da li je zahtev bio uspešan (status 200)
        
        print(">>> Uspešno dobijen odgovor od servera. Obrađujem podatke...")

        # Prvo parsiramo glavni JSON
        api_data = response.json().get('data', {})

        processed_data = {}

        # Sada parsiramo svaki deo koji je "stringified" JSON
        for key, filename in OUTPUT_FILES.items():
            if key in api_data:
                try:
                    # json.loads() pretvara string u pravu JSON (listu/rečnik)
                    processed_data[key] = json.loads(api_data[key])
                    print(f"    - Uspešno obrađen deo: {key}")
                except json.JSONDecodeError:
                    print(f"!!! GREŠKA: Nije moguće parsirati '{key}' deo odgovora.")
                    processed_data[key] = []
            else:
                print(f"!!! UPOZORENJE: Deo '{key}' nedostaje u odgovoru sa servera.")
        
        return processed_data

    except requests.exceptions.RequestException as e:
        print(f"!!! KATASTROFALNA GREŠKA pri komunikaciji sa API-jem: {e}")
        traceback.print_exc()
        return None

def save_data_to_files(data):
    """
    Čuva obrađene podatke u zasebne JSON fajlove.
    """
    print("\n>>> Čuvam podatke u fajlove...")
    for key, content in data.items():
        filename = OUTPUT_FILES.get(key)
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    # Koristimo indent=4 za lepši ispis i ensure_ascii=False za naša slova
                    json.dump(content, f, indent=4, ensure_ascii=False)
                print(f"    - Uspešno sačuvan fajl: {filename}")
            except Exception as e:
                print(f"!!! GREŠKA pri čuvanju fajla '{filename}': {e}")

if __name__ == "__main__":
    print("--- Pokretanje skripte za preuzimanje statičkih podataka ---")
    
    final_data = fetch_and_process_data()
    
    if final_data:
        save_data_to_files(final_data)
        print("\n--- Skripta je uspešno završena! ---")
    else:
        print("\n--- Skripta nije uspela. Proveri greške iznad. ---")
