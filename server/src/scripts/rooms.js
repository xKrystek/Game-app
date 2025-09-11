function room_join(rooms, roomsIndex){

    const collator = new Intl.Collator(undefined, { numeric: true });

    const ROOMS_NAMES = [];

    for(const keys of rooms.keys()){
        // console.log(keys, "listed rooms");
        ROOMS_NAMES.push(keys);
    }

    const filtered = ROOMS_NAMES.filter((x) => x.match(/^room/));

    // console.log(filtered, "filtered");

    const result = filtered.filter(x => {
        if(rooms.get(x).size < 2) return x;
    })
    // console.log(result, "result")

    if(filtered.length > 0 && result.length !== 0){

            // sorting is used so that the user joins possible lowest numbered existing room
            // const sorted = result.sort(collator.compare);
            // console.log(sorted, "sorted");
            // const spliced = result.splice(0, 1);
            // console.log(spliced, "spliced");
            // console.log("triggered")
            // console.log(result, "spliced result")
            return `${result[0]}`;
    } 

    // console.log("reached");
    return `room${++roomsIndex.roomNumber}`;
}

// const roomsSubsitute = new Map([
//     ["AJSDHKASHDJKSHDKASHDa", 1],
//     ["asda", 2]
// ]);

// room_join(roomsSubsitute);

module.exports = room_join;