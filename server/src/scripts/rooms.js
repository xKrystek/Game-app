function room_join(rooms, roomsIndex){

    const collator = new Intl.Collator(undefined, { numeric: true });

    const ROOMS_NAMES = [];

    for(const keys of rooms.keys()){
        console.log(keys);
        ROOMS_NAMES.push(keys);
    }

    const filtered = ROOMS_NAMES.filter((x) => x.length < 11);

    console.log(filtered, "filtered");

    if(filtered.length > 0){

        const result = filtered.map(x => {
            if(rooms.get(x).size < 2) return x;
        })
        if(result.length > 1){
            result.sort(collator.compare);
            result.splice(1);
            return `${result}`;
        }
        console.log(result, "answer");
        return `${result}`;
    } 

    return `room${++roomsIndex}`;
}

// const roomsSubsitute = new Map([
//     ["AJSDHKASHDJKSHDKASHDa", 1],
//     ["asda", 2]
// ]);

// room_join(roomsSubsitute);

module.exports = room_join;