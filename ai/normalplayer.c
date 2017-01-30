#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>

int heur_zero_tile(int game_board[4][4]);
int heur_corner(int game_board[4][4]);
void combine(int copied_game_board[4][4], char command[]);
void pull(int copied_game_board[4][4], char command[]);
void run_command(int copied_game_board[4][4], char command[]);
int is_command_valid(char command[], int game_board[4][4]);
void copy_game_board(int copied_game_board[4][4], int game_board[4][4]);
int expectiminimax(int game_board[4][4], int node, int search_depth, int top);

int main() {
    int board[4][4];
    int x, y;
    int terminate = 0;
    while (!terminate) {
        for (x = 0; x < 4; x++) {
            for (y = 0; y < 4; y++) {
                scanf("%d", &board[x][y]);
            }
        }
        int search_depth;
        int zero_tile = 0;
	      for (x = 0; x < 4; x++) {
		        for (y = 0; y < 4; y++) {
			          if (board[x][y] == 0) zero_tile += 1;
		        }
	      }
	      if (zero_tile > 3) search_depth = 3;
	      else{
		        search_depth = 6 - zero_tile;
	      }
        int aiplayer = expectiminimax(board, 0, search_depth, search_depth);
        if (aiplayer == 0) {
            printf("UP\n");
        }
        else if (aiplayer == 1) {
            printf("DOWN\n");
        }
        else if (aiplayer == 2) {
            printf("LEFT\n");
        }
        else if (aiplayer == 3) {
            printf("RIGHT\n");
        }
        else if (aiplayer == -1) {
            terminate = 1;
        }
    }
    return 0;
}

int expectiminimax(int game_board[4][4], int node, int search_depth, int top) {
    int copied_game_board[4][4];
    copy_game_board(copied_game_board, game_board);
    if (search_depth == 0) {
        int score[4] = {0, 0, 0, 0};
        int i;
        for (i = 0; i < 4; i++) {
            char command[10];
            if(i == 0) strcpy(command, "UP");
            else if(i == 1) strcpy(command, "DOWN");
            else if(i == 2) strcpy(command, "LEFT");
            else if(i == 3) strcpy(command, "RIGHT");
            if(is_command_valid(command, copied_game_board) == 1) {
                int keep_copied_game_board[4][4];
                copy_game_board(keep_copied_game_board, copied_game_board);
                run_command(copied_game_board, command);
                score[i] = heur_corner(copied_game_board) + heur_zero_tile(copied_game_board);
                copy_game_board(copied_game_board, keep_copied_game_board);
            }
        }
        int max = 0;
    		for(i = 0; i < 4; i++) {
    			   if(max < score[i]) max = score[i];
    		}
    		return max;
    }
    else if (node == 1) {
        int count = 0, sum = 0, x, y;
        for (x = 0; x < 4; x++) {
            for (y = 0; y < 4; y++) {
                if (copied_game_board[x][y] == 0) {
                    count += 1;
                    copied_game_board[x][y] = 2;
                    sum += expectiminimax(copied_game_board, 0, search_depth - 1, top);
                    copied_game_board[x][y] = 0;
                }
            }
        }
        return sum / count;
    }
    else if (node == 0) {
        int command[3];
        int score[4] = {0, 0, 0, 0};
        int i;
        for (i = 0; i < 4; i++) {
            char command[10];
            if(i == 0) strcpy(command, "UP");
            else if(i == 1) strcpy(command, "DOWN");
            else if(i == 2) strcpy(command, "LEFT");
            else if(i == 3) strcpy(command, "RIGHT");
            if(is_command_valid(command, copied_game_board) == 1) {
                int keep_copied_game_board[4][4];
                copy_game_board(keep_copied_game_board, copied_game_board);
                run_command(copied_game_board, command);
                score[i] = expectiminimax(copied_game_board, 1, search_depth, top);
                copy_game_board(copied_game_board, keep_copied_game_board);
            }
        }
        if (search_depth == top){
            int max = 0, best_move = 0;
            if (score[0] == 0 && score[1] == 0 && score[2] == 0 && score[3] == 0) {
                for (i = 0; i < 4; i++) {
                    char command[10];
                    if(i == 0) strcpy(command, "UP");
                    else if(i == 1) strcpy(command, "DOWN");
                    else if(i == 2) strcpy(command, "LEFT");
                    else if(i == 3) strcpy(command, "RIGHT");
                    if (is_command_valid(command, copied_game_board) == 1){
                        if (i == 0) return 0;
                        else if (i == 1) return 2;
                        else if (i == 2) return 3;
                        else if (i == 3) return 1;
                    }
                }
                return -1;
            }
            else {
                for (i = 0; i < 4; i++) {
                    if (max < score[i]) {
                        max = score[i];
                        best_move = i;
                    }
                }
                return best_move;
            }
        }
        else {
            int max = 0;
            for (i = 0; i < 4; i++) {
                if (max < score[i]) max = score[i];
            }
            return max;
        }
    }
}

void copy_game_board( int copied_game_board[4][4], int game_board[4][4]) {
    int x, y;
    for(x = 0; x < 4; x++){
        for(y = 0; y < 4; y++){
            copied_game_board[x][y] = game_board[x][y];
        }
    }
    return;
}

