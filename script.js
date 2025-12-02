const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const messageElement = document.getElementById('message');

// 카드 이미지 파일 이름 목록 (8쌍을 가정)
const cardIcons = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg']; 

let gameCards = [...cardIcons, ...cardIcons]; // 총 16장의 카드 (8쌍)

let flippedCards = []; 
let matchedPairs = 0;
let totalMoves = 0;
let isChecking = false; // 카드를 확인 중일 때 추가 클릭 방지

// --- 유틸리티 함수 ---

// Fisher-Yates 셔플 알고리즘: 배열을 무작위로 섞습니다.
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 게임 로직 함수 ---

// 게임 시작 및 보드 생성
function startGame() {
    // 상태 초기화
    totalMoves = 0;
    matchedPairs = 0;
    flippedCards = [];
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
        
        // 카드 내용 (front/back) - 이미지 태그 사용
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">
                    <img src="images/${icon}" alt="Card Image">
                </div>
                <div class="card-face card-back">?</div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement, icon));
        gameBoard.appendChild(cardElement);
    });
}

// 카드 뒤집기 로직
function flipCard(cardElement, icon) {
    // 이미 맞춘 카드, 이미 뒤집힌 카드, 확인 중일 때 클릭 무시
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
        
        setTimeout(checkMatch, 1000); // 1초 후 확인 함수 실행
    }
}

// 짝 확인 및 처리
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

// 게임 승리 메시지
function showWinMessage() {
    messageElement.classList.remove('hidden');
}

// 페이지 로드 시 게임 시작
document.addEventListener('DOMContentLoaded', startGame);
