let currentWish = '';
let currentName = '';

document.getElementById('tanzaku-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const wish = document.getElementById('wish').value.trim();
  const name = document.getElementById('name').value.trim();
  if (!wish) return;

  currentWish = wish;
  currentName = name;

  // 文字列を毎回ランダムな位置で3分割
  const len = wish.length;
  let idx1 = Math.floor(Math.random() * (len - 2)) + 1;
  let idx2 = Math.floor(Math.random() * (len - idx1 - 1)) + idx1 + 1;
  if (idx2 > len) idx2 = len;
  const parts = [wish.slice(0, idx1), wish.slice(idx1, idx2), wish.slice(idx2)];

  // 短冊生成
  const tanzaku = document.createElement('div');
  tanzaku.className = 'tanzaku';
  tanzaku.innerHTML = '';
  // 短冊の色をランダムに設定
  const tanzakuColors = ['#b6e97a', '#fff176', '#ffb6c1', '#81d4fa', '#ffb347']; // 黄緑, 黄色, 桃色, 水色, オレンジ
  // 10%の確率でレインボー
  if (Math.random() < 0.1) {
    tanzaku.style.background = 'linear-gradient(135deg, #ff0000, #ff9900, #ffee00, #33ff00, #00ffff, #0066ff, #cc00ff, #ff0000)';
    tanzaku.style.backgroundSize = '2000% 2000%';
    tanzaku.style.animation = 'rainbow-bg 1.2s linear infinite';
    tanzaku.style.boxShadow = '0 0 32px 8px rgba(255,255,255,0.7), 0 0 64px 16px rgba(255,0,255,0.4)';
    // 右下に"レインボー"ラベル
    const rainbowLabel = document.createElement('div');
    rainbowLabel.textContent = 'レインボー';
    rainbowLabel.style.position = 'absolute';
    rainbowLabel.style.right = '10px';
    rainbowLabel.style.bottom = '8px';
    rainbowLabel.style.fontSize = '0.8em';
    rainbowLabel.style.fontWeight = 'bold';
    rainbowLabel.style.background = 'linear-gradient(90deg, #ff0000, #ff9900, #ffee00, #33ff00, #00ffff, #0066ff, #cc00ff, #ff0000)';
    rainbowLabel.style.backgroundClip = 'text';
    rainbowLabel.style.webkitBackgroundClip = 'text';
    rainbowLabel.style.color = 'transparent';
    rainbowLabel.style.webkitTextFillColor = 'transparent';
    rainbowLabel.style.textShadow = '0 0 8px #fff, 0 0 16px #ff00ff';
    tanzaku.appendChild(rainbowLabel);
  } else {
    tanzaku.style.background = tanzakuColors[Math.floor(Math.random() * tanzakuColors.length)];
    tanzaku.style.animation = '';
    tanzaku.style.boxShadow = '';
  }

  // 3つの文字列を左から決まった高さで縦に並べる（高さを1〜5pxランダムでずらす）
  const baseLeft = 18; // %
  const baseTop = 20; // %
  const colGap = 32; // px
  for (let i = 0; i < 3; i++) {
    const part = parts[i];
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.left = `calc(${baseLeft}% + ${i * colGap}px)`;
    const topRand = baseTop + (Math.random() * 4 + 1); // 1〜5pxランダム
    span.style.top = `calc(${topRand}% )`;
    span.style.transform = 'rotate(0deg)';
    span.style.whiteSpace = 'nowrap';
    // 1文字ずつspanでラップし、ランダムなfont-size
    for (let c = 0; c < part.length; c++) {
      const charSpan = document.createElement('span');
      charSpan.textContent = part[c];
      const scale = 0.8 + Math.random() * 0.7; // 0.8〜1.5倍
      charSpan.style.fontSize = `${scale}em`;
      // レインボー機能は無し
      span.appendChild(charSpan);
    }
    tanzaku.appendChild(span);
  }

  document.getElementById('tanzaku-area').appendChild(tanzaku);
  // 名前が入力されていれば左下に小さく表示
  if (currentName) {
    const nameTag = document.createElement('div');
    nameTag.textContent = currentName;
    nameTag.style.position = 'absolute';
    nameTag.style.left = '8px';
    nameTag.style.bottom = '8px';
    nameTag.style.fontSize = '0.7em';
    nameTag.style.color = '#666';
    nameTag.style.opacity = '0.8';
    nameTag.style.fontFamily = "'Yusei Magic', 'Kosugi Maru', 'Yu Gothic', 'Meiryo', sans-serif";
    tanzaku.appendChild(nameTag);
  }
  document.getElementById('wish').value = '';
  document.getElementById('name').value = '';

  // 短冊画面に遷移
  showTanzakuScreen();
});

// 画面遷移機能
function showTanzakuScreen() {
  document.getElementById('input-screen').style.display = 'none';
  document.getElementById('tanzaku-screen').style.display = 'block';
}

function showInputScreen() {
  document.getElementById('input-screen').style.display = 'block';
  document.getElementById('tanzaku-screen').style.display = 'none';
  // 短冊エリアをクリア
  document.getElementById('tanzaku-area').innerHTML = '';
  currentWish = '';
}

// 戻るボタンのイベントリスナー
document.getElementById('back-btn').addEventListener('click', showInputScreen);

