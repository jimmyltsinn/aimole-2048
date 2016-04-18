export default function(matrix) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var col = 0; col < cols; ++col) {
            res[row][col] = matrix[col][cols - row - 1];
        }
    }
    return res;
};
