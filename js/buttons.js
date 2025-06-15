function cellPressed(cell) {
    if (editMode || hasAchievedBingo) {
        return;
    }

    // Toggle between marked & unmarked
    cell.classList.toggle("marked-cell");

    // Check if bingo has been achieved
    let bingo = checkIfBingo();
    
    if (bingo.length == gridLen) {
        hasAchievedBingo = true;

        let waitTime = 300;  // 300ms between coloring each bingoed cell yellow

        for (let i = 0; i < gridLen; i++) {
            setTimeout(
                function() {bingo[i].classList.add("bingoed-cell");},
                waitTime * (i+1)
            );
        }

        setTimeout(
            function() {
                confetti(
                    {
                        particleCount: 250,
                        spread: 90,
                        startVelocity: 50
                    }
                );
            },
            waitTime * (gridLen + 1)
        );
    }
}

function editButtonPressed() {
    if (hasAchievedBingo) {
        return;
    }

    editMode = !editMode;

    let shuffleAndRestartButton = document.getElementById("shuffle-and-restart-button");

    for (let cellContent of document.getElementsByClassName("bingo-cell-content")) {
        cellContent.contentEditable = editMode ? "plaintext-only" : "false";
        cellContent.classList.toggle("editable-cell-content");
        shuffleAndRestartButton.classList.toggle("invalid-button");
    }

    let editButtonEditMessage = document.getElementById("edit-button-edit-message");
    let editButtonSaveMessage = document.getElementById("edit-button-save-message");

    editButtonEditMessage.style.display = editMode ? "none" : "block";
    editButtonSaveMessage.style.display = editMode ? "block" : "none";

    if (!editMode) {  // Finished editing
        saveCurrBoardToLocalStorage();
    }
}

function shuffleAndRestartButtonPressed() {
    if (editMode) {
        return;
    }

    let cellTexts = [];
    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            cellTexts.push(document.getElementById(`cell${x}${y}-content`).textContent);
        }
    }

    cellTexts = shuffled(cellTexts);

    for (let y = 0; y < gridLen; y++) {
        for (let x = 0; x < gridLen; x++) {
            let cell = document.getElementById(`cell${x}${y}`)
            cell.classList.remove("marked-cell");
            cell.classList.remove("bingoed-cell");
            
            document.getElementById(`cell${x}${y}-content`).textContent = cellTexts[y * gridLen + x];
        }
    }

    hasAchievedBingo = false;
}

function infoButtonPressed() {
    let infoBox = document.getElementById("info-box");

    if (infoBox.style.opacity == 0) {
        infoBox.style.opacity = 1;
        infoBox.style.pointerEvents = "auto";
    } else {
        infoBox.style.opacity = 0;
        infoBox.style.pointerEvents = "none";
    }
}


function setUpShareButtons() {
    document.getElementById("share-site-button").addEventListener("click", async () => {
        let url = new URL(window.location);
        url.search = '';  // Clear all URL search parameters

        let shareData = {
            title: "BINGO",
            text: "A fun party game that combines prediction, observation and playful interaction.",
            url: url,
        };

        try {
            await navigator.share(shareData);
        } catch {
            console.log("Sharing failed");
        }
    });

    document.getElementById("share-board-url-button").addEventListener("click", async () => {
        let shareData = {
            title: "BINGO",
            text: "Play my customised BINGO board!",
            url: convertCurrBoardToURL(),
        };
        try {
            await navigator.share(shareData);
        } catch {
            console.log("Sharing failed");
        }
    });
}

setUpShareButtons();