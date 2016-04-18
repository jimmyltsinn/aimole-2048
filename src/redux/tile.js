export default function(value, row, col, isNew) {
    this.value = value;
    this.merged = 0;
    this.newVal = 0;
    this.row = row;
    this.col = col;
    this.oldRow = -1;
    this.oldCol = -1;
    this.direction = -1;
    this.newTile = isNew;
}
