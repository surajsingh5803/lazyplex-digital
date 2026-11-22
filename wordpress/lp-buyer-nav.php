<?php
/*
Plugin Name: Lazy Plex Buyer Navigation Bridge
Description: Connect the public Lazy Plex header to the approved service, proof, and buying routes.
Version: 1.0.0
*/
defined('ABSPATH') || exit;
add_action('wp_footer', function() {
  if (is_admin()) { return; }
  ?>
  <style id="lp-buyer-nav-style">
  @media (min-width: 1000px) {
    .lpbrand-desktop .lpbrand-phone { display: none!important; }
  }
  .lpbrand-header .lpbrand-cta:focus-visible,
  .lpbrand-header .lpbrand-desktop a:focus-visible,
  .lpbrand-header .lpbrand-mobile a:focus-visible {
    outline: 3px solid #b9f664; outline-offset: 3px;
  }
  </style>
  <script id="lp-buyer-nav-script">
  (function(){
    function path(a){ try{return new URL(a.href).pathname;} catch(e){return "";} }
    function find(nav,p){return Array.from(nav.querySelectorAll("a[href]")).find(a=>path(a)===p);}
    function make(text,href,cls) {
      var a=document.createElement("a");a.textContent=text;a.href=href;
      if(cls)a.className=cls;return a;
    }
    function update(){
      var d=document.querySelector(".lpbrand-header .lpbrand-desktop");
      if(d && !d.dataset.lpBuyerNav){
        var services=find(d,"/services/"),industries=find(d,"/industries/");
        if(services && industries)d.insertBefore(services,industries);
        var about=find(d,"/about/");
        if(about&&!find(d,"/our-work/")) d.insertBefore(make("Our Work","https://lazyplex.com/our-work/",about.className),about);
        var cta=d.querySelector(".lpbrand-cta");
        if(cta){cta.href="https://lazyplex.com/start/";cta.innerHTML='Get Started <span aria-hidden="true">↗</span>';}
        d.dataset.lpBuyerNav="1";
      }
      var m=document.querySelector(".lpbrand-header .lpbrand-mobile nav");
      if(m && !m.dataset.lpBuyerNav){
        var home=find(m,"/"),pricing=find(m,"/pricing/"),contact=find(m,"/contact/");
        if(!find(m,"/start/"))m.insertBefore(make("Get Started","https://lazyplex.com/start/"),home?home.nextSibling:m.firstChild);
        if(!find(m,"/our-work/")){
          var work=make("Our Work","https://lazyplex.com/our-work/");
          if(pricing)pricing.after(work);else m.appendChild(work);
        }
        if(!find(m,"/request-proposal/")){
          var proposal=make("Request a Proposal","https://lazyplex.com/request-proposal/");
          if(contact)m.insertBefore(proposal,contact);else m.appendChild(proposal);
        }
        var audit=find(m,"/growth-audit/");
        if(audit){audit.href="https://lazyplex.com/request-growth-audit/";audit.textContent="Growth Audit — All Industries";}
        m.dataset.lpBuyerNav="1";
      }
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",update,{once:true});
    else update();
    window.addEventListener("pageshow",update);
  })();
  </script>
  <?php
}, 90);
