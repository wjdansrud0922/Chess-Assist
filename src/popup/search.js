document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tab = this.getAttribute('data-tab');
      if (tab === 'chess') {
        document.getElementById('chess-content').style.display = 'block';
        document.getElementById('settings-content').style.display = 'none';
      } else if (tab === 'settings') {
        document.getElementById('chess-content').style.display = 'none';
        document.getElementById('settings-content').style.display = 'block';
      }
    });
  });
  

  document.querySelectorAll('#chess-content .sub-nav-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const subTab = this.getAttribute('data-subtab');
   
      document.querySelectorAll('#chess-content .sub-content').forEach(div => {
        div.style.display = 'none';
      });

      document.getElementById(subTab).style.display = 'block';
      

      if (subTab === 'chess-myinfo') {
        const storedUsername = localStorage.getItem('chessUsername');
        if (storedUsername) {
          initChessMyInfo(storedUsername, 'chess-myinfo');
        }
      }
    });
  });
  

  const searchChessBtn = document.getElementById('search-chess-btn');
  const chessUsernameInput = document.getElementById('chess-username');
  const chessStatsResult = document.getElementById('chess-stats-result');
  const chessStatsData = document.getElementById('chess-stats-data');
  
  searchChessBtn.addEventListener('click', () => {
    const username = chessUsernameInput.value.trim();
    if (username) {
      chessStatsData.innerHTML = "";
      chessStatsResult.style.display = 'none';
      const dynamicContainer = document.getElementById('chess-stats-dynamic');
      if (dynamicContainer) {
        dynamicContainer.innerHTML = "";
      }
      initChessMyInfo(username, 'chess-stats');
    }
  });
  

  
  function calculateTier(rating) {
    let tier, subTier;
    if (rating >= 1800) {
      if (rating <= 1879) { tier = 'King'; subTier = 'V'; }
      else if (rating <= 1949) { tier = 'King'; subTier = 'IV'; }
      else if (rating <= 2019) { tier = 'King'; subTier = 'III'; }
      else if (rating <= 2089) { tier = 'King'; subTier = 'II'; }
      else { tier = 'King'; subTier = 'I'; }
    } else if (rating >= 1400) {
      if (rating <= 1479) { tier = 'Queen'; subTier = 'V'; }
      else if (rating <= 1549) { tier = 'Queen'; subTier = 'IV'; }
      else if (rating <= 1619) { tier = 'Queen'; subTier = 'III'; }
      else if (rating <= 1689) { tier = 'Queen'; subTier = 'II'; }
      else { tier = 'Queen'; subTier = 'I'; }
    } else if (rating >= 1000) {
      if (rating <= 1079) { tier = 'Rook'; subTier = 'V'; }
      else if (rating <= 1149) { tier = 'Rook'; subTier = 'IV'; }
      else if (rating <= 1219) { tier = 'Rook'; subTier = 'III'; }
      else if (rating <= 1289) { tier = 'Rook'; subTier = 'II'; }
      else { tier = 'Rook'; subTier = 'I'; }
    } else if (rating >= 600) {
      if (rating <= 679) { tier = 'Bishop'; subTier = 'V'; }
      else if (rating <= 749) { tier = 'Bishop'; subTier = 'IV'; }
      else if (rating <= 819) { tier = 'Bishop'; subTier = 'III'; }
      else if (rating <= 889) { tier = 'Bishop'; subTier = 'II'; }
      else { tier = 'Bishop'; subTier = 'I'; }
    } else if (rating >= 200) {
      if (rating <= 279) { tier = 'Knight'; subTier = 'V'; }
      else if (rating <= 349) { tier = 'Knight'; subTier = 'IV'; }
      else if (rating <= 419) { tier = 'Knight'; subTier = 'III'; }
      else if (rating <= 489) { tier = 'Knight'; subTier = 'II'; }
      else { tier = 'Knight'; subTier = 'I'; }
    } else if (rating >= 0) {
      if (rating <= 19) { tier = 'Pawn'; subTier = 'V'; }
      else if (rating <= 39) { tier = 'Pawn'; subTier = 'IV'; }
      else if (rating <= 59) { tier = 'Pawn'; subTier = 'III'; }
      else if (rating <= 79) { tier = 'Pawn'; subTier = 'II'; }
      else { tier = 'Pawn'; subTier = 'I'; }
    }
    return tier && subTier ? `${tier} ${subTier}` : "???";
  }
  
  function initChessMyInfo(username, divId) {
    if (divId === 'chess-myinfo') {
      const myDiv = document.getElementById(divId);
      myDiv.innerHTML = `
        <h3>내 정보 - ${username}</h3>
        <div id="streak-info-${username}">스트릭 정보를 불러오는 중...</div>
        <div id="streak-graphic-${username}" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 2px;"></div>
        <div id="month-selector-container-${username}" style="margin-top: 10px;">
          <label for="month-selector-${username}">연도 선택: </label>
          <select id="month-selector-${username}"></select>
        </div>
        <div id="tier-summary-${username}" style="margin-top: 10px; font-size: 12px;"></div>
      `;
      loadMyInfo(username);
    } else if (divId === 'chess-stats') {
      const dynamicContainer = document.getElementById('chess-stats-dynamic');
      dynamicContainer.innerHTML = "";
      const resultWrapper = document.createElement('div');
      resultWrapper.className = "chess-search-result";
      resultWrapper.innerHTML = `
        <h3>${username}</h3>
        <div id="streak-info-${username}">스트릭 정보를 불러오는 중...</div>
        <div id="streak-graphic-${username}" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 2px;"></div>
        <div id="month-selector-container-${username}" style="margin-top: 10px;">
          <label for="month-selector-${username}">연도 선택: </label>
          <select id="month-selector-${username}"></select>
        </div>
        <div id="tier-summary-${username}" style="margin-top: 10px; font-size: 12px;"></div>
      `;
      dynamicContainer.appendChild(resultWrapper);
      fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
        .then(response => response.json())
        .then(data => {
          const archives = data.archives;
          const yearGroups = {};
          archives.forEach(url => {
            const parts = url.split('/');
            const year = parts[parts.length - 2];
            if (!yearGroups[year]) { yearGroups[year] = []; }
            yearGroups[year].push(url);
          });
          const yearSelector = document.getElementById(`month-selector-${username}`);
          yearSelector.innerHTML = '';
          const years = Object.keys(yearGroups).sort((a, b) => b - a);
          years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year}년`;
            yearSelector.appendChild(option);
          });
          yearSelector.addEventListener('change', (e) => {
            loadYearlyStreak(e.target.value, yearGroups[e.target.value], username);
          });
          if (yearSelector.options.length > 0) {
            loadYearlyStreak(yearSelector.options[0].value, yearGroups[yearSelector.options[0].value], username);
          }
        })
        .catch(err => {
          console.error("게임 아카이브 로드 오류:", err);
          document.getElementById(`streak-info-${username}`).textContent = "연도별 게임 데이터를 불러올 수 없습니다.";
        });
      fetchOverallTier(username, `tier-summary-${username}`);
    }
  }
  
  function loadMyInfo(username) {
    fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
      .then(response => response.json())
      .then(data => {
        const archives = data.archives;
        const yearGroups = {};
        archives.forEach(url => {
          const parts = url.split('/');
          const year = parts[parts.length - 2];
          if (!yearGroups[year]) { yearGroups[year] = []; }
          yearGroups[year].push(url);
        });
        const yearSelector = document.getElementById(`month-selector-${username}`);
        yearSelector.innerHTML = '';
        const years = Object.keys(yearGroups).sort((a, b) => b - a);
        years.forEach(year => {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = `${year}년`;
          yearSelector.appendChild(option);
        });
        yearSelector.addEventListener('change', (e) => {
          loadYearlyStreak(e.target.value, yearGroups[e.target.value], username);
        });
        if (yearSelector.options.length > 0) {
          loadYearlyStreak(yearSelector.options[0].value, yearGroups[yearSelector.options[0].value], username);
        }
      })
      .catch(err => {
        document.getElementById(`streak-info-${username}`).textContent = "연도별 게임 데이터를 불러올 수 없습니다.";
      });
    fetchOverallTier(username, `tier-summary-${username}`);
  }
  
  function loadYearlyStreak(year, archiveUrls, username) {
    const streakDiv = document.getElementById(`streak-info-${username}`);
    const graphicDiv = document.getElementById(`streak-graphic-${username}`);
    streakDiv.textContent = "게임 데이터를 불러오는 중...";
    graphicDiv.innerHTML = "";
    const promises = archiveUrls.map(url => fetch(url).then(response => response.json()));
    Promise.all(promises)
      .then(results => {
        let games = [];
        results.forEach(result => {
          if (result.games && result.games.length > 0) {
            games = games.concat(result.games);
          }
        });
        if (games.length === 0) {
          streakDiv.textContent = `${year}년에 플레이한 게임이 없습니다.`;
          return;
        }
        const dayCounts = countGamesPerDay(games);
        renderYearlyStreakGraphic(year, dayCounts, username);
        streakDiv.textContent = "";
      })
      .catch(err => {
        streakDiv.textContent = "게임 데이터를 불러오는 중 오류 발생.";
      });
  }
  
  function renderYearlyStreakGraphic(year, dayCounts, username) {
    const graphicDiv = document.getElementById(`streak-graphic-${username}`);
    graphicDiv.innerHTML = "";
    graphicDiv.style.display = 'flex';
    graphicDiv.style.flexDirection = 'column';
    graphicDiv.style.gap = '4px';
  
    let maxCount = 0;
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const count = dayCounts[dayStr] || 0;
        if (count > maxCount) maxCount = count;
      }
    }
    if (maxCount === 0) maxCount = 1;
  
    for (let month = 0; month < 12; month++) {
      const monthRow = document.createElement('div');
      monthRow.style.display = 'flex';
      monthRow.style.alignItems = 'center';
      monthRow.style.gap = '4px';
  
      const monthLabel = document.createElement('div');
      monthLabel.textContent = `${month + 1}월`;
      monthLabel.style.width = '30px';
      monthLabel.style.textAlign = 'right';
      monthRow.appendChild(monthLabel);
  
      const blockContainer = document.createElement('div');
      blockContainer.style.display = 'flex';
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const count = dayCounts[dayStr] || 0;
        const block = document.createElement('div');
        block.title = `${dayStr}: ${count}게임`;
        block.style.width = '10px';
        block.style.height = '10px';
        block.style.borderRadius = '2px';
        block.style.backgroundColor = (count === 0) ? '#ccc' : `rgba(0,128,0,${0.4 + (count / maxCount) * 0.6})`;
        blockContainer.appendChild(block);
      }
      monthRow.appendChild(blockContainer);
      graphicDiv.appendChild(monthRow);
    }
  
    setTimeout(() => {
      window.resizeTo(document.body.scrollWidth, document.body.scrollHeight);
    }, 200);
  }
  
  function countGamesPerDay(games) {
    const dayCounts = {};
    games.forEach(game => {
      const date = new Date(game.end_time * 1000);
      const dayStr = date.toISOString().slice(0, 10);
      dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1;
    });
    return dayCounts;
  }
  
  function fetchOverallTier(username, targetId) {
    fetch(`https://api.chess.com/pub/player/${username}/stats`)
      .then(response => response.json())
      .then(data => {
        let summaryHtml = "<h4>전체 티어 정리</h4>";
        summaryHtml += "<table style='width:100%; font-size:12px;'>";
        const modes = ['chess_bullet', 'chess_blitz', 'chess_rapid'];
        modes.forEach(mode => {
          if (data[mode] && data[mode].last) {
            const rating = data[mode].last.rating;
            const info = getTierInfo(rating);
            summaryHtml += `<tr>
              <td style="padding: 2px;">${mode.replace("chess_", "").toUpperCase()}</td>
              <td style="padding: 2px;">${rating} (${info.tier})</td>
              <td style="padding: 2px;">${info.nextThreshold ? (info.diff + "점 필요 (" + info.nextTier + ") 까지") : "최고 티어"}</td>
            </tr>`;
          }
        });
        summaryHtml += "</table>";
        document.getElementById(targetId).innerHTML = summaryHtml;
      })
      .catch(err => {
        document.getElementById(targetId).textContent = "티어 정보를 불러오는데 실패했습니다.";
      });
  }
  
  function getTierInfo(rating) {
    let info = {};
    for (let group of tiers) {
      if (rating >= group.subTiers[0].min && rating <= group.subTiers[group.subTiers.length - 1].max) {
        let currentSub = group.subTiers.find(sub => rating >= sub.min && rating <= sub.max);
        info.tier = group.name + " " + currentSub.label;
        let index = group.subTiers.findIndex(sub => sub.label === currentSub.label);
        if (currentSub.label === "I" && group.nextGroup) {
          info.nextThreshold = group.nextGroup.min;
          info.diff = info.nextThreshold - rating;
          info.nextTier = group.nextGroup.name + " V";
        } else if (index < group.subTiers.length - 1) {
          info.nextThreshold = group.subTiers[index + 1].min;
          info.diff = info.nextThreshold - rating;
          info.nextTier = group.name + " " + group.subTiers[index + 1].label;
        } else {
          info.nextThreshold = null;
          info.diff = 0;
          info.nextTier = "최고 티어";
        }
        return info;
      }
    }
    return { tier: "???", nextThreshold: null, diff: 0, nextTier: "???" };
  }
  
  const tiers = [
    {
      name: "Pawn",
      subTiers: [
        { label: "V", min: 0, max: 19 },
        { label: "IV", min: 20, max: 39 },
        { label: "III", min: 40, max: 59 },
        { label: "II", min: 60, max: 79 },
        { label: "I", min: 80, max: 199 }
      ],
      nextGroup: { name: "Bishop", min: 200 }
    },
    {
      name: "Bishop",
      subTiers: [
        { label: "V", min: 200, max: 279 },
        { label: "IV", min: 280, max: 349 },
        { label: "III", min: 350, max: 419 },
        { label: "II", min: 420, max: 489 },
        { label: "I", min: 490, max: 599 }
      ],
      nextGroup: { name: "Knight", min: 600 }
    },
    {
      name: "Knight",
      subTiers: [
        { label: "V", min: 600, max: 679 },
        { label: "IV", min: 680, max: 749 },
        { label: "III", min: 750, max: 819 },
        { label: "II", min: 820, max: 889 },
        { label: "I", min: 890, max: 999 }
      ],
      nextGroup: { name: "Rook", min: 1000 }
    },
    {
      name: "Rook",
      subTiers: [
        { label: "V", min: 1000, max: 1079 },
        { label: "IV", min: 1080, max: 1149 },
        { label: "III", min: 1150, max: 1219 },
        { label: "II", min: 1220, max: 1289 },
        { label: "I", min: 1290, max: 1399 }
      ],
      nextGroup: { name: "Queen", min: 1400 }
    },
    {
      name: "Queen",
      subTiers: [
        { label: "V", min: 1400, max: 1479 },
        { label: "IV", min: 1480, max: 1549 },
        { label: "III", min: 1550, max: 1619 },
        { label: "II", min: 1620, max: 1689 },
        { label: "I", min: 1690, max: 1799 }
      ],
      nextGroup: { name: "King", min: 1800 }
    },
    {
      name: "King",
      subTiers: [
        { label: "V", min: 1800, max: 1879 },
        { label: "IV", min: 1880, max: 1949 },
        { label: "III", min: 1950, max: 2019 },
        { label: "II", min: 2020, max: 2089 },
        { label: "I", min: 2090, max: Infinity }
      ],
      nextGroup: null
    }
  ];
  

  let storedUsername = localStorage.getItem('chessUsername');
  if (!storedUsername) {
    let username = prompt("Chess.com 사용자명을 입력하세요:");
    if (username) {
      fetch(`https://api.chess.com/pub/player/${username}`)
        .then(response => {
          if (response.ok) return response.json();
          else throw new Error("사용자명을 찾을 수 없습니다.");
        })
        .then(data => {
          localStorage.setItem('chessUsername', username);
          storedUsername = username;
       
        })
        .catch(err => {
          alert("올바른 Chess.com 사용자명이 아닙니다. 팝업을 새로고침하여 다시 시도해주세요.");
        });
    }
  }
  

  const extensionSettings = document.getElementById('extension-settings');
  if (extensionSettings) {
    extensionSettings.innerHTML = `
      확장 프로그램 설정<br>
      <button id="reRegisterBtn">사용자 재등록</button>
    `;
    document.getElementById('reRegisterBtn').addEventListener('click', () => {
      localStorage.removeItem('chessUsername');
      let newUsername = prompt("새로운 Chess.com 사용자명을 입력하세요:");
      if (newUsername) {
        fetch(`https://api.chess.com/pub/player/${newUsername}`)
          .then(response => {
            if (response.ok) return response.json();
            else throw new Error("사용자명을 찾을 수 없습니다.");
          })
          .then(data => {
            localStorage.setItem('chessUsername', newUsername);
            storedUsername = newUsername;
            const myInfoDiv = document.getElementById('chess-myinfo');
            if (myInfoDiv && myInfoDiv.style.display === 'block') {
              initChessMyInfo(newUsername, 'chess-myinfo');
            }
            alert("사용자명이 재등록되었습니다.");
          })
          .catch(err => {
            alert("올바른 Chess.com 사용자명이 아닙니다. 다시 시도해주세요.");
          });
      }
    });
  }
});
