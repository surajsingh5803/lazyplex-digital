"use strict";
(() => {
 const header=document.querySelector('.lp-digital-nav');
 if(!header)return;
 const desktop=header.querySelector('.desktop-nav');
 const shell=header.querySelector('.lp-mobile-shell');
 const closeGroups=root=>root?.querySelectorAll('.lp-nav-group[open]').forEach(d=>d.open=false);
 header.addEventListener('toggle',event=>{
   const d=event.target;
   if(d.classList.contains('lp-nav-group')&&d.open){
     d.parentElement.querySelectorAll('.lp-nav-group[open]').forEach(x=>{if(x!==d)x.open=false});
   }
   if(d===shell&&!shell.open)closeGroups(shell);
 },true);
 document.addEventListener('click',event=>{
   if(!header.contains(event.target)){closeGroups(desktop);if(shell)shell.open=false;}
   else if(event.target.closest('.lp-mobile-shell a')&&shell)shell.open=false;
 });
 document.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const open=header.querySelector('.lp-nav-group[open]');
   if(open){open.open=false;open.querySelector('summary').focus();}
   else if(shell?.open){shell.open=false;shell.querySelector('summary').focus();}
 });
 const bp=matchMedia('(max-width:1199px)');
 bp.addEventListener('change',()=>{closeGroups(desktop);if(shell)shell.open=false;});
})();
