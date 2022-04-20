const tiles = document.querySelector('.tile-div');
const keyboard = document.querySelector('.keyboard');
const messageDiv = document.querySelector('.message-div');
const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '«'];
let correctWord;

const getWordle = () => {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            correctWord = json.toUpperCase()
        })
        .catch(err => console.log(err))
}
getWordle()
console.log(correctWord)
const guesses = Array.from(Array(6), () => new Array(5).fill(''));
let currRow = 0;
let currCol = 0;

guesses.forEach((row, rowIdx) => {
    const rowEl = document.createElement('div');
    rowEl.setAttribute('id', `row-${rowIdx}`);
    row.forEach((tile, tileIdx) =>{
        const tileEl = document.createElement('div');
        tileEl.setAttribute('id', `tile-${rowIdx}-${tileIdx}`);
        tileEl.classList.add('tile');
        rowEl.append(tileEl);
    });
    tiles.append(rowEl);
})
function whenClicked(key){
    if(key === '«'){
        deleteLetter();
        console.log('delete letter');
        return;
    }
    else if(key === 'ENTER'){
        console.log('check letter')
        checkWord();
        return;
    }
    if(currCol < 5 && currRow < 6)
        addLetter(key);
}
function addLetter(letter){
    const currTile = document.querySelector(`#tile-${currRow}-${currCol}`);
    currTile.innerText = letter;
    guesses[currRow][currCol] = letter;
    currTile.setAttribute('data', letter);
    ++currCol;
}
function deleteLetter(){
    if(currCol > 0){
        currCol--;
        const currTile = document.querySelector(`#tile-${currRow}-${currCol}`);
        currTile.innerText = '';
        guesses[currRow][currCol] = '';
        currTile.setAttribute('data', '');
    }
}
function checkWord(){
    if(currCol === 5){
        currGuess = guesses[currRow].join('');
        console.log(`Current guess is ${currGuess}, wordle is ${correctWord}`);
        flip();
        if(correctWord === currGuess){
            showMessage('Magnificent');
        }
        else{
            if(currRow >= 5){
                gameOver = true;
                showMessage('Game Over');
                return
            }
            currRow++;
            currCol = 0;
        }
    }
}
function flip(){
    const guessRow = document.querySelectorAll(`#row-${currRow} > div`);
    guessRow.forEach((guess, idx) =>{
        let guessVal = guess.innerText.charCodeAt(0);
        let expectedVal = correctWord.charCodeAt(idx);
        setTimeout(() => {
            guess.classList.add('flip');
            if(expectedVal > guessVal){
                guess.classList.toggle('blue');
            }
            else if(guessVal > expectedVal){
                guess.classList.toggle('red');
            }
            else{
                guess.classList.toggle('green');
            }
        }, 500 * idx);

    })
}
function showMessage(message){
    const newMessage = document.createElement('p');
    newMessage.innerText = message;
    messageDiv.append(newMessage);
    setTimeout(() => messageDiv.removeChild(newMessage), 2000);
}
keys.forEach(key => {
    const el = document.createElement('button');
    el.innerText = key;
    if(key === '«')
        el.setAttribute('id', 'BACK');
    else
        el.setAttribute('id', key);

    el.addEventListener('click', () => whenClicked(key));
    keyboard.append(el);
})