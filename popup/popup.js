document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.nav-btn, #settings-btn');
  const contents = {
    lichess: document.getElementById('lichess-content'),
    chess: document.getElementById('chess-content'),
    settings: document.getElementById('settings-content')
  };

  const subTabs = document.querySelectorAll('.sub-nav-btn');
  const subContents = {
    'lichess-settings': document.getElementById('lichess-settings'),
    'lichess-stats': document.getElementById('lichess-stats'),
    'lichess-misc': document.getElementById('lichess-misc'),
    'chess-settings': document.getElementById('chess-settings'),
    'chess-stats': document.getElementById('chess-stats'),
    'chess-misc': document.getElementById('chess-misc'),
    'extension-settings': document.getElementById('extension-settings'),
    'extension-stats': document.getElementById('extension-stats'),
    'extension-misc': document.getElementById('extension-misc')
  };

  // Show chess.com content by default
  contents.chess.style.display = 'block';
  document.querySelector('[data-tab="chess"]').classList.add('active');
  document.querySelector('[data-subtab="chess-settings"]').classList.add('active');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      Object.values(contents).forEach(content => content.style.display = 'none');
      tabs.forEach(t => t.classList.remove('active'));
      const tabName = tab.dataset.tab;
      contents[tabName].style.display = 'block';
      tab.classList.add('active');
      
      // Activate first sub-tab
      const firstSubTab = contents[tabName].querySelector('.sub-nav-btn');
      if (firstSubTab) {
        firstSubTab.click();
      }
    });
  });

  subTabs.forEach(subTab => {
    subTab.addEventListener('click', () => {
      const parentContent = subTab.closest('.content > div');
      parentContent.querySelectorAll('.sub-content').forEach(content => content.style.display = 'none');
      parentContent.querySelectorAll('.sub-nav-btn').forEach(btn => btn.classList.remove('active'));
      const subTabName = subTab.dataset.subtab;
      subContents[subTabName].style.display = 'block';
      subTab.classList.add('active');
    });
  });

  // 티어 스위치 기능
  const tierSwitch = document.getElementById('tierSwitch');
  
  // 저장된 상태 불러오기
  chrome.storage.sync.get(['useTier'], (result) => {
    tierSwitch.checked = result.useTier !== false;
  });

  // 스위치 상태 변경 시 저장 및 스크립트 실행/중지
  tierSwitch.addEventListener('change', (event) => {
    const useTier = event.target.checked;
    chrome.storage.sync.set({ useTier: useTier }, () => {
      // 설정 저장 후 현재 탭 새로고침
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});