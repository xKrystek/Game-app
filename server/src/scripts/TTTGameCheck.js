function GameCheck(board) {
  const { one, two, three, four, five, six, seven, eight, nine } = board;

  // Horizontal, Vertical and Diagnal
  if (
    (one === "O" && one === two && two === three) ||
    (four === "O" && four === five && five === six) ||
    (seven === "O" && seven === eight && eight === nine) ||
    (one === "O" && one === four && four === seven) ||
    (two === "O" && two === five && five === eight) ||
    (three === "O" && three === six && six === nine) ||
    (one === "O" && one === five && five === nine) ||
    (three === "O" && three === five && five === seven)
  )
    return "O";
  else if (
    (one === "X" && one === two && two === three) ||
    (four === "X" && four === five && five === six) ||
    (seven === "X" && seven === eight && eight === nine) ||
    (one === "X" && one === four && four === seven) ||
    (two === "X" && two === five && five === eight) ||
    (three === "X" && three === six && six === nine) ||
    (one === "X" && one === five && five === nine) ||
    (three === "X" && three === five && five === seven)
  )
    return "X";
  else if (
    one !== "" &&
    two !== "" &&
    three !== "" &&
    four !== "" &&
    five !== "" &&
    six !== "" &&
    seven !== "" &&
    eight !== "" &&
    nine !== ""
  )
    return "tie";
  else return false;
}

module.exports = GameCheck;
