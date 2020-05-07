for (var i = 1; i <= 5; i++) {
    var str = '';
    for (var j = 1; j <= 5; j++) {
        let f = parseFloat(Math.random(9) + 1).toFixed(0);
        let l = parseFloat(Math.random(10)).toFixed(0);
        str += f + "" + l;
        if (j != 5)
            str += '\t\t';
    }
    console.log(str);
}