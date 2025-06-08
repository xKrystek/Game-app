function GameCheck(board) {
  const { one, two, three, four, five, six, seven, eight, nine } = board;

  // Horizontal, Vertical and Diagnal
  if (
    (one !== "" && one === two && two === three) ||
    (four !== "" && four === five && five === six) ||
    (seven !== "" && seven === eight && eight === nine) ||
    (one !== "" && one === four && four === seven) ||
    (two !== "" && two === five && five === eight) ||
    (three !== "" && three === six && six === nine) ||
    (one !== "" && one === five && five === nine) ||
    (three !== "" && three === five && five === seven)
  )
    return true;
  else return false;
}

export default GameCheck;
