// ==UserScript==
// @name         MoeUB 第三方辅助工具
// @namespace    https://github.com/iwengx
// @version      1.0.0
// @description  MoeUB 第三方辅助工具，在 悠悠有品、网易Buff 网页下提供饰品代码的复制功能。更多功能待开发中，如果您有更好的想法欢迎留言。
// @author       iwengx
// @match        https://www.youpin898.com/market/*
// @match        https://buff.163.com/goods/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  "use strict";

  const operationWindowHTML = `<div class="iwengx-float-window" id="iwengxFloatWindow">
      <div class="iwengx-window-header" id="iwengxWindowHeader">
        <div class="iwengx-window-title">MoeUB 第三方辅助工具</div>
        <div class="iwengx-window-controls">
          <button
            class="iwengx-control-btn iwengx-minimize-btn"
            id="iwengxControlBtn"
          >-</button>
        </div>
      </div>
      <div class="iwengx-window-content">
        <div class="iwengx-content-desc">
          <span>服务器列表</span>
          <a href="https://csgo.moeub.cn/server" target="_blank">csgo.moeub.cn/server</a>
        </div>
         <div class="iwengx-content-desc">
          <span>试试换饰品吧</span>
          <a href="https://next.moeub.cn/cs2" target="_blank">next.moeub.cn/cs2</a>
        </div>
      </div>
    </div>`;

  const operationWindowCSS = `.iwengx-float-window {
        position: fixed;
        width: 320px;
        height: 240px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
      }
      .iwengx-float-window.dragging {
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        transform: scale(1.02);
        transition: box-shadow 0.2s ease, transform 0.2s ease;
      }
      .iwengx-float-window.iwengx-minimized {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .iwengx-float-window a {
        color: inherit;
      }
      .iwengx-float-window a:visited {
        color: inherit;
      }
      .iwengx-window-header {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 12px 16px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        transition: all 0.3s ease;
      }
      .iwengx-window-header:hover {
        background: linear-gradient(135deg, #43a3f5 0%, #00e8f5 100%);
      }
      .iwengx-minimized .iwengx-window-header {
        padding: 0;
        height: 45px;
        justify-content: center;
        border-radius: 50%;
      }
      .iwengx-window-title {
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
      }
      .iwengx-minimized .iwengx-window-title {
        font-size: 0;
      }
      .iwengx-minimized .iwengx-window-title::before {
        font-size: 20px;
      }
      .iwengx-window-controls {
        display: flex;
        gap: 8px;
        transition: all 0.3s ease;
      }
      .iwengx-minimized .iwengx-window-controls {
        opacity: 0;
        pointer-events: none;
      }
      .iwengx-control-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .iwengx-control-btn:hover {
        opacity: 0.8;
        transform: scale(1.1);
      }
      .iwengx-minimize-btn {
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .iwengx-window-content {
        padding: 12px;
        height: calc(100% - 48px);
        background: #fafafa;
        transition: all 0.3s ease;
      }
      .iwengx-minimized .iwengx-window-content {
        opacity: 0;
        height: 0;
        padding: 0;
        overflow: hidden;
      }
      .iwengx-content-desc {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .iwengx-minimized {
        cursor: pointer;
      }
      .iwengx-minimized:hover {
        transform: scale(1.1);
      }
      .iwengx-minimized.dragging:hover {
        transform: scale(1.12);
      }`;

  class IwengxDraggableWindow {
    constructor(windowElement, headerElement) {
      this.window = windowElement;
      this.header = headerElement;
      this.isDragging = false;
      this.isMinimized = false;
      this.startX = 0;
      this.startY = 0;
      this.startLeft = 0;
      this.startTop = 0;

      // 保存原始尺寸
      this.originalWidth = 320;
      this.originalHeight = 240;

      this.dragThreshold = 5; // 拖拽阈值，超过这个距离认为是拖拽
      this.hasDragged = false; // 是否发生了拖拽

      this.init();
    }

    init() {
      // 设置初始位置（屏幕中央）
      this.centerWindow();

      // 绑定事件
      this.header.addEventListener("mousedown", this.handleMouseDown.bind(this));
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));

      // 最小化状态下点击整个窗口恢复
      this.window.addEventListener("click", this.handleWindowClick.bind(this));

      // 防止拖拽时选中文本
      this.header.addEventListener("selectstart", (e) => e.preventDefault());
    }

    centerWindow() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elementWidth = this.window.offsetWidth;
      const elementHeight = this.window.offsetHeight;

      const left = (windowWidth - elementWidth) / 2;
      const top = (windowHeight - elementHeight) / 2;

      this.window.style.left = left + "px";
      this.window.style.top = top + "px";
    }

    handleMouseDown(e) {
      this.isDragging = true;
      this.hasDragged = false; // 重置拖拽状态

      // 记录鼠标按下时的位置和窗口位置
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startLeft = parseInt(this.window.style.left) || 0;
      this.startTop = parseInt(this.window.style.top) || 0;

      // 添加拖拽样式
      this.window.classList.add("dragging");
      document.body.classList.add("no-select");

      // 改变鼠标样式
      this.header.style.cursor = "grabbing";

      e.preventDefault();
    }

    handleMouseMove(e) {
      if (!this.isDragging) return;

      // 计算鼠标移动的距离
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      // 检查是否超过拖拽阈值
      if (Math.abs(deltaX) > this.dragThreshold || Math.abs(deltaY) > this.dragThreshold) {
        this.hasDragged = true;
      }

      // 计算新位置
      let newLeft = this.startLeft + deltaX;
      let newTop = this.startTop + deltaY;

      // 边界检测
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elementWidth = this.window.offsetWidth;
      const elementHeight = this.window.offsetHeight;

      // 限制在屏幕范围内
      newLeft = Math.max(0, Math.min(newLeft, windowWidth - elementWidth));
      newTop = Math.max(0, Math.min(newTop, windowHeight - elementHeight));

      // 应用新位置
      this.window.style.left = newLeft + "px";
      this.window.style.top = newTop + "px";
    }

    handleMouseUp() {
      if (!this.isDragging) return;

      this.isDragging = false;

      // 移除拖拽样式
      this.window.classList.remove("dragging");
      document.body.classList.remove("no-select");
      this.header.style.cursor = "move"; // 恢复鼠标样式

      // 延迟重置拖拽状态，避免立即触发点击事件
      setTimeout(() => {
        this.hasDragged = false;
      }, 10);
    }

    handleWindowClick(e) {
      // 只有在最小化状态下、没有发生拖拽且不是点击最小化按钮时才恢复
      if (this.isMinimized && !this.hasDragged && !e.target.classList.contains("iwengx-minimize-btn")) {
        this.toggleMinimize();
      }
    }

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;

      if (this.isMinimized) {
        // 最小化：缩小到 45x45
        this.window.classList.add("iwengx-minimized");
      } else {
        // 恢复：回到原始大小
        this.window.classList.remove("iwengx-minimized");
      }

      // 确保窗口不会超出屏幕范围
      setTimeout(() => {
        this.constrainToScreen();
      }, 300); // 等待动画完成
    }

    constrainToScreen() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elementWidth = this.window.offsetWidth;
      const elementHeight = this.window.offsetHeight;

      let left = parseInt(this.window.style.left) || 0;
      let top = parseInt(this.window.style.top) || 0;

      // 确保窗口不会超出屏幕范围
      left = Math.max(0, Math.min(left, windowWidth - elementWidth));
      top = Math.max(0, Math.min(top, windowHeight - elementHeight));

      this.window.style.left = left + "px";
      this.window.style.top = top + "px";
    }
  }

  // 全局变量存储窗口实例
  let iwengxDraggableWindow;

  document.body.insertAdjacentHTML("beforeend", operationWindowHTML);
  GM_addStyle(operationWindowCSS);

  // 初始化拖拽功能
  const iwengxFloatWindow = document.getElementById("iwengxFloatWindow");
  const iwengxWindowHeader = document.getElementById("iwengxWindowHeader");
  const iwengxControlBtn = document.getElementById("iwengxControlBtn");

  iwengxDraggableWindow = new IwengxDraggableWindow(iwengxFloatWindow, iwengxWindowHeader);

  iwengxControlBtn.addEventListener("click", () => {
    if (iwengxDraggableWindow) {
      iwengxDraggableWindow.toggleMinimize();
    }
  });

  // 响应式处理
  unsafeWindow.addEventListener("resize", () => {
    if (iwengxDraggableWindow) {
      iwengxDraggableWindow.constrainToScreen();
    }
  });
})();