int is_command_valid(char command[], int game_board[][4]) {
    int x, y;
    if (strcmp(command, "UP") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 0; x < 3; x++) {
                if(game_board[x][y] == game_board[x + 1][y] && game_board[x][y]!=0) {
                    return 1;
                }
                if(game_board[x][y] == 0 && game_board[x + 1][y] != 0) {
                    return 1;
                }
            }
        }
    }
    else if (strcmp(command, "DOWN") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 3; x > 0; x--) {
                if(game_board[x][y] == game_board[x - 1][y] && game_board[x][y]!=0) {
                    return 1;
                }
                if(game_board[x][y] == 0 && game_board[x - 1][y] != 0) {
                    return 1;
                }
            }
        }
    }
    else if (strcmp(command, "LEFT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 0; y < 3; y++) {
                if(game_board[x][y] == game_board[x][y + 1] && game_board[x][y]!=0) {
                    return 1;
                }
                if(game_board[x][y] == 0 && game_board[x][y + 1] != 0) {
                    return 1;
                }
            }
        }
    }
    else if (strcmp(command, "RIGHT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 3; y > 0; y--) {
                if(game_board[x][y] == game_board[x][y - 1] && game_board[x][y] != 0) {
                    return 1;
                }
                if(game_board[x][y] == 0 && game_board[x][y - 1] != 0) {
                    return 1;
                }
            }
        }
    }
    return 0;
}

void run_command(int copied_game_board[4][4], char command[]) {
    pull(copied_game_board, command);
	  combine(copied_game_board, command);
	  pull(copied_game_board, command);
    return;
}

void pull(int copied_game_board[4][4], char command[]) {
	  int x, y;
	  int order[4];
	  int temp;
	  if(strcmp(command, "UP") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 0; x < 4; x++) {
                order[x] = 0;
            }
            temp = 0;
            for(x = 0; x < 4; x++) {
                if(copied_game_board[x][y] != 0) {
                    order[temp] = copied_game_board[x][y];
                    temp += 1;
                    copied_game_board[x][y] = 0;
                }
            }
            for(x = 0; x < 4; x++) {
                copied_game_board[x][y] = order[x];
            }
        }
	  }
	  else if(strcmp(command, "DOWN") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 0; x < 4; x++) {
                order[x] = 0;
            }
            temp = 3;
            for(x = 3; x >= 0; x--) {
                if(copied_game_board[x][y] != 0){
                    order[temp] = copied_game_board[x][y];
                    temp -= 1;
                    copied_game_board[x][y] = 0;
                }
            }
            for(x = 3; x >= 0; x--) {
                copied_game_board[x][y] = order[x];
            }
        }
	  }
	  else if(strcmp(command, "LEFT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 0; y < 4; y++) {
                order[y] = 0;
            }
            temp = 0;
            for(y = 0; y < 4; y++) {
                if(copied_game_board[x][y] != 0) {
                    order[temp] = copied_game_board[x][y];
                    temp += 1;
                    copied_game_board[x][y] = 0;
                }
            }
            for(y = 0; y < 4; y++) {
                copied_game_board[x][y] = order[y];
            }
        }
	  }
	  else if(strcmp(command, "RIGHT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 0; y < 4; y++) {
                order[y] = 0;
            }
            temp = 3;
            for(y = 3; y >= 0; y--) {
                if(copied_game_board[x][y] != 0) {
                    order[temp] = copied_game_board[x][y];
                    temp-=1;
                    copied_game_board[x][y] = 0;
                }
            }
            for(y = 3; y >= 0; y--) {
                copied_game_board[x][y] = order[y];
            }
        }
	  }
    return;
}

void combine(int copied_game_board[4][4], char command[]) {
    int x, y;
    if(strcmp(command, "UP") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 0; x < 3; x++) {
                if(copied_game_board[x][y] == copied_game_board[x + 1][y]) {
                    copied_game_board[x][y] += copied_game_board[x][y];
                    copied_game_board[x + 1][y] = 0;
                }
            }
        }
    }
    else if(strcmp(command, "DOWN") == 0) {
        for(y = 0; y < 4; y++) {
            for(x = 3; x > 0; x--) {
                if(copied_game_board[x][y] == copied_game_board[x - 1][y]) {
                    copied_game_board[x][y] += copied_game_board[x][y];
                    copied_game_board[x - 1][y] = 0;
                }
            }
        }
    }
    else if(strcmp(command, "LEFT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 0; y < 3; y++) {
                if(copied_game_board[x][y] == copied_game_board[x][y + 1]) {
                    copied_game_board[x][y] += copied_game_board[x][y];
                    copied_game_board[x][y + 1] = 0;
                }
            }
        }
    }
    else if(strcmp(command, "RIGHT") == 0) {
        for(x = 0; x < 4; x++) {
            for(y = 3; y > 0; y--) {
                if(copied_game_board[x][y] == copied_game_board[x][y - 1]) {
                    copied_game_board[x][y] += copied_game_board[x][y];
                    copied_game_board[x][y - 1] = 0;
                }
            }
        }
    }
    return;
}

int heur_corner(int game_board[4][4]) {
    int tile_weight[4][4] = {
      { 17, 13, 11, 10 },
      { 13, 10, 9, 9 },
      { 11, 9, 8, 8 },
      { 10, 9, 8, 8 }
	  };
	  int x, y;
	  int sum = 0;
	  for(x = 0; x < 4; x++) {
		    for(y = 0; y < 4; y++) {
			      sum += game_board[x][y] * tile_weight[x][y];
		    }
	  }
	  return sum;
}

int heur_zero_tile(int game_board[4][4]) {
    int count = 0;
    int x, y;
    for(x = 0; x < 4; x++) {
		    for(y = 0; y < 4; y++) {
			      if(game_board[x][y] == 0) {
				        count += 1;
			      }
		    }
	  }
    return count * 100;
}
