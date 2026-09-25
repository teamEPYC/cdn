(function(){
  function showSplitTargets(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-twk2-split]'),function(el){
      el.style.visibility='visible';
    });
  }

  function initExactButtons(){
    if(typeof window.gsap==='undefined')return;
    var g=window.gsap;
    Array.prototype.forEach.call(document.querySelectorAll('.twk2_cta-system[data-button]'),function(button){
      if(button.dataset.twk2ButtonReady)return;
      button.dataset.twk2ButtonReady='1';
      var fill=button.querySelector('[data-button-fill]');
      var label=button.querySelector('[data-button-label]');
      var hoverLabel=button.querySelector('[data-button-label-hover]');
      var icon=button.querySelector('[data-button-icon]');
      var down=button.getAttribute('data-button-arrow')==='down';
      var fillTween=null,iconTween=null;
      if(!fill)return;
      g.set(fill,{scale:0});
      if(hoverLabel)g.set(hoverLabel,{yPercent:110});
      /* left/top on the fill resolve against its offset parent, which is
         .twf_btn-inner — inset from the button by the button's padding
         (28.8 x 14.4 on most of these). Measuring the cursor from the button
         instead put the circle that far right and down of the pointer, while
         the radius was sized to just reach the farthest button corner, so it
         fell short on the opposite edge by up to hypot(28.8,14.4) = 32px.
         That is the uncovered crescent. Both the centre and the corner
         distances are now in the offset parent's coordinate space. */
      function point(event){
        var host=fill.offsetParent||button;
        var hr=host.getBoundingClientRect();
        var br=button.getBoundingClientRect();
        return{x:event.clientX-hr.left,y:event.clientY-hr.top,
          bx:br.left-hr.left,by:br.top-hr.top,bw:br.width,bh:br.height};
      }
      function cover(p){
        var x1=p.bx,y1=p.by,x2=p.bx+p.bw,y2=p.by+p.bh;
        var radius=Math.max(
          Math.hypot(p.x-x1,p.y-y1),Math.hypot(p.x-x2,p.y-y1),
          Math.hypot(p.x-x1,p.y-y2),Math.hypot(p.x-x2,p.y-y2));
        return radius*2/(fill.offsetWidth||24);
      }
      button.addEventListener('mouseenter',function(event){
        var p=point(event);
        if(fillTween)fillTween.kill();
        if(iconTween)iconTween.kill();
        g.set(fill,{left:p.x,top:p.y,scale:0});
        fillTween=g.to(fill,{scale:cover(p),duration:.5,ease:'power2.out'});
        if(label)g.to(label,{yPercent:-110,duration:.4,ease:'power3.out'});
        if(hoverLabel)g.to(hoverLabel,{yPercent:0,duration:.4,ease:'power3.out'});
        if(icon){
          iconTween=g.timeline().to(icon,down?{yPercent:130,duration:.2,ease:'power3.in'}:{xPercent:130,duration:.2,ease:'power3.in'})
            .set(icon,down?{yPercent:-130}:{xPercent:-130})
            .to(icon,down?{yPercent:0,duration:.2,ease:'power3.out'}:{xPercent:0,duration:.2,ease:'power3.out'});
        }
      });
      button.addEventListener('mouseleave',function(event){
        var p=point(event);
        if(fillTween)fillTween.kill();
        if(iconTween)iconTween.kill();
        g.set(fill,{left:p.x,top:p.y});
        fillTween=g.to(fill,{scale:0,duration:.5,ease:'power2.inOut'});
        if(label)g.to(label,{yPercent:0,duration:.4,ease:'power3.out'});
        if(hoverLabel)g.to(hoverLabel,{yPercent:110,duration:.4,ease:'power3.out'});
        if(icon)g.to(icon,down?{yPercent:0,duration:.3,ease:'power3.out'}:{xPercent:0,duration:.3,ease:'power3.out'});
      });
    });
  }

  function initVercelSplitText(){
    var g=window.gsap,ST=window.ScrollTrigger,Split=window.SplitText;
    var targets=Array.prototype.slice.call(document.querySelectorAll('[data-twk2-split]'));
    if(!targets.length)return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      showSplitTargets();
      return;
    }
    if(!g||!ST||!Split){
      showSplitTargets();
      return;
    }
    try{g.registerPlugin(ST,Split);}catch(e){}
    targets.forEach(function(el){
      try{
        var config={
          type:'lines',
          mask:'lines',
          autoSplit:true,
          aria:'auto',
          linesClass:'twk2_split-line',
          onSplit:function(self){
            g.set(el,{visibility:'visible'});
            return g.from(self.lines,{
              yPercent:110,
              duration:.9,
              stagger:.08,
              ease:'power3.out',
              immediateRender:true,
              overwrite:'auto',
              scrollTrigger:{trigger:el,start:'top 85%',once:true}
            });
          }
        };
        if(typeof Split.create==='function')Split.create(el,config);
        else{
          var instance=new Split(el,config);
          g.set(el,{visibility:'visible'});
          g.from(instance.lines,{yPercent:110,duration:.9,stagger:.08,ease:'power3.out',immediateRender:true,overwrite:'auto',scrollTrigger:{trigger:el,start:'top 85%',once:true}});
        }
      }catch(error){el.style.visibility='visible';}
    });
    ST.refresh();
  }

  function initWorkingKnowledgeDialog(){
    var modal=document.querySelector('[data-twk2-modal]');
    if(!modal)return;
    if(modal.parentElement!==document.body)document.body.appendChild(modal);
    var lastFocused=null;
    var openers=Array.prototype.slice.call(document.querySelectorAll('[data-twk2-modal-open],a')).filter(function(el){
      return el.hasAttribute('data-twk2-modal-open')||/download report|notify me/i.test((el.textContent||'').trim());
    });
    var closers=modal.querySelectorAll('[data-twk2-modal-close]');
    var firstField=modal.querySelector('input,textarea,button');
    function openDialog(event){
      if(event)event.preventDefault();
      lastFocused=document.activeElement;
      modal.classList.add('twk2_modal-open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('twk2_modal-lock');
      if(window.__twk2Lenis)window.__twk2Lenis.stop();
      window.setTimeout(function(){if(firstField)firstField.focus();},40);
    }
    function closeDialog(){
      modal.classList.remove('twk2_modal-open');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('twk2_modal-lock');
      if(window.__twk2Lenis)window.__twk2Lenis.start();
      if(lastFocused&&lastFocused.focus)lastFocused.focus();
    }
    openers.forEach(function(el){el.addEventListener('click',openDialog);});
    Array.prototype.forEach.call(closers,function(el){el.addEventListener('click',closeDialog);});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&modal.classList.contains('twk2_modal-open'))closeDialog();});
  }

  /* Lenis smooth scroll. It must drive GSAP's ticker and push scroll updates
     into ScrollTrigger, otherwise the split-text triggers fire at the wrong
     scroll positions. Respects prefers-reduced-motion and degrades to native
     scrolling if the library fails to load. */
  function initSmoothScroll(){
    if(typeof window.Lenis==='undefined')return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(window.__twk2Lenis)return;
    var lenis=new window.Lenis({duration:1.1,smoothWheel:true});
    window.__twk2Lenis=lenis;
    if(window.gsap&&window.ScrollTrigger){
      lenis.on('scroll',window.ScrollTrigger.update);
      window.gsap.ticker.add(function(time){lenis.raf(time*1000);});
      window.gsap.ticker.lagSmoothing(0);
    }else{
      (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(0);
    }
    /* in-page anchors (the summary takeaway links) go through Lenis */
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');
      if(!a)return;
      var id=a.getAttribute('href');
      if(!id||id==='#')return;
      var t=document.querySelector(id);
      if(!t)return;
      e.preventDefault();
      lenis.scrollTo(t,{offset:-130});
    });
  }

  var splitStarted=false;
  function runSplitOnce(){
    if(splitStarted)return;
    splitStarted=true;
    initVercelSplitText();
  }

  function init(){
    initSmoothScroll();
    initExactButtons();
    /* r2: SplitText ran on DOMContentLoaded and measured the Georgia fallback,
       which is wider than Ppfragment-Glare, so the hero froze at three lines.
       Wait for the webfont. The timeout is a safety net: p2-a sets
       visibility:hidden up front, so the copy must never depend on a promise
       that might not settle. */
    if(document.fonts&&document.fonts.ready&&typeof document.fonts.ready.then==='function'){
      setTimeout(runSplitOnce,2500);
      document.fonts.ready.then(runSplitOnce)['catch'](runSplitOnce);
    }else{
      runSplitOnce();
    }
    initWorkingKnowledgeDialog();
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
})();
