function roomJoin (rooms, roomsIndex) {
  const ROOMS_NAMES = [];

  for (const keys of rooms.keys()) {
    // console.log(keys, "listed rooms");
    ROOMS_NAMES.push(keys);
  }

  const filtered = ROOMS_NAMES.filter((x) => x.match(/^room/));

  // console.log(filtered, "filtered");

  // eslint-disable-next-line array-callback-return, no-useless-return
  const result = filtered.filter((x) => {
    if (rooms.get(x).size < 2) return x;
  });
  // console.log(result, "result")

  if (filtered.length > 0 && result.length !== 0) {
    return `${result[0]}`;
  }

  // console.log("reached");
  return `room${++roomsIndex.roomNumber}`;
}

// const roomsSubsitute = new Map([
//     ["AJSDHKASHDJKSHDKASHDa", 1],
//     ["asda", 2]
// ]);

// roomJoin(roomsSubsitute);

module.exports = roomJoin;
