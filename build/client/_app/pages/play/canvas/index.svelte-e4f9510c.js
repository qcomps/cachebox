import{S as d,i as h,s as f,e as g,c as u,a as m,d as l,b as i,g as v,L as c,v as C}from"../../../chunks/vendor-fc529e69.js";var p="/_app/assets/beach-c7b7bdd7.png";function _(s){let t;return{c(){t=g("canvas"),this.h()},l(e){t=u(e,"CANVAS",{id:!0,width:!0,height:!0}),m(t).forEach(l),this.h()},h(){i(t,"id","canvas"),i(t,"width","1000"),i(t,"height","500")},m(e,n){v(e,t,n)},p:c,i:c,o:c,d(e){e&&l(t)}}}function b(s,t,e){let{tileConfig:n}=t,o,r;return C(()=>{o=document.getElementById("canvas"),r=o.getContext("2d");const a=new Image;a.onload=function(){r.drawImage(a,0,0)},a.src=p}),s.$$set=a=>{"tileConfig"in a&&e(0,n=a.tileConfig)},[n]}class w extends d{constructor(t){super();h(this,t,b,_,f,{tileConfig:0})}}export{w as default};
