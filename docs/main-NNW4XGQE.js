import{$ as ke,A as L,B as H,C as me,D as g,E as W,F as G,G as pe,H as e,I as d,J as S,K as Q,M as ne,N as ce,O as he,P as F,Q as q,R as xe,S as ue,T as we,U as fe,V as ve,W as Ee,X as v,Y as ge,_ as te,b as u,c as N,ca as ie,d as O,da as C,e as T,ea as Se,f as le,fa as ye,g as M,ga as Y,h as f,ha as Ie,i,j as b,k,l as $,m as se,n as _,o as R,p as z,q as Z,r as de,s as y,t as I,u as w,v as o,w as r,x as E,y as c,z as h}from"./chunk-UDFYWJYM.js";import{a as J,b as X}from"./chunk-7CGTOI24.js";var Ce=(()=>{let a=class a{};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["app-root"]],decls:1,vars:0,template:function(s,t){s&1&&E(0,"router-outlet")},dependencies:[ve],encapsulation:2});let l=a;return l})();var We=["appWorkBar",""],be=["work","path","contact"],_e=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.crown=ye,this.name=v.profile.name,this.status=v.hero.status,this.here=le(null);let n=u(T);b(()=>{if(!("IntersectionObserver"in window))return;let s=new Set,t=new IntersectionObserver(x=>{for(let p of x)p.isIntersecting?s.add(p.target.id):s.delete(p.target.id);this.here.set([...be].reverse().find(p=>s.has(p))??null)},{rootMargin:"-70% 0px -29% 0px"});for(let x of be){let p=document.getElementById(x);p&&t.observe(p)}n.onDestroy(()=>t.disconnect())})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["header","appWorkBar",""]],hostAttrs:[1,"wk-bar","wk-gr","wk-g-paper"],attrs:We,decls:36,vars:23,consts:[[1,"wk-id",3,"href"],[1,"wk-crown"],["viewBox","0 0 142 120","aria-hidden","true"],[1,"wk-nav"],[3,"href"],[1,"wk-do"],[1,"wk-status"],["aria-hidden","true"],["download","",1,"wk-cv",3,"href"],[1,"wk-wide"],[1,"wk-narrow"],[1,"wk-lang",3,"href"]],template:function(s,t){s&1&&(e(0,`
  `),c(1,"a",0)(2,"span",1),N(),c(3,"svg",2),L(4,"path"),h()(),O(),c(5,"span"),e(6),h()(),e(7,`
  `),c(8,"nav",3),e(9,`
    `),c(10,"a",4),e(11),h(),e(12,`
    `),c(13,"a",4),e(14),h(),e(15,`
    `),c(16,"a",4),e(17),h(),e(18,`
  `),h(),e(19,`
  `),c(20,"p",5),e(21,`
    `),c(22,"span",6),L(23,"i",7),e(24),h(),e(25,`
    `),c(26,"a",8)(27,"span",9),e(28),h(),c(29,"span",10),e(30),h()(),e(31,`
    `),c(32,"a",11),e(33),h(),e(34,`
  `),h(),e(35,`
`)),s&2&&(i(),H("href",t.i18n.anchor("top"),f),i(3),_("d",t.crown),i(2),d(t.name),i(2),_("aria-label",t.ui().quickLinks),i(2),H("href",t.i18n.anchor("work"),f),_("aria-current",t.here()==="work"?"location":null),i(),d(t.ui().work.nav.work),i(2),H("href",t.i18n.anchor("path"),f),_("aria-current",t.here()==="path"?"location":null),i(),d(t.ui().work.nav.path),i(2),H("href",t.i18n.anchor("contact"),f),_("aria-current",t.here()==="contact"?"location":null),i(),d(t.ui().work.nav.contact),i(7),d(t.i18n.show(t.status)),i(2),H("href",t.i18n.cv(),f),_("aria-label",t.ui().downloadCv),i(2),d(t.ui().downloadCv),i(2),d(t.ui().cv),i(2),H("href",t.i18n.otherHome(),f),_("hreflang",t.i18n.otherLang())("lang",t.i18n.otherLang())("aria-label",t.ui().switchLang),i(),d(t.ui().langShort))},encapsulation:2,changeDetection:0});let l=a;return l})();var De=(()=>{let a=class a{constructor(){let n=u(M).nativeElement,s=u(T);b(()=>{if(!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches)return;let t=0,x=0,p=0,P=()=>{t=0,n.style.setProperty("--mx",x.toFixed(3)),n.style.setProperty("--my",p.toFixed(3))},U=()=>{t||=requestAnimationFrame(P)},ee=A=>{let V=n.getBoundingClientRect();x=(A.clientX-V.left)/V.width*2-1,p=(A.clientY-V.top)/V.height*2-1,U()},K=()=>{x=p=0,U()};n.addEventListener("pointermove",ee,{passive:!0}),n.addEventListener("pointerleave",K),s.onDestroy(()=>{cancelAnimationFrame(t),n.removeEventListener("pointermove",ee),n.removeEventListener("pointerleave",K)})})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275dir=$({type:a,selectors:[["","wkDepth",""]]});let l=a;return l})();var B=(()=>{let a=class a{constructor(){this.wkFit=q("fill");let n=u(M).nativeElement,s=u(T);b(()=>{let t=n.parentElement;if(!t)return;let x=-1,p=(ee=!1)=>{let K=getComputedStyle(t),A=t.clientWidth-parseFloat(K.paddingLeft)-parseFloat(K.paddingRight);if(!(A<=0||!ee&&A===x))if(x=A,this.wkFit()==="shrink"){n.style.fontSize="";let V=n.getBoundingClientRect().width;V>A&&(n.style.fontSize=(parseFloat(getComputedStyle(n).fontSize)*A/V).toFixed(2)+"px")}else n.style.fontSize="100px",n.style.fontSize=(100*A/n.getBoundingClientRect().width).toFixed(2)+"px"},P=()=>p(!0),U=new ResizeObserver(()=>p());U.observe(t),document.fonts.ready.then(P),document.fonts.addEventListener("loadingdone",P),s.onDestroy(()=>{U.disconnect(),document.fonts.removeEventListener("loadingdone",P)})})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275dir=$({type:a,selectors:[["","wkFit",""]],inputs:{wkFit:[1,"wkFit"]}});let l=a;return l})();var Te="-20% 0px",j=(()=>{let a=class a{constructor(){this.wkInView=q(Te,{transform:t=>t||Te});let n=u(M).nativeElement,s=u(T);b(()=>{if(!("IntersectionObserver"in window))return;let t=new IntersectionObserver(p=>{p.at(-1).isIntersecting&&n.classList.add("wk-in")},{rootMargin:this.wkInView()}),x=new IntersectionObserver(p=>{p.at(-1).isIntersecting||n.classList.remove("wk-in")});t.observe(n),x.observe(n),s.onDestroy(()=>(t.disconnect(),x.disconnect()))})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275dir=$({type:a,selectors:[["","wkInView",""]],inputs:{wkInView:[1,"wkInView"]}});let l=a;return l})();var Ye=["appIntro",""];function Ke(l,a){l&1&&e(0,"\xA0\xB7")}function Je(l,a){if(l&1&&(o(0,"span"),e(1),R(2,Ke,1,0),r(),e(3," ")),l&2){let m=a.$implicit,n=a.$index,s=a.$count;i(),d(m),i(),z(n!==s-1?2:-1)}}var Fe=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.SITE=v,this.me=v.profile,this.hero=v.hero,this.social=Object.fromEntries(v.socials.map(n=>[n.id,n.url])),this.focus=F(()=>v.hero.focus.map(n=>this.i18n.show(n)))}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["section","appIntro",""]],hostAttrs:["id","top",1,"wk-intro"],attrs:Ye,decls:105,vars:24,consts:[["wkDepth","",1,"wk-hero","wk-gr","wk-g-paper"],[1,"wk-name"],["wkFit",""],[1,"wk-ln"],["src","assets/img/portrait-cutout.webp","width","1368","height","1823","fetchpriority","high","decoding","async",1,"wk-me",3,"alt"],[1,"wk-tag"],[1,"wk-role"],[1,"wk-tag-t"],[1,"wk-focus"],[1,"wk-lab","wk-where"],["wkInView","0px",1,"wk-status"],["aria-hidden","true"],[1,"wk-say"],[1,"wk-lede",3,"rich"],[1,"wk-said",3,"rich"],[1,"wk-cta"],["download","",1,"wk-btn",3,"href"],[1,"wk-tl","wk-em",3,"href"],[1,"wk-cta-o"],["rel","noopener",1,"wk-tl",3,"href"],[1,"wk-short","wk-sheet","wk-gr","wk-g-white"],[1,"wk-g"],[1,"wk-lab","wk-no"],[1,"wk-facts"],[1,"wk-lab"]],template:function(s,t){s&1&&(e(0,`
  `),o(1,"div",0),e(2,`
    `),o(3,"h1",1)(4,"span",2)(5,"span",3)(6,"span"),e(7),r()(),e(8," "),E(9,"br"),o(10,"span",3)(11,"span"),e(12),r()()()(),e(13,`
    `),E(14,"img",4),e(15,`
    `),o(16,"div",5),e(17,`
      `),o(18,"p",6),e(19),r(),e(20,`
      `),o(21,"div",7),e(22,`
        `),o(23,"p",8),y(24,Je,4,2,null,null,Z),r(),e(26,`
        `),o(27,"p",9)(28,"span",10),E(29,"i",11),o(30,"b"),e(31),r()(),e(32," "),o(33,"span"),e(34),r(),e(35," "),o(36,"span"),e(37),r()(),e(38,`
      `),r(),e(39,`
    `),r(),e(40,`
    `),o(41,"div",12),e(42,`
      `),E(43,"p",13),e(44,`
      `),E(45,"p",14),e(46,`
      `),o(47,"p",15),e(48,`
        `),o(49,"a",16),e(50),o(51,"span",11),e(52,"\u2193"),r()(),e(53,`
        `),o(54,"a",17),e(55),r(),e(56,`
        `),o(57,"span",18)(58,"a",19),e(59,"LinkedIn"),r(),e(60," "),o(61,"a",19),e(62,"GitHub"),r()(),e(63,`
      `),r(),e(64,`
    `),r(),e(65,`
  `),r(),e(66,`
  `),o(67,"div",20),e(68,`
    `),o(69,"div",21),e(70,`
      `),o(71,"p",22)(72,"b"),e(73,"(01)"),r(),e(74),r(),e(75,`
      `),o(76,"dl",23),e(77,`
        `),o(78,"div")(79,"dt",24),e(80),r(),o(81,"dd"),e(82),r()(),e(83,`
        `),o(84,"div")(85,"dt",24),e(86),r(),o(87,"dd"),e(88),r()(),e(89,`
        `),o(90,"div")(91,"dt",24),e(92),r(),o(93,"dd"),e(94),r()(),e(95,`
        `),o(96,"div")(97,"dt",24),e(98),r(),o(99,"dd"),e(100),r()(),e(101,`
      `),r(),e(102,`
    `),r(),e(103,`
  `),r(),e(104,`
`)),s&2&&(i(7),d(t.me.firstName),i(5),d(t.me.lastName),i(2),w("alt",t.me.name),i(5),d(t.i18n.show(t.hero.role)),i(5),I(t.focus()),i(7),d(t.i18n.show(t.hero.status)),i(3),d(t.i18n.show(t.hero.experience)),i(3),d(t.i18n.show(t.hero.location)),i(6),w("rich",t.i18n.show(t.SITE.work.message)),i(2),w("rich",t.i18n.show(t.SITE.work.proof)),i(4),w("href",t.i18n.cv(),f),i(),S("",t.ui().downloadCv," "),i(4),w("href","mailto:"+t.me.email,f),i(),d(t.me.email),i(3),w("href",t.social.linkedin,f),i(3),w("href",t.social.github,f),i(13),S(" ",t.ui().work.inShort),i(6),d(t.ui().resume.experience),i(2),d(t.i18n.show(t.hero.experience)),i(4),d(t.ui().work.degree),i(2),d(t.i18n.show(t.SITE.work.degree)),i(4),d(t.ui().resume.languages),i(2),d(t.i18n.show(t.hero.languages)),i(4),d(t.ui().work.basedIn),i(2),d(t.i18n.show(t.hero.location)))},dependencies:[Y,De,B,j],encapsulation:2,changeDetection:0});let l=a;return l})();var Xe=["appAgentDiagram",""];function Ze(l,a){if(l&1&&(c(0,"li")(1,"span",20),e(2),h(),e(3),h()),l&2){let m=a.$implicit,n=a.$index;i(2),S("0",n+1),i(),d(m)}}function Qe(l,a){if(l&1&&(e(0," "),c(1,"span"),e(2),h()),l&2){let m=g(2);i(2),d(m.a().live)}}function et(l,a){if(l&1&&(e(0,`
      `),c(1,"li"),L(2,"i",21),e(3),R(4,Qe,3,1),h(),e(5,`
      `)),l&2){let m=a.$implicit,n=a.$index,s=a.$count;i(),G("ag-live",n===s-1),i(2),d(m),i(),z(n===s-1?4:-1)}}var Re=(()=>{let a=class a{constructor(){this.i18n=u(C),this.a=F(()=>this.i18n.ui().agent)}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["figure","appAgentDiagram",""]],hostAttrs:[1,"ag-fig"],features:[se([j])],attrs:Xe,decls:76,vars:14,consts:[[1,"ag","wk-cl"],[1,"ag-node","ag-q"],["viewBox","0 0 36 12","aria-hidden","true",1,"ag-arrow","ag-a1"],["d","M1 6H34M29 2L34 6L29 10"],[1,"ag-agent"],[1,"ag-title"],[1,"ag-sub"],[1,"ag-steps"],[1,"ag-retry"],["viewBox","0 0 14 14","aria-hidden","true"],["d","M11.6 7.4A4.6 4.6 0 1 1 10 3.5M10.4 1.2V3.9H7.7"],["viewBox","0 0 36 12","aria-hidden","true",1,"ag-arrow","ag-a2"],[1,"ag-node","ag-ans"],[1,"ag-tools"],[1,"ag-tools-h"],[1,"ag-node","ag-tool"],["viewBox","0 0 12 34","aria-hidden","true",1,"ag-updown"],["d","M6 2V32M2 7L6 2L10 7M2 27L6 32L10 27"],[1,"ag-gens"],[1,"ag-gens-h"],["aria-hidden","true",1,"ag-n"],["aria-hidden","true"]],template:function(s,t){s&1&&(e(0,`
  `),c(1,"div",0),e(2,`
    `),c(3,"p",1)(4,"b"),e(5),h(),c(6,"span"),e(7),h()(),e(8,`
    `),N(),c(9,"svg",2),L(10,"path",3),h(),e(11,`
    `),O(),c(12,"div",4),e(13,`
      `),c(14,"p",5),e(15),h(),e(16,`
      `),c(17,"p",6),e(18),h(),e(19,`
      `),c(20,"ol",7),y(21,Ze,4,2,"li",null,Z),h(),e(23,`
      `),c(24,"p",8),N(),c(25,"svg",9),L(26,"path",10),h(),e(27),h(),e(28,`
    `),h(),e(29,`
    `),c(30,"svg",11),L(31,"path",3),h(),e(32,`
    `),O(),c(33,"p",12)(34,"b"),e(35),h(),c(36,"span"),e(37),h()(),e(38,`
    `),c(39,"div",13),e(40,`
      `),c(41,"p",14),e(42),h(),e(43,`
      `),c(44,"p",15),N(),c(45,"svg",16),L(46,"path",17),h(),O(),c(47,"b"),e(48),h(),c(49,"span"),e(50),h()(),e(51,`
      `),c(52,"p",15),N(),c(53,"svg",16),L(54,"path",17),h(),O(),c(55,"b"),e(56),h(),c(57,"span"),e(58),h()(),e(59,`
    `),h(),e(60,`
  `),h(),e(61,`
  `),c(62,"div",18),e(63,`
    `),c(64,"p",19),e(65),h(),e(66,`
    `),c(67,"ol"),e(68,`
      `),y(69,et,6,4,null,null,Z),h(),e(71,`
  `),h(),e(72,`
  `),c(73,"figcaption"),e(74),h(),e(75,`
`)),s&2&&(i(5),d(t.a().question),i(2),d(t.a().questionSub),i(8),d(t.a().agent),i(3),d(t.a().agentSub),i(3),I(t.a().steps),i(6),d(t.a().retry),i(8),d(t.a().answer),i(2),d(t.a().answerSub),i(5),d(t.a().tools),i(6),d(t.a().search),i(2),d(t.a().searchSub),i(6),d(t.a().data),i(2),d(t.a().dataSub),i(7),d(t.a().designs),i(4),I(t.a().gens),i(5),d(t.a().caption))},encapsulation:2,changeDetection:0});let l=a;return l})();var tt=["appCases",""],ze=()=>[],it=(l,a)=>a.slug,Me=(l,a)=>a.url;function nt(l,a){if(l&1&&(o(0,"span",5),e(1),r()),l&2){let m=g(2);i(),d(m.i18n.show(a))}}function at(l,a){if(l&1&&(o(0,"figcaption",2),e(1),r()),l&2){let m=g(3);i(),d(m.i18n.show(a))}}function ot(l,a){if(l&1&&(e(0," "),o(1,"a",17),e(2),o(3,"span",7),e(4,"\u2197"),r()()),l&2){let m=a.$implicit,n=g(3);i(),w("href",n.url(m),f),i(),S("",n.i18n.show(m.label)," ")}}function rt(l,a){if(l&1&&(e(0,`
    `),o(1,"div",10),e(2,`
      `),o(3,"div",11),e(4,`
        `),o(5,"p",12),e(6),r(),e(7,`
        `),o(8,"dl",13),e(9,`
          `),o(10,"div")(11,"dt",2),e(12),r(),o(13,"dd"),e(14),r()(),e(15,`
          `),o(16,"div")(17,"dt",2),e(18),r(),o(19,"dd"),e(20),r()(),e(21,`
        `),r(),e(22,`
      `),r(),e(23,`
      `),o(24,"figure",14),e(25,`
        `),E(26,"img",15),e(27,`
        `),R(28,at,2,1,"figcaption",2),r(),e(29,`
      `),o(30,"dl",16),e(31,`
        `),o(32,"div"),e(33,`
          `),o(34,"dt",2),e(35),r(),e(36,`
          `),o(37,"dd"),e(38),y(39,ot,5,2,null,null,Me),r(),e(41,`
        `),r(),e(42,`
        `),o(43,"div")(44,"dt",2),e(45),r(),o(46,"dd"),e(47),r()(),e(48,`
      `),r(),e(49,`
    `),r(),e(50,`
    `)),l&2){let m,n=a,s=g(),t=s.$implicit,x=s.$index,p=g();i(),G("wk-flip",x===2),i(5),d(p.i18n.show(t.study.what??t.p.tagline)),i(6),d(p.ui().work.part),i(2),d(p.i18n.show(t.study.part)),i(4),d(p.ui().work.how),i(2),d(p.i18n.show(t.study.how)),i(6),G("wk-on-white",n.white),w("src",t.p.image,f)("alt",p.i18n.show(n.alt)),_("width",n.size[0])("height",n.size[1]),i(2),z((m=t.study.caption)?28:-1,m),i(7),d(p.ui().work.state),i(3),d(p.i18n.show(t.study.state)),i(),I(t.study.proof??ne(18,ze)),i(6),d(p.ui().resume.stack),i(2),d(p.i18n.list(t.p.stack))}}function lt(l,a){if(l&1&&(e(0," "),o(1,"a",17),e(2),o(3,"span",7),e(4,"\u2197"),r()()),l&2){let m=a.$implicit,n=g(3);i(),w("href",n.url(m),f),i(),S("",n.i18n.show(m.label)," ")}}function st(l,a){if(l&1&&(e(0,`
    `),o(1,"div",18),e(2,`
      `),o(3,"p",12),e(4),r(),e(5,`
      `),o(6,"dl",13),e(7,`
        `),o(8,"div",19)(9,"dt",2),e(10),r(),o(11,"dd"),e(12),r()(),e(13,`
        `),o(14,"div"),e(15,`
          `),o(16,"dt",2),e(17),r(),e(18,`
          `),o(19,"dd"),e(20),y(21,lt,5,2,null,null,Me),r(),e(23,`
        `),r(),e(24,`
        `),o(25,"div")(26,"dt",2),e(27),r(),o(28,"dd"),e(29),r()(),e(30,`
      `),r(),e(31,`
    `),r(),e(32,`
    `),o(33,"div",20),e(34,`
      `),o(35,"p",2),e(36),r(),e(37,`
      `),o(38,"p"),e(39),r(),e(40,`
    `),r(),e(41,`
    `),E(42,"figure",21),e(43,`
    `)),l&2){let m=g().$implicit,n=g();i(4),d(n.i18n.show(m.study.what??m.p.tagline)),i(6),d(n.ui().work.part),i(2),d(n.i18n.show(m.study.part)),i(5),d(n.ui().work.state),i(3),d(n.i18n.show(m.study.state)),i(),I(m.study.proof??ne(9,ze)),i(6),d(n.ui().resume.stack),i(2),d(n.i18n.list(m.p.stack)),i(7),d(n.ui().work.how),i(3),d(n.i18n.show(m.study.how))}}function dt(l,a){if(l&1&&(e(0,`
  `),o(1,"article",3),e(2,`
    `),o(3,"p",4),e(4,`
      `),o(5,"b"),e(6),r(),e(7,`
      `),o(8,"span"),e(9),r(),e(10,`
      `),o(11,"span"),e(12),r(),e(13,`
      `),R(14,nt,2,1,"span",5),o(15,"span",6),E(16,"i",7),e(17),r(),e(18,`
    `),r(),e(19,`
    `),o(20,"h3",8)(21,"span",9),e(22),r()(),e(23,`
    `),R(24,rt,51,19)(25,st,44,10),r(),e(26,`
  `)),l&2){let m,n,s=a.$implicit,t=a.$index,x=g();i(),pe("wk-g-"+(t+1)),w("id",s.slug),_("aria-labelledby",s.slug+"-h"),i(5),S("0",t+1),i(3),d(x.i18n.show(s.p.kicker)),i(3),d(x.i18n.show(s.p.when)),i(2),z((m=s.p.aka)?14:-1,m),i(3),d(x.i18n.show(s.live)),i(3),w("id",s.slug+"-h"),i(2),d(x.projectTitle(s.p,x.i18n.lang())),i(2),z((n=s.shot)?24:25,n)}}var mt=[{slug:"txbot"},{slug:"remind",shot:{size:[1400,718],alt:v.day.bassetti.remind}},{slug:"coilcheck",shot:{size:[1400,509],alt:v.day.uckange.realAlt,white:!0}}],pt=l=>({en:l.en.split(" \xB7 ").pop(),fr:l.fr.split(" \xB7 ").pop()}),$e=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.projectTitle=ge,this.from=v.experience.at(-1).start.slice(0,4),this.cases=mt.map(n=>{let s=v.projects.find(t=>t.slug===n.slug);return X(J({},n),{p:s,study:s.study,live:pt(s.study.index)})})}url(n){return typeof n.url=="string"?n.url:n.url[this.i18n.lang()]}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["section","appCases",""]],hostAttrs:["id","work","aria-labelledby","work-h",1,"wk-cases"],attrs:tt,decls:16,vars:4,consts:[[1,"wk-sec-h","wk-gr","wk-g-white"],["id","work-h",1,"wk-sw"],[1,"wk-lab"],[1,"wk-case","wk-sheet","wk-gr",3,"id"],[1,"wk-meta","wk-lab"],[1,"wk-aka"],["wkInView","0px",1,"wk-live"],["aria-hidden","true"],[1,"wk-big",3,"id"],["wkFit","shrink",1,"wk-sw"],[1,"wk-pair","wk-g"],[1,"wk-tx"],[1,"wk-what"],[1,"wk-notes"],[1,"wk-vis"],["loading","lazy","decoding","async",1,"wk-cl",3,"src","alt"],[1,"wk-notes","wk-under"],["rel","noopener",1,"wk-tl",3,"href"],[1,"wk-txt","wk-g"],[1,"wk-tall"],[1,"wk-how","wk-g"],["appAgentDiagram",""]],template:function(s,t){s&1&&(e(0,`
  `),o(1,"div",0),e(2,`
    `),o(3,"h2",1),e(4),r(),e(5,`
    `),o(6,"p",2)(7,"b"),e(8,"(02)"),r(),e(9),E(10,"br"),e(11),r(),e(12,`
  `),r(),e(13,`
  `),y(14,dt,27,12,null,null,it)),s&2&&(i(4),d(t.ui().work.selected),i(5),S(" ",t.ui().work.threeProjects),i(2),Q("",t.from," \u2014 ",t.ui().present),i(3),I(t.cases))},dependencies:[Re,B,j],encapsulation:2,changeDetection:0});let l=a;return l})();var ct=16,Le=(()=>{let a=class a{constructor(){let n=u(M).nativeElement,s=u(T);b(()=>{let t=()=>{let p=parseFloat(getComputedStyle(n).top);n.classList.toggle("wk-room",p+n.offsetHeight+ct<=innerHeight)},x=new ResizeObserver(t);x.observe(n),addEventListener("resize",t,{passive:!0}),s.onDestroy(()=>{x.disconnect(),removeEventListener("resize",t)})})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275dir=$({type:a,selectors:[["","wkRoom",""]]});let l=a;return l})();var ht=["appPath",""],xt=(l,a)=>[l,a],ut=(l,a)=>a.e.start,wt=(l,a)=>a.title,ft=(l,a)=>a.name;function vt(l,a){if(l&1&&E(0,"p",17),l&2){let m=g(2);w("rich",m.i18n.show(a))}}function Et(l,a){if(l&1&&(e(0,`
          `),o(1,"li"),e(2,`
            `),E(3,"i",15),e(4,`
            `),o(5,"div"),e(6,`
              `),o(7,"p",13),e(8),r(),e(9,`
              `),o(10,"h3"),e(11),r(),e(12,`
              `),o(13,"p",16),e(14),r(),e(15,`
              `),R(16,vt,1,1,"p",17),r(),e(17,`
          `),r(),e(18,`
          `)),l&2){let m,n=a.$implicit,s=g();i(),W("--c",n.col)("--s",n.span)("--k",n.colour),G("wk-up",n.up),i(7),Q("",s.i18n.dates(n.e.start,n.e.end)," \xB7 ",s.i18n.show(n.e.type)),i(3),d(s.i18n.show(n.e.role)),i(3),d(s.i18n.list(ce(13,xt,n.e.company,s.i18n.show(n.e.location)))),i(2),z((m=n.e.line)?16:-1,m)}}function gt(l,a){if(l&1&&(o(0,"span"),e(1),r()),l&2){let m=a.$implicit,n=a.$index;W("--c",n*12+1),i(),d(m)}}function kt(l,a){if(l&1&&(o(0,"span"),e(1),r()),l&2){let m=g().$implicit;i(),d(m.award)}}function St(l,a){if(l&1&&(e(0,`
        `),o(1,"li"),e(2,`
          `),o(3,"span",13),e(4),r(),e(5,`
          `),o(6,"p")(7,"b"),e(8),r(),e(9),R(10,kt,2,1,"span"),r(),e(11,`
        `),r(),e(12,`
        `)),l&2){let m=a.$implicit;i(4),d(m.years),i(4),d(m.title),i(),d(m.rest),i(),z(m.award?10:-1)}}function yt(l,a){if(l&1&&(e(0,`
        `),o(1,"div")(2,"dt"),e(3),r(),o(4,"dd"),e(5),r()(),e(6,`
        `)),l&2){let m=a.$implicit;i(3),d(m.name),i(2),d(m.items)}}var Pe=["#175a44","#a33818","#111934","#fbb915"],ae=new Date,It=`${ae.getFullYear()}-${String(ae.getMonth()+1).padStart(2,"0")}`,oe=+v.experience.at(-1).start.slice(0,4),Ct=Array.from({length:ae.getFullYear()-oe+1},(l,a)=>oe+a),bt=v.experience.map((l,a,m)=>{let n=m.length-1-a,s=m[a-1],t=ie(l.start,l.end??It);return{e:l,col:ie(`${oe}-01`,l.start),span:s?Math.min(t,ie(l.start,s.start)-1):t,up:n%2===1,colour:Pe[n%Pe.length]}}),Ae=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.jobs=bt,this.years=Ct,this.education=F(()=>v.education.map(n=>{let[s,t]=this.i18n.show(n.degree).split(" \u2014 "),x=[te(n.school),...n.school.includes(n.city)?[]:[n.city],this.i18n.show(n.country)].join(", ");return{title:s,rest:this.i18n.list(t?[t,x]:[x]),years:`${n.start.slice(0,4)} \u2014 ${n.end.slice(2,4)}`,award:n.award?this.i18n.show(n.award):""}})),this.skills=F(()=>[...v.skills.map(n=>({name:this.i18n.show(n.group),items:n.items.join(", ")})),{name:this.ui().work.spoken,items:v.languages.map(n=>`${this.i18n.show(n.name)} (${this.i18n.show(n.level).toLowerCase()})`).join(", ")}])}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["section","appPath",""]],hostAttrs:["id","path","aria-labelledby","path-h",1,"wk-path","wk-sheet","wk-gr","wk-g-paper"],attrs:ht,decls:64,vars:9,consts:[[1,"wk-run"],["aria-hidden","true",1,"wk-track"],["wkRoom","",1,"wk-pin"],[1,"wk-meta","wk-lab"],["id","path-h",1,"wk-big"],["wkFit","shrink",1,"wk-sw"],[1,"wk-time"],["aria-hidden","true",1,"wk-head"],["aria-hidden","true",1,"wk-axis","wk-lab"],[3,"--c"],[1,"wk-to"],[1,"wk-more","wk-g"],[1,"wk-edu"],[1,"wk-lab"],[1,"wk-skills"],["aria-hidden","true"],[1,"wk-co"],[1,"wk-d",3,"rich"]],template:function(s,t){s&1&&(e(0,`
  `),o(1,"div",0),e(2,`
    `),E(3,"i",1),e(4,`
    `),o(5,"div",2),e(6,`
      `),o(7,"p",3)(8,"b"),e(9,"(03)"),r(),e(10," "),o(11,"span"),e(12),r(),e(13," "),o(14,"span"),e(15),r()(),e(16,`
      `),o(17,"h2",4)(18,"span",5),e(19),r()(),e(20,`
      `),o(21,"div",6),e(22,`
        `),o(23,"ol"),e(24,`
          `),y(25,Et,19,16,null,null,ut),r(),e(27,`
        `),E(28,"span",7),e(29,`
        `),o(30,"p",8),y(31,gt,2,3,"span",9,de),o(33,"span",10),e(34),r()(),e(35,`
      `),r(),e(36,`
    `),r(),e(37,`
  `),r(),e(38,`
  `),o(39,"div",11),e(40,`
    `),o(41,"div",12),e(42,`
      `),o(43,"h3",13),e(44),r(),e(45,`
      `),o(46,"ol"),e(47,`
        `),y(48,St,13,4,null,null,wt),r(),e(50,`
    `),r(),e(51,`
    `),o(52,"div",14),e(53,`
      `),o(54,"h3",13),e(55),r(),e(56,`
      `),o(57,"dl"),e(58,`
        `),y(59,yt,7,2,null,null,ft),r(),e(61,`
    `),r(),e(62,`
  `),r(),e(63,`
`)),s&2&&(i(12),d(t.ui().work.fourRoles),i(3),Q("",t.years[0]," \u2014 ",t.ui().present),i(4),d(t.ui().resume.experience),i(2),W("--months",t.years.length*12),i(4),I(t.jobs),i(6),I(t.years),i(3),S("",t.ui().present," \u2192"),i(10),d(t.ui().resume.education),i(4),I(t.education()),i(7),d(t.ui().resume.skills),i(4),I(t.skills()))},dependencies:[Y,B,Le],encapsulation:2,changeDetection:0});let l=a;return l})();var _t=["appBeyond",""],Dt=(l,a)=>a.city,Tt=(l,a)=>a.id;function Ft(l,a){if(l&1&&(e(0,`
    `),o(1,"li")(2,"a",8),e(3,`
      `),E(4,"img",9),e(5,`
      `),o(6,"span",1)(7,"b"),e(8),r(),e(9," "),o(10,"span"),e(11),r()(),e(12,`
    `),r()(),e(13,`
    `)),l&2){let m=a.$implicit,n=g();i(),W("--tilt",m.tilt),i(),w("href",n.i18n.story()+"#"+m.stop,f),i(2),w("src","assets/art/card-"+m.city.toLowerCase()+".webp",f)("alt",m.alt),i(4),d(m.city),i(3),d(m.years)}}function Rt(l,a){if(l&1&&(e(0,`
    `),o(1,"article",10),e(2,`
      `),E(3,"video",11),e(4,`
      `),o(5,"h3"),e(6),r(),e(7,`
      `),o(8,"p"),e(9),r(),e(10,`
      `),o(11,"p",12)(12,"a",13),e(13),r(),e(14," "),o(15,"a",13),e(16,"GitHub"),r()(),e(17,`
    `),r(),e(18,`
    `)),l&2){let m=a.$implicit,n=g();i(),w("id",m.id),i(2),w("src",m.p.video,f)("poster",m.p.image,f),_("width",m.size[0])("height",m.size[1])("aria-label",n.i18n.show(m.aria)),i(3),d(m.p.name),i(3),d(n.i18n.show(m.p.tagline)),i(3),w("href",m.p.links.play,f),i(),d(n.ui().playOn),i(2),w("href",m.p.links.github,f)}}var zt=[{city:"Niamey",stop:"niamey",tilt:"-3deg"},{city:"Rabat",stop:"rabat",tilt:"2deg"},{city:"Strasbourg",stop:"strasbourg",tilt:"-1.5deg"},{city:"Uckange",stop:"uckange",tilt:"2.5deg"},{city:"Grenoble",stop:"bassetti",tilt:"-2deg"}],Mt=[{slug:"zktris",id:"zktris",size:[1280,720],aria:v.day.after.zktris},{slug:"roll-power",id:"rollpower",size:[960,540],aria:v.day.after.rollPower}],Ue=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.SITE=v,this.games=Mt.map(n=>X(J({},n),{p:v.projects.find(s=>s.slug===n.slug)})),this.hobbies=F(()=>this.i18n.list(v.interests.map(n=>this.i18n.show(n)))),this.cards=F(()=>zt.map((n,s)=>{let t=v.route.find(x=>x.city===n.city);return X(J({},n),{alt:this.i18n.show(v.day.resume.cards[s]),years:t.years+(t.now?`\u2013${this.ui().now}`:"")})}))}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["section","appBeyond",""]],hostAttrs:[1,"wk-beyond","wk-gr","wk-g-paper"],attrs:_t,decls:38,vars:7,consts:[[1,"wk-long"],[1,"wk-lab"],[1,"wk-lab","wk-tl",3,"href"],["aria-hidden","true"],[1,"wk-cards"],[1,"wk-out","wk-g"],[1,"wk-out-t"],[3,"rich"],[3,"href"],["width","600","height","400","loading","lazy","decoding","async",3,"src","alt"],[1,"wk-game",3,"id"],["inViewPlay","","muted","","loop","","playsinline","","preload","none",3,"src","poster"],[1,"wk-links"],["rel","noopener",1,"wk-tl",3,"href"]],template:function(s,t){s&1&&(e(0,`
  `),o(1,"div",0),e(2,`
    `),o(3,"h2",1)(4,"b"),e(5,"(04)"),r(),e(6),r(),e(7,`
    `),o(8,"p"),e(9),r(),e(10,`
    `),o(11,"a",2),e(12),o(13,"span",3),e(14,"\u2192"),r()(),e(15,`
  `),r(),e(16,`
  `),o(17,"ol",4),e(18,`
    `),y(19,Ft,14,7,null,null,Dt),r(),e(21,`
  `),o(22,"div",5),e(23,`
    `),o(24,"div",6),e(25,`
      `),o(26,"h2",1),e(27),r(),e(28,`
      `),E(29,"p",7),e(30,`
      `),o(31,"p",1),e(32),r(),e(33,`
    `),r(),e(34,`
    `),y(35,Rt,19,11,null,null,Tt),r(),e(37,`
`)),s&2&&(i(6),S(" ",t.ui().work.longVersion),i(3),d(t.i18n.show(t.SITE.work.story)),i(2),w("href",t.i18n.story(),f),i(),S("",t.ui().work.walk," "),i(7),I(t.cards()),i(8),d(t.ui().resume.outside),i(2),w("rich",t.i18n.show(t.SITE.day.after.body)),i(3),d(t.hobbies()),i(3),I(t.games))},dependencies:[Y,Ie],encapsulation:2,changeDetection:0});let l=a;return l})();var $t=["appReach",""],Be=(()=>{let a=class a{constructor(){this.i18n=u(C),this.ui=this.i18n.ui,this.SITE=v,this.hello=F(()=>{let n=te(ke(this.i18n.t(v.contact.title))).split(" \xB7 ");return{here:n.pop().replace(/\.$/,""),others:n.map(s=>s+".").join(" ")}}),this.social=Object.fromEntries(v.socials.map(n=>[n.id,n.url]))}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["section","appReach",""]],hostAttrs:["id","contact","aria-labelledby","contact-h",1,"wk-reach","wk-sheet","wk-gr","wk-g-end"],attrs:$t,decls:62,vars:13,consts:[[1,"wk-g"],[1,"wk-lab","wk-no"],["wkInView","0px",1,"wk-status"],["aria-hidden","true"],[1,"wk-reach-p"],[1,"wk-reach-do"],[1,"wk-mail",3,"href"],[1,"wk-cta"],["download","",1,"wk-btn",3,"href"],[1,"wk-cta-o"],["rel","noopener",1,"wk-tl",3,"href"],[1,"wk-hi"],[1,"wk-bye"],["id","contact-h",1,"wk-hello"],["wkFit",""],["src","assets/art/knight.webp","alt","","width","211","height","400","loading","lazy","decoding","async",1,"wk-knight"],[1,"wk-foot","wk-lab"],["rel","noopener",3,"href"]],template:function(s,t){s&1&&(e(0,`
  `),o(1,"div",0),e(2,`
    `),o(3,"p",1)(4,"span",2),E(5,"i",3),o(6,"b"),e(7),r()()(),e(8,`
    `),o(9,"p",4),e(10),r(),e(11,`
    `),o(12,"div",5),e(13,`
      `),o(14,"a",6),e(15),r(),e(16,`
      `),o(17,"p",7),e(18,`
        `),o(19,"a",8),e(20),o(21,"span",3),e(22,"\u2193"),r()(),e(23,`
        `),o(24,"span",9)(25,"a",10),e(26,"LinkedIn"),r(),e(27," "),o(28,"a",10),e(29,"GitHub"),r()(),e(30,`
      `),r(),e(31,`
    `),r(),e(32,`
  `),r(),e(33,`
  `),o(34,"p",11),e(35),r(),e(36,`
  `),o(37,"div",12),e(38,`
    `),o(39,"h2",13)(40,"span",14),e(41),o(42,"i"),e(43,"."),r()()(),e(44,`
    `),E(45,"img",15),e(46,`
  `),r(),e(47,`
  `),o(48,"p",16),e(49,`
    `),o(50,"span"),e(51),r(),e(52,`
    `),o(53,"span"),e(54),r(),e(55,`
    `),o(56,"a",17),e(57,"itch.io "),o(58,"span",3),e(59,"\u2197"),r()(),e(60,`
  `),r(),e(61,`
`)),s&2&&(i(7),d(t.i18n.show(t.SITE.hero.status)),i(3),d(t.i18n.show(t.SITE.contact.text)),i(4),w("href","mailto:"+t.SITE.profile.email,f),i(),d(t.SITE.profile.email),i(4),w("href",t.i18n.cv(),f),i(),S("",t.ui().downloadCv," "),i(5),w("href",t.social.linkedin,f),i(3),w("href",t.social.github,f),i(7),d(t.hello().others),i(6),d(t.hello().here),i(10),S("\xA9 2026 ",t.SITE.profile.name),i(3),d(t.i18n.show(t.SITE.profile.mission)),i(2),w("href",t.social.itch,f))},dependencies:[B,j],encapsulation:2,changeDetection:0});let l=a;return l})();var je=.24,Ve=(()=>{let a=class a{constructor(){this.wkReveal=q.required();let n=u(M).nativeElement,s=u(T);b(()=>{if(!("IntersectionObserver"in window))return;let t=new IntersectionObserver(x=>{for(let p of x){let P=p.target.classList,U=p.rootBounds?.height??innerHeight;P.contains("wk-wait")?(p.intersectionRatio>=je||p.intersectionRect.height>=U*je)&&(P.replace("wk-wait","wk-go"),t.unobserve(p.target)):p.boundingClientRect.top>=U?P.add("wk-wait"):t.unobserve(p.target)}},{threshold:Array.from({length:21},(x,p)=>p/20)});n.querySelectorAll(this.wkReveal()).forEach(x=>t.observe(x)),s.onDestroy(()=>t.disconnect())})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275dir=$({type:a,selectors:[["","wkReveal",""]],inputs:{wkReveal:[1,"wkReveal"]}});let l=a;return l})();var Lt=new Set(["resume","niamey","knight","rabat","signal","strasbourg","uckange","coilcheck-real","climb","bassetti","well","intern","fixed","now","roll","after","dusk"]),Ne=l=>l.replace(/\/$/,""),Pt=[".wk-facts > div",".wk-sw",".wk-big",".wk-cl",".wk-what",".wk-notes > div",".wk-how",".ag-gens li",".wk-time",".wk-time li",".wk-edu li",".wk-skills dl > div",".wk-long",".wk-cards li",".wk-out-t",".wk-game",".wk-reach-p",".wk-reach-do",".wk-hello span",".wk-knight"].join(", "),re=(()=>{let a=class a{constructor(){this.i18n=u(C),this.parts=Pt;let n=u(fe).snapshot.data.lang??"en";this.i18n.lang.set(n),this.i18n.page.set("work"),u(Se).apply(n,"work"),b(()=>this.forwardOldLinks())}forwardOldLinks(){let n=decodeURIComponent(location.hash.slice(1));!(n&&!document.getElementById(n)&&(Lt.has(n)||n.startsWith("rv-")))&&!new URLSearchParams(location.search).has("resume")||location.replace(new URL(`${this.i18n.story()}#${n||"resume"}`,document.baseURI).href)}onClick(n){if(n.defaultPrevented||n.button!==0||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey)return;let s=n.target.closest('a[href*="#"]');if(!s||!s.hash||s.origin!==location.origin||Ne(s.pathname)!==Ne(location.pathname))return;let t=document.getElementById(decodeURIComponent(s.hash.slice(1)));if(!t)return;n.preventDefault();let x=matchMedia("(prefers-reduced-motion: reduce)").matches;t.scrollIntoView({behavior:x?"auto":"smooth",block:"start"}),history.replaceState(history.state,"",location.pathname+location.search+(t.id==="top"?"":s.hash)),t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0})}};a.\u0275fac=function(s){return new(s||a)},a.\u0275cmp=k({type:a,selectors:[["app-work"]],hostAttrs:[1,"wk"],hostBindings:function(s,t){s&1&&me("click",function(p){return t.onClick(p)})},decls:9,vars:3,consts:[[1,"skip",3,"href"],["appWorkBar",""],["id","main",3,"wkReveal"],["appIntro",""],["appCases",""],["appPath",""],["appBeyond",""],["appReach",""]],template:function(s,t){s&1&&(o(0,"a",0),e(1),r(),E(2,"header",1),o(3,"main",2),E(4,"section",3)(5,"section",4)(6,"section",5)(7,"section",6)(8,"section",7),r()),s&2&&(w("href",t.i18n.anchor("main"),f),i(),d(t.i18n.ui().skipToContent),i(2),w("wkReveal",t.parts))},dependencies:[_e,Fe,$e,Ae,Ue,Be,Ve],encapsulation:2,changeDetection:0});let l=a;return l})();var Oe=()=>import("./chunk-DXQM3SRE.js").then(l=>l.DayPage),He=[{path:"",component:re,data:{lang:"en"}},{path:"fr",component:re,data:{lang:"fr"}},{path:"story",loadComponent:Oe,data:{lang:"en"}},{path:"fr/story",loadComponent:Oe,data:{lang:"fr"}},{path:"**",redirectTo:""}];var Ge={providers:[he(),Ee(He),we(ue())]};xe(Ce,Ge).catch(l=>console.error(l));
