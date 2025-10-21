#include <iostream>
#include <string>

using namespace std;

int main()
{
	string lozinka;
	cout << "Unesi svoju lozinku: ";
	getline(cin, lozinka);
	if(lozinka == "M")
	{
		cout<<"Tacna lozinka!";
	}
	else
	{
		cout<<"Netacna lozinka!";
	}
	return 0;
}