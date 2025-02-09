
let globalRatings = new Map();
let useTier = true;

function run() {
  const newRatingNode = document.querySelector('span.new-rating-component');
  if (newRatingNode) {
    newRatingNode.style.display = 'none';
  }
  const ratingChangeNode = document.querySelector('div.rating-change-right');
  if (ratingChangeNode) {
    ratingChangeNode.style.display = 'none';
  }

  // 사용자 태그라인
  const tagline = document.querySelectorAll('div.user-tagline-component:not(.archive-tab-player)');
  const userBlocks = document.querySelectorAll('div.cc-user-block-component');
  const gameraiting = document.querySelectorAll('div.game-overview-row');
  
  //게임 중 레이팅 -> 티어 변경
  for (let i = 0; i < tagline.length; i++) {

    const rating = tagline[i].querySelector('span.user-tagline-rating');

    if (rating !== null) {

      const ratingNum = parseInt(rating.innerHTML.replace(/\D/g,''), 10);
      console.log('Rating:', ratingNum);
      const username = tagline[i].querySelector('.user-username-component').innerHTML; 

      if (!isNaN(ratingNum) && globalRatings.get(username) !== ratingNum) {
        swapNewRating(tagline[i], rating, ratingNum, username);
      }
    }
  }

  //게임 종료 후 레이팅 -> 티어 변경
  for (let i = 0; i < userBlocks.length; i++) {
    const rating = userBlocks[i].querySelector('div.cc-user-rating-white');
    const username = userBlocks[i].querySelector('.cc-user-username-component').innerHTML;
    if (rating !== null) {
      const ratingNum = parseInt(rating.innerHTML.replace(/\D/g,''), 10);
      if (!isNaN(ratingNum) && globalRatings.get(username) !== ratingNum) {
        swapNewRating(userBlocks[i], rating, ratingNum, username);
      }
    }
  }

  // 게임 종료 후 퍼포먼스 레이팅(리뷰 창) -> 티어
  for (let i = 0; i < gameraiting.length; i++) {
    const rowTitle = gameraiting[i].querySelector('span.game-overview-row-title');
    // 타이틀이 "게임 레이팅"인지 확인
    if (rowTitle && rowTitle.textContent.trim() === '게임 레이팅') {
      const ratingElements = gameraiting[i].querySelectorAll('div.review-rating-component span');
      
      for (let j = 0; j < ratingElements.length; j++) {
        const ratingElement = ratingElements[j];
        
        if (ratingElement !== null) {
          const ratingNum = parseInt(ratingElement.textContent, 10);
          console.log(typeof ratingNum);
  
          if (!isNaN(ratingNum)) {
            ratingElement.textContent = '';
  
            const color = j === 0 ? '#000000' : '#FFFFFF';
            
            const tierNode = makeReviewNode(ratingNum, color);
            ratingElement.appendChild(tierNode);
          }
        }
      }
    }
  }
}

function swapNewRating(parentNode, ratingNode, ratingNum, globalKey) {
  const newTierNode = makeRatingNode(ratingNum);
  const previousTierNode = parentNode.querySelector('#previous-rating');
  if (previousTierNode !== null) {
    parentNode.removeChild(previousTierNode);
  }
  parentNode.insertBefore(newTierNode, ratingNode);
  ratingNode.style.display = 'none';
  globalRatings.set(globalKey, ratingNum);
}

function makeRatingNode(ratingNum) {
  const { Tier, col }= calculateTier(ratingNum);
  const childNodeText = document.createTextNode(`(${Tier})`);

  console.log('Calculated Tier:', childNodeText);
  
  const childNode = document.createElement('span');

  childNode.setAttribute('id', 'previous-rating');
  childNode.style.color = col;
  childNode.style.fontSize = '20px';

  childNode.appendChild(childNodeText);
  return childNode;
}



function makeReviewNode(ratingNum, color) {
  const { Tier, col }= calculateTier(ratingNum);
  const childNodeText = document.createTextNode(`(${Tier})`);
  console.log('Calculated Tier:', childNodeText);
  const childNode = document.createElement('span');

  childNode.setAttribute('id', 'previous-rating');
  childNode.style.color = color;
  childNode.style.fontSize = '12px';

  childNode.appendChild(childNodeText);
  return childNode;
}

function calculateTier(rating) {
  let tier, subTier, color;

  // 킹 (King)
  if (rating >= 1800) {
    tier = 'King';
    color = '#FFEB00';
    if (rating >= 1800 && rating <= 1879) subTier = 'V';
    else if (rating >= 1880 && rating <= 1949) subTier = 'IV';
    else if (rating >= 1950 && rating <= 2019) subTier = 'III';
    else if (rating >= 2020 && rating <= 2089) subTier = 'II';
    else subTier = 'I';
  }
  // 퀸 (Queen)
  else if (rating >= 1400) {
    tier = 'Queen';
    color = '#69247C';
    if (rating >= 1400 && rating <= 1479) subTier = 'V';
    else if (rating >= 1480 && rating <= 1549) subTier = 'IV';
    else if (rating >= 1550 && rating <= 1619) subTier = 'III';
    else if (rating >= 1620 && rating <= 1689) subTier = 'II';
    else subTier = 'I';
  }
  // 룩 (Rook)
  else if (rating >= 1000) {
    tier = 'Rook';
    color = '#754E1A';
    if (rating >= 1000 && rating <= 1079) subTier = 'V';
    else if (rating >= 1080 && rating <= 1149) subTier = 'IV';
    else if (rating >= 1150 && rating <= 1219) subTier = 'III';
    else if (rating >= 1220 && rating <= 1289) subTier = 'II';
    else subTier = 'I';
  }
  // 비숍 (Bishop)
  else if (rating >= 600) {
    tier = 'Bishop';
    color = '#344CB7';
    if (rating >= 600 && rating <= 679) subTier = 'V';
    else if (rating >= 680 && rating <= 749) subTier = 'IV';
    else if (rating >= 750 && rating <= 819) subTier = 'III';
    else if (rating >= 820 && rating <= 889) subTier = 'II';
    else subTier = 'I';
  }
  // 나이트 (Knight)
  else if (rating >= 200) {
    tier = 'Knight';
    color = '#8E1616';
    if (rating >= 200 && rating <= 279) subTier = 'V';
    else if (rating >= 280 && rating <= 349) subTier = 'IV';
    else if (rating >= 350 && rating <= 419) subTier = 'III';
    else if (rating >= 420 && rating <= 489) subTier = 'II';
    else subTier = 'I';
  }
  // 폰 (Pawn)
  else if (rating >= 0) {
    tier = 'Pawn';
    color = '#89A8B2';
    if (rating >= 0 && rating <= 19) subTier = 'V';
    else if (rating >= 20 && rating <= 39) subTier = 'IV';
    else if (rating >= 40 && rating <= 59) subTier = 'III';
    else if (rating >= 60 && rating <= 79) subTier = 'II';
    else subTier = 'I';
  }

  return { Tier: tier && subTier ? `${tier} ${subTier}` : "???", col: color };
}


chrome.storage.sync.get(['useTier'], (items) => {
  if (items['useTier'] === undefined) {
    chrome.storage.sync.set({ 'useTier': true });
  }
  if (items['useTier'] === false) {
    return;
  }

  var observer = new MutationObserver(function(mutations) {
    run();
  });

  observer.observe(document, { childList: true, subtree: true });
});


