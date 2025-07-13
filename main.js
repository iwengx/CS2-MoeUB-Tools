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
        <div class="iwengx-content-skin">
          <div class="iwengx-content-skin-title" id="iwengxContentSkinTitle">饰品代码（Ctrl + Alt + C 快速复制代码）</div>
          <textarea id="iwengxSkinCode" class="iwengx-skin-code" placeholder="鼠标移动到饰品图片上自动生成代码" row="5" spellcheck="false"></textarea>
        </div>
      </div>
    </div>`;

  const operationWindowCSS = `.iwengx-float-window {
      display: flex;
      flex-direction: column;
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
    .iwengx-float-window * {
      box-sizing: border-box;
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
      text-decoration: underline;
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
      color: #fff;
      background: transparent;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .iwengx-window-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px;
      width: 100%;
      height: 100%;
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
    .iwengx-content-skin{
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    .iwengx-content-skin-title {
      margin: 12px 0 4px 0;
    }
    .iwengx-content-skin textarea {
      flex: 1;
      width: 100%;
      height: 100%;
      color: #333;
      line-height: 1.5;
      padding: 8px;
      border-color: transparent;
      outline: transparent;
      resize: none;
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

  class DraggableWindow {
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
      this.resetWindowPosition();

      // 绑定事件
      this.header.addEventListener("mousedown", this.handleMouseDown.bind(this));
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));

      // 最小化状态下点击整个窗口恢复
      this.window.addEventListener("click", this.handleWindowClick.bind(this));

      // 防止拖拽时选中文本
      this.header.addEventListener("selectstart", (e) => e.preventDefault());
    }

    /**
     * 重新设置窗口位置，默认屏幕右下角
     */
    resetWindowPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elementWidth = this.window.offsetWidth;
      const elementHeight = this.window.offsetHeight;

      const left = windowWidth - elementWidth - 20; // 距离右边20px
      const top = windowHeight - elementHeight - 20; // 距离底部

      this.window.style.left = left + "px";
      this.window.style.top = top + "px";
    }

    handleMouseDown(e) {
      this.isDragging = true;
      this.hasDragged = false;

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
        this.window.classList.add("iwengx-minimized");
      } else {
        this.window.classList.remove("iwengx-minimized");
      }

      // 等待动画完成，确保窗口不会超出屏幕范围
      setTimeout(() => {
        this.constrainToScreen();
      }, 300);
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

  class BaseStrategy {
    init() {
      this.codeTextArea = document.getElementById("iwengxSkinCode");
      this.codeTitle = document.getElementById("iwengxContentSkinTitle");
    }

    copySkinCodeToClipboard() {
      const skinCode = this.codeTextArea.value.trim();
      GM_setClipboard(skinCode, "text", () => {
        this.codeTitle.innerText = "饰品代码（复制成功√）";
        setTimeout(() => {
          this.codeTitle.innerText = "饰品代码（Ctrl + Alt + C 快速复制代码）";
        }, 1000);
        this.copySuccessCallback();
      });
    }

    copySuccessCallback() {}

    run() {}
  }

  /**
   * 网易 Buff 策略
   */
  class Buff163Strategy extends BaseStrategy {
    constructor() {
      super();
      this.attrName = "data-asset-info";
      this.currentTr = null;
    }

    findTrInfoValue(el) {
      if (!el) return null;
      if (el.tagName === "TR" && el.attributes.hasOwnProperty(this.attrName)) {
        this.currentTr = el;
        return JSON.parse(el.attributes.getNamedItem(this.attrName).value);
      }
      return this.findTrInfoValue(el.parentNode);
    }

    onMouseMove = throttle((e) => {
      this.skinInfo = this.findTrInfoValue(e.target);
      this.getSkinCode();
    }, 100);

    // 拼接饰品代码
    getSkinCode() {
      if (!this.skinInfo) return "";
      const {
        info: { paintindex, paintseed },
        paintwear,
      } = this.skinInfo;

      const copyValue = `sm_skin knife_m9_bayonet ${paintindex} ${paintwear} ${paintseed} 0 0 0 0 0 0 0 0`;
      this.codeTextArea.value = copyValue;
    }

    copySuccessCallback() {
      if (this.currentTr) {
        this.currentTr.style.background = "antiquewhite";
      }
    }

    run() {
      document.addEventListener("mousemove", this.onMouseMove);
    }
  }

  /**
   * 悠悠有品策略
   */
  class YouPinStrategy extends BaseStrategy {
    run() {
      console.log("Running script for b.com", this.codeTextArea);
    }
  }

  // 确定当前 URL 并选择相应的策略
  function determineStrategy() {
    console.log("determineStrategy");

    const currentUrl = unsafeWindow.location.href;

    if (currentUrl.includes("buff.163.com")) {
      return new Buff163Strategy();
    }
    //
    else if (currentUrl.includes("youpin898.com")) {
      return new YouPinStrategy();
    }
    //
    else {
      return null;
    }
  }

  const strategy = determineStrategy();

  let draggableWindow;

  if (strategy) {
    // 初始化操作界面
    GM_addStyle(operationWindowCSS);
    document.body.insertAdjacentHTML("beforeend", operationWindowHTML);
    const controlBtn = document.getElementById("iwengxControlBtn");
    controlBtn.addEventListener("click", () => {
      if (draggableWindow) {
        draggableWindow.toggleMinimize();
      }
    });

    // 初始化拖拽功能
    const floatWindow = document.getElementById("iwengxFloatWindow");
    const windowHeader = document.getElementById("iwengxWindowHeader");
    draggableWindow = new DraggableWindow(floatWindow, windowHeader);

    // 响应式处理
    unsafeWindow.addEventListener("resize", () => {
      if (draggableWindow) {
        draggableWindow.constrainToScreen();
      }
    });

    unsafeWindow.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, altKey, keyCode } = e;
      // 复制
      if (ctrlKey | metaKey && altKey && keyCode === 67) {
        strategy.copySkinCodeToClipboard();
      }
    });

    // 执行策略
    strategy.init();
    strategy.run();
  }
  //
  else {
    alert("MoeUB 第三方辅助工具：在该页面没有找到可用的脚本");
  }

  /**
   * 简易的节流
   */
  function throttle(func, wait) {
    let timeout;
    let previous = 0;

    function throttled(...args) {
      const now = Date.now();
      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(this, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          func.apply(this, args);
        }, remaining);
      }
    }

    return throttled;
  }
})();
