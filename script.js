let game = [];
let currentSelection = false;
let currentNeighbors = [];

//TODO: Expand game on button click

document.addEventListener('DOMContentLoaded', function() {
    // Game Initialization
    updateGame();
    console.log(game);
}, false);

function addFields() {
    // Get values of remaining Fields
    let newFields = [];
    for (let row of game) {
        for (let field of row) {
            if (field.active) newFields.push(field.value);
        }
    }
    
    // As long as there are new Values left, create new Fields and Rows
    while (newFields.length > 0) {
        console.log("==========");
        console.log(newFields);
        newFields = addButtonsToRow(newFields);
        console.log(newFields);
        if (newFields.length > 0) {
            console.log("adding row");
            addRowToGame();
        }
    }

    // Update the 2D game array
    updateGame();
}

function addButtonsToRow(newFields) {
    // Get last existing row and add elements until its full
    const rows = document.getElementsByClassName("row");
    const y = rows.length-1;
    const lastRow = rows[y];
    console.log(lastRow);
    const fields = lastRow.childElementCount;
    if (fields < 9) {
        for (let x = fields; x < 9; x++) {
            // Create Nodes
            const buttonNode = document.createElement("button");
            const divNode = document.createElement("div");
            const textNode = document.createTextNode(newFields.shift().toString());

            // Add coordinates and classes
            buttonNode.setAttribute("data-x", x);
            buttonNode.setAttribute("data-y", y);
            buttonNode.classList.add("number");
            buttonNode.addEventListener("click", function(event) {
                buttonClick(this);
                event.preventDefault();
            });
            divNode.classList.add("num");

            // Append Nodes
            divNode.appendChild(textNode);
            buttonNode.appendChild(divNode);
            lastRow.appendChild(buttonNode);

            if (newFields.length == 0) {
                return newFields;
            }
        }
    }
    return newFields;
}

function addRowToGame() {
    // Add a new row to the end of the game
    const gameElement = document.getElementById("game")
    const y = document.getElementsByClassName("row").length;

    // Create Node
    const divNode = document.createElement("div");

    // Add y coordinate and class
    divNode.setAttribute("data-y", y);
    divNode.classList.add("row");

    // Append Node
    gameElement.appendChild(divNode);
}

function buttonClick(button) {
    console.log(button);
    const value = parseInt(button.innerText);
    const x = parseInt(button.getAttribute("data-x"));
    const y = parseInt(button.getAttribute("data-y"));

    console.log(`clicked on ${x},${y}`)

    // do nothing if Field is already crossed out
    if (!game[y][x].active) {
        return
    }

    // select Field on click if nothing is currently selected
    if (!currentSelection) {
        game[y][x].toggleSelection();
        // highlight adjacent Fields
        setAdjacent(x,y);
        currentSelection = game[y][x];
        return
    }

    // Select adjacentField
    if (currentNeighbors.includes(game[y][x])) {
        currentSelection.toggleSelection();
        currentSelection.crossOut();
        game[y][x].crossOut();
        currentSelection = false;
        unsetAdjacent();
        return
    }

    // Deselect Field on second click
    if (currentSelection.x == x && currentSelection.y == y) {
        game[y][x].toggleSelection();
        //TODO: remove selected class from button
        currentSelection = false;
        unsetAdjacent();
        return
    }
}

function updateGame() {
    const divs = document.getElementsByClassName("row");
    for (let div of divs) {
        y = div.getAttribute("data-y");
        // skip row if all 9 values already exist
        if (y < (game.length-1)) continue;
        let row = [];
        const buttons = div.getElementsByClassName("number");
        for (let button of buttons) {
            x = button.getAttribute("data-x");
            value = button.firstChild.textContent;
            // if this is the last existing row
            if (y == (game.length-1)) {
                // skip value if value already exists
                if (x < game[y].length) continue;
                // push value in existing row, if row is not full
                else game[y].push(new Field(value, x, y, button));
            }
            // push value in new row, if row doesn't exist
            row.push(new Field(value, x, y, button));
        }
        // push new row in game
        if (y >= game.length) game.push(row);
    }
}

function setAdjacent(x, y) {
    let directions = [[0,-1],[1,0],[0,1],[-1,0]]
    for (dir of directions) {
        dX = dir[0];
        dY = dir[1];
        moveDirection(x, y, dX, dY);
    }
}

function unsetAdjacent() {
    for (button of currentNeighbors) {
        button.object.classList.remove("adjacent");
    }
    currentNeighbors = [];
}

function moveDirection(x, y, dX, dY) {
    // temp coordinades
    let a = x;
    let b = y;
    do {
        a += dX;
        b += dY;

        // move around to the left
        if (a < 0) {
            a = game[y].length-1;
        }
        // move around to the right
        if (a == game[y].length) {
            a = 0;
        }

        // move around to the top
        if (b < 0) {
            if (game[game.length-1].length > a) {
                b = game.length-1;
            } else {
                b = game.length-2;
            }
        }
        // move around to the bottom
        if (b > (game.length-1)) {
            b = 0;
        } else if (b == (game.length-1) && dY == 1) {
            if (a < game[b].length) {
                b = game.length-1;
            } else {
                b = 0;
            }
        }

        // found the next neighbor
        if (game[b][a].active) {
            if (game[b][a].value == game[y][x].value && (x != a || y != b)) {
                game[b][a].object.classList.add("adjacent");
                currentNeighbors.push(game[b][a]);
                //TODO: Add class to selected button to change appearance
            }
            return
        }
    // leave loop after one full rotation
    } while (a != x || b != y);
}