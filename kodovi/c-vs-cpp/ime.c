#include <stdio.h>

int main() {
    char ime[50];

    printf("Unesite svoje ime: ");

    scanf("%s", ime);

    printf("Ahoj, %s!", ime);

    return 0;
}