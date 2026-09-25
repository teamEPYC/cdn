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

  /* r6: on success the dialog delivers, then gets out of the way.

     Webflow reveals .w-form-done by flipping its inline display and fires no
     event, so this watches the node instead.

     BOTH dialogs hide their standfirst at that moment, because each one asks
     for something that has already happened: the report line asks where to
     send it, the notify line offers to tell you when it ships. Leaving the
     notify line up made that panel say the same thing twice, one line above
     the other.

     Only the report opens a file. window.open from an async success callback
     is outside the click gesture and some browsers refuse it, which is exactly
     why the fallback link stays on screen and is never hidden.

     shown() must not read true before Webflow reveals the block. That bit us:
     .twk2_form-done carried display:flex, so the confirmation read as visible
     from page load, this fired immediately, and the dialog showed the form and
     the confirmation at the same time. The class no longer sets display, so
     .w-form-done's own display:none governs until Webflow overrides it inline. */
  function initFormDelivery(){
    [['[data-twk2-modal]',true],['[data-twk2-notify-modal]',false]].forEach(function(pair){
      var modal=document.querySelector(pair[0]);
      if(!modal)return;
      var done=modal.querySelector('.w-form-done');
      if(!done)return;
      var stand=modal.querySelector('.twk2_modal-copy');
      var link=pair[1]?done.querySelector('a[href]'):null;
      var fired=false;
      function shown(){
        if(done.offsetParent!==null)return true;
        var d=window.getComputedStyle(done).display;
        return d!=='none'&&d!=='';
      }
      function deliver(){
        if(fired||!shown())return;
        fired=true;
        if(stand)stand.style.display='none';
        if(link&&link.href){
          try{window.open(link.href,'_blank','noopener');}catch(e){}
        }
      }
      var mo=new MutationObserver(deliver);
      mo.observe(done,{attributes:true,attributeFilter:['style','class']});
      mo.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
      deliver();
    });
  }

  function initWorkingKnowledgeDialog(){
    var dialogs={
      report:document.querySelector('[data-twk2-modal]'),
      notify:document.querySelector('[data-twk2-notify-modal]')
    };
    if(!dialogs.report&&!dialogs.notify)return;
    var lastFocused=null;
    var current=null;

    function closeDialog(modal){
      var target=modal||current;
      if(!target)return;
      target.classList.remove('twk2_modal-open');
      target.setAttribute('aria-hidden','true');
      document.body.classList.remove('twk2_modal-lock');
      if(window.__twk2Lenis)window.__twk2Lenis.start();
      if(lastFocused&&lastFocused.focus)lastFocused.focus();
      current=null;
    }
    function openDialog(modal,event){
      if(!modal)return;
      if(event)event.preventDefault();
      lastFocused=document.activeElement;
      current=modal;
      modal.classList.add('twk2_modal-open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('twk2_modal-lock');
      if(window.__twk2Lenis)window.__twk2Lenis.stop();
      var firstField=modal.querySelector('input,textarea,button');
      window.setTimeout(function(){if(firstField)firstField.focus();},40);
    }

    ['report','notify'].forEach(function(key){
      var modal=dialogs[key];
      if(!modal)return;
      if(modal.parentElement!==document.body)document.body.appendChild(modal);
      Array.prototype.forEach.call(modal.querySelectorAll('[data-twk2-modal-close]'),function(el){
        el.addEventListener('click',function(){closeDialog(modal);});
      });
    });

    /* r3: Notify Me used to open the REPORT dialog, because the opener matched
       on link text and both CTAs matched. Route by attribute value instead.
       "notify me" is deliberately gone from the text test so a Notify CTA can
       never fall through to the report form. The ternary keeps the old
       behaviour if the notify dialog has not been published yet, so there is
       no half-broken state between a script push and a site publish. */
    /* r5: never hijack a real link. This filter used to match ANY anchor whose
       text read "download report", and openDialog() calls preventDefault() on
       it. The confirmation state's own download link reads the same words, so
       clicking it re-opened the dialog and the PDF never loaded — right-click
       "open in new tab" worked because that bypasses the click handler. An
       opener is either attribute-tagged or a trigger with no real href; a link
       that points somewhere, or that lives inside a form's success/error
       block, is left alone. */
    var openers=Array.prototype.slice.call(document.querySelectorAll('[data-twk2-modal-open],a')).filter(function(el){
      if(el.closest&&el.closest('.w-form-done,.w-form-fail'))return false;
      var href=el.getAttribute('href');
      if(href&&href.charAt(0)!=='#')return false;
      return el.hasAttribute('data-twk2-modal-open')||/download report/i.test((el.textContent||'').trim());
    });
    openers.forEach(function(el){
      var which=(el.getAttribute('data-twk2-modal-open')||'').trim().toLowerCase();
      var modal=(which==='notify'&&dialogs.notify)?dialogs.notify:dialogs.report;
      el.addEventListener('click',function(event){openDialog(modal,event);});
    });

    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&current)closeDialog(current);
    });
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
    initFormDelivery();
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
})();
