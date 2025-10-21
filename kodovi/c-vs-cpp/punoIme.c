#include <stdio.h>

int main() {
    char puno_ime[50];

    printf("Unesite svoje puno ime i prezime: ");

    fgets(puno_ime, 50, stdin);

    printf("Ahoj %s!", puno_ime);

    return 0;
}