import{S as p,i as d,s as m,e as u,t as f,c as _,a as h,h as y,d as c,g as v,G as g,N as o,Q as x,v as S,R as w}from"../../chunks/vendor-c7513497.js";import{s as r}from"../../chunks/stores-e54798f8.js";function P(n){let s,a;return{c(){s=u("div"),a=f("Playing")},l(t){s=_(t,"DIV",{});var e=h(s);a=y(e,"Playing"),e.forEach(c)},m(t,e){v(t,s,e),g(s,a)},p:o,i:o,o,d(t){t&&c(s)}}}function R(n,s,a){let t;x(n,r,i=>a(0,t=i)),S(async()=>{await e()});const e=async function(){const l=await(await fetch("/gameState",{headers:{"content-type":"application/json"},method:"GET"})).json();w(r,t=l,t)};return[]}class j extends p{constructor(s){super();d(this,s,R,P,m,{})}}export{j as default};
