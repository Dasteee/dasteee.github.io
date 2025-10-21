#include <stdio.h>
#include <string.h>

int main() {
    char ime[50], prezime[50], puno_ime[100];
    int duzina_imena;
    printf("Unesi svoje ime: ");
    scanf("%s", ime);
    printf("Unesi svoje prezime: ");
    scanf("%s", prezime);
    strcpy(puno_ime, ime);
    strcat(puno_ime, " ");
    strcat(puno_ime, prezime);
    duzina_imena = strlen(puno_ime)-1; // Oduzimamo 1 zbog razmaka
    printf("\n\n");
    printf("Zdravo, %s\n", puno_ime);
    printf("Tvoje puno ime sadrzi %d karaktera.\n", duzina_imena);
    return 0;
}