export default {
    message:
`
# 2048 Game Rule and Coding Guide #

## Goal ##
Write a program to slide numbered tiles on the grid to combine them!
When two tiles with the same number touch, they merge into one.
The goal is to get tiles with big value.

## Rule ##
Every turn, a new tile with a **value 2** will randomly appear in an empty spot on the **4 x 4** game board.
Tiles slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the grid.

## Language ##
Your program can be written in **C**, **Python**, **Javascript** or **Ruby**.
You can switch the mode of editor.

## Standard Input ##
You program will receive the input data in each turn.
The input data will be 16 integer numbers in the format as below.
0 represents an empty tile.
Please note that there is a space between two numbers and each row ends with a newline symbol \`\\n\`.

    0 2 0 0
    0 0 4 8
    0 2 4 8
    2 4 8 32

These input data represent the game board as below.

![2048 Screen Shot](./2048_Screen_Shot.png "Game Board Screen Shot")

## Standard Output ##
You program should write output in the following format to the standard output.
If you want the tiles to move up, output capital letters \`UP\` with a newline symbol \`\\n\` right after them.
For example, you may write \`printf("UP\\n");\` in C.
Similarly, output \`DOWN\`, \`LEFT\`, \`RIGHT\` to move tiles down, to left or to right respectively.

## Time Limit ##
Your program should give the output within **2s** per turn.
The limit of total run time is **2 minutes**.
Therefore, you are challenged to make good decision as fast as possible in order to survive till 2 minutes and achieve higher score.

Have Fun :)
===========

`
};
