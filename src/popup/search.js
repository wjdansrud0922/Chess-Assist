document.addEventListener('DOMContentLoaded', () => {
  const searchChessBtn = document.getElementById('search-chess-btn');
  const chessUsernameInput = document.getElementById('chess-username');
  const chessStatsResult = document.getElementById('chess-stats-result');
  const chessStatsData = document.getElementById('chess-stats-data');

  // Chess.com 전적 검색
  searchChessBtn.addEventListener('click', () => {
    const username = chessUsernameInput.value.trim();
    if (username) {
      fetchChessStats(username);
    }
  });

  // Chess.com 전적 가져오기
  function fetchChessStats(username) {
    fetch(`https://api.chess.com/pub/player/${username}/stats`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          // 각 게임 모드별 티어 계산 및 출력
          const stats = `
            <strong>불렛:</strong> ${data.chess_bullet.last.rating} (티어: ${calculateTier(data.chess_bullet.last.rating)})<br>
            <strong>블리츠:</strong> ${data.chess_blitz.last.rating} (티어: ${calculateTier(data.chess_blitz.last.rating)})<br>
            <strong>래피드:</strong> ${data.chess_rapid.last.rating} (티어: ${calculateTier(data.chess_rapid.last.rating)})<br>
          `;
          chessStatsData.innerHTML = stats;
          chessStatsResult.style.display = 'block';
        } else {
          chessStatsData.textContent = '사용자를 찾을 수 없습니다.';
          chessStatsResult.style.display = 'block';
        }
      })
      .catch(error => {
        chessStatsData.textContent = '전적을 가져오는 데 실패했습니다.';
        chessStatsResult.style.display = 'block';
        console.error('Chess.com API Error:', error);
      });
  }

// 레이팅에 따른 티어 계산 함수
function calculateTier(rating) {
  let tier, subTier;

  // 킹 (King)
  if (rating >= 1800) {
    tier = 'King';
    if (rating >= 1800 && rating <= 1879) subTier = 'V';
    else if (rating >= 1880 && rating <= 1949) subTier = 'IV';
    else if (rating >= 1950 && rating <= 2019) subTier = 'III';
    else if (rating >= 2020 && rating <= 2089) subTier = 'II';
    else subTier = 'I';
  }
  // 퀸 (Queen)
  else if (rating >= 1400) {
    tier = 'Queen';
    if (rating >= 1400 && rating <= 1479) subTier = 'V';
    else if (rating >= 1480 && rating <= 1549) subTier = 'IV';
    else if (rating >= 1550 && rating <= 1619) subTier = 'III';
    else if (rating >= 1620 && rating <= 1689) subTier = 'II';
    else subTier = 'I';
  }
  // 룩 (Rook)
  else if (rating >= 1000) {
    tier = 'Rook';
    if (rating >= 1000 && rating <= 1079) subTier = 'V';
    else if (rating >= 1080 && rating <= 1149) subTier = 'IV';
    else if (rating >= 1150 && rating <= 1219) subTier = 'III';
    else if (rating >= 1220 && rating <= 1289) subTier = 'II';
    else subTier = 'I';
  }
  // 나이트 (Knight)
  else if (rating >= 600) {
    tier = 'Knight';
    if (rating >= 600 && rating <= 679) subTier = 'V';
    else if (rating >= 680 && rating <= 749) subTier = 'IV';
    else if (rating >= 750 && rating <= 819) subTier = 'III';
    else if (rating >= 820 && rating <= 889) subTier = 'II';
    else subTier = 'I';
  }
  // 비숍 (Bishop)
  else if (rating >= 200) {
    tier = 'Bishop';
    if (rating >= 200 && rating <= 279) subTier = 'V';
    else if (rating >= 280 && rating <= 349) subTier = 'IV';
    else if (rating >= 350 && rating <= 419) subTier = 'III';
    else if (rating >= 420 && rating <= 489) subTier = 'II';
    else subTier = 'I';
  }
  // 폰 (Pawn)
  else if (rating >= 0) {
    tier = 'Pawn';
    if (rating >= 0 && rating <= 19) subTier = 'V';
    else if (rating >= 20 && rating <= 39) subTier = 'IV';
    else if (rating >= 40 && rating <= 59) subTier = 'III';
    else if (rating >= 60 && rating <= 79) subTier = 'II';
    else subTier = 'I';
  }

  return tier && subTier ? `${tier} ${subTier}` : "???";
}

});
