const Top = document.querySelector('.rig');
const rig = document.querySelector('.righty-rig')
const active = document.querySelector('.active')

const across = document.querySelectorAll('.across')
const x = document.querySelector('.x')


function checkWindowWidth() {
  // 获取视窗宽度
  var windowWidth = window.innerWidth;

  // 检查视窗宽度是否大于992px
  if (windowWidth > 992) {
    // 如果宽度大于992px，隐藏.righty-rig
    rig.style.display = 'none';
    rig.style.height = '0px';
  } else {
    // 如果宽度小于或等于992px，显示.righty-rig
    rig.style.display = '';
  }
}
// 在页面加载时检查视窗宽度
checkWindowWidth();

// 监听resize事件，以便在视窗大小变化时检查宽度
window.addEventListener('resize', checkWindowWidth);


Top.addEventListener('click', () => {
  console.log('点击了', Top);
  // console.log(list);

  rig.style.height = rig.style.height === '308px' ? '0px' : '308px';
  // rig.style.height = rig.style.height === 'auto' ? '0px' : 'auto';

  if (rig.style.height === '0px') {

    across.forEach(function (across) {
      across.style.display = 'block';
    });
    x.style.display = 'none';

  } else {

    x.style.display = 'block';
    across.forEach(function (across) {
      across.style.display = 'none';
    });

  }

});



// 初始值和结束值
let start = 16358656;
let end = 99999999.99;

let current = start;

let interval = 0.01; // 计数器增加的间隔，这里是0.01秒

// 格式化数字，每三位加逗号
function formatNumber(num) {
  let parts = num.toFixed(2).split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1];
  let formattedIntegerPart = '';

  while (integerPart.length > 3) {
    formattedIntegerPart = ',' + integerPart.slice(-3) + formattedIntegerPart;
    integerPart = integerPart.slice(0, -3);
  }

  formattedIntegerPart = integerPart + formattedIntegerPart;

  return formattedIntegerPart + '.' + decimalPart;
}

// 更新显示的函数
function updateDisplay() {
  document.getElementById('time-number').textContent = formatNumber(current);
}

// 计数器函数
function counter() {
  if (current >= end) {
    current = start; // 到达结束值时重置为初始值
  } else {
    current += interval;
  }
  updateDisplay();
}

// 启动计数器
setInterval(counter, 10); // 每10毫秒调用一次counter函数





const TenTxt = document.querySelectorAll('.ten-txt2');
const TenWriting = document.querySelectorAll('.ten-writing1');
const TenContents = document.querySelectorAll('.ten-txt3');

TenTxt.forEach((item, index) => {
  // console.log(item, index);

  item.addEventListener('click', () => {
    // console.log(item, index);

    // 切换当前点击项的写作符号和内容的显示状态
    const content = TenContents[index];

    if (content.classList.contains('expanded')) {

      // 如果已经展开，则隐藏内容并显示 '+'
      content.classList.remove('expanded');
      TenWriting[index].textContent = '+';
      console.log('点击内容隐藏', content);

    } else {

      // 移除所有内容的 'expanded' 类
      TenContents.forEach((content, contentIndex) => {
        if (content.classList.contains('expanded')) {
          content.classList.remove('expanded');
          TenWriting[contentIndex].textContent = '+';
        }
      });

      // 否则，展开内容并显示 '-'
      content.classList.add('expanded');
      TenWriting[index].textContent = '-';
      console.log('点击内容展开', content);
    }

  });

});






