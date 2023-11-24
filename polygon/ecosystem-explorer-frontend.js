"use strict";(()=>{var E="https://explorer-backend-1.onrender.com",l={zkevm:"Polygon zkEVM",pos:"Polygon POS",cdk:"Polygon CDK",id:"Polygon ID",miden:"Polygon Miden"},r={dapps:"dApps",solution_providers:"Solution Providers",ecosystem_enablers:"Ecosystem Enablers",enterprises:"Enterprises",chains:"Chains"},x={ascending:"ascending",descending:"descending"},m={public_chains:"Public Chains",app_specific_chains:"App Specific Chains",decentralized_identity:"Decentralized Identity"},_="#filter-wrapper",b="#list-wrapper",N="#list-news-wrapper",q={"Polygon zkEVM":[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises],"Polygon POS":[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises],"Polygon CDK":[r.chains,r.solution_providers],"Polygon ID":[r.dapps,r.solution_providers]};function Z(e={},i="store"){let t=0;function s(p,d){let c=new CustomEvent(p,{bubbles:!0,cancelable:!0,detail:d});t>0&&(document.dispatchEvent(c),t=0)}function o(p,d){return{get:function(c,g){return g==="_isProxy"?!0:(["object","array"].includes(Object.prototype.toString.call(c[g]).slice(8,-1).toLowerCase())&&!c[g]._isProxy&&(c[g]=new Proxy(c[g],o(p,d))),c[g])},set:function(c,g,f){return c[g]===f||(c[g]=f,t+=1),!0},deleteProperty:function(c,g){return delete c[g],t+=1,!0}}}let a=p=>{console.log("ran setState");for(let d in p)p.hasOwnProperty(d)&&(e[d]=p[d]);t+=1,s(i,e)};return{state:new Proxy(e,o(i,e)),setState:a}}var{state:n,setState:h}=Z({tab:m.public_chains,chain:l.zkevm,type:r.dapps,categories:[],sort:"ascending",query:"",after:0,limit:9},"filters");var u={log:e=>{console.log(e)},deep:e=>{console.dir(e)},info:e=>{console.info(e)},warn:e=>{console.warn(e)},error:e=>{console.error(e)}};var W=e=>Object.entries(e).map(([i,t])=>Array.isArray(t)?t.map(s=>`${encodeURIComponent(i)}=${encodeURIComponent(s)}`).join("&"):`${encodeURIComponent(i)}=${encodeURIComponent(t)}`).join("&"),Q=async(e,i,t)=>{let s={method:i,headers:{"Content-Type":"application/json"}};t&&(s.body=t);let a=await(await fetch(`${E}/${e}`,s)).json();return u.deep(a),a},M=async e=>{u.deep(e);let i=W(e);return Q(`companies?${i}`,"GET")};var P=e=>{let i=n.categories;return`
  <div class="filtered-projects-container">
  <div class="text-size-med text-gray6">
    <span class="filter-number-text">${e} projects</span> 
  ${i&&i.length>0?"filtered by":""}
  </div>
  ${i&&i.length>0?i.map(s=>`<div class="filtered-projects-tags-container">
    <div class="filtered-projects-tag">
      <div class="filtered-label">${s}</div>
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
`},z=e=>`
  <div fs-cmsnest-element="list-2" role="list" class="items-cl w-dyn-items">${e.map(s=>J(s)).join("")}</div>`,J=e=>{let{id:i,name:t,description:s,icon:o,cardBackground:a,twitterHandle:p,githubRepo:d,category:c,subCategories:g,discordServer:f,telegramChannel:v,coingeckoLink:w,websiteLink:y,linkedinLink:me,spnProfile:$}=e;return`<div role="listitem" class="items-ci w-dyn-item">
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
          src="${o}"
          class="item-icon-img"
        />
        <div class="item-name-tags">
          <h3 class="text-h3">${t}</h3>
        ${c?`<div class= "item-tags">${c.map(S=>`<div class="items-tag is-primary" > ${S} </div >`).join("")} </div>`:""}
        ${g?`<div class="item-tags"> ${g.map(S=>`<div class="items-tag">${S}</div>`).join("")}</div >`:""}
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
        <h3 class="text-h3">${t}</h3>
        <p class="text-size-med is-item-card-desc">
          ${s}
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
              ${s}
            </div>
          </div>
        </div>
      </div>
      <div class="items-links-wrapper">
        <div class="items-social-links-wrapper">
          ${y?`<a
            href="${y}"
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
          ${p?`<a
            href="${p}"
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
          >`:""}${d?`<a
            href="${d}"
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
        ${$?`<a href="${$}" class="featured-item-link w-inline-block"
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

`},A=(e,i)=>{let t=n.after,s=n.limit,o=3,a=[],p=parseInt(t/s)+1,d=parseInt(e/s)+1;a.push(1),p>3&&a.push("...");let c=Math.max(p-Math.floor(o/2),2),g=Math.min(c+o-1,d-1);g-c<o-2&&(c=Math.max(g-o+2,2));for(let v=c;v<=g;v++)a.push(v);return g<d-1&&a.push("..."),d>1&&a.push(d),`
        <div class="pagination-wrapper">
  <button
    class="pagination-btn is-previous w-inline-block ${t?"":"is-disabled"}"
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

  ${a.map(v=>`<button class="pagination-link ${v===p?"w--current":""}"> ${v}</button>`).join("")}
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
    `},H=()=>{let e=n.query;return`<div class="no-results-wrapper">
  <div class="no-results-abs-overlay">
    <img
      src="https://assets-global.website-files.com/652772322237331bccec35f0/655dc0be222b8fc5ca76f1fa_no-results-icon.svg"
      loading="lazy"
      alt=""
      class="no-results-icon"
    />
    <div class="spacer-1"></div>
    ${e?`<div class="text-size-large">
          No results for \u201C<span id="no-results-search-text">${e}</span>\u201D
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
`};var O=(e,i)=>{let t=document.querySelector(e);t?t.innerHTML=i:u.warn(`Unable to find the DOM element with identifier ${e}`)},K=async(e,i,t)=>{var g,f,v;let s="";if(e.length>0){let w=z(e),y=A(i,t);s=w+y}else s=H();let o=P(i);O("#filter-count",o),O(b,s);let a=(g=document.querySelector(b))==null?void 0:g.querySelector(".is-previous"),p=(f=document.querySelector(b))==null?void 0:f.querySelector(".is-next"),d=(v=document.querySelector(b))==null?void 0:v.querySelectorAll(".pagination-link"),c=n.after;a==null||a.addEventListener("click",()=>L("prev",c,t,0)),p==null||p.addEventListener("click",()=>L("next",c,t,0)),d==null||d.forEach(w=>{let y=parseInt(w.textContent);w.addEventListener("click",()=>L("goto",c,t,y))}),ee(),te()},R=e=>{let i=document.querySelector(_),t=document.querySelector(N);i&&t&&(e?(i.style.display="block",t.style.display="flex"):(i.style.display="none",t.style.display="none"))},X=()=>{let i=[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(o=>document.querySelector(`[data-type-filter="${o}"]`)),t=n.chain,s=q[t];i.forEach(o=>{let a=o.getAttribute("data-type-filter");s.includes(a)?o.style.display="block":o.style.display="none"})},G=()=>{let e=n.type;[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(s=>document.querySelector(`[data-type-filter="${s}"]`)).forEach(s=>{var a,p,d,c;(a=s==null?void 0:s.querySelector(".w-radio-input"))==null||a.classList.remove("w--redirected-checked","w--redirected-focus"),(p=s==null?void 0:s.querySelector(".filter-radio-label"))==null||p.classList.remove("is-active");let o=s.getAttribute("data-type-filter");e===o&&((d=s==null?void 0:s.querySelector(".w-radio-input"))==null||d.classList.add("w--redirected-checked"),(c=s==null?void 0:s.querySelector(".filter-radio-label"))==null||c.classList.add("is-active"))})},T=async()=>{u.log("Updating Filters"),X(),G()},I=async()=>{u.log("Updating List");let e={chain:n.chain,type:n.type,categories:n.categories,query:n.query,sort:n.sort,after:n.after,limit:n.limit},i=await M(e),{success:t,status:s,data:o,error:a}=i;if(t){let{total:p,records:d,has_more:c}=o;K(d,p,c)}else u.warn(a)},L=(e,i,t,s)=>{u.log(e),e==="next"&&t?h({after:n.after+n.limit}):e==="prev"&&i>0?h({after:n.after-n.limit}):e==="goto"&&!isNaN(s)&&h({after:(s-1)*n.limit})},ee=()=>{let e=document.querySelectorAll(".filtered-projects-tag");console.log(e),e.forEach(i=>{console.log(i);let t=i.querySelector(".filtered-label"),s=i.querySelector(".filter-close-icon"),o=document.querySelector(`[data-categories-option="${t==null?void 0:t.textContent}"]`);console.log(i,s,o),i.addEventListener("click",a=>{console.log("removing filter"),o==null||o.click()})})};function te(){let e=document.getElementById("id-categories"),i=document.getElementById("pos-zkevm-categories"),t=n.chain,s=n.type;i.style.display="none",e.style.display="none",console.log(e,i,t,s),t===l.id&&s===r.solution_providers?(e.style.display="block",i.style.display="none"):(t===l.pos||t===l.zkevm)&&s===r.solution_providers&&(e.style.display="none",i.style.display="block")}var k=()=>{document.querySelectorAll(".filter-search-field.is-in-dd").forEach(t=>{console.log(t),t.value=""}),document.querySelectorAll(" .filter-checkbox").forEach(t=>{t.classList.remove("w--redirected-checked")})};var C=(e,i,t)=>{document.querySelectorAll(e).forEach(o=>{o.addEventListener("click",t)})},ie=e=>{var t,s,o;let i=e.currentTarget.getAttribute("data-tab-name");switch(h({tab:i,after:0,categories:[]}),i){case m.public_chains:h({type:r.dapps}),(t=document.querySelector(`[data-chain-name="${l.zkevm}"]`))==null||t.click();break;case m.app_specific_chains:h({type:r.chains}),(s=document.querySelector(`[data-chain-name="${l.cdk}"]`))==null||s.click();break;case m.decentralized_identity:h({type:r.dapps}),(o=document.querySelector(`[data-chain-name="${l.id}"]`))==null||o.click();break}k(),u.log(`Tab selected: ${n.tab}`)},se=e=>{let i=e.currentTarget.getAttribute("data-chain-name");switch(h({chain:i,after:0,categories:[]}),i){case l.zkevm:case l.pos:h({type:r.dapps});break;case l.cdk:h({type:r.chains});break;case l.id:h({type:r.dapps});break}u.log(`Chain selected: ${n.chain}`);let t=[l.cdk,l.id,l.pos,l.zkevm];R(t.includes(i)),k()},re=e=>{let i=e.currentTarget.getAttribute("data-type-filter");h({type:i,after:0,categories:[]}),u.log(`Type selected: ${n.type}`),k()},oe=e=>{let i=e.currentTarget.getAttribute("data-sort-filter");h({sort:i,after:0}),u.log(`Sort selected: ${n.sort}`)},ne=e=>{let i=ce(t=>{console.log(t);let s=t.target.value;h({query:s,after:0}),u.log(`Query: ${n.query}`)},500);console.log(e),i(e)},F=()=>{let i=[m.public_chains,m.app_specific_chains,m.decentralized_identity].map(t=>`[data-tab-name="${t}"]`).join(",");C(i,"tab",ie)},j=()=>{let i=[l.zkevm,l.pos,l.id,l.cdk,l.miden].map(t=>`[data-chain-name="${t}"]`).join(",");C(i,"chain",se)},B=()=>{let i=[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(t=>`[data-type-filter="${t}"]`).join(",");C(i,"type",re)},D=()=>{let i=[x.ascending,x.descending].map(t=>`[data-sort-filter="${t}"]`).join(",");C(i,"sort",oe)};function ce(e,i=300){let t;return(...s)=>{clearTimeout(t),t=setTimeout(()=>{e.apply(this,s)},i)}}var U=()=>{let e="#filter-search";document.querySelector(e).addEventListener("input",ne)},V=(e,i)=>{i.forEach(t=>{var a;let o=(((a=t.textContent)==null?void 0:a.toLowerCase())||"").includes(e.toLowerCase());t.style.display=o?"flex":"none"})},ae=e=>{var s;let i=e.currentTarget.value,t=(s=document.querySelector("#pos-zkevm-categories"))==null?void 0:s.querySelectorAll(".filter-checkbox-container");console.log(i,t),V(i,t),u.log(`Query: ${i}`)},le=e=>{var s;let i=e.currentTarget.value,t=(s=document.querySelector("#id-categories"))==null?void 0:s.querySelectorAll(".filter-checkbox-container");console.log(i,t),V(i,t),u.log(`Query: ${i}`)},de=e=>{e.preventDefault();let i=e.currentTarget.getAttribute("data-categories-option"),t=[...n.categories];console.log(t),t.includes(i)?t=t.filter(o=>o!==i):t.push(i),h({categories:t,after:0});let s=e.currentTarget.querySelector(".w-checkbox-input");n.categories.includes(i)?s==null||s.classList.add("w--redirected-checked"):s==null||s.classList.remove("w--redirected-checked"),u.log(`Categories selected: ${n.categories}`)},Y=()=>{let e="#PoS-zkEVM-Categories-Search",i=document.querySelector(e);i==null||i.addEventListener("input",ae);let t="#ID-Categories-Search",s=document.querySelector(t);s==null||s.addEventListener("input",le),C(".filter-checkbox-container","click",de)};var pe=()=>{document.addEventListener("filters",function(e){console.log("Event triggered",e),T(),I()})},ge=()=>{F(),j(),B(),D(),U(),Y()},ue=()=>{var s;let e=document.querySelector(`[data-tab-name="${m.public_chains}"]`),i=document.querySelector(`[data-tab-name="${l.zkevm}"]`),t=document.querySelector(`[data-sort-filter="${x.ascending}"]`);(s=t==null?void 0:t.querySelector(".filter-radiobox"))==null||s.classList.add("w--redirected-checked"),e==null||e.click()},he=()=>{window.Webflow||(window.Webflow=[]),window.Webflow.push(async()=>{pe(),ge(),ue(),T(),I()})};he();})();
