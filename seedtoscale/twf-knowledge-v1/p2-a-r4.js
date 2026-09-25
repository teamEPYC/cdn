(function(){
  var root=document.querySelector('.page-wrapper.is-twfa-page');
  if(root){
    root.dataset.twfAnimReady='1';
    root.__twfHoverBound=true;
  }

  function iconMarkup(direction){
    var path=direction==='down'
      ? '<path d="M8 3v10M4.5 9.5 8 13l3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>'
      : '<path d="M3 8h10M9 4.5 13 8l-4 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>';
    return '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-button-icon class="twf_btn-icon">'+path+'</svg>';
  }
  function buttonMarkup(label,direction){
    return '<div class="twf_btn-inner"><div data-button-fill class="twf_btn-fill"></div><div class="twf_btn-label-wrap"><div data-button-label class="twf_btn-label"><p class="twf_btn-label-text">'+label+'</p></div><div aria-hidden="true" data-button-label-hover class="twf_btn-label-hover"><p class="twf_btn-label-text">'+label+'</p></div></div><div class="twf_btn-icon-wrap">'+iconMarkup(direction)+'</div></div>';
  }
  function enhanceButton(el,label,variant,direction){
    if(!el)return;
    el.setAttribute('data-button','');
    el.setAttribute('data-button-arrow',direction);
    el.removeAttribute('twf-anim');
    el.classList.add('twk2_cta-system','twf_cta','w-inline-block');
    el.classList.remove('w-button','is-twf-light','is-twf-dark');
    el.classList.add(variant==='dark'?'is-twf-dark':'is-twf-light');
    el.innerHTML=buttonMarkup(label,direction);
  }
  enhanceButton(document.querySelector('.twfa_hero-bar-cta'),'Download Report','dark','down');
  enhanceButton(document.querySelector('.twk2_author-meta .twf_cta'),'View Profile','light','right');
  enhanceButton(document.querySelector('.twfa_dl-section .twf_cta'),'Download Report','light','down');
  enhanceButton(document.querySelector('.twk2_notify'),'Notify Me','dark','right');
  /* Summary section CTA: same button as the other four, not a bare text link.
     enhanceButton builds the fill, the sliding label and the two animated
     arrows, and initExactButtons below wires the GSAP hover. */
  enhanceButton(document.querySelector('.twk2_summary-left a'),'Download Report','dark','down');

  var authorArt=document.querySelector('.twk2_author-art');
  if(authorArt)authorArt.innerHTML='<img class="twk2_author-photo" src="https://cdn.prod.website-files.com/6410c40c8f9e67469272e6db/6ab38baf5780966619478eed_tarun-raheja.jpg" alt="Tarun Raheja"><div class="twk2_author-gradient" aria-hidden="true"></div>';

  /* Summary takeaways: drawn glyphs + accordion, ported from the prototype.
     The SVG artwork is inline here, so it is ours — nothing is fetched from
     the prototype's host. Styling lives in the head under .twk2_tk-*.
     This is the page's contents list: one entry per section, in page order,
     and each entry's link goes to the section its own text is about. An
     earlier version reused the framework's four card titles here and then
     sent each one to a different section, so the text and the link under it
     described different things. Each body below paraphrases that section's
     own copy rather than introducing a new claim. */
  var TK=[
    {n:'01',t:'What the playbook covers.',
     w:'Four parts. Benchmarking model capabilities in your domain. Harness engineering to improve frontier performance. Productionizing and scaling up. Retaining moats as the models improve.',
     g:'<rect x="6" y="6" width="36" height="36" pathLength="1" style="--i:0"></rect><line x1="30" y1="6" x2="30" y2="42" pathLength="1" style="--i:1"></line><line x1="38" y1="6" x2="38" y2="42" pathLength="1" style="--i:2"></line><line x1="6" y1="18" x2="42" y2="18" pathLength="1" style="--i:3"></line><line x1="6" y1="30" x2="42" y2="30" pathLength="1" style="--i:4"></line><circle class="is-fill" cx="34" cy="12" r="3" pathLength="1" style="--i:5"></circle>'},
    {n:'02',t:'Where the value accrues.',
     w:'Models train well on tasks that are well represented in training data and machine-checkable. Code and math have improved quickly on that basis. Work that needs judgement has moved slower. A harness is a specific solution to a general problem, so a generalist model will eventually cover it. Four things stay with you: expert-labelled edge cases and proprietary data, workflow depth and the switching cost it creates, customer deployments, and customer trust.',
     g:'<rect x="8" y="10" width="32" height="28" rx="1" pathLength="1" style="--i:0"></rect><line x1="14" y1="18" x2="30" y2="18" pathLength="1" style="--i:1"></line><line x1="14" y1="24" x2="34" y2="24" pathLength="1" style="--i:2"></line><line x1="14" y1="30" x2="26" y2="30" pathLength="1" style="--i:3"></line><circle class="is-fill" cx="36" cy="32" r="3" pathLength="1" style="--i:4"></circle>'},
    {n:'03',t:'The loop: map, improve, productionize, re-evaluate.',
     w:'This is a loop, not a build. Find where the model is weak, task by task. Improve the output in those areas. Make it robust to real edge cases. Re-evaluate on every release and remove the scaffolding that is no longer needed.',
     g:'<circle cx="24" cy="24" r="17" pathLength="1" style="--i:0"></circle><path d="M24 12 V24 L32 29" pathLength="1" style="--i:1"></path><path d="M24 4 V7 M24 41 V44 M4 24 H7 M41 24 H44" pathLength="1" style="--i:2"></path><circle class="is-fill" cx="24" cy="24" r="2.5" pathLength="1" style="--i:3"></circle>'},
    {n:'04',t:'The full report.',
     w:'The complete playbook as a document. Run the loop about once a quarter. Re-run your eval suite in the first two days after a new model ships.',
     g:'<rect x="7" y="7" width="34" height="34" pathLength="1" style="--i:0"></rect><path d="M15 25 L22 32 L34 17" pathLength="1" style="--i:1"></path><circle class="is-fill" cx="34" cy="17" r="3" pathLength="1" style="--i:2"></circle>'}
  ];
  /* Each entry links to the section it summarises. */
  var TK_LINK=[
    {h:'#twk2-benchmarking',l:'Inside the playbook \u2192'},
    {h:'#twk2-author',l:'The argument \u2192'},
    {h:'#twk2-framework',l:'The framework \u2192'},
    {h:'#twk2-download',l:'Download the report \u2192'}
  ];
  /* Accent runs. The design colours the opening clause of each heading
     #ff3621 and the remainder #222 — a character-style override in the Figma
     file, not a separate element. Each pair below is [heading, red part] read
     out of that file. The last two are inferred from their siblings: the file
     has no override recorded for them.
     This runs before SplitText so the spans are carried into the line masks. */
  var RED=[
    ['Benchmarking model capabilities in your domain','Benchmarking model capabilities'],
    ['Harness engineering to improve frontier performance','Harness engineering'],
    ['Productionizing and scaling up','Productionizing'],
    ['Retaining moats and staying ahead','Retaining moats'],
    ['Building a vertical AI product is a loop, not a build.','Building a vertical AI product is a loop'],
    ['Two more reports are on the way. Get word the day either one ships.','Two more reports'],
    ['Find where the model is weak, task by task.','Find'],
    ['Improve the output in those specific areas.','Improve the output'],
    ['Productionize and make it robust to real edge cases.','Productionize'],
    ['Re-evaluate on every release, and remove scaffolding.','Re-evaluate']
  ];
  function paintAccent(el,red){
    var raw=el.textContent;
    var re=new RegExp(red.split(/\s+/).map(function(w){
      return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    }).join('\\s+'));
    var m=re.exec(raw);
    if(!m)return;
    var start=m.index,end=start+m[0].length,pos=0;
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),nodes=[],n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(function(tn){
      var t=tn.nodeValue,a=pos,b=pos+t.length;pos=b;
      var s=Math.max(start,a),e=Math.min(end,b);
      if(s>=e)return;
      var frag=document.createDocumentFragment();
      if(s>a)frag.appendChild(document.createTextNode(t.slice(0,s-a)));
      var span=document.createElement('span');
      span.className='twk2_accent';
      span.textContent=t.slice(s-a,e-a);
      frag.appendChild(span);
      if(e<b)frag.appendChild(document.createTextNode(t.slice(e-a)));
      tn.parentNode.replaceChild(frag,tn);
    });
  }
  Array.prototype.forEach.call(
    document.querySelectorAll('.twk2_card-title,.twk2_title,.twk2_framework-title'),
    function(el){
      if(el.querySelector('.twk2_accent'))return;
      var flat=el.textContent.replace(/\s+/g,' ').trim();
      for(var i=0;i<RED.length;i++){
        if(flat===RED[i][0]){paintAccent(el,RED[i][1]);break;}
      }
    });

  /* Anchors for the takeaway links. Webflow's API cannot write an element id
     (it is a setting, not an attribute), so they are assigned here. */
  [['.twk2_playbook','twk2-benchmarking'],
   ['.twk2_author','twk2-author'],
   ['.twk2_framework','twk2-framework'],
   ['.twfa_dl-section','twk2-download']].forEach(function(p){
    var el=document.querySelector(p[0]);
    if(el&&!el.id)el.id=p[1];
  });

  var tkList=document.querySelector('.twk2_summary-list');
  if(tkList){
    tkList.innerHTML='<ol class="twk2_tk-list">'+TK.map(function(it,i){
      var id='twk2-tk-p'+(i+1);
      return '<li class="twk2_tk-item">'+
        '<button class="twk2_tk-row" type="button" aria-expanded="false" aria-controls="'+id+'">'+
          '<svg class="twk2_tk-glyph" viewBox="0 0 48 48" aria-hidden="true">'+it.g+'</svg>'+
          '<span class="twk2_tk-num">'+it.n+'</span>'+
          '<span class="twk2_tk-take">'+it.t+'</span>'+
          '<span class="twk2_tk-plus" aria-hidden="true"></span>'+
        '</button>'+
        '<div class="twk2_tk-panel" id="'+id+'"><div><div class="twk2_tk-panel-in">'+
          '<p>'+it.w+'</p>'+
          '<a class="twk2_tk-link" href="'+TK_LINK[i].h+'">'+TK_LINK[i].l+'</a>'+
        '</div></div></div></li>';
    }).join('')+'</ol>';
    tkList.addEventListener('click',function(e){
      var row=e.target.closest('.twk2_tk-row');
      if(!row||!tkList.contains(row))return;
      var item=row.parentElement,panel=item.querySelector('.twk2_tk-panel');
      var open=item.classList.toggle('is-open');
      row.setAttribute('aria-expanded',open?'true':'false');
      /* height is set here, not in CSS: the 0fr/1fr grid trick resolves to 0px
         on this page, so the panel is measured and given a pixel height. */
      panel.style.height=open?panel.firstElementChild.scrollHeight+'px':'0px';
    });
    window.addEventListener('resize',function(){
      Array.prototype.forEach.call(tkList.querySelectorAll('.twk2_tk-item.is-open'),function(it){
        var p=it.querySelector('.twk2_tk-panel');
        p.style.height=p.firstElementChild.scrollHeight+'px';
      });
    });
  }

  var splitSelector='.twfa_hero-title,.twfa_hero-body,.twk2_title,.twk2_card-title,.twk2_card-body,.twk2_quote-text,.twk2_closing,.twfa_dl-title,.twk2_download-body,.twk2_next-title';
  Array.prototype.forEach.call(document.querySelectorAll(splitSelector),function(el){
    el.style.visibility='hidden';
    el.setAttribute('data-twk2-split','');
  });

  var footer=document.querySelector('.twf_footer-pull');
  if(footer){
    footer.className='twf_footer-pull is-twf-reveal';
    footer.innerHTML='<div class="twf_footer-brand"><img src="https://cdn.prod.website-files.com/6410c40c8f9e67469272e6db/6aaf840f76ee55a919a91b4c_twf-sts-wordmark-cream.svg" loading="lazy" alt="SeedToScale" class="twf_footer-mark"><img src="https://cdn.prod.website-files.com/6410c40c8f9e67469272e6db/64272120257befb8ee0cff4d_curated-by-accel.svg" loading="lazy" alt="Curated by Accel" class="twf_footer-curated"></div>';
  }
})();
