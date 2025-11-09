import resetBoard from "./scripts/reset-board.js";
const BOARD = document.querySelectorAll(".box");
const playerDisplayBoardButton = document.getElementById("playerBoard");
const computerDisplayBoardButton = document.getElementById("computerBoard");
const resetBoardButton = document.getElementById("resetBoard");

let POSSIBLE_INDEXES = [
    {value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}, 
    {value: 6}, {value: 7}, {value: 8}, {value: 9}, {value: 10}, {value: 11},
    {value: 12}, {value: 13}, {value: 14}, {value: 15}, {value: 16}, {value: 17},
    {value: 18}, {value: 19}, {value: 20}, {value: 21}, {value: 22}, {value: 23},
    {value: 24}, {value: 25}, {value: 26}, {value: 27}, {value: 28}, {value: 29}, 
    {value: 30}, {value: 31}, {value: 32}, {value: 33}, {value: 34}, {value: 35},
];

// const Reserved_Copy_Of_indexes = POSSIBLE_INDEXES.map(obj => ({...obj}));

function displayBoat(size){

    const boardCopy = [...BOARD];

    let randomBoxResult;

    let randomBox = () => randomBoxResult = Math.floor(boardCopy.length * Math.random());

    // Get random Box
    randomBox();

    if(POSSIBLE_INDEXES.every(x => x.value === undefined)){
        console.log("No box to place");
        return;
    }
    
    // Check if it is already occupied and if is choose other box
    while(POSSIBLE_INDEXES[randomBoxResult].value === undefined) randomBox();

    // set the chosen box as occuppied
    POSSIBLE_INDEXES[randomBoxResult].value = undefined;


    console.log(randomBoxResult, "randomBox");

    // Choose direction for a next box   
    const POSSIBLE_DIRECTIONS = [{direction: "LEFT"}, {direction: "RIGHT"}, {direction: "UP"}, {direction: "DOWN"}];

    let randomDirection;
    let index;
    let returnEarly;

    function chooseDirection(p_directions, r_direction, i){

    
        let pickDirection = () => {
            if(POSSIBLE_DIRECTIONS.length === 0){
                POSSIBLE_INDEXES[randomBoxResult].value = undefined;
                returnEarly = true;
                return;
            }
            i = Math.floor(Math.random() * POSSIBLE_DIRECTIONS.length);
            r_direction = p_directions[i].direction;
        }
        pickDirection();

        if(returnEarly) return;

        console.log(i, "index to choose random direction");
        console.log(r_direction, "random direction");

    
        switch(r_direction){
            case "LEFT":
                // If the box on the direction is not out of bound and is not occupied set the box.textContent and the possible_index as undefined
                if(randomBoxResult  % 6 !== 0 && boardCopy[randomBoxResult - 1].textContent === "" ){
                   POSSIBLE_INDEXES[randomBoxResult - 1].value = undefined;
                   boardCopy[randomBoxResult].textContent = "S";
                   boardCopy[randomBoxResult - 1].textContent = "S";
                   return 1;
                } 
                // Otherwise exclude the direction
                else {
                    POSSIBLE_DIRECTIONS.splice(i, 1);
                    return chooseDirection(p_directions, r_direction, i);
                }
            case "RIGHT":
                // If the box on the direction is not out of bound and is not occupied set the box.textContent and the possible_index as undefined
                if(randomBoxResult % 6 !== 5 && boardCopy[randomBoxResult + 1].textContent === ""  ){
                   POSSIBLE_INDEXES[randomBoxResult + 1].value = undefined;
                   boardCopy[randomBoxResult].textContent = "S";
                   boardCopy[randomBoxResult + 1].textContent = "S";
                   return 1;
                } 
                // Otherwise exclude the direction
                else {
                    POSSIBLE_DIRECTIONS.splice(i, 1);
                    return chooseDirection(p_directions, r_direction, i);
                }
            case "UP":
                // If the box on the direction is not out of bound and is not occupied set the box.textContent and the possible_index as undefined
                if(randomBoxResult - 6 >= 0 &&  boardCopy[randomBoxResult - 6].textContent === "" ){
                   POSSIBLE_INDEXES[randomBoxResult - 6].value = undefined;
                   boardCopy[randomBoxResult].textContent = "S";
                   boardCopy[randomBoxResult - 6].textContent = "S";
                   return 1;
                } 
                // Otherwise exclude the direction
                else {
                    POSSIBLE_DIRECTIONS.splice(i, 1);
                    return chooseDirection(p_directions, r_direction, i);
                }
            case "DOWN":
                // If the box on the direction is not out of bound and is not occupied set the box.textContent and the possible_index as undefined
                if(randomBoxResult + 6 <= 35 && boardCopy[randomBoxResult + 6].textContent === "" ){
                   POSSIBLE_INDEXES[randomBoxResult + 6].value = undefined;
                   boardCopy[randomBoxResult].textContent = "S";
                   boardCopy[randomBoxResult + 6].textContent = "S";
                   return 1;
                } 
                // Otherwise exclude the direction
                else {
                    POSSIBLE_DIRECTIONS.splice(i, 1);
                    return chooseDirection(p_directions, r_direction, i);
                }
        }
    }

    

    if(chooseDirection(POSSIBLE_DIRECTIONS, randomDirection, index) !== 1) displayBoat(0);

    console.log("Finished");

    return;
}

// displayBoat(0);

computerDisplayBoardButton.addEventListener("click", () => displayBoat(0));
resetBoardButton.addEventListener("click", () => resetBoard(BOARD, POSSIBLE_INDEXES));