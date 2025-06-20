const gridLen = 5;
const numOfGridCells = gridLen * gridLen;

let defaultCellContents = shuffled([
    "Takes selfie",
    "Dances",
    "Tells a bad joke",
    "Receives a phone call",
    "Claps",
    "Initiates party game",
    "Screams",
    "Drops snack",
    "Introduces a friend",
    "Baffled by party game rules",
    "Uses word with 12 or more letters",
    "Misuses word or slang",
    "Swears",
    "Runs",
    "Uses stationery",
    "References obscure media",
    "\"Whoa\" / \"Wow\"",
    "Jumps",
    "Consults ChatGPT",
    "Asks someone to repeat what they said",
    "Facepalms",
    "Laughs for over 5 seconds",
    "Roasts someone",
    "Records video",
    "Grosses everyone out"
]);

let editMode = false;
let hasAchievedBingo = false;

function shuffled(list) {
    /* Returns a shuffled version of the list */
    return list.sort(() => Math.random() - 0.5);
}


function readCellDataFromURL() {
    /* If info from URL is insufficient, null is returned */

    let result = {
        cellContents: [],
        markedCells: []
    };

    let urlParams = new URLSearchParams(window.location.search);

    for (let i = 0; i < numOfGridCells; i++) {
        let cellContent = urlParams.get(i.toString());
        if (cellContent == null) {
            return null;
        }
        result.cellContents.push(cellContent);
    }

    return result;
}


function convertCurrBoardToURL() {
    let url = new URL(window.location);

    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            url.searchParams.set(y * gridLen + x, document.getElementById(`cell${x}${y}-content`).textContent);
        }
    }

    return url;
}


function readCellContentsFromLocalStorage() {
    let result = {
        cellContents: [],
        markedCells: []
    };

    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            let cellContent = localStorage.getItem(`cell${x}${y}-content`);
            if (cellContent == null) {
                return null;
            }
            result.cellContents.push(cellContent);
        }
    }

    let markedCellsAsString = localStorage.getItem("marked-cells");
    if (markedCellsAsString != null) {
        result.markedCells = markedCellsAsString
                            .split(",")
                            .map(s => parseInt(s));
    }
    
    return result;
}


function saveCurrBoardToLocalStorage() {
    let markedCells = [];

    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            localStorage.setItem(`cell${x}${y}-content`, document.getElementById(`cell${x}${y}-content`).textContent);

            if (document.getElementById(`cell${x}${y}`).classList.contains("marked-cell")) {
                markedCells.push(y * gridLen + x);
            }
        }
    }

    localStorage.setItem("marked-cells", markedCells.join(","));
}


function getCellData() {
    /*
    Returns the cell data for initialising cells at the start of the game.
    
    The function starts by checking the URL. If the URL contains sufficient information needed to create a custom bingo board, it is used for initialisation.

    Then, if window.localStorage contains cell contents stored from a previous session, those are returned.

    Finally, the default cell contents are returned.

    The returned value is an object:
    {
        cellContents: [ ... ]  // list of strings
        markedCells: [ ... ]  // list of integers from 0 to 24
    }
    */

    // Check URL
    let resultFromURL = readCellDataFromURL();
    if (resultFromURL != null) {
        return resultFromURL;
    }

    // Check local storage
    let resultFromLocalStorage = readCellContentsFromLocalStorage();
    if (resultFromLocalStorage != null) {
        return resultFromLocalStorage;
    }

    // If nothing works, return default
    return {
        cellContents: defaultCellContents,
        markedCells: []
    };
}


function init() {
    /*
    Initialises the site using the given bingo cell data (from URL/ from local storage/ by default).
    */

    let bingoCellData = getCellData();

    let bingoGrid = document.getElementById("bingo-grid");

    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            let i = y * gridLen + x;

            let newCell = document.createElement("div");
            newCell.classList.add("bingo-cell");
            if (bingoCellData.markedCells.includes(i)) {
                newCell.classList.add("marked-cell");
            }
            newCell.contentEditable = "false";
            newCell.id = `cell${x}${y}`;

            let newCellContent = document.createElement("div");
            newCellContent.classList.add("bingo-cell-content");
            newCellContent.id = newCell.id + "-content";

            newCellContent.textContent = bingoCellData.cellContents[i];
            
            newCell.appendChild(newCellContent);
            newCell.onclick = function() {cellPressed(newCell);}

            bingoGrid.appendChild(newCell);
        }
    }

    checkIfBingo();
}


function allCellsMarked(cells) {
    /*
    Given a list of cell elements, returns whether all of them have been marked.
    */
    return cells.every((c) => c.classList.contains("marked-cell"));
}


function checkIfBingo() {
    /*
    Checks if bingo has been achieved.
    If it has, the bingoed cells are returned.
    If not, an empty list is returned.
    */

    // Check rows
    for (let y = 0; y < gridLen; y++) {
        let row = [];
        for (let x = 0; x < gridLen; x++) {
            let cell = document.getElementById(`cell${x}${y}`);
            row.push(cell);
        }
        if (allCellsMarked(row)) {
            return row;
        }
    }

    // Check columns
    for (let x = 0; x < gridLen; x++) {
        let col = [];
        for (let y = 0; y < gridLen; y++) {
            let cell = document.getElementById(`cell${x}${y}`);
            col.push(cell);
        }
        if (allCellsMarked(col)) {
            return col;
        }
    }

    // Check diagonals
    let diagSE = [];
    let diagSW = [];
    for (let i = 0; i < gridLen; i++) {
        diagSE.push(document.getElementById(`cell${i}${i}`));
        diagSW.push(document.getElementById(`cell${gridLen - 1 - i}${i}`));
    }
    if (allCellsMarked(diagSE)) {
        return diagSE;
    }
    if (allCellsMarked(diagSW)) {
        return diagSW;
    }

    return [];
}


init();