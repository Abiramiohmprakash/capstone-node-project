onload = function () {
    var input = document.getElementById("name");
    input.onfocus = function () {
        setTimeout(function () {
            input.setSelectionRange(0, 0);
        }, 0);
    };
};
