for (var i = 1; i <= 5; i++) {
    var str = '';
    for (var j = 1; j <= 5; j++) {
        str += parseInt(Math.random() * 9 + 1, 10) + '' + parseInt(Math.random() * 10, 10);
        if (j != 5)
            str += '\t';
    }
    console.log(str);
}