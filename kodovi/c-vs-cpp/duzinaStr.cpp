#include <iostream>
#include <string>

using namespace std;

int main()
{
	string ime, prezime, puno_ime;
	int duzina_imena;
	cout << "Unesi svoje ime: ";
	getline(cin, ime);
	cout << endl;
	cout << "Unesi svoje prezime: ";
	getline(cin, prezime);
	puno_ime = ime + " " + prezime;
	duzina_imena = puno_ime.length() - 1; // Oduzimamo 1 zbog razmaka
	cout << endl <<endl;
	cout << "Zdravo, " << puno_ime << endl;
	cout << "Tvoje puno ime sadrzi " << duzina_imena << " karaktera." << endl;
	return 0;
}