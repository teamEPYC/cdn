"use strict";(()=>{var q="https://explorer-backend-1.onrender.com",l={zkevm:"Polygon zkEVM",pos:"Polygon POS",cdk:"Polygon CDK",id:"Polygon ID",miden:"Polygon Miden"},o={dapps:"dApps",solution_providers:"Solution Providers",ecosystem_enablers:"Ecosystem Enablers",enterprises:"Enterprises",chains:"Chains"},b={ascending:"ascending",descending:"descending"},v={public_chains:"Public Chains",app_specific_chains:"App Specific Chains",decentralized_identity:"Decentralized Identity"},_="#filter-wrapper",x="#list-wrapper",M="#list-news-wrapper",N={"Polygon zkEVM":[o.dapps,o.solution_providers,o.ecosystem_enablers,o.enterprises],"Polygon POS":[o.dapps,o.solution_providers,o.ecosystem_enablers,o.enterprises],"Polygon CDK":[o.chains,o.solution_providers],"Polygon ID":[o.dapps,o.solution_providers]};var d={log:(...t)=>{window.location.hostname.includes("webflow.io")&&console.log(...t)},deep:(...t)=>{window.location.hostname.includes("webflow.io")&&console.dir(...t)},info:(...t)=>{window.location.hostname.includes("webflow.io")&&console.info(...t)},warn:(...t)=>{window.location.hostname.includes("webflow.io")&&console.warn(...t)},error:(...t)=>{window.location.hostname.includes("webflow.io")&&console.error(...t)}};var Q=t=>Object.entries(t).map(([i,e])=>Array.isArray(e)?e.map(r=>`${encodeURIComponent(i)}=${encodeURIComponent(r)}`).join("&"):`${encodeURIComponent(i)}=${encodeURIComponent(e)}`).join("&"),W=async(t,i,e)=>{let r={method:i,headers:{"Content-Type":"application/json"}};e&&(r.body=e);let a=await(await fetch(`${q}/${t}`,r)).json();return d.deep(a),a},z=async t=>{d.deep(t);let i=Q(t);return W(`companies?${i}`,"GET")};function G(t={},i="store"){let e=0;function r(u,p){let c=new CustomEvent(u,{bubbles:!0,cancelable:!0,detail:p});e>0&&(document.dispatchEvent(c),e=0)}function s(u,p){return{get:function(c,g){return g==="_isProxy"?!0:(["object","array"].includes(Object.prototype.toString.call(c[g]).slice(8,-1).toLowerCase())&&!c[g]._isProxy&&(c[g]=new Proxy(c[g],s(u,p))),c[g])},set:function(c,g,y){return c[g]===y||(c[g]=y,e+=1),!0},deleteProperty:function(c,g){return delete c[g],e+=1,!0}}}let a=u=>{d.log("ran setState");for(let p in u)u.hasOwnProperty(p)&&(t[p]=u[p]);e+=1,r(i,t)};return{state:new Proxy(t,s(i,t)),setState:a}}var{state:n,setState:h}=G({tab:v.public_chains,chain:l.zkevm,type:o.dapps,categories:[],sort:"ascending",query:"",after:0,limit:9},"filters");var A=t=>{let i=n.categories;return`
  <div class="filtered-projects-container">
  <div class="text-size-med text-gray6">
    <span class="filter-number-text">${t} projects</span> 
  ${i&&i.length>0?"filtered by":""}
  </div>
  ${i&&i.length>0?i.map(r=>`<div class="filtered-projects-tags-container">
    <div class="filtered-projects-tag">
      <div class="filtered-label" data-value="${r}">${r.split("_")[1]||r}</div>
      <div class="filter-close-icon w-embed">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentcolor"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </div>`).join(""):""}
    </div>
  </div>
</div>
`},P=t=>`
  <div fs-cmsnest-element="list-2" role="list" class="items-cl w-dyn-items">${t.map(r=>J(r)).join("")}</div>`,J=t=>{let{id:i,name:e,description:r,icon:s,cardBackground:a,twitterHandle:u,githubRepo:p,category:c,subCategories:g,discordServer:y,telegramChannel:m,coingeckoLink:w,websiteLink:f,linkedinLink:ye,spnProfile:I}=t;return`<div role="listitem" class="items-ci w-dyn-item">
  <div
    class="items-ci-wrapper"
    style="
      transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg)
        rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
      transform-style: preserve-3d;
    "
  >
    <div class="items-card-content">
      <div class="item-content">
        <img
          width="112"
          loading="lazy"
          alt=""
          src="${s}"
          class="item-icon-img"
        />
        <div class="item-name-tags">
          <h3 class="text-h3">${e}</h3>
        ${c?`<div class= "item-tags">${c.map(k=>`<div class="items-tag is-primary" > ${k} </div >`).join("")} </div>`:""}
        ${g?`<div class="item-tags"> ${g.map(k=>`<div class="items-tag">${k}</div>`).join("")}</div >`:""}
        </div>
      </div>
    </div>
    <div
      style="
        background-image: url('${a}');
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg)
          rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        display: none;
      "
      class="items-card-hover-content"
    >
      <div class="item-card-link">
        <h3 class="text-h3">${e}</h3>
        <p class="text-size-med is-item-card-desc">
          ${r}
        </p>
        <div class="item-read-more-container">
          <div class="text-semibold is-item-read-more">Read&nbsp;More</div>
          <div class="item-read-more-tooltip" style="display: none; opacity: 0">
            <div class="item-read-more-tooltip-tip w-embed">
              <svg
                width="20"
                height="7"
                viewBox="0 0 20 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2979 2.43832C12.5825 1.06599 11.7248 0.379828 10.7512 0.193675C10.2549 0.0987752 9.7451 0.0987753 9.24878 0.193675C8.27522 0.379828 7.41751 1.06599 5.7021 2.43832L6.99382e-07 7L20 7L14.2979 2.43832Z"
                  fill="currentcolor"
                ></path>
              </svg>
            </div>
            <div class="item-read-more-tooltip-text">
              ${r}
            </div>
          </div>
        </div>
      </div>
      <div class="items-links-wrapper">
        <div class="items-social-links-wrapper">
          ${f?`<a
            href="${f}"
            class="featured-social-link w-inline-block "
            ><div class="featured-items-social-icon w-embed">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2"
                  stroke="currentcolor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg></div></a
          >`:""}
          ${u?`<a
            href="${u}"
            class="featured-social-link w-inline-block"
            ><div class="items-social-icon w-embed">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 6.73077C20.325 7.07692 19.65 7.19231 18.8625 7.30769C19.65 6.84615 20.2125 6.15385 20.4375 5.23077C19.7625 5.69231 18.975 5.92308 18.075 6.15385C17.4 5.46154 16.3875 5 15.375 5C13.0125 5 11.2125 7.30769 11.775 9.61538C8.7375 9.5 6.0375 8 4.125 5.69231C3.1125 7.42308 3.675 9.61538 5.25 10.7692C4.6875 10.7692 4.125 10.5385 3.5625 10.3077C3.5625 12.0385 4.8 13.6538 6.4875 14.1154C5.925 14.2308 5.3625 14.3462 4.8 14.2308C5.25 15.7308 6.6 16.8846 8.2875 16.8846C6.9375 17.9231 4.9125 18.5 3 18.2692C4.6875 19.3077 6.6 20 8.625 20C15.4875 20 19.3125 14.1154 19.0875 8.69231C19.875 8.23077 20.55 7.53846 21 6.73077Z"
                  fill="currentcolor"
                ></path>
              </svg></div></a
          >`:""}${p?`<a
            href="${p}"
            class="featured-social-link w-inline-block"
            ><div class="featured-items-social-icon w-embed">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.9694 2C6.46483 2 2 6.58933 2 12.2474C2 16.7739 4.87462 20.6088 8.78899 21.9919C9.27829 22.0547 9.46177 21.7404 9.46177 21.4889C9.46177 21.2375 9.46177 20.6088 9.46177 19.7286C6.70948 20.3573 6.09786 18.3456 6.09786 18.3456C5.66972 17.1511 4.99694 16.8367 4.99694 16.8367C4.07951 16.2081 5.0581 16.2081 5.0581 16.2081C6.0367 16.2709 6.58716 17.2768 6.58716 17.2768C7.50459 18.8485 8.91131 18.4084 9.46177 18.1569C9.52294 17.4654 9.82875 17.0253 10.0734 16.7739C7.87156 16.5224 5.5474 15.6422 5.5474 11.6816C5.5474 10.55 5.91437 9.66984 6.58716 8.91543C6.52599 8.72682 6.15902 7.65808 6.70948 6.27499C6.70948 6.27499 7.56575 6.02352 9.46177 7.34374C10.2569 7.09227 11.1131 7.0294 11.9694 7.0294C12.8257 7.0294 13.682 7.15514 14.4771 7.34374C16.3731 6.02352 17.2294 6.27499 17.2294 6.27499C17.7798 7.65808 17.4128 8.72682 17.3517 8.97829C17.9633 9.66984 18.3914 10.6128 18.3914 11.7445C18.3914 15.7051 16.0673 16.5224 13.8654 16.7739C14.2324 17.0882 14.5382 17.7169 14.5382 18.6599C14.5382 20.043 14.5382 21.1117 14.5382 21.4889C14.5382 21.7404 14.7217 22.0547 15.211 21.9919C19.1865 20.6088 22 16.7739 22 12.2474C21.9388 6.58933 17.474 2 11.9694 2Z"
                  fill="currentcolor"
                ></path>
              </svg></div
          ></a>`:""}
        </div>
        ${I?`<a href="${I}" class="featured-item-link w-inline-block"
          ><div>Connect with SP</div>
          <div class="featured-item-link-arrow w-embed">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.83301 14.1667L14.1663 5.83337M14.1663 5.83337V14.1667M14.1663 5.83337H5.83301"
                stroke="currentcolor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg></div
        ></a>`:""}
      </div>
    </div>
  </div>
</div>

`},H=(t,i)=>{let e=n.after,r=n.limit,s=3,a=[],u=parseInt(e/r)+1,p=parseInt((t-1)/r)+1;a.push(1),u>3&&a.push("...");let c=Math.max(u-Math.floor(s/2),2),g=Math.min(c+s-1,p-1);g-c<s-2&&(c=Math.max(g-s+2,2));for(let m=c;m<=g;m++)a.push(m);return g<p-1&&a.push("..."),p>1&&a.push(p),`
        <div class="pagination-wrapper">
  <button
    class="pagination-btn is-previous w-inline-block ${e?"":"is-disabled"}"
  >
    <div class="pagination-icon w-embed">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M15 19L8 12L15 5"
            stroke="currentcolor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    </div>
  </button>

  ${a.map(m=>`<button class="pagination-link ${m===u?"w--current":""}"> ${m}</button>`).join("")}
  <button
    class="pagination-btn is-next w-inline-block ${i?"":"is-disabled"}"
  >
    <div class="pagination-icon w-embed">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M9 5L16 12L9 19"
            stroke="currentcolor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    </div>
  </button>
</div>
    `},O=()=>{let t=n.query;return`<div class="no-results-wrapper">
  <div class="no-results-abs-overlay">
    <img
      src="https://assets-global.website-files.com/652772322237331bccec35f0/655dc0be222b8fc5ca76f1fa_no-results-icon.svg"
      loading="lazy"
      alt=""
      class="no-results-icon"
    />
    <div class="spacer-1"></div>
    ${t?`<div class="text-size-large">
          No results for \u201C<span id="no-results-search-text">${t}</span>\u201D
        </div>`:""}
    <div class="spacer-p5"></div>
    <div class="text-size-small text-gray6">
      Sorry, we couldn't find anything with this criteria. Please try refining
      your search filters.
    </div>
  </div>
  <div class="no-results-list-grid">
    <div
      id="w-node-db06898f-18f7-fd4c-6ae1-9cf2b0517345-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
    <div
      id="w-node-_7c33c881-15de-d637-0626-e04bed95d02a-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
    <div
      id="w-node-f57cafe3-d616-b848-5e0c-0bbe56c67509-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
    <div
      id="w-node-e6059205-bd3e-82dc-b98a-322c58eb45e5-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
    <div
      id="w-node-b9d8de25-2ed9-acf0-a9df-e4e6cc66cc66-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
    <div
      id="w-node-_509eb595-fafe-c5a1-887a-d9443c816376-ccec35f7"
      class="no-results-list-card"
    >
      <div class="no-results-ghost-icon w-embed">
        <svg
          width="112"
          height="120"
          viewBox="0 0 112 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="24"
            width="64"
            height="64"
            rx="12"
            fill="currentcolor"
          ></rect>
          <rect
            y="80"
            width="112"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
          <rect
            x="31"
            y="108"
            width="50"
            height="12"
            rx="4"
            fill="currentcolor"
          ></rect>
        </svg>
      </div>
    </div>
  </div>
</div>
`};var F=(t,i)=>{let e=document.querySelector(t);e?e.innerHTML=i:d.warn(`Unable to find the DOM element with identifier ${t}`)},X=async(t,i,e)=>{var g,y,m;let r="";if(t&&t.length>0){let w=P(t),f=H(i,e);r=w+f}else r=O();let s=A(i);F("#filter-count",s),F(x,r);let a=(g=document.querySelector(x))==null?void 0:g.querySelector(".is-previous"),u=(y=document.querySelector(x))==null?void 0:y.querySelector(".is-next"),p=(m=document.querySelector(x))==null?void 0:m.querySelectorAll(".pagination-link"),c=n.after;a==null||a.addEventListener("click",()=>L("prev",c,e,0)),u==null||u.addEventListener("click",()=>L("next",c,e,0)),p==null||p.forEach(w=>{let f=parseInt(w.textContent);w.addEventListener("click",()=>L("goto",c,e,f))}),ie(),re()},R=t=>{let i=document.querySelector(_),e=document.querySelector(M);i&&e&&(t?(i.style.display="block",e.style.display="flex"):(i.style.display="none",e.style.display="none"))},ee=()=>{let i=[o.dapps,o.solution_providers,o.ecosystem_enablers,o.enterprises,o.chains].map(s=>document.querySelector(`[data-type-filter="${s}"]`)),e=n.chain,r=N[e];i.forEach(s=>{let a=s.getAttribute("data-type-filter");r.includes(a)?s.style.display="block":s.style.display="none"})},te=()=>{let t=n.type;[o.dapps,o.solution_providers,o.ecosystem_enablers,o.enterprises,o.chains].map(r=>document.querySelector(`[data-type-filter="${r}"]`)).forEach(r=>{var a,u,p,c;(a=r==null?void 0:r.querySelector(".w-radio-input"))==null||a.classList.remove("w--redirected-checked","w--redirected-focus"),(u=r==null?void 0:r.querySelector(".filter-radio-label"))==null||u.classList.remove("is-active");let s=r.getAttribute("data-type-filter");t===s&&((p=r==null?void 0:r.querySelector(".w-radio-input"))==null||p.classList.add("w--redirected-checked"),(c=r==null?void 0:r.querySelector(".filter-radio-label"))==null||c.classList.add("is-active"))})},T=async()=>{d.log("Updating Filters"),ee(),te()},E=async()=>{d.log("Updating List");let t={chain:n.chain,type:n.type,categories:n.categories,query:n.query,sort:n.sort,after:n.after,limit:n.limit},i=await z(t),{success:e,status:r,data:s,error:a}=i;if(e){let{total:u,records:p,has_more:c}=s;X(p,u,c)}else d.warn(a)},L=(t,i,e,r)=>{d.log(t),t==="next"&&e?h({after:n.after+n.limit}):t==="prev"&&i>0?h({after:n.after-n.limit}):t==="goto"&&!isNaN(r)&&h({after:(r-1)*n.limit})},ie=()=>{document.querySelectorAll(".filtered-projects-tag").forEach(i=>{let e=i.querySelector(".filtered-label"),r=i.querySelector(".filter-close-icon"),s=document.querySelector(`[data-categories-option="${e==null?void 0:e.getAttribute("data-value")}"]`);s||(s=document.querySelector(`[data-subcategories-option="${e==null?void 0:e.getAttribute("data-value")}"]`)),d.log(i,r,s),i.addEventListener("click",a=>{s==null||s.click()})})};function re(){let t=document.getElementById("id-categories"),i=document.getElementById("pos-zkevm-categories"),e=document.getElementById("dapps-categories"),r=n.chain,s=n.type;i.style.display="none",t.style.display="none",e.style.display="none",r===l.id&&s===o.solution_providers?(t.style.display="block",i.style.display="none",e.style.display="none"):(r===l.pos||r===l.zkevm)&&s===o.solution_providers?(t.style.display="none",i.style.display="block",e.style.display="none"):(r===l.pos||r===l.zkevm)&&s===o.dapps&&(t.style.display="none",i.style.display="none",e.style.display="block")}var C=()=>{document.querySelectorAll(".filter-search-field.is-in-dd").forEach(e=>{e.value=""}),document.querySelectorAll(" .w-checkbox-input").forEach(e=>{e.classList.remove("w--redirected-checked")})};var S=(t,i,e)=>{document.querySelectorAll(t).forEach(s=>{s.addEventListener("click",e)})},se=t=>{var e,r,s;let i=t.currentTarget.getAttribute("data-tab-name");switch(i){case v.public_chains:h({tab:i,after:0,categories:[],type:o.dapps,chain:l.zkevm}),(e=document.querySelector(`[data-chain-name="${l.zkevm}"]`))==null||e.click();break;case v.app_specific_chains:h({tab:i,after:0,categories:[],type:o.chains,chain:l.cdk}),(r=document.querySelector(`[data-chain-name="${l.cdk}"]`))==null||r.click();break;case v.decentralized_identity:h({tab:i,after:0,categories:[],type:o.dapps,chain:l.id}),(s=document.querySelector(`[data-chain-name="${l.id}"]`))==null||s.click();break}C(),d.log(`Tab selected: ${n.tab}`)},oe=t=>{let i=t.currentTarget.getAttribute("data-chain-name");switch(i){case l.zkevm:case l.pos:h({chain:i,after:0,categories:[],type:o.dapps});break;case l.cdk:h({chain:i,after:0,categories:[],type:o.chains});break;case l.id:h({chain:i,after:0,categories:[],type:o.dapps});break}d.log(`Chain selected: ${n.chain}`);let e=[l.cdk,l.id,l.pos,l.zkevm];R(e.includes(i)),C()},ne=t=>{let i=t.currentTarget.getAttribute("data-type-filter");h({type:i,after:0,categories:[]}),d.log(`Type selected: ${n.type}`),C()},ce=t=>{let i=t.currentTarget.getAttribute("data-sort-filter");h({sort:i,after:0}),d.log(`Sort selected: ${n.sort}`)},ae=t=>{le(e=>{d.log(e);let r=e.target.value;h({query:r,after:0}),d.log(`Query: ${n.query}`)},500)(t)},D=()=>{let i=[v.public_chains,v.app_specific_chains,v.decentralized_identity].map(e=>`[data-tab-name="${e}"]`).join(",");S(i,"tab",se)},j=()=>{let i=[l.zkevm,l.pos,l.id,l.cdk,l.miden].map(e=>`[data-chain-name="${e}"]`).join(",");S(i,"chain",oe)},U=()=>{let i=[o.dapps,o.solution_providers,o.ecosystem_enablers,o.enterprises,o.chains].map(e=>`[data-type-filter="${e}"]`).join(",");S(i,"type",ne)},V=()=>{let i=[b.ascending,b.descending].map(e=>`[data-sort-filter="${e}"]`).join(",");S(i,"sort",ce)};function le(t,i=300){let e;return(...r)=>{clearTimeout(e),e=setTimeout(()=>{t.apply(this,r)},i)}}var Y=()=>{let t="#filter-search";document.querySelector(t).addEventListener("input",ae)},$=(t,i)=>{i.forEach(e=>{var a;let s=(((a=e.textContent)==null?void 0:a.toLowerCase())||"").includes(t.toLowerCase());e.style.display=s?"flex":"none"})},de=t=>{var r;let i=t.currentTarget.value,e=(r=document.querySelector("#pos-zkevm-categories"))==null?void 0:r.querySelectorAll(".filter-checkbox-container");$(i,e),d.log(`Query: ${i}`)},pe=t=>{var r;let i=t.currentTarget.value,e=(r=document.querySelector("#id-categories"))==null?void 0:r.querySelectorAll(".filter-checkbox-container");$(i,e),d.log(`Query: ${i}`)},ue=t=>{var r;let i=t.currentTarget.value,e=(r=document.querySelector("#dapps-categories"))==null?void 0:r.querySelectorAll(".filter-checkbox-container");d.log(i,e),$(i,e),d.log(`Query: ${i}`)},B=t=>{t.preventDefault();let i=t.currentTarget.getAttribute("data-categories-option"),e=[...n.categories];d.log(e),e.includes(i)?e=e.filter(s=>s!==i):e.push(i),h({categories:e,after:0});let r=t.currentTarget.querySelector(".w-checkbox-input");n.categories.includes(i)?r==null||r.classList.add("w--redirected-checked"):r==null||r.classList.remove("w--redirected-checked"),d.log(`Categories selected: ${n.categories}`)},ge=t=>{t.preventDefault();let i=t.currentTarget.getAttribute("data-subcategories-option");i||(i=t.currentTarget.getAttribute("data-categories-option"));let e=[...n.categories];d.log(e),e.includes(i)?e=e.filter(s=>s!==i):e.push(i),h({categories:e,after:0});let r=t.currentTarget.querySelector(".w-checkbox-input");n.categories.includes(i)?r==null||r.classList.add("w--redirected-checked"):r==null||r.classList.remove("w--redirected-checked"),d.log(`Categories selected: ${n.categories}`)},Z=()=>{var y,m,w;let t="#PoS-zkEVM-Categories-Search",i=document.querySelector(t);i==null||i.addEventListener("input",de);let e="#ID-Categories-Search",r=document.querySelector(e);r==null||r.addEventListener("input",pe);let s="#dApps-Categories-Search",a=document.querySelector(s);a==null||a.addEventListener("input",ue);let u=".filter-checkbox-container",p=(y=document.querySelector("#dapps-categories"))==null?void 0:y.querySelectorAll(u);p==null||p.forEach(f=>{f.addEventListener("click",ge)});let c=(m=document.querySelector("#pos-zkevm-categories"))==null?void 0:m.querySelectorAll(u);c==null||c.forEach(f=>{f.addEventListener("click",B)});let g=(w=document.querySelector("#id-categories"))==null?void 0:w.querySelectorAll(u);g==null||g.forEach(f=>{f.addEventListener("click",B)})};var he=()=>{document.addEventListener("filters",function(t){d.log("Event triggered",t),T(),E()})};var me=()=>{D(),j(),U(),V(),Y(),Z()},fe=()=>{var r;let t=document.querySelector(`[data-tab-name="${v.public_chains}"]`),i=document.querySelector(`[data-tab-name="${l.zkevm}"]`),e=document.querySelector(`[data-sort-filter="${b.ascending}"]`);(r=e==null?void 0:e.querySelector(".filter-radiobox"))==null||r.classList.add("w--redirected-checked"),t==null||t.click()},ve=()=>{window.Webflow||(window.Webflow=[]),window.Webflow.push(async()=>{localStorage.getItem("DEBUG_MODE")!=="true"&&(he(),me(),fe(),T(),E())})};ve();})();
