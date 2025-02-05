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
    
    // 챌린저
    if (rating >= 2071) {
        tier = '챌린저';
        if (rating >= 2071 && rating <= 2100) subTier = 5;
        else if (rating >= 2101 && rating <= 2130) subTier = 4;
        else if (rating >= 2131 && rating <= 2160) subTier = 3;
        else if (rating >= 2161 && rating <= 2190) subTier = 2;
        else subTier = 1;
    }
    // 다이아몬드
    else if (rating >= 1488 && rating <= 2070) {
        tier = '다이아몬드';
        if (rating >= 1488 && rating <= 1562) subTier = 5;
        else if (rating >= 1563 && rating <= 1627) subTier = 4;
        else if (rating >= 1628 && rating <= 1692) subTier = 3;
        else if (rating >= 1693 && rating <= 1757) subTier = 2;
        else subTier = 1;
    }
    // 플레티넘
    else if (rating >= 1082 && rating <= 1487) {
        tier = '플레티넘';
        if (rating >= 1082 && rating <= 1150) subTier = 5;
        else if (rating >= 1151 && rating <= 1219) subTier = 4;
        else if (rating >= 1220 && rating <= 1288) subTier = 3;
        else if (rating >= 1289 && rating <= 1357) subTier = 2;
        else subTier = 1;
    }
    // 골드
    else if (rating >= 717 && rating <= 1081) {
        tier = '골드';
        if (rating >= 717 && rating <= 786) subTier = 5;
        else if (rating >= 787 && rating <= 856) subTier = 4;
        else if (rating >= 857 && rating <= 926) subTier = 3;
        else if (rating >= 927 && rating <= 996) subTier = 2;
        else subTier = 1;
    }
    // 실버
    else if (rating >= 348 && rating <= 716) {
        tier = '실버';
        if (rating >= 348 && rating <= 417) subTier = 5;
        else if (rating >= 418 && rating <= 487) subTier = 4;
        else if (rating >= 488 && rating <= 557) subTier = 3;
        else if (rating >= 558 && rating <= 627) subTier = 2;
        else subTier = 1;
    }
    // 브론즈
    else if (rating >= 100 && rating <= 347) {
        tier = '브론즈';
        if (rating >= 100 && rating <= 147) subTier = 5;
        else if (rating >= 148 && rating <= 195) subTier = 4;
        else if (rating >= 196 && rating <= 243) subTier = 3;
        else if (rating >= 244 && rating <= 291) subTier = 2;
        else subTier = 1;
    }
    // 아이언
    else if (rating >= 0 && rating <= 99) {
        tier = '아이언';
        if (rating >= 0 && rating <= 19) subTier = 5;
        else if (rating >= 20 && rating <= 39) subTier = 4;
        else if (rating >= 40 && rating <= 59) subTier = 3;
        else if (rating >= 60 && rating <= 79) subTier = 2;
        else subTier = 1;
    }
  
    return tier && subTier ? `${tier} ${subTier}` : "???";
  }
});
