function padBoth(str, spaces = 1) {
  return str.padStart(str.length + spaces, " ").padEnd(str.length + spaces * 2, " ");
}

module.exports = padBoth;