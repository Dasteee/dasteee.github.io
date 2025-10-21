#include <stdio.h>
#include <string.h>

int main() {

    char s[20] = "Bumble"; 
    char p[] = "bee";

    //spajamo p na kraj s
    strcat(s, p);

    printf("%s", s);

    return 0;
}