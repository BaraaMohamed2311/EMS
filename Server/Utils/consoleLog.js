function colorLog(message, color) {
    color = color || "black";
    switch (color) {
        case "success":
            color = "\x1b[42m";
            break;
        case "info":
            color = "\x1b[44m";
            break;
        case "error":
            color = "\x1b[41m";
            break;
        case "warning":
            color = "\x1b[43m";
            break;
        default:
            color = color;
    }
    console.log(color + message + "\x1b[0m");
}

module.exports = colorLog;