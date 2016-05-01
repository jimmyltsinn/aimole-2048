#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

/*
 * Implement your "nextMove" and "isValid" functions.
 * You are free to add more functions or remove any function.
 * If you are not clear about the rules, click the "Game Rules" button on the player bar.
 */

int isValid(int board[4][4], char move[5]) {
    // Check If the Move is Valid
    // Implement Your Checking Function
    return 1;
}

void nextMove(int board[4][4], char move[5]) {
    // Implement Your AI Here
    if (isValid(board, "UP") == 1) {
        strcpy(move, "UP");
    }
}

int main() {
    int board[4][4], i, j;
    char move[5];

    // Read Game Board
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            scanf("%d", &board[i][j]);
        }
    }

    // Compute Your Next Move
    nextMove(board, move);

    // Print Your Next Move to the Standard Output
    printf("%s\n", move);
    return 0;
}
