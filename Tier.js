
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
  // tagline[1] = 상대 tagline[2] = 나
  for (let i = 0; i < tagline.length; i++) {

    const rating = tagline[i].querySelector('span.user-tagline-rating');

    if (rating !== null) {

      const ratingNum = parseInt(rating.innerHTML.replace(/\D/g,''), 10);
      const username = tagline[i].querySelector('.user-username-component').innerHTML; 

      if (!isNaN(ratingNum) && globalRatings.get(username) !== ratingNum) {
        swapNewRating(tagline[i], rating, ratingNum, username);
      }
    }
  }
  
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
}

function swapNewRating(parentNode, ratingNode, ratingNum, globalKey) {
  const newTierNode = makeRatingNode(ratingNum, globalKey);
  const previousTierNode = parentNode.querySelector('#previous-rating');
  if (previousTierNode !== null) {
    parentNode.removeChild(previousTierNode);
  }
  parentNode.insertBefore(newTierNode, ratingNode);
  ratingNode.style.display = 'none';
  globalRatings.set(globalKey, ratingNum);
}

function makeRatingNode(ratingNum) {
  const childNodeText = document.createTextNode(`(${calculateTier(ratingNum)})`);
  const childNode = document.createElement('span');
  childNode.setAttribute('id', 'previous-rating');
  childNode.style.color = 'hsla(0,0%,100%,.65)';
  childNode.appendChild(childNodeText);
  return childNode;
}

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

  return `${tier} ${subTier}`;
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


