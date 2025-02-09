// board will contain the current state of the board.
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// we are going to contain array of arrays in board, nested array, 2d array, matrix

// function that will set the gameboard
function setGame(){
	// how can we initialize a 4x4 game board with all tiles set to 0
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	// Create the game board on the HTML document
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			// Create a div element representing a tile
			let tile = document.createElement("div");

			// Set a unique id for each tile based on its coordinates
			tile.id = r + "-" + c;

			let num = board[r][c];

			updateTile(tile, num);
			
			document.getElementById("board").append(tile);

		}
	}

	setTwo();
    setTwo();
}

// Function to update the appearance of a tile based on its number.
function updateTile(tile, num){
	// clear the tile
	tile.innerText = "";
	// clear the classList to avoid multiple classes
	tile.classList.value = "";

	// CSS class named "tile" is added to the calssList of the tile, this will be for styling the tiles
	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num;

		if(num <= 4096){
			tile.classList.add("x" + num);
		} else {
			tile.classList.add("x8192");
		}
	}
}

// event that triggers when the web page finishes loading, its like saying "wait until everything on the page is ready."
window.onload = function(){
	setGame();
}

// function that handles the user's keyboard input when they press certain arrow keys
function handleSlide(e){
	// console.log(e.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown".includes(e.code)]){
		// if statement that will be based on which arrow key was pressed.
		if(e.code == "ArrowLeft" && canMoveLeft()){
			slideLeft();
			setTwo();
		}else if(e.code == "ArrowRight" && canMoveRight()){
			slideRight();
			setTwo();
		}else if(e.code == "ArrowUp" && canMoveUp()){
			slideUp();
			setTwo();
		}else if(e.code == "ArrowDown" && canMoveDown()){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		if(hasLost()){
			alert("Game Over! You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart");
		}else{
			checkWin();
		}
	}, 100);
}

function restartGame(){
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

	score = 0;
	setTwo();
}

// Event Listener
document.addEventListener("keydown", handleSlide);

function slideLeft(){
	// iterate through each row
	for(let r = 0; r < rows; r++){
		// current array from the row
		let row = board[r]; //[0, 2, 0, 2] > [2,2]

		let originalRow = row.slice();

		row = slide(row); //[4, 0, 0, 0]

		// update the current state of the board.
		board[r] = row;

		// update the id of the tile
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s"

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}
	}
}

function slideRight(){
	for(let r = 0; r < rows; r++){
		let row = board[r];

		let originalRow = row.slice();

		row.reverse();

		row = slide(row);

		row.reverse();

		board[r] = row;

		// update the tiles
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);

		}

	}
}

function slideUp(){
	for(let c = 0; c < columns; c++){
		let col = board.map(row => row[c]);

		let originalCol = col.slice();

		col = slide(col);

		for(let r=0; r < rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}

	}
}

function slideDown(){
	for(let c = 0; c < columns; c++){
		let col = board.map(row => row[c]);

		let originalCol = col.slice();

		col.reverse();

		col = slide(col);

		col.reverse();
		for(let r=0; r < rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}
	}
}

function filterZero(row){
	// this filter will remove the zero element from our array
	return row.filter(num => num != 0);
}

function slide(row){
	// getting rid of zeroes
	row = filterZero(row);

	// if two adjacent numbers are equal
	for(let i = 0; i < row.length; i++){
		if(row[i] == row[i+1]){
			// merge them by doubling the first one
			row[i] *= 2;
			// and setting the second one to zero
			row[i+1] = 0;
			score += row[i];
		}
	}

	row = filterZero(row);

	// add zeroes back
	while(row.length < columns){
		row.push(0)
	}

	return row;
}

// Create a function that will check if there is an empty tile or none in the board
// Returns a boolean
function hasEmptyTile(){
    return board.some(row => row.some(col => col == 0))
}

// Create a function called setTwo()
// It will randomly add/create tile in the board
function setTwo(){
	// early exit if there is no available tile
	if(!hasEmptyTile()){
		return;
	}

	// found variable 
	let found = false;

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r + "-" + c);
			updateTile(tile, board[r][c])

			found = true;
		}
	}
}

// We are going to create a function that will check if there is possible move going to left
function canMoveLeft(){
	for(let r = 0; r < rows; r++){
		for(let c = 1; c < columns; c++){
			// console.log(`${r} - ${c}`);

			if(board[r][c] !== 0){
				if(board[r][c] == board[r][c-1] || board[r][c-1] == 0){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRight(){
	for(let r=0; r < rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] !== 0){
				if(board[r][c] == board[r][c+1] || board[r][c+1] == 0){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveUp(){
	for(let c = 0; c < columns; c++){
		for(let r = 1; r < rows; r++){
			if(board[r][c] != 0){
				if(board[r-1][c] == 0 || board[r-1][c] == board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown(){
	for(let c = 0; c < columns; c++){
		for(let r = rows - 2; r >= 0; r--){
			if(board[r][c] != 0){
				if(board[r+1][c] == 0 || board[r+1][c] == board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');
                is2048Exist = true;
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] === 0){
				return false;
			}

			const currentTile = board[r][c];

			if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
				return false;
			}
		}
	}

	return true;

}