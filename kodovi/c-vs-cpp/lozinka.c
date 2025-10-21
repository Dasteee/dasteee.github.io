#include <stdio.h>
#include <string.h>

int main() {
    char lozinka[50];
    printf("Unesi svoju lozinku: ");
    scanf("%s", lozinka);
    if (strcmp(lozinka, "M") == 0) {
        printf("Tacna lozinka!\n");
    } else {
        printf("Netacna lozinka!\n");
    }
    return 0;
}