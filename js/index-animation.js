// DOMContentLoaded = DOM Ready! 確保 DOM 結構被完整的讀取跟解析 (DOM 結構被完整的讀取跟解析後就會被觸發，不須等待外部資源讀取完成)
document.addEventListener('DOMContentLoaded', function () {
  // 好評推薦
  const ele = document.querySelector('.recommendation-wall');
  // 拖曳標誌  grab & grabbing
  ele.style.cursor = 'grab';
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  // 滑鼠按下時拖曳
  const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };
  // Attach the handler
  ele.addEventListener('mousedown', mouseDownHandler);
});
// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
})

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}