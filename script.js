const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const messageElement = document.getElementById('message');

// 게임에 사용할 카드 내용 (이모지) - 각 항목은 2번씩 들어가야 짝이 됩니다.
const cardIcons = ['🍎', '🍌', '🥝', '🍓', '🍇', '🍍', '🍉', '🍑'];
let gameCards = [...cardIcons, ...cardIcons]; // 총 16장의 카드 (8쌍)

let flippedCards = []; // 현재 뒤집힌 카드 2장을 저장할 배열
let matchedPairs = 0;
let totalMoves = 0;
let isChecking = false; // 카드를 확인 중일 때 추가 클릭 방지

// Fisher-Yates 셔플 알고리즘: 배열을 무작위로 섞는 함수
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// === 1. 게임 시작 및 보드 생성 ===
function startGame() {
    // 상태 초기화
    totalMoves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = totalMoves;
    gameBoard.innerHTML = '';
    messageElement.classList.add('hidden');

    // 카드 섞기
    shuffle(gameCards);

    // 카드 요소 생성 및 보드에 추가
    gameCards.forEach((icon, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        
        // 카드 내용 (front/back) 추가
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">${icon}</div>
                <div class="card-face card-back">?</div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement, icon));
        gameBoard.appendChild(cardElement);
    });
}

// === 2. 카드 뒤집기 로직 ===
function flipCard(cardElement, icon) {
    // 짝을 맞춘 카드이거나, 이미 뒤집혔거나, 현재 2장을 확인 중이면 클릭 무시
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched') || isChecking) {
        return;
    }

    cardElement.classList.add('flipped');
    flippedCards.push({ element: cardElement, icon: icon });

    // 2장의 카드가 뒤집혔을 때 짝 확인
    if (flippedCards.length === 2) {
        isChecking = true; // 확인 중 상태 활성화
        totalMoves++;
        movesDisplay.textContent = totalMoves;
        
        // 짝이 맞는지 확인
        setTimeout(checkMatch, 1000); // 1초 후 확인 함수 실행
    }
}

// === 3. 짝 확인 및 처리 ===
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.icon === card2.icon) {
        // 짝이 맞을 경우: 'matched' 클래스 추가
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        
        // 게임 종료 확인
        if (matchedPairs === cardIcons.length) {
            setTimeout(showWinMessage, 500);
        }
    } else {
        // 짝이 틀릴 경우: 다시 뒤집기
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }

    // 다음 턴을 위해 초기화
    flippedCards = [];
    isChecking = false; 
}

// === 4. 게임 승리 메시지 ===
function showWinMessage() {
    messageElement.classList.remove('hidden');
}

// 페이지 로드 시 게임 시작
document.addEventListener('DOMContentLoaded', startGame);