// 「同じ文字で再度短冊を作る」ボタンを追加
const remakeBtn = document.createElement('button');
remakeBtn.id = 'remake-btn';
remakeBtn.textContent = '同じ文字で再度短冊を作る';
remakeBtn.style.marginTop = '16px';
remakeBtn.style.padding = '12px 24px';
remakeBtn.style.background = '#e08a1e';
remakeBtn.style.color = 'white';
remakeBtn.style.border = 'none';
remakeBtn.style.borderRadius = '8px';
remakeBtn.style.fontSize = '1em';
remakeBtn.style.cursor = 'pointer';
remakeBtn.style.transition = 'background 0.3s';
remakeBtn.onmouseover = function(){remakeBtn.style.background='#c77719'};
remakeBtn.onmouseout = function(){remakeBtn.style.background='#e08a1e'};
document.getElementById('tanzaku-screen').appendChild(remakeBtn);

remakeBtn.addEventListener('click', function() {
  if (currentWish) {
    document.getElementById('tanzaku-area').innerHTML = '';
    // 再生成時もcurrentNameを使う
    const tanzaku = document.createElement('div');
    tanzaku.className = 'tanzaku';
    tanzaku.innerHTML = '';
    // 短冊の色をランダムに設定
    const tanzakuColors = ['#b6e97a', '#fff176', '#ffb6c1', '#81d4fa', '#ffb347'];
    if (Math.random() < 0.1) {
      tanzaku.style.background = 'linear-gradient(135deg, #ff0000, #ff9900, #ffee00, #33ff00, #00ffff, #0066ff, #cc00ff, #ff0000)';
      tanzaku.style.backgroundSize = '2000% 2000%';
      tanzaku.style.animation = 'rainbow-bg 1.2s linear infinite';
      tanzaku.style.boxShadow = '0 0 32px 8px rgba(255,255,255,0.7), 0 0 64px 16px rgba(255,0,255,0.4)';
      // 右下に"レインボー"ラベル
      const rainbowLabel = document.createElement('div');
      rainbowLabel.textContent = 'レインボー';
      rainbowLabel.style.position = 'absolute';
      rainbowLabel.style.right = '10px';
      rainbowLabel.style.bottom = '8px';
      rainbowLabel.style.fontSize = '0.8em';
      rainbowLabel.style.fontWeight = 'bold';
      rainbowLabel.style.background = 'linear-gradient(90deg, #ff0000, #ff9900, #ffee00, #33ff00, #00ffff, #0066ff, #cc00ff, #ff0000)';
      rainbowLabel.style.backgroundClip = 'text';
      rainbowLabel.style.webkitBackgroundClip = 'text';
      rainbowLabel.style.color = 'transparent';
      rainbowLabel.style.webkitTextFillColor = 'transparent';
      rainbowLabel.style.textShadow = '0 0 8px #fff, 0 0 16px #ff00ff';
      tanzaku.appendChild(rainbowLabel);
    } else {
      tanzaku.style.background = tanzakuColors[Math.floor(Math.random() * tanzakuColors.length)];
      tanzaku.style.animation = '';
      tanzaku.style.boxShadow = '';
    }
    // 3分割ロジック
    const len = currentWish.length;
    let idx1 = Math.floor(Math.random() * (len - 2)) + 1;
    let idx2 = Math.floor(Math.random() * (len - idx1 - 1)) + idx1 + 1;
    if (idx2 > len) idx2 = len;
    const parts = [currentWish.slice(0, idx1), currentWish.slice(idx1, idx2), currentWish.slice(idx2)];
    const baseLeft = 18;
    const baseTop = 20;
    const colGap = 32;
    for (let i = 0; i < 3; i++) {
      const part = parts[i];
      const span = document.createElement('span');
      span.style.position = 'absolute';
      span.style.left = `calc(${baseLeft}% + ${i * colGap}px)`;
      const topRand = baseTop + (Math.random() * 4 + 1);
      span.style.top = `calc(${topRand}% )`;
      span.style.transform = 'rotate(0deg)';
      span.style.whiteSpace = 'nowrap';
      for (let c = 0; c < part.length; c++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = part[c];
        const scale = 0.8 + Math.random() * 0.7;
        charSpan.style.fontSize = `${scale}em`;
        // レインボー機能は無し
        span.appendChild(charSpan);
      }
      tanzaku.appendChild(span);
    }
    // 名前が入力されていれば左下に小さく表示
    if (currentName) {
      const nameTag = document.createElement('div');
      nameTag.textContent = currentName;
      nameTag.style.position = 'absolute';
      nameTag.style.left = '8px';
      nameTag.style.bottom = '8px';
      nameTag.style.fontSize = '0.7em';
      nameTag.style.color = '#666';
      nameTag.style.opacity = '0.8';
      nameTag.style.fontFamily = "'Yusei Magic', 'Kosugi Maru', 'Yu Gothic', 'Meiryo', sans-serif";
      tanzaku.appendChild(nameTag);
    }
    document.getElementById('tanzaku-area').appendChild(tanzaku);
  }
});

// CSSアニメーション用の@keyframes追加
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow-bg {
    0% { background-position: 0% 50%; filter: brightness(1.2) saturate(2); }
    25% { background-position: 50% 100%; filter: brightness(1.5) saturate(2.5); }
    50% { background-position: 100% 50%; filter: brightness(1.2) saturate(2); }
    75% { background-position: 50% 0%; filter: brightness(1.5) saturate(2.5); }
    100% { background-position: 0% 50%; filter: brightness(1.2) saturate(2); }
  }
`;
document.head.appendChild(style);