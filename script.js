const wordListThreeLetters = [
    "ami", "âne", "art", "bal", "bac", "bas", "bol", "bon", "bus", "cap", 
    "car", "cri", "col", "cor", "cou", "dix", "dos", "duo", "eau", "été", 
    "feu", "fil", "fin", "fou", "gaz", "gel", "île", "jeu", "jet", "jus", 
    "lac", "lit", "lot", "lui", "mal", "mer", "mie", "moi", "mot", "mur", 
    "nez", "nom", "nul", "oui", "ouf", "par", "pas", "peu", "pie", "pin", 
    "pli", "pot", "pou", "riz", "roi", "sac", "sel", "ski", "sol", "son", 
    "sou", "sud", "tel", "the", "toi", "ton", "top", "tri", "tue", "tut", 
    "une", "uni", "van", "vie", "vin", "vif", "vol", "vue", "zoo"
];

const wordListFiveLetters = [
    "avion", "chien", "livre", "magie", "plage", "solde", "fleur", "brise",
    "route", "poire", "frein", "poule", "piano", "amour", "corde", "photo",
    "nuage", "monde", "matin", "sable", "vague", "forme", "porte", "fiche",
    "craie", "pluie", "fruit", "glace", "verre", "sapin", "stylo", "lundi",
    "table", "lampe", "champ", "sport", "temps", "jolie", "coeur", "veste",
    "carte", "danse", "foule", "blond", "hiver", "avril", "ecole", "train"
];

const wordLists = {
    3: wordListThreeLetters,
    5: wordListFiveLetters
};

let activeWordList = [];
let WORD_LENGTH ;
let MAX_ATTEMPTS = 5;
let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

function selectWordLength() {
    const availableLengths = Object.keys(wordLists);
    const randomIndex = Math.floor(Math.random() * availableLengths.length);
    return parseInt(availableLengths[randomIndex]);
}

function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * activeWordList.length);
    return activeWordList[randomIndex].toUpperCase();
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
    if (currentTile !== WORD_LENGTH ){
        console.log(`Erreur: Vous devez entrer ${WORD_LENGTH} lettres.`);
        alert(`Erreur: Vous devez entrer ${WORD_LENGTH} lettres.`);
        return;
    }
    if (gameOver) return;


    let word = '';
    const tiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .tile`);
    tiles.forEach(tile => {
        word += tile.textContent;
    });

    console.log(`Mot saisi: ${word}`);


    if (!activeWordList.includes(word.toLowerCase())) {
        console.log("Ce mot n'est pas dans la liste !");
        alert("Ce mot n'est pas dans la liste !");
        return;
    }

    const letterCounts = {};
    for (const letter of targetWord) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileLetter = word[i];
        const keyEl = document.querySelector(`.key[data-key="${tileLetter.toLowerCase()}"]`);

        if (tileLetter === targetWord[i]) {
            updateTile(currentRow, i, tileLetter, "correct");
            if (keyEl) {
                keyEl.classList.remove("present");
                keyEl.classList.add("correct");
            }
            letterCounts[tileLetter]--;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileLetter = word[i];
        const keyEl = document.querySelector(`.key[data-key="${tileLetter.toLowerCase()}"]`);

        if (tiles[i].classList.contains("correct")) continue;

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
        console.log("CORRECT! Le mot saisi correspond exactement au mot à deviner.");
        alert("Bravo ! Vous avez trouvé le mot !");
        gameOver = true;
        document.getElementById("restart").style.display = "block";
        return;
    } else {
        console.log(`Incorrect. ce n'est pas le mot à deviner.`);
        document.getElementById('message').textContent = `Essai ${currentRow + 1} sur ${MAX_ATTEMPTS}`;
    }


    currentRow++;
    currentTile = 0;

    if (currentRow === MAX_ATTEMPTS) {
        console.log(`Partie terminée. Le mot à deviner était: ${targetWord}`);
        alert(`Désolé, vous avez perdu ! Le mot était : ${targetWord}`);
        gameOver = true;
        document.getElementById("restart").style.display = "block";
    }
}

function initGame() {
    WORD_LENGTH = selectWordLength();
    activeWordList = wordLists[WORD_LENGTH];

    targetWord = selectRandomWord();
    currentRow = 0;
    currentTile = 0;
    gameOver = false;

    initializeGrid();
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
    document.getElementById("restart").style.display = "none";
    document.getElementById('message').textContent = `Trouvez le mot de ${WORD_LENGTH} lettres. Vous avez ${MAX_ATTEMPTS} essais.`;
    console.log(`Mot cible : ${targetWord} (${WORD_LENGTH} lettres)`);
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
document.addEventListener("keydown", handleKeyDown);
document.addEventListener('DOMContentLoaded', () => {

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
