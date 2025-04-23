const wordList = [
    "avion", "chien", "livre", "magie", "plage", "solde", "fleur", "brise",
    "route", "poire", "frein", "poule", "piano", "amour", "corde", "photo",
    "nuage", "monde", "matin", "sable", "vague", "forme", "porte", "fiche",
    "craie", "pluie", "fruit", "glace", "verre", "sapin", "stylo", "lundi",
    "table", "lampe", "champ", "sport", "temps", "jolie", "coeur", "veste",
    "carte", "danse", "foule", "blond", "hiver", "avril", "ecole", "train"
];

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex].toUpperCase();
}

function initializeGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
}

function updateTile(row, tile, letter, status = '') {
    const grid = document.getElementById('grid');
    const rows = grid.getElementsByClassName('row');
    const tiles = rows[row].getElementsByClassName('tile');
    tiles[tile].textContent = letter;
    if (status) {
        tiles[tile].classList.add(status);
    }
}

function addLetter(letter) {
    if (currentTile < WORD_LENGTH && !gameOver) {
        updateTile(currentRow, currentTile, letter);
        currentTile++;
    }
}

function removeLetter() {
    if (currentTile > 0 && !gameOver) {
        currentTile--;
        updateTile(currentRow, currentTile, '');
    }
}

function checkWord() {
    if (currentTile !== WORD_LENGTH || gameOver) return;

    let word = '';
    const tiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .tile`);
    tiles.forEach((tile, index) => {
        word += tile.textContent.toLowerCase();
    });

    if (!wordList.includes(word)) {
        alert("Ce mot n'est pas dans la liste !");
        return;
    }

    const letterCounts = {};
    for (const letter of targetWord) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileLetter = word[i];
        const keyEl = document.querySelector(`.key[data-key="${tileLetter}"]`);

        if (tileLetter === targetWord[i]) {
            updateTile(currentRow, i, tileLetter, "correct");
            keyEl.classList.remove("present");
            keyEl.classList.add("correct");
            letterCounts[tileLetter]--;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileLetter = word[i];
        const keyEl = document.querySelector(`.key[data-key="${tileLetter}"]`);

        if (tileLetter !== targetWord[i] && targetWord.includes(tileLetter) && letterCounts[tileLetter] > 0) {
            updateTile(currentRow, i, tileLetter, "present");
            if (!keyEl.classList.contains("correct")) {
                keyEl.classList.add("present");
            }
            letterCounts[tileLetter]--;
        } else if (tileLetter !== targetWord[i]) {
            updateTile(currentRow, i, tileLetter, "absent");
            if (!keyEl.classList.contains("correct") && !keyEl.classList.contains("present")) {
                keyEl.classList.add("absent");
            }
        }
    }

    if (word === targetWord) {
        alert("Bravo ! Vous avez trouvé le mot !");
        gameOver = true;
        document.getElementById("restart").style.display = "block";
        return;
    }

    currentRow++;
    currentTile = 0;

    if (currentRow === MAX_ATTEMPTS) {
        alert(`Désolé, vous avez perdu ! Le mot était : ${targetWord}`);
        gameOver = true;
        document.getElementById("restart").style.display = "block";
    }
}

function initGame() {
    targetWord = selectRandomWord();
    currentRow = 0;
    currentTile = 0;
    gameOver = false;

    initializeGrid();
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
    document.getElementById("restart").style.display = "none";
    document.getElementById('message').textContent = '';
    console.log(`Mot cible : ${targetWord}`);
}

function handleKeyDown(event) {
    if (gameOver) return;

    if (event.key === "Enter") {
        checkWord();
        return;
    } else if (event.key === "Backspace") {
        removeLetter();
        return;
    }

    const letter = /^[a-z]$/i.test(event.key) ? event.key.toUpperCase() : null;
    
    if (letter) {
        addLetter(letter);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', handleKeyDown);

    document.getElementById("restart").addEventListener('click', initGame);

    document.querySelector('.keyboard').addEventListener('click', function(event) {
        if (gameOver) return;
    
        const key = event.target;
    
        if (key.classList.contains('key') && key.dataset.key) {
            const keyValue = key.dataset.key;
            
            if (keyValue === "Enter") {
                checkWord();
            } else if (keyValue === "Backspace") {
                removeLetter();
            } else {
                addLetter(keyValue.toUpperCase());
            }
        }
    });

    initGame(); 
});
