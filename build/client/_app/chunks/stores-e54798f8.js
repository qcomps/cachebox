import{U as o}from"./vendor-c7513497.js";const n=()=>{const s=o("__svelte__");return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:s.navigating.subscribe}},session:s.session,updated:s.updated}},t=s=>{throw new Error(`Cannot ${s} session store before subscribing`)},r={subscribe(s){const e=n().session;return r.set=e.set,r.update=e.update,e.subscribe(s)},set:()=>t("set"),update:()=>t("update")};export{r as s};
