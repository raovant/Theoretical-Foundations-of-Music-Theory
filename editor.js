/* ═══════════════════════════════════════════════════════════
   editor.js — موتور ویرایشگر درسنامه‌ها · نسخه v10
   ═══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var FONT_CSS=`
@font-face{font-family:'Kalameh';font-weight:600;font-display:swap;src:url('fonts/Kalameh-SemiBold.woff2') format('woff2'),url('fonts/Kalameh-SemiBold.woff') format('woff');}
@font-face{font-family:'Kalameh';font-weight:700;font-display:swap;src:url('fonts/Kalameh-Bold.woff2') format('woff2'),url('fonts/Kalameh-Bold.woff') format('woff');}
@font-face{font-family:'IRANSans';font-weight:300;font-display:swap;src:url('fonts/IRANSansWeb_Light.woff2') format('woff2'),url('fonts/IRANSansWeb_Light.woff') format('woff');}
@font-face{font-family:'IRANSans';font-weight:400;font-display:swap;src:url('fonts/IRANSansWeb.woff2') format('woff2'),url('fonts/IRANSansWeb.woff') format('woff');}
@font-face{font-family:'IRANSans';font-weight:500;font-display:swap;src:url('fonts/IRANSansWeb_Medium.woff2') format('woff2'),url('fonts/IRANSansWeb_Medium.woff') format('woff');}
@font-face{font-family:'IRANSans';font-weight:700;font-display:swap;src:url('fonts/IRANSansWeb_Bold.woff2') format('woff2'),url('fonts/IRANSansWeb_Bold.woff') format('woff');}
@font-face{font-family:'IRANSans FaNum';font-weight:400;font-display:swap;src:url('fonts/IRANSansWeb_FaNum.woff2') format('woff2'),url('fonts/IRANSansWeb_FaNum.woff') format('woff');}
@font-face{font-family:'IRANSans FaNum';font-weight:700;font-display:swap;src:url('fonts/IRANSansWeb_Bold_FaNum.woff2') format('woff2'),url('fonts/IRANSansWeb_Bold_FaNum.woff') format('woff');}
`;
var COMP_CSS=`
:root{--paper:#f7f4ee;--card:#fdfbf7;--well:#f0ebe0;--ink:#221d17;--ink-2:#544c40;--ink-3:#8b8272;--rule:#e4dccb;--rule-2:#d3c9b2;--accent:#b23a26;--accent-bg:rgba(178,58,38,.055);--f-disp:'Kalameh',sans-serif;--f-body:'IRANSans','Kalameh',sans-serif;--f-fa:'IRANSans FaNum','IRANSans',sans-serif;--measure:42rem;}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;color-scheme:light}
body{font-family:var(--f-body);background:var(--paper);color:var(--ink);font-size:14.5px;line-height:2.05;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent);color:var(--paper)}
a{color:var(--accent)}
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.fanum{font-family:var(--f-fa)}
.page{max-width:var(--measure);margin:0 auto;padding:56px 28px 40px}
.rule-double{height:7px;border-top:2.5px solid var(--ink);border-bottom:1px solid var(--ink);margin-bottom:26px}
.rule-double.bottom{margin:34px 0 22px}
.divider{border:none;border-top:1px solid var(--rule-2);margin:30px 0}
.fig{margin:26px 0;text-align:center}
.fig img{max-width:100%;border-radius:12px;border:1px solid var(--rule);background:var(--card)}
.fig figcaption{font-size:.78rem;color:var(--ink-3);margin-top:8px}
.back-link{display:inline-flex;align-items:center;gap:8px;font-size:.82rem;font-weight:500;color:var(--ink-3);text-decoration:none;padding:6px 14px;border:1px solid var(--rule);border-radius:99px;background:var(--card);transition:.18s;margin-bottom:18px}
.back-link:hover{border-color:var(--accent);color:var(--accent)}
.back-link .arrow{transition:transform .2s}
.back-link:hover .arrow{transform:translateX(4px)}
.doc-kicker{font-size:.75rem;font-weight:500;color:var(--ink-3);display:flex;align-items:center;gap:10px;margin-bottom:18px}
.doc-kicker::after{content:'';flex:1;border-top:1px solid var(--rule)}
h1{font-family:var(--f-disp);font-weight:700;font-size:clamp(1.8rem,5vw,2.2rem);line-height:1.55;margin-bottom:16px}
h1 .h1-dot{color:var(--accent)}
.doc-lead{font-weight:300;font-size:1.06rem;line-height:2.15;color:var(--ink-2);max-width:36rem;margin-bottom:22px}
.doc-meta{display:flex;flex-wrap:wrap;gap:6px 0;font-size:.8rem;color:var(--ink-3)}
.doc-meta span:not(:last-child)::after{content:'·';margin:0 10px;color:var(--rule-2)}
.doc-meta b{font-family:var(--f-fa);font-weight:700;color:var(--ink-2)}
.toc{margin:34px 0 0;border:1px solid var(--rule);border-radius:14px;background:var(--card);padding:20px 26px 8px}
.toc-title{font-size:.75rem;font-weight:700;color:var(--ink-3);margin-bottom:6px}
.toc ol{list-style:none}
.toc li{border-bottom:1px solid var(--rule)}
.toc li:last-child{border-bottom:none}
.toc a{display:flex;align-items:baseline;gap:12px;padding:9px 2px;text-decoration:none;color:var(--ink-2);font-size:.9rem;font-weight:400;transition:color .15s}
.toc a:hover{color:var(--accent)}
.toc .n{font-family:var(--f-fa);font-size:.72rem;font-weight:700;color:var(--accent);flex:none;width:44px}
.sec{margin-top:72px;scroll-margin-top:32px}
.sec-label{font-size:.8rem;font-weight:700;color:var(--accent);margin-bottom:6px}
.sec h2{font-family:var(--f-disp);font-weight:700;font-size:clamp(1.3rem,3.2vw,1.55rem);line-height:1.65}
.sec h2 .h2-sub{font-family:var(--f-body);font-weight:300;font-size:.6em;color:var(--ink-3)}
.sec-head{border-bottom:1px solid var(--rule-2);padding-bottom:16px;margin-bottom:26px}
.sec-head p{font-size:.92rem;color:var(--ink-3);margin-top:4px;font-weight:300}
.prose p{margin-bottom:1.15rem;text-align:right}
.prose p:last-child{margin-bottom:0}
strong{font-weight:700;color:var(--ink)}
em{font-style:normal;font-weight:500}
u{text-underline-offset:3px}
.tk{direction:ltr;unicode-bidi:isolate;display:inline-block;font-weight:500;font-size:.9em;line-height:1.5;color:var(--ink-2);background:var(--well);border:1px solid var(--rule);border-radius:6px;padding:.02em .55em;vertical-align:baseline}
.seq{direction:ltr;text-align:center;font-weight:500;font-size:.95rem;letter-spacing:.05em;line-height:2;background:var(--well);border:1px solid var(--rule);border-radius:9px;padding:9px 14px;margin:14px 0;color:var(--ink-2)}
.letters{display:flex;direction:ltr;justify-content:center;gap:6px;margin:30px 0 10px;flex-wrap:wrap}
.lt{min-width:62px;text-align:center;padding:10px 4px 12px;border-bottom:2px solid var(--rule-2)}
.lt b{display:block;font-family:var(--f-disp);font-weight:700;font-size:1.55rem;line-height:1.4;color:var(--ink)}
.lt span{font-size:.7rem;color:var(--ink-3)}
.letters-cap{text-align:center;font-size:.78rem;color:var(--ink-3);margin-bottom:26px}
.letters-cap b{color:var(--accent);font-weight:700}
.interval-types{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin:24px 0}
.int-type{border:1px solid var(--rule);border-radius:14px;background:var(--card);padding:20px}
.int-type h3{font-family:var(--f-disp);font-weight:700;font-size:1rem;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.int-type h3 .icon{font-size:1.2rem}
.int-type p{font-size:.88rem;color:var(--ink-2);line-height:2}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:24px 0}
.feature{border:1px solid var(--rule);border-radius:14px;background:var(--card);padding:20px}
.feature h3{font-family:var(--f-disp);font-weight:700;font-size:1rem;margin-bottom:8px;color:var(--accent)}
.feature p{font-size:.88rem;color:var(--ink-2);line-height:2;margin-bottom:8px}
.feature .example{background:var(--well);border-radius:8px;padding:10px 14px;font-size:.85rem;line-height:1.9;margin-top:10px}
.note{border-inline-start:3px solid var(--accent);background:var(--accent-bg);border-radius:0 12px 12px 0;padding:14px 20px;margin:24px 0;font-size:.93rem;line-height:2.1;color:var(--ink-2)}
.note .tag{color:var(--accent);font-weight:700;font-size:.82rem}
table{width:100%;border-collapse:collapse;margin:24px 0;font-size:.88rem}
caption{caption-side:top;text-align:right;font-size:.78rem;color:var(--ink-3);padding-bottom:8px;font-weight:500}
th{font-size:.72rem;font-weight:700;color:var(--ink-3);text-align:right;padding:10px 8px;border-bottom:1.5px solid var(--rule-2);vertical-align:top}
td{padding:10px 8px;border-bottom:1px solid var(--rule);vertical-align:top;color:var(--ink-2);font-size:.85rem;line-height:1.8}
tr:last-child td{border-bottom:none}
td.num{font-weight:700;font-size:1rem;color:var(--accent);width:35px;direction:ltr;text-align:right}
td.sym{font-weight:700;color:var(--ink);width:60px;direction:ltr;text-align:right}
td.semi{width:40px;direction:ltr;text-align:right;font-weight:700;font-family:var(--f-fa)}
td.ex{direction:ltr;text-align:right;width:80px;color:var(--ink);font-weight:500}
td.name{direction:ltr;text-align:right;color:var(--ink);font-weight:500;width:120px}
td.emotion{color:var(--ink-2);font-size:.82rem}
td.use{font-size:.82rem;color:var(--ink-3)}
td .en{font-weight:500;font-size:.88em;color:var(--ink-2);direction:ltr;unicode-bidi:isolate;display:inline-block}
.formula{direction:ltr;text-align:center;font-weight:500;font-size:1.04rem;line-height:2;background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:20px 16px;margin:24px 0 8px;color:var(--ink)}
.formula b{color:var(--accent);font-weight:700}
.formula-cap{text-align:center;font-size:.8rem;color:var(--ink-3);margin-bottom:24px}
.freq{display:flex;border:1px solid var(--rule);border-radius:12px;background:var(--card);margin:26px 0;overflow:hidden}
.freq>div{flex:1;text-align:center;padding:16px 8px}
.freq>div+div{border-inline-start:1px solid var(--rule)}
.freq b{display:block;font-weight:700;font-size:1.3rem;direction:ltr;line-height:1.7}
.freq span{display:block;font-weight:500;font-size:.82rem;color:var(--ink-2);direction:ltr}
.freq i{display:block;font-style:normal;font-size:.72rem;color:var(--ink-3);margin-top:4px}
.freq .ref b{color:var(--accent)}
.freq .ref i{color:var(--accent);font-weight:700}
.piece{border:1px solid var(--rule);border-radius:14px;background:var(--card);padding:22px 26px;margin:22px 0}
.piece h3{font-family:var(--f-disp);font-weight:700;font-size:1.08rem;line-height:1.9}
.piece h3 .en-name{font-family:var(--f-body);font-weight:700;font-size:.95em;direction:ltr;unicode-bidi:isolate;display:inline-block}
.piece .artist{font-family:var(--f-body);font-size:.78rem;color:var(--ink-3);font-weight:300}
.piece .oct-tag{display:inline-block;font-size:.72rem;font-weight:700;color:var(--accent);border:1px solid var(--accent);border-radius:99px;padding:1px 12px;margin-inline-start:10px;vertical-align:middle}
.piece .an{font-size:.9rem;color:var(--ink-2);line-height:2.15;margin-top:12px}
.piece .an b{color:var(--ink)}
.piece .an-label{color:var(--accent);font-weight:700;font-size:.82rem}
.inversion-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:24px 0}
.inv-card{border:1px solid var(--rule);border-radius:10px;background:var(--card);padding:14px;text-align:center}
.inv-card .arrow{display:block;font-size:1.2rem;color:var(--accent);margin:6px 0}
.inv-card .from,.inv-card .to{font-size:.85rem;font-weight:500}
.inv-card .from{color:var(--ink-2)}
.inv-card .to{color:var(--accent);font-weight:700}
.key-point{border:1px solid var(--rule);border-radius:14px;background:var(--card);padding:20px;margin:20px 0}
.key-point h3{font-family:var(--f-disp);font-weight:700;font-size:.95rem;margin-bottom:10px;color:var(--accent)}
.key-point p{font-size:.88rem;color:var(--ink-2);line-height:2}
.qa{margin:26px 0}
.qa .q,.qa .a{margin-bottom:10px}
.qa-mark{display:inline-block;font-size:.7rem;font-weight:700;border-radius:99px;padding:2px 13px;margin-inline-end:10px;vertical-align:2px}
.q .qa-mark{color:var(--accent);border:1px solid var(--accent);background:transparent}
.a .qa-mark{color:var(--ink-3);border:1px solid var(--rule-2);background:var(--card)}
.qa .q{font-weight:700;line-height:2.1}
.qa .a{color:var(--ink-2);font-size:.93rem;line-height:2.15;padding-inline-start:4px}
.ex-item{display:flex;gap:16px;margin:26px 0}
.ex-num{flex:none;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--accent);color:var(--accent);display:grid;place-items:center;font-family:var(--f-fa);font-weight:700;font-size:1.05rem;margin-top:6px}
.ex-body{flex:1;min-width:0}
.ex-body h4{font-family:var(--f-disp);font-weight:700;font-size:1rem;margin-bottom:2px}
.ex-body>p{font-size:.93rem;color:var(--ink-2)}
.ex-list{list-style:none;margin-top:10px;padding-inline-start:0}
.ex-list li{padding:4px 0;font-size:.88rem;color:var(--ink-2);line-height:2}
.ex-list li::before{content:'•';color:var(--accent);font-weight:700;margin-inline-end:8px}
.ex-ans{margin-top:12px;border-top:1px dashed var(--rule-2);padding-top:10px;font-size:.88rem;color:var(--ink-2);line-height:2.1}
.ex-ans b.ans-label{color:var(--accent);font-weight:700;font-size:.8rem}
.summary{border:2px solid var(--accent);border-radius:14px;background:var(--accent-bg);padding:24px;margin:32px 0}
.summary h3{font-family:var(--f-disp);font-weight:700;font-size:1.1rem;margin-bottom:14px;color:var(--accent)}
.summary ul{list-style:none;padding:0}
.summary li{padding:6px 0;font-size:.9rem;line-height:2;color:var(--ink-2)}
.summary li::before{content:'✓';color:var(--accent);font-weight:700;margin-inline-end:10px}
footer{text-align:center}
footer .fl{font-size:.8rem;color:var(--ink-3);line-height:2.2}
footer .fl b{color:var(--ink-2)}
footer .note-glyph{font-size:1.3rem;color:var(--accent);display:block;margin-bottom:6px}
/* ── اجزای نقشهٔ راه (فاز/مبحث) ── */
.topics{list-style:none}
.topic{display:flex;align-items:center;gap:10px;padding:4px 2px;border-bottom:1px solid var(--rule)}
.t-link{flex:1;display:flex;align-items:center;gap:10px;padding:7px 2px;text-decoration:none;color:var(--ink-2);transition:.15s;min-width:0}
.t-link:hover{color:var(--accent)}
.t-text{flex:1;font-size:.95rem;line-height:2;min-width:0}
.go{flex:none;color:var(--rule-2);font-size:.95rem;transition:.2s}
.t-link:hover .go{color:var(--accent);transform:translateX(-5px)}
.t-link.unset{opacity:.75}
.phase-head{display:flex;align-items:flex-start;gap:12px}
.ph-t{flex:1;min-width:0}
.col-btn{width:31px;height:31px;border-radius:50%;border:1px solid var(--rule-2);background:var(--card);color:var(--ink-3);font-size:.8rem;transition:transform .3s,border-color .2s}
.col-btn:hover{border-color:var(--accent);color:var(--accent)}
.phase.closed .col-btn{transform:rotate(90deg)}
.phase-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .45s ease}
.phase.closed .phase-body{grid-template-rows:0fr}
.phase-inner{overflow:hidden}
/* ── موتور ── */
body:not(.editing) .edit-only{display:none!important}
body.editing [data-edit]{cursor:text;border-radius:4px}
body.editing [data-edit]:hover{outline:1.5px dashed var(--accent);outline-offset:4px}
body.editing [data-edit]:focus{outline:1.5px solid var(--accent);outline-offset:4px;background:var(--accent-bg)}
.selected{outline:2px solid var(--accent)!important;outline-offset:4px;border-radius:4px}
body.editing #sheet *{cursor:pointer}
body.editing #sheet [data-edit]{cursor:text}
.add-phase{display:block;width:100%;margin-top:44px;padding:14px;border-radius:14px;border:1.5px dashed var(--rule-2);background:transparent;color:var(--ink-3);font-size:.9rem;font-weight:700;transition:.2s}
.add-phase:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}
.ctx{position:fixed;z-index:70;min-width:250px;max-height:88vh;overflow:auto;background:var(--card);border:1px solid var(--rule-2);border-radius:14px;box-shadow:0 18px 50px rgba(34,29,23,.28);padding:6px;display:none;font-family:var(--f-body)}
.ctx.open{display:block}
.ctx button{display:flex;align-items:center;gap:10px;width:100%;text-align:right;background:none;border:none;border-radius:9px;padding:8px 12px;font-size:.8rem;color:var(--ink-2);transition:.12s;font-family:var(--f-body)}
.ctx button:hover{background:var(--accent-bg);color:var(--accent)}
.ctx button .ci{width:20px;text-align:center;flex:none}
.ctx button .ck{margin-inline-start:auto;font-size:.65rem;color:var(--ink-3)}
.ctx .csep{height:1px;background:var(--rule);margin:5px 8px}
.ctx .ctitle{font-size:.62rem;color:var(--ink-3);padding:4px 12px 2px;font-weight:700}
.ctx .cstatus{font-size:.62rem;color:var(--ink-3);padding:6px 12px 4px;text-align:center;direction:ltr}
.ctx .cstatus.bad{color:var(--accent)}
.insp{position:fixed;bottom:14px;inset-inline:0;z-index:45;display:flex;justify-content:center;padding:0 12px;pointer-events:none}
.insp[hidden]{display:none}
.insp-card{pointer-events:auto;width:min(680px,100%);background:var(--card);border:1px solid var(--rule-2);border-radius:16px;box-shadow:0 14px 44px rgba(34,29,23,.18);padding:12px 18px 14px;font-family:var(--f-body)}
.insp-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.insp-head b{font-size:.78rem;color:var(--accent)}
#inspTag{font-size:.7rem;color:var(--ink-3);direction:ltr}
.insp-head .sp{flex:1}
.insp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px 12px;align-items:end}
.insp-grid label{display:flex;flex-direction:column;gap:3px;font-size:.68rem;color:var(--ink-3);font-weight:500}
.insp-grid input[type=range]{width:100%;accent-color:var(--accent)}
.insp-grid select,.insp-grid input[type=color]{width:100%;border:1px solid var(--rule-2);border-radius:8px;background:var(--paper);color:var(--ink);font-family:inherit;font-size:.75rem;padding:4px 6px}
.insp-grid input[type=color]{padding:2px;height:30px}
.swatches{display:flex;gap:6px;align-items:center}
.sw{width:20px;height:20px;border-radius:50%;border:1px solid var(--rule-2)}
.sw:hover{transform:scale(1.15)}
.ib{width:26px;height:26px;border-radius:50%;border:1px solid var(--rule-2);background:transparent;color:var(--ink-3);font-size:.8rem;line-height:1;transition:.15s}
.ib:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}
.toast{position:fixed;bottom:24px;inset-inline:0;display:flex;justify-content:center;z-index:50;pointer-events:none}
.toast span{background:var(--ink);color:var(--paper);font-size:.78rem;padding:8px 22px;border-radius:99px;opacity:0;transform:translateY(14px);transition:.3s;max-width:88%;text-align:center;font-family:var(--f-body)}
@media print{@page{margin:17mm}body{background:#fff;font-size:11.5pt}.page{max-width:100%;padding:0}.sec{margin-top:2.4em;break-inside:auto}.note,.piece,.ex-item,table,.features{break-inside:avoid}a{color:inherit;text-decoration:none}.edit-only,.toast,.insp,.ctx,.back-link{display:none!important}}
@media(max-width:560px){.page{padding:40px 20px}body{font-size:15.5px}.ex-item{gap:12px}.freq{flex-direction:column}.freq>div+div{border-inline-start:none;border-top:1px solid var(--rule)}}
`;
function injectStyle(id,css){var el=document.getElementById(id);if(!el){el=document.createElement('style');el.id=id;document.head.appendChild(el);}el.textContent=css;}
injectStyle('inj-fonts',FONT_CSS);
injectStyle('inj-css',COMP_CSS);

var INSP_HTML='<div class="insp" id="insp" hidden><div class="insp-card"><div class="insp-head"><b>استایل المان / انتخاب</b><span id="inspTag"></span><span class="sp"></span><button type="button" class="ib" id="inspReset" title="بازنشانی استایل">↺</button><button type="button" class="ib" id="inspClose" title="بستن">×</button></div><div class="insp-grid"><label>سایز قلم <span class="ltr" id="vSize"></span><input type="range" id="inSize" min="10" max="56" step="1"></label><label>فاصله خطوط <input type="range" id="inLh" min="1.4" max="2.8" step="0.05"></label><label>وزن<select id="inWeight"><option value="300">300 Light</option><option value="400">400 Regular</option><option value="500">500 Medium</option><option value="600">600 SemiBold</option><option value="700">700 Bold</option></select></label><label>خانواده<select id="inFamily"><option value="body">IRANSans</option><option value="disp">Kalameh</option><option value="fa">IRANSans FaNum</option></select></label><label>چینش<select id="inAlign"><option value="right">راست</option><option value="center">وسط</option><option value="left">چپ</option></select></label><label>رنگ<div class="swatches"><button type="button" class="sw" data-c="#221d17" style="background:#221d17"></button><button type="button" class="sw" data-c="#544c40" style="background:#544c40"></button><button type="button" class="sw" data-c="#8b8272" style="background:#8b8272"></button><button type="button" class="sw" data-c="#b23a26" style="background:#b23a26"></button><input type="color" id="inColor" value="#221d17"></div></label></div></div></div>';
function ensureChrome(){
  if(!document.getElementById('ctx')){var c=document.createElement('div');c.id='ctx';c.className='ctx';document.body.appendChild(c);}
  if(!document.getElementById('insp')){document.body.insertAdjacentHTML('beforeend',INSP_HTML);}
  if(!document.querySelector('.toast')){var t=document.createElement('div');t.className='toast';t.innerHTML='<span id="toastMsg"></span>';document.body.appendChild(t);}
  if(!document.getElementById('imgFileInput')){var f=document.createElement('input');f.type='file';f.accept='image/*';f.id='imgFileInput';f.style.display='none';document.body.appendChild(f);}
  if(!document.getElementById('addSection')){var foot=document.querySelector('#sheet .rule-double.bottom')||document.querySelector('#sheet footer');if(foot){foot.insertAdjacentHTML('beforebegin','<button type="button" class="add-phase edit-only" id="addSection">+ افزودن بخش جدید</button>');}}
}
ensureChrome();

var STATUS='در حال بررسی…';
function showErr(m){STATUS='✗ '+m;var t=document.getElementById('toastMsg');if(t){t.textContent='⚠️ '+m;t.classList.add('show');}if(window.console)console.error(m);}
window.addEventListener('error',function(e){showErr(e.message||'خطای جاوااسکریپت');});

try{
var $=function(s){return document.querySelector(s);}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
var BASE=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'')||'index';
var KEY='edit-'+BASE;
var VER='v10';
var sheet=$('#sheet');
var selEl=null, PPI=3, anchorEl=null, lastX=0, lastY=0;
var insp=$('#insp'), ctx=$('#ctx');

/* ── تاریخچه Undo/Redo ── */
var hist=[],histIdx=-1;
function persist(){try{localStorage.setItem(KEY,sheet.innerHTML);}catch(e){}}
function pushHist(){var snap=sheet.innerHTML;if(hist[histIdx]===snap)return;hist=hist.slice(0,histIdx+1);hist.push(snap);if(hist.length>60)hist.shift();histIdx=hist.length-1;}
function afterRestore(){makeEditableSafe(sheet);if(document.body.classList.contains('editing'))setEditing(true);deselect();}
function undo(){if(histIdx>0){histIdx--;sheet.innerHTML=hist[histIdx];persist();afterRestore();toast('واگرد ↩');}}
function redo(){if(histIdx<hist.length-1){histIdx++;sheet.innerHTML=hist[histIdx];persist();afterRestore();toast('ازنو ↪');}}

var st;
function save(quiet){persist();pushHist();if(!quiet)toast('ذخیره شد ✓');}
function saveSoon(){clearTimeout(st);st=setTimeout(function(){save(true);},500);}
function toast(msg){var el=$('#toastMsg');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show');},2200);}
try{var saved=localStorage.getItem(KEY);if(saved&&saved.indexOf('<section')>-1&&saved.length>800)sheet.innerHTML=saved;}catch(e){}
sheet=$('#sheet');

var WRAP_BOXES='.note,.example,.key-point,.int-type,.feature,.piece,.ex-body,.inv-card,.lt,.freq>div,.summary,.qa,.fig';
function makeEditableSafe(root){
  (root||sheet).querySelectorAll(WRAP_BOXES).forEach(function(box){
    if(box.hasAttribute('data-edit'))return;
    box.querySelectorAll('.tag,.an-label,.qa-mark').forEach(function(t){if(!t.hasAttribute('data-edit'))t.setAttribute('data-edit','');});
    Array.prototype.slice.call(box.childNodes).forEach(function(n){
      if(n.nodeType===3&&n.parentNode===box&&n.textContent.trim()){
        var s=document.createElement('span');s.setAttribute('data-edit','');
        box.replaceChild(s,n);s.appendChild(n);
      }
    });
  });
}
makeEditableSafe(sheet);
pushHist();

function setEditing(on){
  document.body.classList.toggle('editing',on);
  $$('#sheet [data-edit]').forEach(function(el){
    if(on){try{el.contentEditable='plaintext-only';}catch(e){el.contentEditable='true';}}
    else el.contentEditable='false';
  });
  if(!on)deselect();
}
setEditing(false);

var TPL={
  note:'<div class="note"><span class="tag" data-edit>نکته — </span><span data-edit>متن نکته یا کاربرد…</span></div>',
  keypoint:'<div class="key-point"><h3 data-edit>عنوان کانتینر</h3><p data-edit>متن توضیح…</p></div>',
  divider:'<div class="divider"></div>',
  table:'<table><thead><tr><th data-edit>ستون ۱</th><th data-edit>ستون ۲</th><th data-edit>ستون ۳</th></tr></thead><tbody><tr><td data-edit>…</td><td data-edit>…</td><td data-edit>…</td></tr><tr><td data-edit>…</td><td data-edit>…</td><td data-edit>…</td></tr></tbody></table>',
  formula:'<div class="formula" data-edit>FORMULA</div>',
  seq:'<div class="seq" data-edit>C - D - E - F - G - A - B</div>',
  piece:'<article class="piece"><h3 data-edit>عنوان قطعه <span class="en-name">Song Name</span> <span class="int-tag fanum">برچسب</span><br><span class="artist">از <span class="ltr">Artist</span></span></h3><p class="an" data-edit><span class="an-label">تحلیل: </span>متن تحلیل…</p></article>',
  features:'<div class="features"><div class="feature"><h3 data-edit>عنوان الف</h3><p data-edit>متن…</p></div><div class="feature"><h3 data-edit>عنوان ب</h3><p data-edit>متن…</p></div></div>',
  qa:'<div class="qa"><p class="q" data-edit><span class="qa-mark">پرسش</span> متن پرسش…</p><p class="a" data-edit><span class="qa-mark">پاسخ</span> متن پاسخ…</p></div>',
  ex:'<div class="ex-item"><div class="ex-num fanum">۱</div><div class="ex-body"><h4 data-edit>عنوان تمرین</h4><p data-edit>صورت تمرین…</p></div></div>',
  summary:'<div class="summary"><h3 data-edit>جمع‌بندی</h3><ul><li data-edit>مورد اول…</li><li data-edit>مورد دوم…</li></ul></div>',
  letters:'<div class="letters"><div class="lt" data-edit><b>C</b><span>دو</span></div><div class="lt" data-edit><b>D</b><span>ر</span></div><div class="lt" data-edit><b>E</b><span>می</span></div></div>',
  freq:'<div class="freq"><div data-edit><b>A4</b><span>440 Hz</span><i>توضیح</i></div><div data-edit><b>A5</b><span>880 Hz</span><i>توضیح</i></div></div>',
  section:'<section class="sec"><div class="sec-head"><p class="sec-label" data-edit>بخش جدید</p><h2 data-edit>عنوان بخش…</h2></div><div class="prose"><p data-edit>متن بخش…</p></div></section>'
};
function insertHTML(html){
  var anchor=anchorEl||$('#addSection')||sheet.lastElementChild;
  anchor.insertAdjacentHTML('beforebegin',html);
  var n=anchor.previousElementSibling;
  makeEditableSafe(n);syncEditable(n);save(false);
  toast('بلوک اضافه شد ✓');
}
function syncEditable(root){
  if(!document.body.classList.contains('editing'))return;
  root.querySelectorAll('[data-edit]').forEach(function(el){try{el.contentEditable='plaintext-only';}catch(e){el.contentEditable='true';}});
}
function addSectionFn(){insertHTML(TPL.section);}
function pickImageFile(){
  var inp=$('#imgFileInput');
  inp.onchange=function(){
    var f=inp.files&&inp.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(){insertHTML('<figure class="fig"><img src="'+r.result+'" alt=""><figcaption data-edit>توضیح تصویر…</figcaption></figure>');};
    r.readAsDataURL(f);inp.value='';
  };
  inp.click();
}
function insertImageURL(){
  var u=prompt('لینک یا مسیر تصویر (مثلاً img/photo.png):');
  if(u&&u.trim())insertHTML('<figure class="fig"><img src="'+u.trim()+'" alt=""><figcaption data-edit>توضیح تصویر…</figcaption></figure>');
}

/* ── پنل استایل + استایل سطح کلمه ── */
var SEL='#sheet h1,#sheet h2,#sheet h3,#sheet h4,#sheet p,#sheet li,#sheet a,#sheet span,#sheet b,#sheet td,#sheet th,#sheet caption,#sheet .formula,#sheet .seq,#sheet .int-type,#sheet .feature,#sheet .piece,#sheet .inv-card,#sheet .key-point,#sheet figure';
var BLOCK_SEL='#sheet .sec,#sheet header,#sheet footer,#sheet nav.toc,#sheet .rule-double,#sheet .divider,#sheet .sec-head,#sheet article.piece,#sheet table,#sheet .interval-types,#sheet .features,#sheet .inversion-grid,#sheet .summary,#sheet .note,#sheet .key-point,#sheet .ex-item,#sheet .qa,#sheet .letters,#sheet .freq,#sheet figure,#sheet .phase';
var FAMS={body:"'IRANSans','Kalameh',sans-serif",disp:"'Kalameh',sans-serif",fa:"'IRANSans FaNum','IRANSans',sans-serif"};
function rgbHex(c){var m=c.match(/\d+/g);return m?'#'+m.slice(0,3).map(function(x){return (+x).toString(16).padStart(2,'0');}).join(''):'#221d17';}
function currentSelectionRange(){
  var sel=getSelection();
  if(!sel||!sel.rangeCount)return null;
  var r=sel.getRangeAt(0);
  if(r.collapsed)return null;
  var host=r.commonAncestorContainer;host=host.nodeType===1?host:host.parentElement;
  if(!host||!host.closest('[data-edit]'))return null;
  return r;
}
function styleSelection(prop,val){
  var r=currentSelectionRange();if(!r)return false;
  var sp=document.createElement('span');sp.style[prop]=val;
  try{r.surroundContents(sp);}
  catch(e){var f=r.extractContents();sp.appendChild(f);r.insertNode(sp);}
  saveSoon();return true;
}
function styleProp(prop,val){if(styleSelection(prop,val))return;applyStyle(function(s){s[prop]=val;});}
function select(el){
  if(selEl)selEl.classList.remove('selected');
  selEl=el;
  if(!el){insp.hidden=true;return;}
  el.classList.add('selected');insp.hidden=false;
  $('#inspTag').textContent='<'+el.tagName.toLowerCase()+'>';
  var cs=getComputedStyle(el);
  $('#inSize').value=parseFloat(cs.fontSize);$('#vSize').textContent=Math.round(parseFloat(cs.fontSize))+'px';
  $('#inLh').value=Math.min(2.8,Math.max(1.4,parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||2)).toFixed(2);
  var w=String(Math.round(+cs.fontWeight));
  $('#inWeight').value=['300','400','500','600','700'].indexOf(w)>-1?w:'400';
  $('#inFamily').value=cs.fontFamily.indexOf('Kalameh')>-1?'disp':cs.fontFamily.indexOf('FaNum')>-1?'fa':'body';
  $('#inAlign').value=cs.textAlign==='center'?'center':cs.textAlign==='left'?'left':'right';
  $('#inColor').value=rgbHex(cs.color);
}
function deselect(){select(null);}
$('#inspClose').addEventListener('click',deselect);
$('#inspReset').addEventListener('click',function(){if(selEl){selEl.removeAttribute('style');select(selEl);saveSoon();}});
function applyStyle(fn){if(!selEl)return;fn(selEl.style);saveSoon();}
$('#inSize').addEventListener('input',function(e){$('#vSize').textContent=e.target.value+'px';styleProp('fontSize',e.target.value+'px');});
$('#inLh').addEventListener('input',function(e){applyStyle(function(s){s.lineHeight=e.target.value;});});
$('#inWeight').addEventListener('change',function(e){styleProp('fontWeight',e.target.value);});
$('#inFamily').addEventListener('change',function(e){styleProp('fontFamily',FAMS[e.target.value]);});
$('#inAlign').addEventListener('change',function(e){applyStyle(function(s){s.textAlign=e.target.value;});});
$('#inColor').addEventListener('input',function(e){styleProp('color',e.target.value);});
$$('.sw').forEach(function(b){b.addEventListener('click',function(){styleProp('color',b.dataset.c);$('#inColor').value=b.dataset.c;});});

function removeEl(el){
  var big=el.matches(BLOCK_SEL);
  if(big&&!confirm('کل بخش <'+el.tagName.toLowerCase()+'> حذف شود؟'))return;
  if(selEl&&el.contains(selEl))deselect();
  el.remove();save(false);
  toast(big?'بخش کامل حذف شد':'المان حذف شد');
}

/* ── جست‌وجو و جایگزینی ── */
function findReplace(){
  var f=prompt('جست‌وجو برای:');if(!f)return;
  var r=prompt('جایگزینی با:');if(r===null)return;
  var count=0;
  $$('#sheet [data-edit]').forEach(function(el){
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null);
    var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(n){
      if(n.nodeValue.indexOf(f)>-1){count+=n.nodeValue.split(f).length-1;n.nodeValue=n.nodeValue.split(f).join(r);}
    });
  });
  if(count){save(false);toast(count+' مورد جایگزین شد');}else toast('پیدا نشد');
}

/* ── ابزار جدول ── */
function tableTools(cell){
  var table=cell.closest('table'),tr=cell.closest('tr');
  addTitle('ابزار جدول');
  addItem('＋','افزودن سطر',function(){
    var last=table.rows[table.rows.length-1],nr=table.insertRow(-1);
    for(var i=0;i<last.cells.length;i++){var c=nr.insertCell(-1);c.setAttribute('data-edit','');c.textContent='…';}
    syncEditable(nr);save(false);
  });
  addItem('＋','افزودن ستون',function(){
    Array.prototype.forEach.call(table.rows,function(row,idx){
      var c=row.insertCell(-1);c.setAttribute('data-edit','');
      c.textContent=(idx===0&&row.parentNode.tagName==='THEAD')?'ستون جدید':'…';
    });
    syncEditable(table);save(false);
  });
  addItem('－','حذف این سطر',function(){if(table.rows.length>1){tr.parentNode.removeChild(tr);save(false);}});
  addItem('－','حذف این ستون',function(){var idx=cell.cellIndex;Array.prototype.forEach.call(table.rows,function(row){if(row.cells[idx])row.deleteCell(idx);});save(false);});
  addSep();
}

/* ── منوی کلیک‌راست ── */
function hideCtx(){ctx.classList.remove('open');}
function addItem(icon,label,fn,extra){
  var b=document.createElement('button');
  b.innerHTML='<span class="ci">'+icon+'</span><span>'+label+'</span>'+(extra?'<span class="ck">'+extra+'</span>':'');
  b.addEventListener('click',function(){hideCtx();fn();});
  ctx.appendChild(b);
}
function addSep(){var d=document.createElement('div');d.className='csep';ctx.appendChild(d);}
function addTitle(t){var d=document.createElement('div');d.className='ctitle';d.textContent=t;ctx.appendChild(d);}
function placeCtx(){
  ctx.classList.add('open');
  var w=ctx.offsetWidth,h=ctx.offsetHeight;
  ctx.style.left=Math.max(8,Math.min(lastX,innerWidth-w-10))+'px';
  ctx.style.top=Math.max(8,Math.min(lastY,innerHeight-h-10))+'px';
}
function openInsertMenu(){
  ctx.innerHTML='';
  addTitle('درج بلوک (قبل از بخش انتخاب‌شده)');
  addItem('🖼','تصویر (از فایل)',pickImageFile);
  addItem('🔗','تصویر (از لینک)',insertImageURL);
  addItem('➖','خط جداکننده',function(){insertHTML(TPL.divider);});
  addItem('🩷','باکس صورتی نکته / کاربرد',function(){insertHTML(TPL.note);});
  addItem('📦','کانتینر (عنوان + متن)',function(){insertHTML(TPL.keypoint);});
  addItem('📊','جدول (۳×۳)',function(){insertHTML(TPL.table);});
  addItem('🧮','باکس فرمول',function(){insertHTML(TPL.formula);});
  addItem('🎼','ردیف نت‌ها (seq)',function(){insertHTML(TPL.seq);});
  addItem('🎸','کارت تحلیل قطعه',function(){insertHTML(TPL.piece);});
  addItem('🗂','کارت‌های دوستونی',function(){insertHTML(TPL.features);});
  addItem('❓','پرسش و پاسخ',function(){insertHTML(TPL.qa);});
  addItem('✍️','تمرین',function(){insertHTML(TPL.ex);});
  addItem('✅','باکس جمع‌بندی',function(){insertHTML(TPL.summary);});
  addItem('🎹','ردیف حروف نت',function(){insertHTML(TPL.letters);});
  addItem('📶','نوار فرکانس',function(){insertHTML(TPL.freq);});
  placeCtx();
}
var SHORTCUTS_TXT='شرتکات‌ها (حالت ویرایش):\nCtrl+Shift+→ : راست‌چین\nCtrl+Shift+← : چپ‌چین\nCtrl+E : وسط‌چین · Ctrl+J : کشیده\nCtrl+B/I/U : ضخیم/ایتالیک/زیرخط (روی کلمهٔ انتخاب‌شده)\nانتخاب کلمه + تغییر سایز/وزن/رنگ/فونت از پنل : فقط روی انتخاب\nCtrl+] / Ctrl+[ : سایز ±\nCtrl+D : پنل استایل\nCtrl+Z / Ctrl+Y : واگرد / ازنو\nCtrl+H : جست‌وجو و جایگزینی\nCtrl+S : ذخیره\nEsc : لغو انتخاب / بستن منو';
document.addEventListener('contextmenu',function(e){
  if(e.target.closest('.insp'))return;
  e.preventDefault();
  lastX=e.clientX;lastY=e.clientY;
  var t=e.target, editing=document.body.classList.contains('editing');
  anchorEl=t.closest(BLOCK_SEL)||t.closest('#sheet .sec');
  ctx.innerHTML='';
  if(editing&&t.closest('#sheet')){
    var cell=t.closest('td,th');
    if(cell)tableTools(cell);
    var small=t.closest(SEL), block=t.closest(BLOCK_SEL), edt=t.closest('[data-edit]');
    if(small||block){
      addTitle('المان زیر نشانگر');
      if(edt)addItem('✍️','ویرایش متن این بخش',function(){setEditing(true);edt.focus();});
      var sty=small||block;
      if(sty)addItem('🎨','استایل این المان <'+sty.tagName.toLowerCase()+'>',function(){select(sty);});
      if(small)addItem('🗑','حذف این المان <'+small.tagName.toLowerCase()+'>',function(){removeEl(small);});
      if(block&&block!==small){
        addItem('⛔','حذف کل بخش <'+block.tagName.toLowerCase()+'>',function(){removeEl(block);});
        addItem('⧉','تکثیر این بخش',function(){var c=block.cloneNode(true);block.parentNode.insertBefore(c,block.nextElementSibling);makeEditableSafe(c);syncEditable(c);save(false);});
        addItem('⬆','جابه‌جایی به بالا',function(){var p=block.previousElementSibling;if(p){block.parentNode.insertBefore(block,p);save(false);}});
        addItem('⬇','جابه‌جایی به پایین',function(){var n=block.nextElementSibling;if(n){block.parentNode.insertBefore(block,n.nextElementSibling);save(false);}});
      }
      addSep();
    }
  }
  addItem(editing?'✅':'✏️',editing?'خروج از حالت ویرایش':'حالت ویرایش',function(){setEditing(!editing);});
  if(editing){
    addItem('➕','درج بلوک جدید…',openInsertMenu);
    addItem('📄','افزودن بخش جدید',addSectionFn);
    addItem('🔎','جست‌وجو و جایگزینی',findReplace);
    addItem('↩','واگرد (Undo)',undo);
    addItem('↪','ازنو (Redo)',redo);
  }
  addSep();
  addItem('🖼','خروجی PNG',exportPNG,'×'+PPI);
  addItem('📄','خروجی PDF',exportPDF,'×'+PPI);
  addItem('⚙️','کیفیت خروجی (PPI)',changePPI,'×'+PPI);
  addSep();
  addItem('💾','ذخیره تغییرات در سورس',saveSource);
  addItem('⬇','دانلود کپی سورس',dlCopy);
  addItem('↺','بازنشانی به نسخه اولیه',resetFn);
  addItem('⌨','فهرست شرتکات‌ها',function(){alert(SHORTCUTS_TXT);});
  addSep();
  var stt=document.createElement('div');
  stt.className='cstatus'+(STATUS.indexOf('✗')===0?' bad':'');
  stt.textContent=VER+' · '+STATUS+' · '+BASE;
  ctx.appendChild(stt);
  placeCtx();
});
document.addEventListener('click',function(e){if(!e.target.closest('.ctx'))hideCtx();},true);
addEventListener('scroll',hideCtx,{passive:true});
addEventListener('resize',hideCtx);
addEventListener('keydown',function(e){if(e.key==='Escape'){deselect();hideCtx();}});

function changePPI(){
  var v=parseFloat(prompt('ضریب کیفیت خروجی (۰٫۵ تا ۶):',PPI));
  if(!isNaN(v)){PPI=Math.min(6,Math.max(0.5,v));toast('کیفیت خروجی: ×'+PPI);}
}

/* ── شرتکات‌ها ── */
function editTargetFromSelection(){
  var sel=getSelection();
  var node=sel&&sel.anchorNode;
  if(!node)return selEl||null;
  var el=node.nodeType===1?node:node.parentElement;
  return (el&&el.closest('[data-edit]'))||selEl;
}
function wrapSelection(tag){
  var r=currentSelectionRange();if(!r)return;
  var el=document.createElement(tag);
  try{r.surroundContents(el);}
  catch(err){var f=r.extractContents();el.appendChild(f);r.insertNode(el);}
  saveSoon();
}
document.addEventListener('keydown',function(e){
  if(!document.body.classList.contains('editing'))return;
  if(!(e.ctrlKey||e.metaKey))return;
  var tgt=editTargetFromSelection();
  var k=e.key;
  if(!e.shiftKey&&(k==='z'||k==='Z')){e.preventDefault();undo();return;}
  if(!e.shiftKey&&(k==='y'||k==='Y')){e.preventDefault();redo();return;}
  if(!e.shiftKey&&(k==='h'||k==='H')){e.preventDefault();findReplace();return;}
  if(e.shiftKey&&k==='ArrowRight'){e.preventDefault();if(tgt){tgt.style.textAlign='right';select(tgt);saveSoon();}return;}
  if(e.shiftKey&&k==='ArrowLeft'){e.preventDefault();if(tgt){tgt.style.textAlign='left';select(tgt);saveSoon();}return;}
  if(!e.shiftKey&&(k==='e'||k==='E')){e.preventDefault();if(tgt){tgt.style.textAlign='center';select(tgt);saveSoon();}return;}
  if(!e.shiftKey&&(k==='j'||k==='J')){e.preventDefault();if(tgt){tgt.style.textAlign='justify';select(tgt);saveSoon();}return;}
  if(!e.shiftKey&&(k==='b'||k==='B')){e.preventDefault();wrapSelection('strong');return;}
  if(!e.shiftKey&&(k==='i'||k==='I')){e.preventDefault();wrapSelection('em');return;}
  if(!e.shiftKey&&(k==='u'||k==='U')){e.preventDefault();wrapSelection('u');return;}
  if(!e.shiftKey&&(k===']'||k==='}')){e.preventDefault();if(tgt){var s=Math.round(parseFloat(getComputedStyle(tgt).fontSize))+1;tgt.style.fontSize=s+'px';select(tgt);saveSoon();}return;}
  if(!e.shiftKey&&(k==='['||k==='{')){e.preventDefault();if(tgt){var s2=Math.max(8,Math.round(parseFloat(getComputedStyle(tgt).fontSize))-1);tgt.style.fontSize=s2+'px';select(tgt);saveSoon();}return;}
  if(!e.shiftKey&&(k==='d'||k==='D')){e.preventDefault();if(tgt)select(tgt);return;}
  if(!e.shiftKey&&(k==='s'||k==='S')){e.preventDefault();save(false);return;}
});

/* ── کلیک‌ها (شامل دکمه‌های داخلی نقشهٔ راه) ── */
document.addEventListener('click',function(e){
  var t=e.target, editing=document.body.classList.contains('editing');
  if(editing&&t.closest('#sheet a'))e.preventDefault();
  if(!editing&&t.closest('.t-link.unset')){e.preventDefault();toast('در حالت ویرایش، با کلیک‌راست → 🔗 آدرس صفحه را تنظیم کنید');return;}
  var col=t.closest('.col-btn');
  if(col){col.closest('.phase').classList.toggle('closed');return;}
  if(editing){
    var lk=t.closest('.lk');
    if(lk){
      var a=lk.closest('.topic').querySelector('.t-link');
      var v=prompt('آدرس صفحهٔ این مبحث (مثلاً lesson-02.html):',a.getAttribute('href')||'#');
      if(v!==null){var url=v.trim()||'#';a.setAttribute('href',url);a.classList.toggle('unset',url==='#');save(false);}
      return;
    }
    var del=t.closest('.del');
    if(del){
      var li=del.closest('.topic'),ph=del.closest('.phase');
      if(li)removeEl(li);else if(ph)removeEl(ph);
      return;
    }
  }
  if(t.closest('#addSection')&&editing){addSectionFn();return;}
  if(editing&&!t.closest('button')&&!t.closest('.insp')){
    var s=t.closest(SEL);
    if(s)select(s);
    else if(!t.closest('#sheet'))deselect();
  }
});
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('#sheet [data-edit]'))saveSoon();});

function resetFn(){
  if(confirm('همه ویرایش‌ها پاک و نسخه اولیه بازگردانده شود؟')){try{localStorage.removeItem(KEY);}catch(e){}location.reload();}
}

/* ── خروجی‌ها ── */
var FONT_FILES=['fonts/Kalameh-SemiBold.woff2','fonts/Kalameh-Bold.woff2','fonts/IRANSansWeb_Light.woff2','fonts/IRANSansWeb.woff2','fonts/IRANSansWeb_Medium.woff2','fonts/IRANSansWeb_Bold.woff2','fonts/IRANSansWeb_FaNum.woff2','fonts/IRANSansWeb_Bold_FaNum.woff2'];
function b64(buf){var s='';var u=new Uint8Array(buf);for(var i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
function collectFonts(){
  return (document.fonts?document.fonts.ready:Promise.resolve()).catch(function(){}).then(function(){
    var out=[];var chain=Promise.resolve();
    FONT_FILES.forEach(function(f){
      chain=chain.then(function(){
        return fetch(f,{cache:'force-cache'}).then(function(r){if(!r.ok)return;return r.arrayBuffer();}).then(function(buf){if(buf)out.push({path:f,dataUrl:'data:font/woff2;base64,'+b64(buf)});}).catch(function(){});
      });
    });
    return chain.then(function(){return out;});
  });
}
function raster(){
  setEditing(false);deselect();hideCtx();if(document.activeElement)document.activeElement.blur();
  return new Promise(function(r){setTimeout(r,80);}).then(function(){
    var css='';$$('style').forEach(function(s){css+=s.textContent+'\n';});
    css+="svg{--paper:#f7f4ee;--card:#fdfbf7;--well:#f0ebe0;--ink:#221d17;--ink-2:#544c40;--ink-3:#8b8272;--rule:#e4dccb;--rule-2:#d3c9b2;--accent:#b23a26;--accent-bg:rgba(178,58,38,.055);--f-disp:'Kalameh',sans-serif;--f-body:'IRANSans','Kalameh',sans-serif;--f-fa:'IRANSans FaNum','IRANSans',sans-serif;}";
    return collectFonts().then(function(fontMap){
      fontMap.forEach(function(f){css=css.split("url('"+f.path+"')").join("url('"+f.dataUrl+"')");});
      css=css.replace(/url\('fonts\/[^']+'\)/g,"url('data:,')");
      var W=sheet.offsetWidth,H=sheet.offsetHeight;
      var clone=sheet.cloneNode(true);
      clone.removeAttribute('id');
      clone.querySelectorAll('.selected').forEach(function(el){el.classList.remove('selected');});
      clone.querySelectorAll('.edit-only').forEach(function(el){el.remove();});
      clone.querySelectorAll('[contenteditable]').forEach(function(el){el.removeAttribute('contenteditable');});
      var x=new XMLSerializer().serializeToString(clone);
      var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:'+W+'px;box-sizing:border-box;background:#f7f4ee;color:#221d17;font-family:\'IRANSans\',\'Kalameh\',sans-serif;font-size:14.5px;line-height:2.05;direction:rtl"><style><![CDATA['+css+']]></style>'+x+'</div></foreignObject></svg>';
      var img=new Image();
      img.src=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
      return img.decode().then(function(){URL.revokeObjectURL(img.src);return{img:img,W:W,H:H};},function(e){URL.revokeObjectURL(img.src);throw new Error('رندر SVG ناموفق: '+(e.message||e));});
    });
  });
}
function dl(url,name){var a=document.createElement('a');a.href=url;a.download=name;a.click();}
function exportPNG(){
  toast('در حال رندر PNG با ×'+PPI+' …');
  raster().then(function(o){
    var c=document.createElement('canvas');
    c.width=Math.round(o.W*PPI);c.height=Math.round(o.H*PPI);
    var x=c.getContext('2d');
    x.fillStyle='#f7f4ee';x.fillRect(0,0,c.width,c.height);
    x.scale(PPI,PPI);x.drawImage(o.img,0,0,o.W,o.H);
    c.toBlob(function(bl){dl(URL.createObjectURL(bl),BASE+'-'+PPI+'x.png');toast('PNG دانلود شد 🖼');},'image/png');
  }).catch(function(err){showErr('PNG: '+(err.message||err));});
}
function buildPdf(pages){
  var enc=new TextEncoder(),chunks=[],off=0,offsets=[];
  function push(d){var b=typeof d==='string'?enc.encode(d):d;chunks.push(b);off+=b.length;}
  var n=pages.length;
  function pO(i){return 3+i*3;} function cO(i){return 4+i*3;} function iO(i){return 5+i*3;}
  push('%PDF-1.4\n');
  offsets[1]=off;push('1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n');
  offsets[2]=off;push('2 0 obj<</Type/Pages/Kids['+pages.map(function(_,i){return pO(i)+' 0 R';}).join('')+']/Count '+n+'>>endobj\n');
  pages.forEach(function(p,i){
    var dH=(595.28*p.h/p.w).toFixed(2),dY=(841.89-595.28*p.h/p.w).toFixed(2);
    offsets[pO(i)]=off;
    push(pO(i)+' 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595.28 841.89]/Resources<</XObject<</Im'+i+' '+iO(i)+' 0 R>>/ProcSet[/PDF/ImageC]>>/Contents '+cO(i)+' 0 R>>endobj\n');
    var cs='q 595.28 0 0 '+dH+' 0 '+dY+' cm /Im'+i+' Do Q';
    offsets[cO(i)]=off;
    push(cO(i)+' 0 obj<</Length '+enc.encode(cs).length+'>>stream\n'+cs+'\nendstream endobj\n');
    offsets[iO(i)]=off;
    push(iO(i)+' 0 obj<</Subtype/Image/ColorSpace/DeviceRGB/BitsPerComponent 8/Width '+p.w+'/Height '+p.h+'/Filter/DCTDecode/Length '+p.data.length+'>>stream\n');
    push(p.data);push('\nendstream endobj\n');
  });
  var xOff=off,total=3+3*n;
  push('xref\n0 '+total+'\n0000000000 65535 f \n');
  for(var i=1;i<total;i++)push(String(offsets[i]).padStart(10,'0')+' 00000 n \n');
  push('trailer<</Size '+total+'/Root 1 0 R>>\nstartxref\n'+xOff+'\n%%EOF');
  return new Blob(chunks,{type:'application/pdf'});
}
function exportPDF(){
  toast('در حال رندر PDF با ×'+PPI+' …');
  raster().then(function(o){
    var pageCssH=o.W*297/210;
    var top=sheet.getBoundingClientRect().top;
    var bounds=$$('#sheet .sec-head,#sheet .piece,#sheet tr,#sheet header,#sheet .rule-double,#sheet .divider,#sheet footer,#sheet .note,#sheet .formula,#sheet .features,#sheet .key-point,#sheet .ex-item,#sheet .summary,#sheet .qa,#sheet .seq,#sheet figure,#sheet .topic')
      .map(function(el){return el.getBoundingClientRect().bottom-top;}).sort(function(a,b){return a-b;});
    var pages=[],y=0;
    function step(){
      if(y>=o.H-2){dl(URL.createObjectURL(buildPdf(pages)),BASE+'.pdf');toast('PDF دانلود شد 📄 ('+pages.length+' صفحه)');return Promise.resolve();}
      var target=Math.min(y+pageCssH,o.H);
      if(target<o.H){var best=null;bounds.forEach(function(bd){if(bd>y+pageCssH*.6&&bd<=y+pageCssH)best=bd;});if(best)target=best;}
      var h=target-y,dw=Math.round(1654*PPI/3),dh=Math.max(2,Math.round(dw*h/o.W));
      var c=document.createElement('canvas');c.width=dw;c.height=dh;
      var x=c.getContext('2d');x.fillStyle='#f7f4ee';x.fillRect(0,0,dw,dh);
      x.drawImage(o.img,0,y,o.W,h,0,0,dw,dh);
      return new Promise(function(res){c.toBlob(function(bl){bl.arrayBuffer().then(function(ab){res(new Uint8Array(ab));});},'image/jpeg',.92);}).then(function(jb){
        pages.push({w:dw,h:dh,data:jb});y=target;return step();
      });
    }
    return step();
  }).catch(function(err){showErr('PDF: '+(err.message||err));});
}

function buildSource(){
  var clone=document.documentElement.cloneNode(true);
  clone.querySelectorAll('[contenteditable]').forEach(function(el){el.removeAttribute('contenteditable');});
  clone.querySelectorAll('.selected').forEach(function(el){el.classList.remove('selected');});
  clone.querySelectorAll('body').forEach(function(bd){bd.classList.remove('editing');});
  var i=clone.querySelector('#insp');if(i)i.setAttribute('hidden','');
  var c=clone.querySelector('#ctx');if(c)c.classList.remove('open');
  var f=clone.querySelector('#imgFileInput');if(f)f.parentNode.removeChild(f);
  return '<!DOCTYPE html>\n'+clone.outerHTML;
}
function saveSource(){
  setEditing(false);
  dl(URL.createObjectURL(new Blob([buildSource()],{type:'text/html'})),(location.pathname.split('/').pop()||'index.html'));
  toast('سورس با همه تغییرات ذخیره شد 💾 — جایگزین فایل گیت‌هاب کن');
}
function dlCopy(){
  setEditing(false);
  dl(URL.createObjectURL(new Blob([buildSource()],{type:'text/html'})),BASE+'-copy.html');
  toast('نسخه کپی دانلود شد ⬇');
}

STATUS='JS فعال ✓';
}catch(err){showErr('بارگذاری: '+(err.message||err));}
})();
