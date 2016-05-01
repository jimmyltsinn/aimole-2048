#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

/*
 * Implement your "nextMove" and "isValid" functions.
 * You are free to add more functions or remove any function.
 * If you are not clear about the rules, click the "Game Rules" button on the player bar.
 */

int isValid(char move[5], int board[4][4]) {
    // Check If the Move is Valid
    // Implement Your Checking Function
    return 1;
}

char* nextMove(int board[4][4]) {
    // Implement Your AI Here
    char move[5];
    if (isValid("UP", board) == 1) {
        strcpy(move, 'UP');
    }
    return move;
}

int main() {
    int board[4][4], i, j;

    // Read Game Board
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            scanf("%d", &board[i][j]);
        }
    }

    // Print Your Next Move to the Standard Output
    printf("%s\n", nextMove(board));
    return 0;
}
