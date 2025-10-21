#include <iostream>
#include <string>

using namespace std;

int main()
{
    string puno_ime;
    cout << "Unesite svoje puno ime i prezime: ";
    getline(cin, puno_ime);
	cout << "Ahoj " << puno_ime << "!" << std::endl;
    return 0;
}