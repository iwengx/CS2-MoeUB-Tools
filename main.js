// ==UserScript==
// @name         MoeUB 第三方辅助工具
// @namespace    https://github.com/iwengx
// @version      1.2.0
// @description  MoeUB 第三方辅助工具，在 悠悠有品、网易Buff 网页下提供饰品代码的复制功能。更多功能待开发中，如果您有更好的想法欢迎留言。
// @author       iwengx
// @match        https://www.youpin898.com/market/*
// @match        https://buff.163.com/goods/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/544393/MoeUB%20%E7%AC%AC%E4%B8%89%E6%96%B9%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544393/MoeUB%20%E7%AC%AC%E4%B8%89%E6%96%B9%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const operationWindowHTML = `<div class="iwengx-sidebar iwengx-sidebar-maximum" id="iwengxSideBar">
      <div class="iwengx-sidebar-wrapper">
        <a class="iwengx-bar-item" href="https://csgo.moeub.cn/server" target="_blank">
          <div class="iwengx-bar-item-icon">
            <div class="iwengx-icon-square" style="background:#5b8bd0;"></div>
          </div>
          <div class="iwengx-bar-item-description">MoeUB 服务器列表</div>
        </a>
        <a class="iwengx-bar-item" href="https://next.moeub.cn/cs2" target="_blank">
          <div class="iwengx-bar-item-icon">
            <div class="iwengx-icon-square" style="background:#9b59b6;"></div>
          </div>
          <div class="iwengx-bar-item-description">试试换饰品吧</div>
        </a>
        <a id="copyButton" class="iwengx-bar-item" :href="javascript:void(0);" title="复制当前饰品代码 (Ctrl + C)">
          <div class="iwengx-bar-item-icon">
            <div id="copyIconSquare" class="iwengx-icon-square" style="background:#1abc9c;"></div>
          </div>
          <div id="codeTextElement" class="iwengx-bar-item-description">当前饰品: 移动鼠标到饰品图片上</div>
        </a>
        <a class="iwengx-bar-item" href="https://github.com/iwengx/CS2-MoeUB-Tools" target="_blank">
          <div class="iwengx-bar-item-icon">
            <div class="iwengx-icon-square" style="background:#7f8c8d;"></div>
          </div>
          <div class="iwengx-bar-item-description">问题反馈 & 建议</div>
        </a>
        <div class="iwengx-bar-pin">
          <div id="iwengxBarPin" title="固定窗口大小" style="width: fit-content; height: fit-content;">
            <svg class="iwengx-bar-pin-icon" t="1752909936479" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2476" width="18" height="18"><path d="M648.728381 130.779429a73.142857 73.142857 0 0 1 22.674286 15.433142l191.561143 191.756191a73.142857 73.142857 0 0 1-22.137905 118.564571l-67.876572 30.061715-127.341714 127.488-10.093714 140.239238a73.142857 73.142857 0 0 1-124.684191 46.445714l-123.66019-123.782095-210.724572 211.699809-51.833904-51.614476 210.846476-211.821714-127.926857-128.024381a73.142857 73.142857 0 0 1 46.299428-124.635429l144.237715-10.776381 125.074285-125.220571 29.379048-67.779048a73.142857 73.142857 0 0 1 96.207238-38.034285z" p-id="2477"></path></svg>
          </div>
        </div>
      </div>
    </div>
    `;

  const operationWindowCSS = `
    .iwengx-sidebar {
      --iwengx-bar-minimum-width: 60px;
      --iwengx-bar-maximum-width: 320px;
    }
    .iwengx-sidebar {
      width: 60px;
      padding: 10px;
      box-sizing: content-box;
      position: fixed;
      left: 6px;
      top: 50%;
      z-index: 70;
      margin-top: -158px;
      border-radius: 6px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, .3);
      background: -webkit-gradient(linear, left top, left bottom, from(#26355d), to(#48273d));
      background: linear-gradient(180deg, #26355d 0%, #48273d 100%);
      overflow: hidden;
      transition: width .2s ease-in-out;
    }
    .iwengx-sidebar:hover,
    .iwengx-sidebar-wrapper {
      width: var(--iwengx-bar-maximum-width);
    }
    .iwengx-sidebar-maximum {
      width: var(--iwengx-bar-maximum-width) !important;
    }
    .iwengx-bar-item {
      display: flex;
      cursor: pointer;
      text-decoration: none;
      transition: background-color .2s ease-in-out;
    }
    .iwengx-bar-item:hover {
      background-color: hsla(0, 0%, 100%, .1);
    }
    .iwengx-bar-item-icon {
      width: var(--iwengx-bar-minimum-width);
      height: var(--iwengx-bar-minimum-width);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
    .iwengx-icon-square {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      transition: background-color .2s ease-in-out;
    }
    .iwengx-bar-item-description {
      flex: 1;
      color: #bebec4;
      display: flex;
      align-items: center;
    }
    .iwengx-bar-pin {
      padding: 10px 10px 0 0;
      display: flex;
      justify-content: flex-end;
    }
    .iwengx-bar-pin-icon {
      fill: #bebec4;
      cursor: pointer;
      transition: fill .2s ease-in-out;
    }
    .iwengx-bar-pin-icon:hover {
      fill: #fff;
    }
    .iwengx-bar-pin-active {
      transform: rotate(-45deg);
    }
    `;

  const skinJson = [
    {
      name: "沙漠之鹰",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔",
      model: "elite",
      type: "weapon",
    },
    {
      name: "FN57",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AK-47",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP",
      model: "awp",
      type: "weapon",
    },
    {
      name: "法玛斯",
      model: "famas",
      type: "weapon",
    },
    {
      name: "G3SG1",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M249",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A4",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P90",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MP5-SD",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "UMP-45",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "PP-野牛",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MAG-7",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "内格夫",
      model: "negev",
      type: "weapon",
    },
    {
      name: "截短霰弹枪",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "Tec-9",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪",
      model: "taser",
      type: "weapon",
    },
    {
      name: "P2000",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "MP7",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "新星",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SCAR-20",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "C4炸弹",
      model: "c4",
      type: "weapon",
    },
    {
      name: "M4A1消音版",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "CZ75自动型",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "R8左轮手枪",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "匕首",
      model: "knife",
      type: "melee",
    },
    {
      name: "匕首",
      model: "knife_t",
      type: "melee",
    },
    {
      name: "刺刀",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "狂牙手套",
      model: "studded_brokenfang_gloves",
      type: "glove",
      def: 4725,
    },
    {
      name: "血猎手套",
      model: "studded_bloodhound_gloves",
      type: "glove",
      def: 5027,
    },
    {
      name: "默认T手套",
      model: "t_gloves",
      type: "glove",
      def: 5028,
    },
    {
      name: "默认反恐精英手套",
      model: "ct_gloves",
      type: "glove",
      def: 5029,
    },
    {
      name: "运动手套",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "驾驶手套",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "裹手",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "摩托手套",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "专业手套",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "九头蛇手套",
      model: "studded_hydra_gloves",
      type: "glove",
      def: 5035,
    },
    {
      name: "闪光震撼弹",
      model: "flashbang",
      type: "utility",
    },
    {
      name: "高爆手雷",
      model: "hegrenade",
      type: "utility",
    },
    {
      name: "烟雾弹",
      model: "smokegrenade",
      type: "utility",
    },
    {
      name: "燃烧瓶",
      model: "molotov",
      type: "utility",
    },
    {
      name: "诱饵弹",
      model: "decoy",
      type: "utility",
    },
    {
      name: "燃烧弹",
      model: "incgrenade",
      type: "utility",
    },
    {
      name: "格洛克18型|地下水",
      model: "glock",
      type: "weapon",
    },
    {
      name: "Tec-9|地下水",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "FN57|红苹果",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|红苹果",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MAC-10|红苹果",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "PP-野牛|红苹果",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "新星|红苹果",
      model: "nova",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|森林DDPAT",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "MP7|森林DDPAT",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "刺刀|森林DDPAT",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|森林DDPAT",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|森林DDPAT",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|森林DDPAT",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|森林DDPAT",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|森林DDPAT",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|森林DDPAT",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|森林DDPAT",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|森林DDPAT",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|森林DDPAT",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|森林DDPAT",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|森林DDPAT",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|森林DDPAT",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|森林DDPAT",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|森林DDPAT",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|森林DDPAT",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|森林DDPAT",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|森林DDPAT",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|森林DDPAT",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|森林DDPAT",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "G3SG1|极寒迷彩",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "G3SG1|沙漠风暴",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "M4A4|沙漠风暴",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "AUG|孟加拉猛虎",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AUG|铜斑蛇",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MP7|死亡骷髅",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "CZ75自动型|深红之网",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|深红之网",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "刺刀|深红之网",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|深红之网",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|深红之网",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|深红之网",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|深红之网",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|深红之网",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|深红之网",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|深红之网",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|深红之网",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|深红之网",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|深红之网",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|深红之网",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|深红之网",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|深红之网",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|深红之网",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|深红之网",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|深红之网",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|深红之网",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|深红之网",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|深红之网",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "PP-野牛|水蓝条纹",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "AK-47|红色层压板",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "UMP-45|硝烟",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MP7|硝烟",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P250|硝烟",
      model: "p250",
      type: "weapon",
    },
    {
      name: "M4A4|丛林虎",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|都市DDPAT",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "M4A4|都市DDPAT",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|都市DDPAT",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "UMP-45|都市DDPAT",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "Tec-9|都市DDPAT",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "P90|病毒危机",
      model: "p90",
      type: "weapon",
    },
    {
      name: "P2000|坚毅大理石纹",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "法玛斯|对比涂装",
      model: "famas",
      type: "weapon",
    },
    {
      name: "M249|对比涂装",
      model: "m249",
      type: "weapon",
    },
    {
      name: "PP-野牛|森林之叶",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "新星|森林之叶",
      model: "nova",
      type: "weapon",
    },
    {
      name: "USP消音版|森林之叶",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|青苔虚线",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P250|骸骨外罩",
      model: "p250",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|骸骨外罩",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|深蓝电镀处理",
      model: "elite",
      type: "weapon",
    },
    {
      name: "内格夫|深蓝电镀处理",
      model: "negev",
      type: "weapon",
    },
    {
      name: "MP7|深蓝电镀处理",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "SG553|深蓝电镀处理",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "AWP|蝮蛇迷彩",
      model: "awp",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|蝮蛇迷彩",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "MAC-10|银质",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|银质",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P2000|银质",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "CZ75自动型|银质",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "AUG|赤红新星",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MP9|赤红新星",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "MAG-7|金属DDPAT",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P250|金属DDPAT",
      model: "p250",
      type: "weapon",
    },
    {
      name: "Tec-9|骨化之色",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|炽烈之炎",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "UMP-45|炽烈之炎",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|炽烈之炎",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "格洛克18型|渐变之色",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MAC-10|渐变之色",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "刺刀|渐变之色",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|渐变之色",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|渐变之色",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|渐变之色",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|渐变之色",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|渐变之色",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|渐变之色",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|渐变之色",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|渐变之色",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|渐变之色",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|渐变之色",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|渐变之色",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|渐变之色",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|渐变之色",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|渐变之色",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|渐变之色",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|渐变之色",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|渐变之色",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|渐变之色",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|渐变之色",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "MAG-7|威吓者",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|威吓者",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SG553|威吓者",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|噩梦之夜",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "格洛克18型|噩梦之夜",
      model: "glock",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|噩梦之夜",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "刺刀|噩梦之夜",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|噩梦之夜",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|噩梦之夜",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|噩梦之夜",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|噩梦之夜",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|噩梦之夜",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|噩梦之夜",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|噩梦之夜",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|噩梦之夜",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|噩梦之夜",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "截短霰弹枪|镀铜",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "XM1014|蓝钢",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "刺刀|蓝钢",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|蓝钢",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|蓝钢",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|蓝钢",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|蓝钢",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|蓝钢",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|蓝钢",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|蓝钢",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|蓝钢",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|蓝钢",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|蓝钢",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|蓝钢",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|蓝钢",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|蓝钢",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|蓝钢",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|蓝钢",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|蓝钢",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|蓝钢",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|蓝钢",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|蓝钢",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "双持贝瑞塔|人工染色",
      model: "elite",
      type: "weapon",
    },
    {
      name: "刺刀|人工染色",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|人工染色",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|人工染色",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|人工染色",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|人工染色",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|人工染色",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|人工染色",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|人工染色",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|人工染色",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|人工染色",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|人工染色",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|人工染色",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|人工染色",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|人工染色",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|人工染色",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|人工染色",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|人工染色",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|人工染色",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|人工染色",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|人工染色",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "FN57|表面淬火",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "AK-47|表面淬火",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "MAC-10|表面淬火",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "刺刀|表面淬火",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|表面淬火",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|表面淬火",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|表面淬火",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|表面淬火",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|表面淬火",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|表面淬火",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|表面淬火",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|表面淬火",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|表面淬火",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|表面淬火",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|表面淬火",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|表面淬火",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|表面淬火",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|表面淬火",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|表面淬火",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|表面淬火",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|表面淬火",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|表面淬火",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|表面淬火",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "双持贝瑞塔|雇佣兵",
      model: "elite",
      type: "weapon",
    },
    {
      name: "FN57|雇佣兵",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "AUG|雇佣兵",
      model: "aug",
      type: "weapon",
    },
    {
      name: "G3SG1|雇佣兵",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "SCAR-20|雇佣兵",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|殖民侵略者",
      model: "elite",
      type: "weapon",
    },
    {
      name: "AUG|殖民侵略者",
      model: "aug",
      type: "weapon",
    },
    {
      name: "法玛斯|殖民侵略者",
      model: "famas",
      type: "weapon",
    },
    {
      name: "格洛克18型|黑龙纹身",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AWP|雷击",
      model: "awp",
      type: "weapon",
    },
    {
      name: "刺刀|屠夫",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|屠夫",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|屠夫",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|屠夫",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|屠夫",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|屠夫",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|屠夫",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|屠夫",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|屠夫",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|屠夫",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|屠夫",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|屠夫",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|屠夫",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|屠夫",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|屠夫",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|屠夫",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|屠夫",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|屠夫",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|屠夫",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|屠夫",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "法玛斯|黑水",
      model: "famas",
      type: "weapon",
    },
    {
      name: "SSG08|黑水",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "M4A1消音版|黑水",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版|黑水",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|蛊惑之色",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "MP9|蛊惑之色",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SG553|蛊惑之色",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "新星|樱花之绚烂",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P90|冷血杀手",
      model: "p90",
      type: "weapon",
    },
    {
      name: "UMP-45|碳素纤维",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "PP-野牛|碳素纤维",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MAG-7|碳素纤维",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "SCAR-20|碳素纤维",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SSG08|碳素纤维",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P2000|致命红蝎",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "AK-47|狩猎网格",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|狩猎网格",
      model: "awp",
      type: "weapon",
    },
    {
      name: "G3SG1|狩猎网格",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "刺刀|狩猎网格",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|狩猎网格",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|狩猎网格",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|狩猎网格",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|狩猎网格",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|狩猎网格",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|狩猎网格",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|狩猎网格",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|狩猎网格",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|狩猎网格",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|狩猎网格",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|狩猎网格",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|狩猎网格",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|狩猎网格",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|狩猎网格",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|狩猎网格",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|狩猎网格",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|狩猎网格",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|狩猎网格",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|狩猎网格",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "AUG|鹰翼",
      model: "aug",
      type: "weapon",
    },
    {
      name: "G3SG1|极地迷彩",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "M249|暴雪大理石纹",
      model: "m249",
      type: "weapon",
    },
    {
      name: "加利尔AR|冬之森林",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "P250|北方森林",
      model: "p250",
      type: "weapon",
    },
    {
      name: "M4A1消音版|北方森林",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "刺刀|北方森林",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|北方森林",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|北方森林",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|北方森林",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|北方森林",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|北方森林",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|北方森林",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|北方森林",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|北方森林",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|北方森林",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|北方森林",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|北方森林",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|北方森林",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|北方森林",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|北方森林",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|北方森林",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|北方森林",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|北方森林",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|北方森林",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|北方森林",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "FN57|暮色森林",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "P250|暮色森林",
      model: "p250",
      type: "weapon",
    },
    {
      name: "加利尔AR|橙黄DDPAT",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|橙黄DDPAT",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "格洛克18型|粉红DDPAT",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AWP|粉红DDPAT",
      model: "awp",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|泥地杀手",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "UMP-45|泥地杀手",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "法玛斯|湖蓝涂装",
      model: "famas",
      type: "weapon",
    },
    {
      name: "UMP-45|色如焦糖",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|工业牧草",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "P2000|工业牧草",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "XM1014|蓝色云杉",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "SSG08|蓝色云杉",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "MAC-10|致命紫罗兰",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SG553|致命紫罗兰",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "刺刀|致命紫罗兰",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|致命紫罗兰",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|致命紫罗兰",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|致命紫罗兰",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|致命紫罗兰",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|致命紫罗兰",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|致命紫罗兰",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|致命紫罗兰",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "求生匕首|致命紫罗兰",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|致命紫罗兰",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|致命紫罗兰",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|致命紫罗兰",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|致命紫罗兰",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|致命紫罗兰",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|致命紫罗兰",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "MAG-7|沙丘之黄",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "新星|沙丘之黄",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|沙丘之黄",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SSG08|沙丘之黄",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "AUG|暴风呼啸",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P90|暴风呼啸",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MAG-7|暴风呼啸",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|暴风呼啸",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SCAR-20|暴风呼啸",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "加利尔AR|狂哮飓风",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M4A4|狂哮飓风",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|狂哮飓风",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SG553|狂哮飓风",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "MP7|银装素裹",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P250|银装素裹",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P2000|草原落叶",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "M4A1消音版|蒸汽波",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "新星|极地网格",
      model: "nova",
      type: "weapon",
    },
    {
      name: "AUG|众枪之的",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P90|冰川网格",
      model: "p90",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|水枪冲击",
      model: "elite",
      type: "weapon",
    },
    {
      name: "AK-47|局外人",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|书法涂鸦",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "USP消音版|027",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SCAR-20|沙漠网格",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SCAR-20|开拓者",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "M4A4|涡轮",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "加利尔AR|贤者涂装",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|贤者涂装",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "M249|催眠术",
      model: "m249",
      type: "weapon",
    },
    {
      name: "AUG|豪华装饰",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AK-47|丛林涂装",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|探戈",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "P90|沙漠涂装",
      model: "p90",
      type: "weapon",
    },
    {
      name: "P250|X射线",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|赛博恶魔",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P90|兰迪快冲",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SSG08|致命站点",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "格洛克18型|大金牙",
      model: "glock",
      type: "weapon",
    },
    {
      name: "P250|震中",
      model: "p250",
      type: "weapon",
    },
    {
      name: "UMP-45|黑色魅影",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "P90|擦擦",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AUG|扎佩姆斯之眼",
      model: "aug",
      type: "weapon",
    },
    {
      name: "XM1014|都市穿孔",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "SG553|浪花穿孔",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "AWP|克拉考",
      model: "awp",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|跷跷板",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|小甜使",
      model: "elite",
      type: "weapon",
    },
    {
      name: "MAC-10|鼠鼠我呀",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "FN57|橘皮涂装",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "MP7|橘皮涂装",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9|橘皮涂装",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "AK-47|怪兽在B",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "刺刀|都市伪装",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|都市伪装",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|都市伪装",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|都市伪装",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|都市伪装",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|都市伪装",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|都市伪装",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|都市伪装",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|都市伪装",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|都市伪装",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|都市伪装",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|都市伪装",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|都市伪装",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|都市伪装",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|都市伪装",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|都市伪装",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|都市伪装",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|都市伪装",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|都市伪装",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|都市伪装",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "内格夫|墙临弹雨",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|香肠地狱",
      model: "nova",
      type: "weapon",
    },
    {
      name: "XM1014|怪物汰换",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "G3SG1|丛林虚线",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "SSG08|丛林虚线",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "CZ75自动型|丛林虚线",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "PP-野牛|沙漠虚线",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MP9|沙漠虚线",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "PP-野牛|都市虚线",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "FN57|狂野丛林",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M249|狂野丛林",
      model: "m249",
      type: "weapon",
    },
    {
      name: "格洛克18型|凫色涂鸦",
      model: "glock",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|爆破能手",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|残影",
      model: "famas",
      type: "weapon",
    },
    {
      name: "M4A4|弹雨",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "P90|喵之萌杀",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MAC-10|棕榈色",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SCAR-20|棕榈色",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "新星|胡桃木",
      model: "nova",
      type: "weapon",
    },
    {
      name: "格洛克18型|黄铜",
      model: "glock",
      type: "weapon",
    },
    {
      name: "PP-野牛|黄铜",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "Tec-9|黄铜",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "SCAR-20|黄铜",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "M4A1消音版|请擦擦",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MP5-SD|霓虹榨汁机",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "P250|狂野飞溅",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AWP|CMYK",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M4A4|现代猎手",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "PP-野牛|现代猎手",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "新星|现代猎手",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|现代猎手",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SCAR-20|溅射果酱",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "XM1014|火焰橙",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "新星|火焰橙",
      model: "nova",
      type: "weapon",
    },
    {
      name: "M4A4|辐射危机",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "P250|核子威慑",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|辐射警告",
      model: "p90",
      type: "weapon",
    },
    {
      name: "UMP-45|辐射警告",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|辐射警告",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AK-47|捕食者",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "M249|捕食者",
      model: "m249",
      type: "weapon",
    },
    {
      name: "新星|捕食者",
      model: "nova",
      type: "weapon",
    },
    {
      name: "PP-野牛|辐照警报",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MAG-7|辐照警报",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|辐照警报",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "AK-47|黑色层压板",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|小猪猪",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP|*嘣*",
      model: "awp",
      type: "weapon",
    },
    {
      name: "P90|枯焦之色",
      model: "p90",
      type: "weapon",
    },
    {
      name: "UMP-45|枯焦之色",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MP7|枯焦之色",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "刺刀|枯焦之色",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "海豹短刀|枯焦之色",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "折叠刀|枯焦之色",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|枯焦之色",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|枯焦之色",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|枯焦之色",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|枯焦之色",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|枯焦之色",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|枯焦之色",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|枯焦之色",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|枯焦之色",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|枯焦之色",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|枯焦之色",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|枯焦之色",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|枯焦之色",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|枯焦之色",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|枯焦之色",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|枯焦之色",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|枯焦之色",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|枯焦之色",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "M4A4|渐变斑纹",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAG-7|记忆碎片",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "法玛斯|厄运之喵",
      model: "famas",
      type: "weapon",
    },
    {
      name: "Tec-9|核子威慑",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "AK-47|火蛇",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|珊瑚树",
      model: "awp",
      type: "weapon",
    },
    {
      name: "P90|翡翠之龙",
      model: "p90",
      type: "weapon",
    },
    {
      name: "USP消音版|疯狂蔓延",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "P2000|珊瑚树",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|黄金锦鲤",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "SG553|浪花喷漆",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "M4A4|星级",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|不可磨灭",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "M4A1消音版|澄澈之水",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|黑榄仁木",
      model: "elite",
      type: "weapon",
    },
    {
      name: "新星|兴风作浪",
      model: "nova",
      type: "weapon",
    },
    {
      name: "加利尔AR|支离破碎",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "UMP-45|白骨之堆",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "法玛斯|喷焰者",
      model: "famas",
      type: "weapon",
    },
    {
      name: "G3SG1|丰饶女神",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "SCAR-20|翡翠色调",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "AUG|深蓝电镀处理",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MAG-7|危机色调",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|干旱季节",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SSG08|玛雅之梦",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "内格夫|棕榈色",
      model: "negev",
      type: "weapon",
    },
    {
      name: "M249|丛林DDPAT",
      model: "m249",
      type: "weapon",
    },
    {
      name: "PP-野牛|外表生锈",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|马赛克",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "XM1014|狂野丛林",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "Tec-9|狂哮飓风",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "P250|多面体",
      model: "p250",
      type: "weapon",
    },
    {
      name: "格洛克18型|沙丘之黄",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MP7|地下水",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "FN57|电镀青铜",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "P2000|海之泡沫",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "AWP|石墨黑",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP7|海之泡沫",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "新星|石墨黑",
      model: "nova",
      type: "weapon",
    },
    {
      name: "M4A4|X射线",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "加利尔AR|蓝钛",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "Tec-9|蓝钛",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|血虎",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版|血虎",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "法玛斯|蓝巢",
      model: "famas",
      type: "weapon",
    },
    {
      name: "CZ75自动型|蓝巢",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "P250|红巢",
      model: "p250",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|血红蛋白",
      model: "elite",
      type: "weapon",
    },
    {
      name: "USP消音版|血清",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|水中之血",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "FN57|夜影",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "PP-野牛|水纹之印",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "新星|幽灵迷彩",
      model: "nova",
      type: "weapon",
    },
    {
      name: "AK-47|蓝色层压板",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|电子蜂巢",
      model: "awp",
      type: "weapon",
    },
    {
      name: "P90|盲点",
      model: "p90",
      type: "weapon",
    },
    {
      name: "G3SG1|碧蓝斑纹",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "格洛克18型|钢铁禁锢",
      model: "glock",
      type: "weapon",
    },
    {
      name: "P250|钢铁禁锢",
      model: "p250",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|钴蓝禁锢",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|深红之网",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "SCAR-20|深红之网",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SSG08|热带风暴",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P90|白蜡木",
      model: "p90",
      type: "weapon",
    },
    {
      name: "G3SG1|多变迷彩",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|多变迷彩",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "Tec-9|多变迷彩",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|多变迷彩",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "PP-野牛|午夜行动",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "USP消音版|午夜行动",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|都市瓦砾",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "加利尔AR|都市瓦砾",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "XM1014|蔚蓝多变迷彩",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "加利尔AR|金属榨汁机",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "法玛斯|加州迷彩",
      model: "famas",
      type: "weapon",
    },
    {
      name: "XM1014|加州迷彩",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "内格夫|加州迷彩",
      model: "negev",
      type: "weapon",
    },
    {
      name: "加利尔AR|隐蔽猎手",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "Tec-9|陆军网格",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "M249|鳄鱼网格",
      model: "m249",
      type: "weapon",
    },
    {
      name: "SG553|鳄鱼网格",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "法玛斯|摧枯拉朽",
      model: "famas",
      type: "weapon",
    },
    {
      name: "P90|摧枯拉朽",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MP7|陆军斥候",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "AUG|渐变琥珀",
      model: "aug",
      type: "weapon",
    },
    {
      name: "加利尔AR|渐变琥珀",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "MAC-10|渐变琥珀",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|渐变琥珀",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "P2000|渐变琥珀",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "SG553|大马士革钢",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|晶红石英",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "新星|晶红石英",
      model: "nova",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|钴蓝石英",
      model: "elite",
      type: "weapon",
    },
    {
      name: "UMP-45|逮捕者",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|逮捕者",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "MP7|逮捕者",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "AWP|响尾蛇",
      model: "awp",
      type: "weapon",
    },
    {
      name: "FN57|银白石英",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "SSG08|渐变强酸",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "FN57|氮化处理",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M4A1消音版|氮化处理",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|二西莫夫",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|北海巨妖",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "M4A1消音版|守护者",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "P250|曼海蒂",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AWP|红线",
      model: "awp",
      type: "weapon",
    },
    {
      name: "法玛斯|电子脉冲",
      model: "famas",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|海斗士",
      model: "elite",
      type: "weapon",
    },
    {
      name: "MP9|铁血玫瑰",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "新星|惊惧骷髅",
      model: "nova",
      type: "weapon",
    },
    {
      name: "加利尔AR|沙尘暴",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "FN57|神祇",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M249|岩浆",
      model: "m249",
      type: "weapon",
    },
    {
      name: "PP-野牛|钴蓝半调",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "CZ75自动型|花纹钢板",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "CZ75自动型|梅红时刻",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "CZ75自动型|维多利亚",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "P250|暗潮",
      model: "p250",
      type: "weapon",
    },
    {
      name: "Tec-9|钛片",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|遗产",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "FN57|铜色星系",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "P2000|红色碎片迷彩",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|黑豹",
      model: "elite",
      type: "weapon",
    },
    {
      name: "USP消音版|不锈钢",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "格洛克18型|蓝色裂纹",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AWP|二西莫夫",
      model: "awp",
      type: "weapon",
    },
    {
      name: "AUG|变色龙",
      model: "aug",
      type: "weapon",
    },
    {
      name: "UMP-45|下士",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AK-47|红线",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "P90|三角",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MAC-10|炽热",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "内格夫|青绿地形",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|古董枪",
      model: "nova",
      type: "weapon",
    },
    {
      name: "SG553|电子脉冲",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "法玛斯|中士",
      model: "famas",
      type: "weapon",
    },
    {
      name: "Tec-9|沙尘暴",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|守护者",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MAG-7|天空守卫",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|鼾龙传说",
      model: "taser",
      type: "weapon",
    },
    {
      name: "格洛克18型|夺命撼响",
      model: "glock",
      type: "weapon",
    },
    {
      name: "PP-野牛|夺命撼响",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "G3SG1|绿苹果",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|绿苹果",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "新星|绿苹果",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|富兰克林",
      model: "p250",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|陨星",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "加利尔AR|燕尾",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "CZ75自动型|燕尾",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "内格夫|军队之辉",
      model: "negev",
      type: "weapon",
    },
    {
      name: "MP9|军队之辉",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "新星|军队之辉",
      model: "nova",
      type: "weapon",
    },
    {
      name: "SCAR-20|军队之辉",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|军队之辉",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "CZ75自动型|军队之辉",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "新星|钢笼",
      model: "nova",
      type: "weapon",
    },
    {
      name: "AK-47|翡翠细条纹",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "M4A1消音版|原子合金",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|火神",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "Tec-9|艾萨克",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "SSG08|裂痕",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "AUG|力矩",
      model: "aug",
      type: "weapon",
    },
    {
      name: "PP-野牛|古董枪",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|报应",
      model: "elite",
      type: "weapon",
    },
    {
      name: "加利尔AR|神祇",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M4A4|咆哮",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|诅咒",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P90|沙漠战争",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SCAR-20|次时代",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "USP消音版|猎户",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|天空守卫",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "CZ75自动型|毒镖",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "AK-47|美洲猛虎",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "内格夫|*哒哒哒*",
      model: "negev",
      type: "weapon",
    },
    {
      name: "USP消音版|公路杀手",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|迂回路线",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "XM1014|血红巨蟒",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "M4A1消音版|神来之作",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "CZ75自动型|氮化处理",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|外表生锈",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "新星|外表生锈",
      model: "nova",
      type: "weapon",
    },
    {
      name: "新星|约克夏",
      model: "nova",
      type: "weapon",
    },
    {
      name: "CZ75自动型|复古圣杯",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "M4A1消音版|骑士",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAG-7|坚固链甲",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P2000|坚固链甲",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|手上加农炮",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "MP9|黑暗时代",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|蔷薇",
      model: "elite",
      type: "weapon",
    },
    {
      name: "MP9|极寒三色",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "USP消音版|宝蓝之色",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|紫青之色",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "UMP-45|紫青之色",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "CZ75自动型|紫青之色",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "CZ75自动型|螺形扭转",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "P90|深蓝组件",
      model: "p90",
      type: "weapon",
    },
    {
      name: "M4A4|沙漠精英",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|烧尽",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P2000|电子脉冲",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "USP消音版|凯门鳄",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|酷炫涂鸦皮革",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AK-47|至高皮革",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "P90|棕色皮革",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MAC-10|通勤者皮革",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "AWP|巨龙传说",
      model: "awp",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|至高皮革",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "P2000|廉价皮革",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|飞行员",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "XM1014|红色皮革",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "PP-野牛|死亡主宰者",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "CZ75自动型|猛虎",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|阴谋者",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "FN57|狩猎利器",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|水灵",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MP7|都市危机",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "内格夫|沙漠精英",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|锦鲤",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P2000|乳白象牙",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P250|超新星",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|二西莫夫",
      model: "p90",
      type: "weapon",
    },
    {
      name: "M4A1消音版|次时代",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|无尽深海",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "UMP-45|迷之宫",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "SG553|旅行者皮革",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "USP消音版|商业皮革",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MP7|橄榄格纹",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9|绿色格纹",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "CZ75自动型|绿色格纹",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "格洛克18型|核子反应",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MP9|落日",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "内格夫|核子废渣",
      model: "negev",
      type: "weapon",
    },
    {
      name: "XM1014|碾骨机",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "法玛斯|冥界之憎",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MAC-10|核子花园",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P250|核子污染",
      model: "p250",
      type: "weapon",
    },
    {
      name: "Tec-9|核子剧毒",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "AUG|辐射危机",
      model: "aug",
      type: "weapon",
    },
    {
      name: "PP-野牛|化工之绿",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "FN57|热火朝天",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "SG553|辐射警告",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "加利尔AR|地狱看门犬",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "AK-47|荒野反叛",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "格洛克18型|粉碎者",
      model: "glock",
      type: "weapon",
    },
    {
      name: "G3SG1|黑暗豹纹",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "M4A1消音版|翼蜥",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|狮鹫",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAG-7|灼烧之痕",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|飞驰",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "FN57|都市危机",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "P250|卡特尔",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P2000|火灵",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|路霸",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SCAR-20|心脏打击",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "UMP-45|迷幻",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|宁静",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AK-47|卡特尔",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|无畏战神",
      model: "awp",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|都市冲击",
      model: "elite",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|纳迦蛇神",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "加利尔AR|喧闹骷髅",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|亡者之寝",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|龙王",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M249|系统锁定",
      model: "m249",
      type: "weapon",
    },
    {
      name: "MAC-10|孔雀石",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MP9|致命毒药",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P250|死亡轮回",
      model: "p250",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|祥和之翼",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SCAR-20|蓝洞",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "XM1014|剧毒水银",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "刺刀|虎牙",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|虎牙",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|虎牙",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|虎牙",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|虎牙",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|虎牙",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|虎牙",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|虎牙",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|虎牙",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|虎牙",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|虎牙",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|虎牙",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|虎牙",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|虎牙",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|虎牙",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|虎牙",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|虎牙",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|虎牙",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|大马士革钢",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|大马士革钢",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|大马士革钢",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|大马士革钢",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "系绳匕首|大马士革钢",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|大马士革钢",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "流浪者匕首|大马士革钢",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "骷髅匕首|大马士革钢",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "M9刺刀|大马士革钢",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|大马士革钢",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|大马士革钢",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|大马士革钢",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|大马士革钢",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|大马士革钢",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "UMP-45|深红箔",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "刺刀|渐变大理石",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|渐变大理石",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|渐变大理石",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|渐变大理石",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|渐变大理石",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|渐变大理石",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|渐变大理石",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|渐变大理石",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|渐变大理石",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|渐变大理石",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|渐变大理石",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|渐变大理石",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|渐变大理石",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|渐变大理石",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|渐变大理石",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|渐变大理石",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "骷髅匕首|渐变大理石",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|外表生锈",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|外表生锈",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|外表生锈",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|外表生锈",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|外表生锈",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|外表生锈",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|外表生锈",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|外表生锈",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|外表生锈",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|外表生锈",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|外表生锈",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|外表生锈",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|外表生锈",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|外表生锈",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|外表生锈",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|外表生锈",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|外表生锈",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|外表生锈",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "刺刀|多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "系绳匕首|多普勒",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|多普勒",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|多普勒",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|多普勒",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|多普勒",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|多普勒",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "骷髅匕首|多普勒",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "AK-47|精英之作",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "MP7|装甲核心",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "AWP|蠕虫之神",
      model: "awp",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|青铜装饰",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "P250|元素轮廓",
      model: "p250",
      type: "weapon",
    },
    {
      name: "FN57|耍猴把戏",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "加利尔AR|经济",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "法玛斯|爱神",
      model: "famas",
      type: "weapon",
    },
    {
      name: "M4A1消音版|暴怒野兽",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAG-7|炽热",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "内格夫|无畏战神",
      model: "negev",
      type: "weapon",
    },
    {
      name: "MAC-10|霓虹骑士",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|千纸鹤",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "CZ75自动型|先驱",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "UMP-45|车王",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "格洛克18型|暮光星系",
      model: "glock",
      type: "weapon",
    },
    {
      name: "G3SG1|柯罗诺斯",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "Tec-9|哈迪斯",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|伊卡洛斯殒落",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "UMP-45|弥诺陶洛斯迷宫",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MP7|星点",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P2000|寻路者",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "USP消音版|寻路者",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AUG|代达罗斯之殇",
      model: "aug",
      type: "weapon",
    },
    {
      name: "M4A1消音版|赤红新星",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "AWP|美杜莎",
      model: "awp",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|决斗家",
      model: "elite",
      type: "weapon",
    },
    {
      name: "MP9|潘多拉魔盒",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "M4A4|波塞冬",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|天秤之月",
      model: "elite",
      type: "weapon",
    },
    {
      name: "新星|天秤之月",
      model: "nova",
      type: "weapon",
    },
    {
      name: "AWP|狮子之日",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M249|海滨预测者",
      model: "m249",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|翡翠色调",
      model: "elite",
      type: "weapon",
    },
    {
      name: "CZ75自动型|翡翠色调",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "USP消音版|绿色伞兵",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AUG|秋叶原之选",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AK-47|水栽竹",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "PP-野牛|墨竹",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|竹影",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "Tec-9|竹林",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "加利尔AR|水蓝阶地",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "法玛斯|半袖式",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MAG-7|反梗精英",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "Tec-9|梗怖分子",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "FN57|日式荧光涂装",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "G3SG1|日式橙色涂装",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "P250|日式深红涂装",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P250|日式薄荷涂装",
      model: "p250",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|午夜风暴",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|日落风暴壱",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|日落风暴弐",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "M4A4|破晓",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M249|冲击钻",
      model: "m249",
      type: "weapon",
    },
    {
      name: "MAG-7|海鸟",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "AK-47|深海复仇",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|暴怒野兽",
      model: "awp",
      type: "weapon",
    },
    {
      name: "CZ75自动型|黄夹克",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "法玛斯|神经网",
      model: "famas",
      type: "weapon",
    },
    {
      name: "加利尔AR|火箭冰棒",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|本生灯",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|杀意大名",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP7|复仇者",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9|红宝石毒镖",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "内格夫|大嘴巴",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|游侠",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P2000|手炮",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P90|精英之作",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SG553|次时代",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "UMP-45|暴乱",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "USP消音版|力矩",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|前线迷雾",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|龙之双子",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|幸存者Z",
      model: "famas",
      type: "weapon",
    },
    {
      name: "G3SG1|弗卢克斯",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|冷石",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|幻影冥魂",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M249|星云十字军",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A1消音版|金蛇缠绕",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|冉吉",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|钴核",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP7|速递",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P250|翼击",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SCAR-20|绿色陆战队",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SSG08|巨铁",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "USP消音版|枪响人亡",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|斯康里娅",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AK-47|混沌点阵",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|弹跳线条",
      model: "aug",
      type: "weapon",
    },
    {
      name: "PP-野牛|核燃料棒",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|科林斯遗产",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "FN57|朝枪夕拾",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "G3SG1|行刑者",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "M4A4|皇家圣骑士",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "SSG08|芝诺悖论",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "内格夫|动力装载机",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P2000|至高帝皇",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P90|精雕木刻",
      model: "p90",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|弄臣之颅",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SCAR-20|丛林爆发",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|豹灯蛾",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|坍雪寒裘",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "XM1014|特克卢喷射者",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|渐变之色",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|渐变琥珀",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "AK-47|燃料喷射器",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|精英之作",
      model: "awp",
      type: "weapon",
    },
    {
      name: "PP-野牛|透光区",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|大佬龙",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|卡特尔",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|元素轮廓",
      model: "famas",
      type: "weapon",
    },
    {
      name: "FN57|三位一体",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|皇家军团",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|战场之星",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|青金鳄皮",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|禁卫军",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP7|帝国",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "新星|暴怒野兽",
      model: "nova",
      type: "weapon",
    },
    {
      name: "SSG08|通灵者",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "Tec-9|贾姆比亚",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|铅管",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AUG|燕群",
      model: "aug",
      type: "weapon",
    },
    {
      name: "PP-野牛|阿努比斯之审判",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "CZ75自动型|红鹰",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|通风机",
      model: "elite",
      type: "weapon",
    },
    {
      name: "G3SG1|橙光冲击",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|火线冲锋",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M249|鬼影",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A1消音版|女火神之炽焰",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MP9|生化泄漏",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P2000|海洋",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P250|二西莫夫",
      model: "p250",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|破铜烂铁",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SG553|擎天神",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08|幽灵战士",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "Tec-9|战火重燃",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "UMP-45|野蛮剑齿虎",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|西装革履",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "刺刀|传说",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|传说",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|传说",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|传说",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|传说",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "刺刀|黑色层压板",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|黑色层压板",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|黑色层压板",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|黑色层压板",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|黑色层压板",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "刺刀|伽玛多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|伽玛多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|伽玛多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|伽玛多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|伽玛多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|伽玛多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|伽玛多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|伽玛多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|伽玛多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|伽玛多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|伽玛多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|伽玛多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|伽玛多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|伽玛多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|伽玛多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|伽玛多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|伽玛多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|伽玛多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|伽玛多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|伽玛多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|伽玛多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|伽玛多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|伽玛多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|伽玛多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|伽玛多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|伽玛多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|伽玛多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|伽玛多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|伽玛多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|伽玛多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|伽玛多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|伽玛多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|伽玛多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|伽玛多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|伽玛多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|伽玛多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|伽玛多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|伽玛多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|伽玛多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|伽玛多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|伽玛多普勒",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|伽玛多普勒",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|伽玛多普勒",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|伽玛多普勒",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|伽玛多普勒",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|伽玛多普勒",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|伽玛多普勒",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|伽玛多普勒",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|伽玛多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|伽玛多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|自动化",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|自动化",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|自动化",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|自动化",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|自动化",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "刺刀|澄澈之水",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|澄澈之水",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|澄澈之水",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "爪子刀|澄澈之水",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "M9刺刀|澄澈之水",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|澄澈之水",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|澄澈之水",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|澄澈之水",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|澄澈之水",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|澄澈之水",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "刺刀|自由之手",
      model: "bayonet",
      type: "melee",
    },
    {
      name: "折叠刀|自由之手",
      model: "knife_flip",
      type: "melee",
    },
    {
      name: "穿肠刀|自由之手",
      model: "knife_gut",
      type: "melee",
    },
    {
      name: "M9刺刀|自由之手",
      model: "knife_m9_bayonet",
      type: "melee",
    },
    {
      name: "猎杀者匕首|自由之手",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|自由之手",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|自由之手",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|自由之手",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|自由之手",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "爪子刀|自由之手",
      model: "knife_karambit",
      type: "melee",
    },
    {
      name: "AUG|贵族",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP|火卫一",
      model: "awp",
      type: "weapon",
    },
    {
      name: "FN57|霸意大名",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|荒野反叛",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A1消音版|机械工业",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|死寂空间",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|捕猎者",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "新星|Exo",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P2000|至尊威龙",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P250|铠甲",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|夺命器",
      model: "p90",
      type: "weapon",
    },
    {
      name: "PP-野牛|收割机",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|重新启动",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|聚光灯",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SCAR-20|血腥运动",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|轻空",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|冰冠",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "AK-47|霓虹革命",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|席德.米德",
      model: "aug",
      type: "weapon",
    },
    {
      name: "CZ75自动型|印花板",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|指挥",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "法玛斯|防滚架",
      model: "famas",
      type: "weapon",
    },
    {
      name: "FN57|斯康里娅",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "G3SG1|通风机",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "格洛克18型|鼬鼠",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MAG-7|石雕",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|气密",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "内格夫|眩目",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P90|冷血无情",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SCAR-20|权力之心",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|三巨头",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|燃料喷射器",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "UMP-45|简报",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|滑流",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "蝴蝶刀|多普勒",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "暗影双匕|多普勒",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "猎杀者匕首|致命紫罗兰",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "弯刀|致命紫罗兰",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "系绳匕首|致命紫罗兰",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "CZ75自动型|聚合物",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "格洛克18型|铁之作",
      model: "glock",
      type: "weapon",
    },
    {
      name: "SSG08|炎龙之焰",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|皇室伴侣",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|机械工业",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MP7|卷云",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "G3SG1|毒刺",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|黑砂",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "MP9|砂垢",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|闪回",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|喧嚣杀戮",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAG-7|声纳",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "新星|毒蜥",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P2000|草皮",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P90|浅坟",
      model: "p90",
      type: "weapon",
    },
    {
      name: "USP消音版|次时代",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|荒野公主",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "AK-47|血腥运动",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|浮生如梦",
      model: "awp",
      type: "weapon",
    },
    {
      name: "PP-野牛|丛林滑流",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "SCAR-20|蓝图",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "CZ75自动型|相柳",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "M4A1消音版|毁灭者2000",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|锈蚀烈焰",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "FN57|毛细血管",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "加利尔AR|深红海啸",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M249|翠绿箭毒蛙",
      model: "m249",
      type: "weapon",
    },
    {
      name: "MP7|非洲部落",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P250|涟漪",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|绝界之行",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "UMP-45|支架",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "USP消音版|黑色魅影",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|四季",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|梭鲈",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "AK-47|轨道Mk01",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "USP消音版|蓝图",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|毒蛇袭击",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|死亡之舞",
      model: "famas",
      type: "weapon",
    },
    {
      name: "FN57|暴怒野兽",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "加利尔AR|~甜甜的~",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "AWP|鬼退治",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M4A1消音版|简报",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|地狱烈焰",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|阿罗哈",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|硬水",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P2000|林间猎者",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P250|红岩",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|死亡之握",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SSG08|鬼脸天蛾",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "Tec-9|剪纸",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "UMP-45|合金绽放",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|夜百合",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "AUG|三角战术",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AK-47|皇后",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "PP-野牛|买定离手",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "G3SG1|猎人",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "P250|生化短吻鳄",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MP9|焦油缠绕",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "格洛克18型|异星世界",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A1消音版|破碎铅秋",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|海洋",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|美洲驼炮",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "Tec-9|碎蛋白石",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "SCAR-20|丛林滑流",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|幻影",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "CZ75自动型|战术高手",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "UMP-45|曝光",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "XM1014|五彩斑驳",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AUG|湖怪鸟",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP|死神",
      model: "awp",
      type: "weapon",
    },
    {
      name: "PP-野牛|黑夜暴乱",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "FN57|焰色反应",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|城里的月光",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|黑色魅影",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP7|血腥运动",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9|黑砂",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "内格夫|狮子鱼",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|狂野六号",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P2000|都市危机",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|稳",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "SG553|阿罗哈",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "MAG-7|SWAG-7",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "UMP-45|白狼",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "USP消音版|脑洞大开",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|锈蚀烈焰",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AK-47|霓虹骑士",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|琥珀冲流",
      model: "aug",
      type: "weapon",
    },
    {
      name: "CZ75自动型|经济",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|碎片",
      model: "elite",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|红色代号",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "G3SG1|公海",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "格洛克18型|战鹰",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A1消音版|梦魇",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MP9|毛细血管",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "新星|玩具士兵",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P90|牵引力",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AWP|猫猫狗狗",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP7|权力之心",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|吞噬",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|生存主义者",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "Tec-9|蛇-9",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "法玛斯|雅典娜之眼",
      model: "famas",
      type: "weapon",
    },
    {
      name: "AK-47|野荷",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "UMP-45|忘忧草",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "P90|日落百合",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AUG|午夜百合",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MP7|青之绽放",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "FN57|绛之绽放",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M4A4|暗之绽放",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "XM1014|芭蕉叶",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "格洛克18型|合成叶",
      model: "glock",
      type: "weapon",
    },
    {
      name: "Tec-9|锈叶",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MP9|野百合",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "海豹短刀|夜色",
      model: "knife_css",
      type: "melee",
    },
    {
      name: "系绳匕首|夜色",
      model: "knife_cord",
      type: "melee",
    },
    {
      name: "求生匕首|夜色",
      model: "knife_canis",
      type: "melee",
    },
    {
      name: "熊刀|夜色",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|夜色",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "流浪者匕首|夜色",
      model: "knife_outdoor",
      type: "melee",
    },
    {
      name: "短剑|夜色",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|夜色",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "骷髅匕首|夜色",
      model: "knife_skeleton",
      type: "melee",
    },
    {
      name: "廓尔喀刀|夜色",
      model: "knife_kukri",
      type: "melee",
    },
    {
      name: "AWP|王子",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MAG-7|五指短剑",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "Tec-9|穆拉诺之橙",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "G3SG1|穆拉诺之紫",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "AUG|穆拉诺之蓝",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P250|暗之镂刻",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|绯红镂刻",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SSG08|橙黄镂刻",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P90|巴洛克之红",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AK-47|巴洛克之紫",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "新星|巴洛克之橙",
      model: "nova",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|双涡轮",
      model: "elite",
      type: "weapon",
    },
    {
      name: "MAC-10|小牛皮",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P250|葡萄酒",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SG553|意式拉力",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08|手刹",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "MP7|渐变之色",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP5-SD|越野",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MAG-7|外表生锈",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|滑移",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "AWP|永恒之枪",
      model: "awp",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|翡翠巨蟒",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "AUG|烈焰巨蟒",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P90|星辰巨蟒",
      model: "p90",
      type: "weapon",
    },
    {
      name: "XM1014|寒霜锁链",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "MAC-10|赤金锁链",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SSG08|血染风采",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "内格夫|雷神之锤",
      model: "negev",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|沙漠之狐",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "SG553|沙漠之花",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|虎纹模板",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MP5-SD|萨凡纳半调",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "PP-野牛|冷室",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MAG-7|野树林",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P250|随便玩玩",
      model: "p250",
      type: "weapon",
    },
    {
      name: "PP-野牛|设施系列·速写图",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "P90|设施系列·底片图",
      model: "p90",
      type: "weapon",
    },
    {
      name: "P250|设施系列·草图",
      model: "p250",
      type: "weapon",
    },
    {
      name: "UMP-45|设施系列·深色图",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AUG|随机存取",
      model: "aug",
      type: "weapon",
    },
    {
      name: "M4A4|主机",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP5-SD|协处理器",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MP7|主板",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "内格夫|舱壁",
      model: "negev",
      type: "weapon",
    },
    {
      name: "FN57|冷却剂",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "新星|芯轴",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|交换机",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAG-7|核芯破裂",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "AWP|冥界之河",
      model: "awp",
      type: "weapon",
    },
    {
      name: "格洛克18型|核子花园",
      model: "glock",
      type: "weapon",
    },
    {
      name: "加利尔AR|冰核聚变",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "Tec-9|遥控",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|控制台",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|变频器",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "AUG|扫频仪",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AK-47|安全网",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "Tec-9|安全网",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|引擎故障灯",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|刹车灯",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "MP5-SD|氮化处理",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|氮化处理",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "格洛克18型|远光灯",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MP5-SD|小白鼠",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "AK-47|二西莫夫",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "UMP-45|动量",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AWP|黑色魅影",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP9|中度威胁",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|机械工业",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "G3SG1|净化者",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|信号灯",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|锈蚀烈焰",
      model: "glock",
      type: "weapon",
    },
    {
      name: "新星|灼木",
      model: "nova",
      type: "weapon",
    },
    {
      name: "MP5-SD|磷光体",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "M4A4|镁元素",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|销声",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P250|影魔",
      model: "p250",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|黑砂",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SG553|危险距离",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|破铜烂铁",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|闪回",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版|紫色DDPAT",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AWP|九头金蛇",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP9|八音盒",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "XM1014|雅藤如嫣",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "MAG-7|海军之辉",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "AUG|夜空沙暴",
      model: "aug",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|浮木",
      model: "elite",
      type: "weapon",
    },
    {
      name: "P250|天旱",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|赭色大马士革",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "M249|雪茄盒",
      model: "m249",
      type: "weapon",
    },
    {
      name: "P90|碧绿升藤",
      model: "p90",
      type: "weapon",
    },
    {
      name: "PP-野牛|安乐蜥",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "USP消音版|阿尔卑斯迷彩",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "FN57|热处理",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "格洛克18型|AXIA",
      model: "glock",
      type: "weapon",
    },
    {
      name: "XM1014|半调转换",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "法玛斯|保护色",
      model: "famas",
      type: "weapon",
    },
    {
      name: "AK-47|迷踪秘境",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "FN57|怒氓",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "AWP|树蝰",
      model: "awp",
      type: "weapon",
    },
    {
      name: "Tec-9|青竹伪装",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MAC-10|白鲑鱼",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|轻轨",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "加利尔AR|战吼斑纹",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|头骨粉碎者",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "M4A4|皇帝",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "AUG|动量",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MP5-SD|高斯",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MP7|恶作剧",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P250|铜绿",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|异星世界",
      model: "p90",
      type: "weapon",
    },
    {
      name: "XM1014|焚烬之鳄",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "UMP-45|城里的月光",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "锯齿爪刀|多普勒",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "锯齿爪刀|渐变大理石",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "熊刀|大马士革钢",
      model: "knife_ursus",
      type: "melee",
    },
    {
      name: "折刀|大马士革钢",
      model: "knife_gypsy_jackknife",
      type: "melee",
    },
    {
      name: "短剑|大马士革钢",
      model: "knife_stiletto",
      type: "melee",
    },
    {
      name: "锯齿爪刀|大马士革钢",
      model: "knife_widowmaker",
      type: "melee",
    },
    {
      name: "CZ75自动型|翡翠石英",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|熊熊烈焰",
      model: "elite",
      type: "weapon",
    },
    {
      name: "SG553|路障",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "M4A1消音版|苔藓石英",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "法玛斯|暗夜锁链",
      model: "famas",
      type: "weapon",
    },
    {
      name: "SG553|红苹果",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SCAR-20|石砌",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|水都泛波",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "MP9|彩绘玻璃",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SSG08|海滨印花",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "法玛斯|日暮",
      model: "famas",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|灌木丛",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "MAC-10|冲浪木",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MP5-SD|茂竹之园",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "PP-野牛|海鸟",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "M4A4|多边形编辑",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M249|时频谱",
      model: "m249",
      type: "weapon",
    },
    {
      name: "SSG08|半调轮纹",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P2000|珊瑚半调",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "UMP-45|渐变之色",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|旱地之花",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "法玛斯|半调水洗",
      model: "famas",
      type: "weapon",
    },
    {
      name: "SCAR-20|野莓",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "PP-野牛|路霸",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "AK-47|复古浪潮",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|极地孤狼",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP|冲出重围",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP5-SD|鼻青脸肿",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "Tec-9|屠杀者",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "新星|风卷残云",
      model: "nova",
      type: "weapon",
    },
    {
      name: "G3SG1|黑砂",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|记忆碎片",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "MP7|七彩斑斓",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "P2000|黑曜石",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|左右开花",
      model: "elite",
      type: "weapon",
    },
    {
      name: "SCAR-20|撕起来",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|四号栖息地",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "MAC-10|潜行者",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SSG08|喋血战士",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "M249|战隼",
      model: "m249",
      type: "weapon",
    },
    {
      name: "SG553|浆果胶衣",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "M249|阿兹特克",
      model: "m249",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|1.6精英",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|退役",
      model: "famas",
      type: "weapon",
    },
    {
      name: "Tec-9|闪光舞步",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "FN57|好兄弟",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "P250|炼狱小镇",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|板条箱",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|碰碰狗",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP9|九头蛇",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P90|往日行动",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AK-47|交叉渐变",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|汪之萌杀",
      model: "aug",
      type: "weapon",
    },
    {
      name: "SCAR-20|仓库突击",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "MP5-SD|探员",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "UMP-45|塑胶炸弹",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AWP|野火",
      model: "awp",
      type: "weapon",
    },
    {
      name: "格洛克18型|烈焰天使",
      model: "glock",
      type: "weapon",
    },
    {
      name: "法玛斯|纪念碑",
      model: "famas",
      type: "weapon",
    },
    {
      name: "内格夫|巴洛克之沙",
      model: "negev",
      type: "weapon",
    },
    {
      name: "AK-47|黄金藤蔓",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "USP消音版|橙红安乐蜥",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MP5-SD|幻化绿洲",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|沙漠伪装",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "P90|沙漠DDPAT",
      model: "p90",
      type: "weapon",
    },
    {
      name: "M4A4|红色DDPAT",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "AUG|朽木",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P250|潜藏者",
      model: "p250",
      type: "weapon",
    },
    {
      name: "新星|流沙",
      model: "nova",
      type: "weapon",
    },
    {
      name: "G3SG1|碧藤青翠",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "MP9|残花败藤",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "FN57|紫藤老树",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M249|夜半棕榈",
      model: "m249",
      type: "weapon",
    },
    {
      name: "CZ75自动型|夜半棕榈",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "SG553|白骨",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "MP7|掠夺者",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "SSG08|掠夺者",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P90|攻击向量",
      model: "p90",
      type: "weapon",
    },
    {
      name: "CZ75自动型|回转",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|星尘拱廊",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "加利尔AR|NV",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "MP7|星盘",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "AK-47|幻影破坏者",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|汤姆猫",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AWP|毛细血管",
      model: "awp",
      type: "weapon",
    },
    {
      name: "CZ75自动型|做旧手艺",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|蓝色层压板",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "M4A1消音版|二号玩家",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|渐变迪斯科",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|正义",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP5-SD|沙漠精英",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "内格夫|原型机",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P2000|酸蚀",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|骸骨锻造",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|启示录",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SCAR-20|执行者",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SG553|黯翼",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08|浮生如梦",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "格洛克18型|子弹皇后",
      model: "glock",
      type: "weapon",
    },
    {
      name: "内格夫|飞羽",
      model: "negev",
      type: "weapon",
    },
    {
      name: "AK-47|阿努比斯军团",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "P2000|盘根错节",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "MAG-7|北冥有鱼",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|印花集",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "格洛克18型|摩登时代",
      model: "glock",
      type: "weapon",
    },
    {
      name: "Tec-9|兄弟连",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MAC-10|魅惑",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SG553|锈蚀之刃",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08|主机001",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P250|卡带",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|集装箱",
      model: "p90",
      type: "weapon",
    },
    {
      name: "XM1014|埋葬之影",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "M4A4|齿仙",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "加利尔AR|凤凰商号",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "PP-野牛|神秘碑文",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MP5-SD|猛烈冲锋",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "AWP|亡灵之主",
      model: "awp",
      type: "weapon",
    },
    {
      name: "CZ75自动型|世仇",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "P90|大怪兽RUSH",
      model: "p90",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|灾难",
      model: "elite",
      type: "weapon",
    },
    {
      name: "FN57|童话城堡",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "G3SG1|血腥迷彩",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "加利尔AR|破坏者",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "P250|污染物",
      model: "p250",
      type: "weapon",
    },
    {
      name: "M249|等高线",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A1消音版|印花集",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|赛博",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP5-SD|零点行动",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "新星|一见青心",
      model: "nova",
      type: "weapon",
    },
    {
      name: "格洛克18型|黑色魅影",
      model: "glock",
      type: "weapon",
    },
    {
      name: "SSG08|抖枪",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "UMP-45|金铋辉煌",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "USP消音版|小绿怪",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|古铜密码",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "M4A4|全球攻势",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "XM1014|旧宪章",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AUG|搜索",
      model: "aug",
      type: "weapon",
    },
    {
      name: "SSG08|侦测",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P2000|绝命密电",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|暗网总机",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|幕后主谋",
      model: "famas",
      type: "weapon",
    },
    {
      name: "P90|豹走",
      model: "p90",
      type: "weapon",
    },
    {
      name: "M4A1消音版|冒险家乐园",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "FN57|蓝莓樱桃",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "UMP-45|犯罪现场",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AK-47|X射线",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|街头抢匪",
      model: "elite",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|午夜凶匪",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "MP7|金库悍匪",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "UMP-45|犬牙",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MAC-10|狂蟒之灾",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "Tec-9|凤凰涂鸦",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|凤凰手迹",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "内格夫|凤凰徽记",
      model: "negev",
      type: "weapon",
    },
    {
      name: "加利尔AR|凤凰冥灯",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|伏击者",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "P90|困兽之斗",
      model: "p90",
      type: "weapon",
    },
    {
      name: "格洛克18型|富兰克林",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A1消音版|澜磷",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|美洲豹",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "P2000|豹纹迷彩",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "P90|古老星球",
      model: "p90",
      type: "weapon",
    },
    {
      name: "XM1014|太古传说",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "SG553|废墟丛生",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "MP7|绿野迷踪",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "Tec-9|上古图腾",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MAC-10|金砖",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "AWP|渐变之色",
      model: "awp",
      type: "weapon",
    },
    {
      name: "USP消音版|锁定",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SCAR-20|大宪章",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "AWP|锦虎",
      model: "awp",
      type: "weapon",
    },
    {
      name: "P250|孟加拉猛虎",
      model: "p250",
      type: "weapon",
    },
    {
      name: "USP消音版|远古幻想",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "加利尔AR|废墟黄昏",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "AUG|璞玉",
      model: "aug",
      type: "weapon",
    },
    {
      name: "G3SG1|远古仪式",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "AK-47|墨岩",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "CZ75自动型|短趾雕",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "MP9|爆裂食物链",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "加利尔AR|迷人眼",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|一目了然",
      model: "glock",
      type: "weapon",
    },
    {
      name: "USP消音版|倒吊人",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|活色生香",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M249|O.S.I.P.R.",
      model: "m249",
      type: "weapon",
    },
    {
      name: "内格夫|橙灰之名",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P250|赛博先锋",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MAC-10|战争手柄",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "XM1014|要抱抱",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|废物王",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "SG553|重金属摇滚",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "UMP-45|动摇",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|后发制人",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "新星|随风",
      model: "nova",
      type: "weapon",
    },
    {
      name: "SSG08|致命一击",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "法玛斯|熔化",
      model: "famas",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|热处理",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "P2000|太空竞赛",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|人造卫星",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "AWP|复古流行",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M4A1消音版|气泡流行",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|春季方巾",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "MP5-SD|秋季方巾",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "FN57|午夜喷涂",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "M4A4|合纵",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "CZ75自动型|辛迪加",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "USP消音版|银装素裹",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "法玛斯|线路故障",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MAC-10|凝视之眼",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "AK-47|绿色层压板",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "加利尔AR|警告！",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "MAG-7|棱彩阶梯",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "M4A1消音版|紧迫危机",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "P90|解视图",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MAC-10|策略",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "CZ75自动型|幻光构架",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "新星|致幻时刻",
      model: "nova",
      type: "weapon",
    },
    {
      name: "XM1014|蓝色轮胎",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "格洛克18型|红色轮胎",
      model: "glock",
      type: "weapon",
    },
    {
      name: "内格夫|基础建设",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P250|数字架构师",
      model: "p250",
      type: "weapon",
    },
    {
      name: "FN57|坠落危险",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "PP-野牛|开关箱",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "SG553|玩命职场",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "UMP-45|机械装置",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|更换机油",
      model: "elite",
      type: "weapon",
    },
    {
      name: "AK-47|抽象派1337",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AUG|瘟疫",
      model: "aug",
      type: "weapon",
    },
    {
      name: "MAG-7|铋晶体",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|纵横波涛",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|胶面花纹",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|ZX81彩色",
      model: "famas",
      type: "weapon",
    },
    {
      name: "FN57|同步力场",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "MP9|富士山",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "G3SG1|特训地图",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "MP7|游击队",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "M4A4|彼岸花",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|玩具盒子",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "PP-野牛|战术手电",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "格洛克18型|零食派对",
      model: "glock",
      type: "weapon",
    },
    {
      name: "SSG08|速度激情",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "USP消音版|黑莲花",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|狻猊",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "鲍伊猎刀|传说",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|传说",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "弯刀|传说",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "猎杀者匕首|传说",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "暗影双匕|传说",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|黑色层压板",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|黑色层压板",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "弯刀|黑色层压板",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "猎杀者匕首|黑色层压板",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "暗影双匕|黑色层压板",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "鲍伊猎刀|自动化",
      model: "knife_survival_bowie",
      type: "melee",
    },
    {
      name: "蝴蝶刀|自动化",
      model: "knife_butterfly",
      type: "melee",
    },
    {
      name: "弯刀|自动化",
      model: "knife_falchion",
      type: "melee",
    },
    {
      name: "猎杀者匕首|自动化",
      model: "knife_tactical",
      type: "melee",
    },
    {
      name: "暗影双匕|自动化",
      model: "knife_push",
      type: "melee",
    },
    {
      name: "格洛克18型|伽玛多普勒",
      model: "glock",
      type: "weapon",
    },
    {
      name: "格洛克18型|伽玛多普勒",
      model: "glock",
      type: "weapon",
    },
    {
      name: "格洛克18型|伽玛多普勒",
      model: "glock",
      type: "weapon",
    },
    {
      name: "格洛克18型|伽玛多普勒",
      model: "glock",
      type: "weapon",
    },
    {
      name: "格洛克18型|伽玛多普勒",
      model: "glock",
      type: "weapon",
    },
    {
      name: "PP-野牛|太空猫",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|瓜瓜",
      model: "elite",
      type: "weapon",
    },
    {
      name: "法玛斯|目皆转睛",
      model: "famas",
      type: "weapon",
    },
    {
      name: "FN57|涂鸦潦草",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "G3SG1|梦之林地",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "M4A1消音版|夜无眠",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|坐牢",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|先见之明",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP7|幽幻深渊",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MP9|星使",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "XM1014|行尸攻势",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "USP消音版|地狱门票",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MP5-SD|小小噩梦",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "P2000|升天",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "SCAR-20|暗夜活死鸡",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|灵应牌",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "AK-47|夜愿",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "USP消音版|印花集",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|可燃冰",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|迷人眼",
      model: "awp",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|疯狂老八",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "法玛斯|喵喵36",
      model: "famas",
      type: "weapon",
    },
    {
      name: "加利尔AR|毁灭者",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M249|闹市区",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A4|透明弹匣",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|萌猴迷彩",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SG553|青龙",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "内格夫|丢把枪",
      model: "negev",
      type: "weapon",
    },
    {
      name: "P250|迷人幻象",
      model: "p250",
      type: "weapon",
    },
    {
      name: "P90|给爷冲",
      model: "p90",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|么么",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|食人花",
      model: "elite",
      type: "weapon",
    },
    {
      name: "UMP-45|路障",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "格洛克18型|冬季战术",
      model: "glock",
      type: "weapon",
    },
    {
      name: "Tec-9|渣渣",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|模拟输入",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "SSG08|灾难",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "新星|黑暗徽记",
      model: "nova",
      type: "weapon",
    },
    {
      name: "MP7|笑一个",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MAC-10|灯箱",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "M4A4|蚀刻领主",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M4A1消音版|黑莲花",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "格洛克18型|崩络克18型",
      model: "glock",
      type: "weapon",
    },
    {
      name: "FN57|混合体",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|藏身处",
      model: "elite",
      type: "weapon",
    },
    {
      name: "AWP|镀铬大炮",
      model: "awp",
      type: "weapon",
    },
    {
      name: "AK-47|传承",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|奥林匹斯",
      model: "taser",
      type: "weapon",
    },
    {
      name: "USP消音版|破颚者",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|刺青",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "UMP-45|机动化",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "M4A1消音版|渐变之色",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "加利尔AR|彩虹勺",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "AK-47|橄榄迷彩",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "MP5-SD|静态学",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "P2000|防滑握把",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "XM1014|知更鸟",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|当岁鱼",
      model: "taser",
      type: "weapon",
    },
    {
      name: "法玛斯|幻灭之旅",
      model: "famas",
      type: "weapon",
    },
    {
      name: "加利尔AR|控制",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "USP消音版|PC-GRN",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "SSG08|纪念碑",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "MAG-7|重新补给",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|巨蟒冲击",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "P90|破浪者",
      model: "p90",
      type: "weapon",
    },
    {
      name: "新星|初升之樱",
      model: "nova",
      type: "weapon",
    },
    {
      name: "MP9|中枢",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "UMP-45|K.O.工厂",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "CZ75自动型|铜芯纤维",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "AUG|钢铁哨兵",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P90|满昏作品",
      model: "p90",
      type: "weapon",
    },
    {
      name: "格洛克18型|格林线",
      model: "glock",
      type: "weapon",
    },
    {
      name: "XM1014|跑跑跑",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "法玛斯|2A2F",
      model: "famas",
      type: "weapon",
    },
    {
      name: "UMP-45|深夜通勤",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MAC-10|脱轨",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|充电宝",
      model: "taser",
      type: "weapon",
    },
    {
      name: "AWP|印花集",
      model: "awp",
      type: "weapon",
    },
    {
      name: "AK-47|灼心怒焰",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "格洛克18型|忍瞳",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|炼狱之火",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M4A4|战鹰",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP9|首冲拿铁",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P250|建构主义者",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AWP|灵缇",
      model: "awp",
      type: "weapon",
    },
    {
      name: "Tec-9|银装素裹",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "XM1014|幽独",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "M4A1消音版|平流层巡航",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版|皇家卫队",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AK-47|午夜层压板",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "法玛斯|雪怪迷彩",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MAG-7|鱼长梦短",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "AK-47|一发入魂",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|金粉肆蛇",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M4A1消音版|隐伏帝王龙",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "P2000|变态杀戮",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "MP9|羽量级",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "SCAR-20|碎片",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "格洛克18型|圆影玉兔",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|反冲精英",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MAC-10|错觉",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "P250|重构",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MP5-SD|液化",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|蕉农炮",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "P90|元女王",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SG553|赛博之力",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "Tec-9|叛逆",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "UMP-45|野孩子",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|镶嵌装饰",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "AK-47|钢铁三角洲",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "AWP|尼罗河沃土",
      model: "awp",
      type: "weapon",
    },
    {
      name: "格洛克18型|拉美西斯之触",
      model: "glock",
      type: "weapon",
    },
    {
      name: "法玛斯|奈芙蒂斯之河",
      model: "famas",
      type: "weapon",
    },
    {
      name: "M249|淹没",
      model: "m249",
      type: "weapon",
    },
    {
      name: "M4A1消音版|泥斑迷彩",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|鸣沙",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "MAG-7|鎏铜",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "MP7|赤地",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "新星|索贝克之噬",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|阿佩普之咒",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AUG|蛇窟",
      model: "aug",
      type: "weapon",
    },
    {
      name: "P90|疾袭圣甲虫",
      model: "p90",
      type: "weapon",
    },
    {
      name: "SSG08|碧蓝雕文",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "Tec-9|腐朽木乃伊",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|沙漠战术",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "XM1014|象形文字",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "M4A4|荷鲁斯之眼",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "P90|珊瑚挽歌",
      model: "p90",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|薄荷折扇",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "MP9|钴蓝佩斯利",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P2000|皇家巴洛克",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "内格夫|酸葡萄",
      model: "negev",
      type: "weapon",
    },
    {
      name: "新星|松石流彩",
      model: "nova",
      type: "weapon",
    },
    {
      name: "FN57|青空",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|蔷薇珠母",
      model: "elite",
      type: "weapon",
    },
    {
      name: "加利尔AR|鸲珠",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "格洛克18型|深海地貌",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|海军虎纹迷彩",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "XM1014|口香糖迷彩",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|电光幽蓝",
      model: "taser",
      type: "weapon",
    },
    {
      name: "MAC-10|风暴迷彩",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "SG553|暗夜迷彩",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "SSG08|灰色烟幕",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|径流",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "P250|绛络",
      model: "p250",
      type: "weapon",
    },
    {
      name: "MP5-SD|青柠蜂巢",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "加利尔AR|灰色烟幕",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|钴蓝握把",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "P90|海蓝战术",
      model: "p90",
      type: "weapon",
    },
    {
      name: "MP9|褪色蓝痕",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "Tec-9|蓝爆",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "AWP|一击碧命",
      model: "awp",
      type: "weapon",
    },
    {
      name: "M4A4|轰天闪",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "格洛克18型|格更鸟",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AK-47|寒翠",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "USP消音版|椰风花语",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "MAC-10|白杨丛",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "Tec-9|束带-9",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "XM1014|铜斑迷彩",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "AK-47|灰变迷彩",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "SSG08|虎噬",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|精琢孔雀石",
      model: "elite",
      type: "weapon",
    },
    {
      name: "P90|芥子气",
      model: "p90",
      type: "weapon",
    },
    {
      name: "P2000|草泽",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|叶蝉",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "MP5-SD|黄金榕",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MAC-10|酸蚀蜂巢",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "加利尔AR|酸蚀镖",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|沼泽DDPAT",
      model: "taser",
      type: "weapon",
    },
    {
      name: "M249|鼠尾草迷彩",
      model: "m249",
      type: "weapon",
    },
    {
      name: "Tec-9|生瓷",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "内格夫|生瓷",
      model: "negev",
      type: "weapon",
    },
    {
      name: "MP9|松",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "法玛斯|棕榈色",
      model: "famas",
      type: "weapon",
    },
    {
      name: "UMP-45|碧漩",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "SSG08|绿陶",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "G3SG1|绿色细胞",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "MAG-7|氧化铜",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "P250|氧化铜",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AUG|特种兵连",
      model: "aug",
      type: "weapon",
    },
    {
      name: "AK-47|新红浪潮",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "MP9|噬裂",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|故障艺术",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "格洛克18型|珊红花汛",
      model: "glock",
      type: "weapon",
    },
    {
      name: "M4A4|钢铁红流",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "加利尔AR|血橙游骑兵",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "P250|赤色潮汐",
      model: "p250",
      type: "weapon",
    },
    {
      name: "SSG08|霞坠",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "P250|沉积",
      model: "p250",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|玛珀丽",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "M4A1消音版|玫瑰蜂巢",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "SG553|篮纹半调",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "法玛斯|灰色幽灵",
      model: "famas",
      type: "weapon",
    },
    {
      name: "Tec-9|柠檬酸",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "USP消音版|血刃",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AWP|砷化污染",
      model: "awp",
      type: "weapon",
    },
    {
      name: "PP-野牛|木纹迷彩",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MP7|赭石短调",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "SCAR-20|赭石短调",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "G3SG1|红碧玉",
      model: "g3sg1",
      type: "weapon",
    },
    {
      name: "CZ75自动型|粉玑",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "MP9|多地形迷彩",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "新星|沼泽草",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P90|沙漠半调",
      model: "p90",
      type: "weapon",
    },
    {
      name: "XM1014|画布云斑",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "MAC-10|古铜",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|第二边界",
      model: "elite",
      type: "weapon",
    },
    {
      name: "FN57|秋日灌木",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "新星|夜雨月台",
      model: "nova",
      type: "weapon",
    },
    {
      name: "M4A1消音版|幽独",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "AUG|后发制人",
      model: "aug",
      type: "weapon",
    },
    {
      name: "M4A1消音版|液化",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "MP9|打口碟",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "P2000|红翼",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "SCAR-20|牢笼",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "MP5-SD|专注",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "P250|牛蛙",
      model: "p250",
      type: "weapon",
    },
    {
      name: "AWP|可燃冰",
      model: "awp",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|天矢之眼",
      model: "elite",
      type: "weapon",
    },
    {
      name: "格洛克18型|镜面马赛克",
      model: "glock",
      type: "weapon",
    },
    {
      name: "MAC-10|纸老虎",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "新星|目镜",
      model: "nova",
      type: "weapon",
    },
    {
      name: "UMP-45|连续体",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "AK-47|流金王朝",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "M4A4|破浪狂飙",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "MP7|吸烟有害健康",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "MAG-7|震级",
      model: "mag7",
      type: "weapon",
    },
    {
      name: "AWP|剧终",
      model: "awp",
      type: "weapon",
    },
    {
      name: "格洛克18型|追踪锁定",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AK-47|突破",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "P2000|防滑胶带",
      model: "hkp2000",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|每日鹰爆",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "P90|风蚀流光",
      model: "p90",
      type: "weapon",
    },
    {
      name: "AUG|蔓延",
      model: "aug",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|暗室",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "M4A4|风蚀幽冥",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "法玛斯|复仇",
      model: "famas",
      type: "weapon",
    },
    {
      name: "MP5-SD|雪溅",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MAC-10|雪溅",
      model: "mac10",
      type: "weapon",
    },
    {
      name: "新星|气流",
      model: "nova",
      type: "weapon",
    },
    {
      name: "P250|冻雨",
      model: "p250",
      type: "weapon",
    },
    {
      name: "M249|冻雨",
      model: "m249",
      type: "weapon",
    },
    {
      name: "SCAR-20|锌元素",
      model: "scar20",
      type: "weapon",
    },
    {
      name: "SSG08|无漫风格",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "双持贝瑞塔|银流",
      model: "elite",
      type: "weapon",
    },
    {
      name: "PP-野牛|变焦",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "MP9|眩晕",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "M4A1消音版|夜店王子",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "USP消音版|一颗入眠",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "AWP|热释放",
      model: "awp",
      type: "weapon",
    },
    {
      name: "SSG08|仿书法",
      model: "ssg08",
      type: "weapon",
    },
    {
      name: "FN57|鹤吻莓",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "XM1014|电光明黄",
      model: "xm1014",
      type: "weapon",
    },
    {
      name: "宙斯x27电击枪|大地曼陀罗",
      model: "taser",
      type: "weapon",
    },
    {
      name: "加利尔AR|天空曼陀罗",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "Tec-9|芭蕉叶",
      model: "tec9",
      type: "weapon",
    },
    {
      name: "MP5-SD|野餐",
      model: "mp5sd",
      type: "weapon",
    },
    {
      name: "MP7|珊瑚佩斯利",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "UMP-45|热血斑纹",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "MP9|创世蜂鸣",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "R8左轮手枪|淡紫旁白",
      model: "revolver",
      type: "weapon",
    },
    {
      name: "CZ75自动型|蜜金佩斯利",
      model: "cz75a",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|赤红蜡染",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "PP-野牛|热气流",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "法玛斯|副产品",
      model: "famas",
      type: "weapon",
    },
    {
      name: "SG553|狩猎印花",
      model: "sg556",
      type: "weapon",
    },
    {
      name: "AK-47|爱神",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "驾驶手套|逐沧浪",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|深红鹤服",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|繁花似锦",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|龙拳",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|花园",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|青海波",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "运动手套|紫罗兰珠绣",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|寒霜",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|炽烈之炎",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|奶油细条纹",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|赤色追风",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|紫外狂潮",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "驾驶手套|蓝紫点子",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "专业手套|青柠迷彩",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|黑皮书",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|可可伯爵",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|日忙",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "运动手套|隐知",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "PP-野牛|混音",
      model: "bizon",
      type: "weapon",
    },
    {
      name: "P90|美杜莎之视",
      model: "p90",
      type: "weapon",
    },
    {
      name: "P250|金缮",
      model: "p250",
      type: "weapon",
    },
    {
      name: "格洛克18型|巅峰状态",
      model: "glock",
      type: "weapon",
    },
    {
      name: "AWP|后翼弃兵",
      model: "awp",
      type: "weapon",
    },
    {
      name: "MP9|都市霸王",
      model: "mp9",
      type: "weapon",
    },
    {
      name: "AK-47|翔鹤",
      model: "ak47",
      type: "weapon",
    },
    {
      name: "UMP-45|击杀时刻",
      model: "ump45",
      type: "weapon",
    },
    {
      name: "截短霰弹枪|融合",
      model: "sawedoff",
      type: "weapon",
    },
    {
      name: "FN57|暗夜聚合",
      model: "fiveseven",
      type: "weapon",
    },
    {
      name: "沙漠之鹰|霜寒之焰",
      model: "deagle",
      type: "weapon",
    },
    {
      name: "USP消音版|无声一击",
      model: "usp_silencer",
      type: "weapon",
    },
    {
      name: "M4A4|犬牙交错",
      model: "m4a1",
      type: "weapon",
    },
    {
      name: "M4A1消音版|翠珀金",
      model: "m4a1_silencer",
      type: "weapon",
    },
    {
      name: "加利尔AR|加利鳄",
      model: "galilar",
      type: "weapon",
    },
    {
      name: "M249|博客积木",
      model: "m249",
      type: "weapon",
    },
    {
      name: "MP7|琥珀流光",
      model: "mp7",
      type: "weapon",
    },
    {
      name: "专业手套|狂澜",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|羽袭",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "驾驶手套|针织手套",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "专业手套|青云狩",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "血猎手套|焦炭",
      model: "studded_bloodhound_gloves",
      type: "glove",
      def: 5027,
    },
    {
      name: "血猎手套|蛇咬",
      model: "studded_bloodhound_gloves",
      type: "glove",
      def: 5027,
    },
    {
      name: "血猎手套|染铜",
      model: "studded_bloodhound_gloves",
      type: "glove",
      def: 5027,
    },
    {
      name: "裹手|皮革",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|云杉DDPAT",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "驾驶手套|月色织物",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|护卫",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|深红织物",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "运动手套|超导体",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|干旱",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "裹手|屠夫",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "摩托手套|日蚀",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|薄荷",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|*嘣！*",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|清凉薄荷",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "专业手套|森林DDPAT",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|深红和服",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|翠绿之网",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|元勋",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "裹手|恶土",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "运动手套|潘多拉之盒",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|树篱迷宫",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "血猎手套|游击队",
      model: "studded_bloodhound_gloves",
      type: "glove",
      def: 5027,
    },
    {
      name: "驾驶手套|菱背蛇纹",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|王蛇",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|蓝紫格子",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|超越",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|墨绿色调",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "运动手套|双栖",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|青铜形态",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|欧米伽",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|迈阿密风云",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "摩托手套|嘭！",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|玳瑁",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|交运",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|多边形",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "裹手|钴蓝骷髅",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|套印",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|防水布胶带",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|森林色调",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "九头蛇手套|翡翠色调",
      model: "studded_hydra_gloves",
      type: "glove",
      def: 5035,
    },
    {
      name: "九头蛇手套|红树林",
      model: "studded_hydra_gloves",
      type: "glove",
      def: 5035,
    },
    {
      name: "九头蛇手套|响尾蛇",
      model: "studded_hydra_gloves",
      type: "glove",
      def: 5035,
    },
    {
      name: "九头蛇手套|表面淬火",
      model: "studded_hydra_gloves",
      type: "glove",
      def: 5035,
    },
    {
      name: "专业手套|深红之网",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|狩鹿",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|渐变之色",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|大腕",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|渐变大理石",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|陆军少尉长官",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|老虎精英",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "专业手套|一线特工",
      model: "specialist_gloves",
      type: "glove",
      def: 5034,
    },
    {
      name: "驾驶手套|绯红列赞",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|雪豹",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|美洲豹女王",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "驾驶手套|西装革履",
      model: "slick_gloves",
      type: "glove",
      def: 5031,
    },
    {
      name: "运动手套|弹弓",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|大型猎物",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|猩红头巾",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "运动手套|夜行衣",
      model: "sporty_gloves",
      type: "glove",
      def: 5030,
    },
    {
      name: "摩托手套|终点线",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|小心烟雾弹",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|血压",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "摩托手套|第三特种兵连",
      model: "motorcycle_gloves",
      type: "glove",
      def: 5033,
    },
    {
      name: "裹手|沙漠头巾",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|长颈鹿",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|蟒蛇",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "裹手|警告！",
      model: "leather_handwraps",
      type: "glove",
      def: 5032,
    },
    {
      name: "狂牙手套|翡翠",
      model: "studded_brokenfang_gloves",
      type: "glove",
      def: 4725,
    },
    {
      name: "狂牙手套|黄色斑纹",
      model: "studded_brokenfang_gloves",
      type: "glove",
      def: 4725,
    },
    {
      name: "狂牙手套|针尖",
      model: "studded_brokenfang_gloves",
      type: "glove",
      def: 4725,
    },
    {
      name: "狂牙手套|精神错乱",
      model: "studded_brokenfang_gloves",
      type: "glove",
      def: 4725,
    },
    {
      name: "残酷的达里尔（穷鬼）|专业人士",
      model: "tm_professional/tm_professional_varf5",
      type: "agent",
      def: 4613,
    },
    {
      name: "“蓝莓”铅弹|海军水面战中心海豹部队",
      model: "ctm_st6/ctm_st6_variantj",
      type: "agent",
      def: 4619,
    },
    {
      name: "“两次”麦考伊|战术空中管制部队装甲兵",
      model: "ctm_st6/ctm_st6_variantl",
      type: "agent",
      def: 4680,
    },
    {
      name: "指挥官梅“极寒”贾米森|特警",
      model: "ctm_swat/ctm_swat_variante",
      type: "agent",
      def: 4711,
    },
    {
      name: "第一中尉法洛|特警",
      model: "ctm_swat/ctm_swat_variantf",
      type: "agent",
      def: 4712,
    },
    {
      name: "约翰“范·海伦”卡斯克|特警",
      model: "ctm_swat/ctm_swat_variantg",
      type: "agent",
      def: 4713,
    },
    {
      name: "生物防害专家|特警",
      model: "ctm_swat/ctm_swat_varianth",
      type: "agent",
      def: 4714,
    },
    {
      name: "军士长炸弹森|特警",
      model: "ctm_swat/ctm_swat_varianti",
      type: "agent",
      def: 4715,
    },
    {
      name: "化学防害专家|特警",
      model: "ctm_swat/ctm_swat_variantj",
      type: "agent",
      def: 4716,
    },
    {
      name: "红衫列赞|军刀",
      model: "tm_balkan/tm_balkan_variantk",
      type: "agent",
      def: 4718,
    },
    {
      name: "残酷的达里尔爵士（迈阿密）|专业人士",
      model: "tm_professional/tm_professional_varf",
      type: "agent",
      def: 4726,
    },
    {
      name: "飞贼波兹曼|专业人士",
      model: "tm_professional/tm_professional_varg",
      type: "agent",
      def: 4727,
    },
    {
      name: "小凯夫|专业人士",
      model: "tm_professional/tm_professional_varh",
      type: "agent",
      def: 4728,
    },
    {
      name: "出逃的萨莉|专业人士",
      model: "tm_professional/tm_professional_varj",
      type: "agent",
      def: 4730,
    },
    {
      name: "老K|专业人士",
      model: "tm_professional/tm_professional_vari",
      type: "agent",
      def: 4732,
    },
    {
      name: "残酷的达里尔爵士（沉默）|专业人士",
      model: "tm_professional/tm_professional_varf1",
      type: "agent",
      def: 4733,
    },
    {
      name: "残酷的达里尔爵士（头盖骨）|专业人士",
      model: "tm_professional/tm_professional_varf2",
      type: "agent",
      def: 4734,
    },
    {
      name: "残酷的达里尔爵士（皇家）|专业人士",
      model: "tm_professional/tm_professional_varf3",
      type: "agent",
      def: 4735,
    },
    {
      name: "残酷的达里尔爵士（聒噪）|专业人士",
      model: "tm_professional/tm_professional_varf4",
      type: "agent",
      def: 4736,
    },
    {
      name: "军医少尉|法国宪兵特勤队",
      model: "ctm_gendarmerie/ctm_gendarmerie_varianta",
      type: "agent",
      def: 4749,
    },
    {
      name: "化学防害上尉|法国宪兵特勤队",
      model: "ctm_gendarmerie/ctm_gendarmerie_variantb",
      type: "agent",
      def: 4750,
    },
    {
      name: "中队长鲁沙尔·勒库托|法国宪兵特勤队",
      model: "ctm_gendarmerie/ctm_gendarmerie_variantc",
      type: "agent",
      def: 4751,
    },
    {
      name: "准尉|法国宪兵特勤队",
      model: "ctm_gendarmerie/ctm_gendarmerie_variantd",
      type: "agent",
      def: 4752,
    },
    {
      name: "军官雅克·贝尔特朗|法国宪兵特勤队",
      model: "ctm_gendarmerie/ctm_gendarmerie_variante",
      type: "agent",
      def: 4753,
    },
    {
      name: "中尉法洛（抱树人）|特警",
      model: "ctm_swat/ctm_swat_variantk",
      type: "agent",
      def: 4756,
    },
    {
      name: "指挥官黛维达·费尔南德斯（护目镜）|海豹蛙人",
      model: "ctm_diver/ctm_diver_varianta",
      type: "agent",
      def: 4757,
    },
    {
      name: "指挥官弗兰克·巴鲁德（湿袜）|海豹蛙人",
      model: "ctm_diver/ctm_diver_variantb",
      type: "agent",
      def: 4771,
    },
    {
      name: "中尉雷克斯·克里奇|海豹蛙人",
      model: "ctm_diver/ctm_diver_variantc",
      type: "agent",
      def: 4772,
    },
    {
      name: "精锐捕兽者索尔曼|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_varianta",
      type: "agent",
      def: 4773,
    },
    {
      name: "遗忘者克拉斯沃特|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantb",
      type: "agent",
      def: 4774,
    },
    {
      name: "亚诺（野草）|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantc",
      type: "agent",
      def: 4775,
    },
    {
      name: "上校曼戈斯·达比西|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantd",
      type: "agent",
      def: 4776,
    },
    {
      name: "薇帕姐（革新派）|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variante",
      type: "agent",
      def: 4777,
    },
    {
      name: "捕兽者（挑衅者）|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantf",
      type: "agent",
      def: 4778,
    },
    {
      name: "克拉斯沃特（三分熟）|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantb2",
      type: "agent",
      def: 4780,
    },
    {
      name: "捕兽者|游击队",
      model: "tm_jungle_raider/tm_jungle_raider_variantf2",
      type: "agent",
      def: 4781,
    },
    {
      name: "地面叛军|精锐分子",
      model: "tm_leet/tm_leet_variantg",
      type: "agent",
      def: 5105,
    },
    {
      name: "奥西瑞斯|精锐分子",
      model: "tm_leet/tm_leet_varianth",
      type: "agent",
      def: 5106,
    },
    {
      name: "沙哈马特教授|精锐分子",
      model: "tm_leet/tm_leet_varianti",
      type: "agent",
      def: 5107,
    },
    {
      name: "精英穆哈里克先生|精锐分子",
      model: "tm_leet/tm_leet_variantf",
      type: "agent",
      def: 5108,
    },
    {
      name: "丛林反抗者|精锐分子",
      model: "tm_leet/tm_leet_variantj",
      type: "agent",
      def: 5109,
    },
    {
      name: "枪手|凤凰战士",
      model: "tm_phoenix/tm_phoenix_varianth",
      type: "agent",
      def: 5205,
    },
    {
      name: "执行者|凤凰战士",
      model: "tm_phoenix/tm_phoenix_variantf",
      type: "agent",
      def: 5206,
    },
    {
      name: "弹弓|凤凰战士",
      model: "tm_phoenix/tm_phoenix_variantg",
      type: "agent",
      def: 5207,
    },
    {
      name: "街头士兵|凤凰战士",
      model: "tm_phoenix/tm_phoenix_varianti",
      type: "agent",
      def: 5208,
    },
    {
      name: "特种兵|联邦调查局（FBI）特警",
      model: "ctm_fbi/ctm_fbi_variantf",
      type: "agent",
      def: 5305,
    },
    {
      name: "马尔库斯·戴劳|联邦调查局（FBI）人质营救队",
      model: "ctm_fbi/ctm_fbi_variantg",
      type: "agent",
      def: 5306,
    },
    {
      name: "迈克·赛弗斯|联邦调查局（FBI）狙击手",
      model: "ctm_fbi/ctm_fbi_varianth",
      type: "agent",
      def: 5307,
    },
    {
      name: "爱娃特工|联邦调查局（FBI）",
      model: "ctm_fbi/ctm_fbi_variantb",
      type: "agent",
      def: 5308,
    },
    {
      name: "第三特种兵连|德国特种部队突击队",
      model: "ctm_st6/ctm_st6_variantk",
      type: "agent",
      def: 5400,
    },
    {
      name: "海豹突击队第六分队士兵|海军水面战中心海豹部队",
      model: "ctm_st6/ctm_st6_variante",
      type: "agent",
      def: 5401,
    },
    {
      name: "铅弹|海军水面战中心海豹部队",
      model: "ctm_st6/ctm_st6_variantg",
      type: "agent",
      def: 5402,
    },
    {
      name: "“两次”麦考伊|美国空军战术空中管制部队",
      model: "ctm_st6/ctm_st6_variantm",
      type: "agent",
      def: 5403,
    },
    {
      name: "海军上尉里克索尔|海军水面战中心海豹部队",
      model: "ctm_st6/ctm_st6_varianti",
      type: "agent",
      def: 5404,
    },
    {
      name: "陆军中尉普里米罗|巴西第一营",
      model: "ctm_st6/ctm_st6_variantn",
      type: "agent",
      def: 5405,
    },
    {
      name: "德拉戈米尔|军刀",
      model: "tm_balkan/tm_balkan_variantf",
      type: "agent",
      def: 5500,
    },
    {
      name: "马克西姆斯|军刀",
      model: "tm_balkan/tm_balkan_varianti",
      type: "agent",
      def: 5501,
    },
    {
      name: "准备就绪的列赞|军刀",
      model: "tm_balkan/tm_balkan_variantg",
      type: "agent",
      def: 5502,
    },
    {
      name: "黑狼|军刀",
      model: "tm_balkan/tm_balkan_variantj",
      type: "agent",
      def: 5503,
    },
    {
      name: "“医生”罗曼诺夫|军刀",
      model: "tm_balkan/tm_balkan_varianth",
      type: "agent",
      def: 5504,
    },
    {
      name: "德拉戈米尔|军刀勇士",
      model: "tm_balkan/tm_balkan_variantl",
      type: "agent",
      def: 5505,
    },
    {
      name: "B中队指挥官|英国空军特别部队",
      model: "ctm_sas/ctm_sas_variantf",
      type: "agent",
      def: 5601,
    },
    {
      name: "D中队军官|新西兰特种空勤团",
      model: "ctm_sas/ctm_sas_variantg",
      type: "agent",
      def: 5602,
    },
  ];

  const moeUBSkinInfoMap = new Map();

  function getMoeUBSkinInfoByName(name) {
    const newName = extractSkinName(name);
    if (moeUBSkinInfoMap.has(newName)) {
      return moeUBSkinInfoMap.get(newName);
    }
    const skinItem = skinJson.find((skin) => skin.name === newName);
    moeUBSkinInfoMap.set(newName, skinItem);
    return skinItem;
  }

  class BaseStrategy {
    skinCode = "";

    updateSkinInfo(record) {
      const { index, wear, seed, name } = record;
      const tempInfo = getMoeUBSkinInfoByName(name);
      const { model, type, def } = tempInfo;
      const isStatTrak = name.includes("StatTrak");

      const codeTextElement = document.querySelector("#codeTextElement");

      let copyValue = "";
      let elementText = "";
      // 枪械、刀
      if (["melee", "weapon"].includes(type)) {
        copyValue = `sm_skin ${model} ${index} ${wear} ${seed} 0 0 0 0 0 0 0 0 ${Number(isStatTrak)}`;
        elementText = `当前饰品: ${seed}, ${wear.substring(0, 6)}..`;
      }
      // 探员
      else if (type === "agent") {
        copyValue = `sm_agent ${def}`;
        elementText = `当前探员: ${def}`;
      }
      // 手套
      else if (type === "glove") {
        copyValue = `sm_glove ${def} ${index} ${wear} ${seed}`;
        elementText = `当前手套: ${seed}, ${wear.substring(0, 6)}..`;
      }

      this.skinCode = copyValue;

      if (codeTextElement) {
        codeTextElement.innerText = elementText;
      }
    }

    copySkinCodeToClipboard() {
      GM_setClipboard(this.skinCode, "text", () => {
        // const copyIconImg = document.querySelector("#copyIconImage");
        // copyIconImg.src = copyDoneIcon;
        // setTimeout(() => {
        //   copyIconImg.src = copyIcon;
        // }, 1000);
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
        const infoValue = JSON.parse(el.attributes.getNamedItem(this.attrName).value);
        const skinName = JSON.parse(el.attributes.getNamedItem("data-goods-info").value).name;
        return Object.assign({}, infoValue, { name: skinName });
      }
      return this.findTrInfoValue(el.parentNode);
    }

    onMouseMove = throttle((e) => {
      const tempInfo = this.findTrInfoValue(e.target);
      if (tempInfo) {
        const {
          info: { paintindex: index, paintseed: seed },
          paintwear: wear,
          name,
        } = tempInfo;
        const formatName = name.replace("消音型", "消音版");
        this.updateSkinInfo({ seed, wear, index, name: formatName });
      }
    }, 100);

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
    constructor() {
      super();
      this.trCalssName = "ant-table-row-level-0";
      this.currentTr = null;
    }

    findTr(el) {
      if (!el) return;
      if (el.tagName === "TR" && el.classList.contains(this.trCalssName)) {
        this.currentTr = el;
        return;
      }
      return this.findTr(el.parentNode);
    }

    startListen() {
      setInterval(() => {
        let uuSkinPopover = document.querySelector(".popover-container___Df3_l");
        if (uuSkinPopover) {
          let infos = Array.from(uuSkinPopover.querySelectorAll(".template-infos-item___gjNUs"));
          let seed = 0;
          let index = 0;
          let wear = 0;
          let name = "";

          try {
            name = uuSkinPopover.querySelector(".goods-title___DPu2Y").textContent;
            seed = parseInt(infos[0].children[1].textContent);
            index = infos[1].children[1].firstChild.textContent;
            wear = infos[2].children[1].textContent;
          } catch {}

          this.updateSkinInfo({ seed, index, wear, name });

          // uu的饰品气泡卡片元素是动态生成的，使用完后需要清理防止内存泄漏
          uuSkinPopover = null;
          infos = null;
        }
      }, 300);
    }

    onMouseMove = throttle((e) => {
      this.findTr(e.target);
    }, 100);

    copySuccessCallback() {
      if (this.currentTr) {
        this.currentTr.style.background = "antiquewhite";
      }
    }

    run() {
      document.addEventListener("mousemove", this.onMouseMove);
      this.startListen();
    }
  }

  // 确定当前 URL 并选择相应的策略
  function determineStrategy() {
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
  const pinStateKey = "iwengxPinState";
  const floatBarMaximumClassName = "iwengx-sidebar-maximum";

  if (strategy) {
    // 初始化操作界面
    GM_addStyle(operationWindowCSS);
    document.body.insertAdjacentHTML("beforeend", operationWindowHTML);

    document.querySelector("#copyButton").addEventListener("click", () => {
      strategy.copySkinCodeToClipboard();
    });
    unsafeWindow.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, keyCode } = e;
      // 复制快捷键
      if (ctrlKey | metaKey && keyCode === 67) {
        strategy.copySkinCodeToClipboard();
      }
    });

    // 窗口的固定状态
    const floatBar = document.querySelector("#iwengxSideBar");
    const pinIcon = document.querySelector("#iwengxBarPin");
    function updatePinState() {
      const isContains = floatBar.classList.contains(floatBarMaximumClassName);
      pinIcon.classList[isContains ? "add" : "remove"]("iwengx-bar-pin-active");
    }
    pinIcon.addEventListener("click", () => {
      const floatState = floatBar.classList.toggle(floatBarMaximumClassName);
      GM_setValue(pinStateKey, floatState);
      updatePinState();
    });
    const isPin = GM_getValue(pinStateKey, true);
    floatBar.classList[isPin ? "add" : "remove"](floatBarMaximumClassName);
    updatePinState();

    // 执行策略
    strategy.run();
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

  /**
   * 截取饰品名称
   * 例如: "蝴蝶刀（★） | 外表生锈 (战痕累累)" => "蝴蝶刀 | 外表生锈"
   * @param {String} skinName
   * @returns
   */
  function extractSkinName(skinName) {
    // 去除 ★ 和 StatTrak™ 相关
    let step1 = skinName.replace(/（★\s*(StatTrak™)?）/g, "").replaceAll(" ", "");

    // 去除磨损等级（战痕累累、破损不堪等）
    let step2 = step1.replace(/\s*\((崭新出厂|略有磨损|久经沙场|破损不堪|战痕累累)\)/g, "");

    // 去除 StatTrak™（单独出现的情况）
    let result = step2.replace(/（StatTrak™）/g, "").trim();

    return result;
  }
})();
