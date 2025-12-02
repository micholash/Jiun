const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const messageElement = document.getElementById('message');

// 카드 이미지 파일 이름 목록 (8쌍을 가정)
// 이 파일들이 루트 폴더에 있어야 합니다.
const cardIcons = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg']; 

let gameCards = [...cardIcons, ...cardIcons]; 

let flippedCards = []; 
let matchedPairs = 0;
let totalMoves = 0;
let isChecking = false; 

// --- 유틸리티 함수 ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 게임 로직 함수 ---
function startGame() {
    totalMoves = 0;
    matchedPairs = 0;
    flippedCards = [];
    movesDisplay.textContent = totalMoves;
    gameBoard.innerHTML = '';
    messageElement.classList.add('hidden');

    shuffle(gameCards);

    gameCards.forEach((icon, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        
        // **★ 수정된 부분: 이미지 경로에서 'images/' 제거 ★**
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">
                    <img src="${icon}" alt="Card Image"> 
                </div>
                <div class="card-face card-back">?</div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement, icon));
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(cardElement, icon) {
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched') || isChecking) {
        return;
    }

    cardElement.classList.add('flipped');
    flippedCards.push({ element: cardElement, icon: icon });

    if (flippedCards.length === 2) {
        isChecking = true;
        totalMoves++;
        movesDisplay.textContent = totalMoves;
        
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.icon === card2.icon) {
        // 짝이 맞으면 'flipped'를 유지하고 'matched' 클래스만 추가 (계속 앞면 유지)
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === cardIcons.length) {
            setTimeout(showWinMessage, 500);
        }
    } else {
        // 짝이 틀리면 다시 뒤집음
        card1.element.classList.remove('flipped'); 
        card2.element.classList.remove('flipped');
    }

    flippedCards = [];
    isChecking = false; 
}

function showWinMessage() {
    messageElement.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', startGame);
