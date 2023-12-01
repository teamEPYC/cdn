"use strict";(()=>{var M="https://explorer-backend-1.onrender.com",g={zkevm:"Polygon zkEVM",pos:"Polygon POS",cdk:"Polygon CDK",id:"Polygon ID",miden:"Polygon Miden"},r={dapps:"dApps",solution_providers:"Solution Providers",ecosystem_enablers:"Ecosystem Enablers",enterprises:"Enterprises",chains:"Chains"},b={ascending:"ascending",descending:"descending"},v={public_chains:"Public Chains",app_specific_chains:"App Specific Chains",decentralized_identity:"Decentralized Identity"},N="#filter-wrapper",x="#list-wrapper",A="#list-news-wrapper",z={"Polygon zkEVM":[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises],"Polygon POS":[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises],"Polygon CDK":[r.chains,r.solution_providers],"Polygon ID":[r.dapps,r.solution_providers]};var n={log:(...e)=>{localStorage.getItem("DEBUG_MODE")==="true"&&console.log(...e)},deep:(...e)=>{localStorage.getItem("DEBUG_MODE")==="true"&&console.dir(...e)},info:(...e)=>{localStorage.getItem("DEBUG_MODE")==="true"&&console.info(...e)},warn:(...e)=>{localStorage.getItem("DEBUG_MODE")==="true"&&console.warn(...e)},error:(...e)=>{localStorage.getItem("DEBUG_MODE")==="true"&&console.error(...e)}};var te=e=>Object.entries(e).map(([t,o])=>Array.isArray(o)?o.map(i=>`${encodeURIComponent(t)}=${encodeURIComponent(i)}`).join("&"):`${encodeURIComponent(t)}=${encodeURIComponent(o)}`).join("&"),oe=async(e,t,o)=>{let i={method:t,headers:{"Content-Type":"application/json"}};o&&(i.body=o);let c=await(await fetch(`${M}/${e}`,i)).json();return n.deep(c),c},P=async e=>{n.deep(e);let t=te(e);return oe(`companies?${t}`,"GET")};function ie(e={},t="store"){let o=0;function i(p,d){let l=new CustomEvent(p,{bubbles:!0,cancelable:!0,detail:d});o>0&&(document.dispatchEvent(l),o=0)}function s(p,d){return{get:function(l,u){return u==="_isProxy"?!0:(["object","array"].includes(Object.prototype.toString.call(l[u]).slice(8,-1).toLowerCase())&&!l[u]._isProxy&&(l[u]=new Proxy(l[u],s(p,d))),l[u])},set:function(l,u,y){return l[u]===y||(l[u]=y,o+=1),!0},deleteProperty:function(l,u){return delete l[u],o+=1,!0}}}let c=p=>{n.log("ran setState");for(let d in p)p.hasOwnProperty(d)&&(e[d]=p[d]);o+=1,i(t,e)};return{state:new Proxy(e,s(t,e)),setState:c}}var{state:a,setState:h}=ie({tab:v.public_chains,chain:g.zkevm,type:r.dapps,categories:[],sort:"ascending",query:"",after:0,limit:9},"filters");var O=e=>{let t=a.categories;return`
  <div class="filtered-projects-container">
  <div class="text-size-med text-gray6">
    <span class="filter-number-text">${e} projects</span> 
  ${t&&t.length>0?"filtered by":""}
  </div>
  ${t&&t.length>0?t.map(i=>`<div class="filtered-projects-tags-container">
    <div class="filtered-projects-tag">
      <div class="filtered-label" data-value="${i}">${i.split("_")[1]||i}</div>
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
`},R=e=>`
  <div fs-cmsnest-element="list-2" role="list" class="items-cl w-dyn-items">${e.map(i=>se(i)).join("")}</div>`,se=e=>{let{id:t,name:o,description:i,icon:s,cardBackground:c,twitterHandle:p,githubRepo:d,category:l,subCategories:u,discordServer:y,telegramChannel:f,coingeckoLink:w,websiteLink:m,linkedinLink:_e,spnProfile:q}=e;return`<div role="listitem" class="items-ci w-dyn-item">
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
          <h3 class="text-h3">${o}</h3>
        ${l?`<div class= "item-tags">${l.map(k=>`<div class="items-tag is-primary" > ${k} </div >`).join("")} </div>`:""}
        ${u?`<div class="item-tags"> ${u.map(k=>`<div class="items-tag">${k}</div>`).join("")}</div >`:""}
        </div>
      </div>
    </div>
    <div
      style="
        background-image: url('${c}');
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg)
          rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        display: none;
      "
      class="items-card-hover-content"
    >
      <div class="item-card-link">
        <h3 class="text-h3">${o}</h3>
        <p class="text-size-med is-item-card-desc">
          ${i}
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
              ${i}
            </div>
          </div>
        </div>
      </div>
      <div class="items-links-wrapper">
        <div class="items-social-links-wrapper">
          ${m?`<a
            href="${m}"
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
        ${q?`<a href="${q}" class="featured-item-link w-inline-block"
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

`},H=(e,t)=>{let o=a.after,i=a.limit,s=3,c=[],p=parseInt(o/i)+1,d=parseInt((e-1)/i)+1;c.push(1),p>3&&c.push("...");let l=Math.max(p-Math.floor(s/2),2),u=Math.min(l+s-1,d-1);u-l<s-2&&(l=Math.max(u-s+2,2));for(let f=l;f<=u;f++)c.push(f);return u<d-1&&c.push("..."),d>1&&c.push(d),`
        <div class="pagination-wrapper">
  <button
    class="pagination-btn is-previous w-inline-block ${o?"":"is-disabled"}"
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

  ${c.map(f=>`<button class="pagination-link ${f===p?"w--current":""}"> ${f}</button>`).join("")}
  <button
    class="pagination-btn is-next w-inline-block ${t?"":"is-disabled"}"
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
    `},B=()=>{let e=a.query;return`<div class="no-results-wrapper">
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
`};var D=(e,t)=>{let o=document.querySelector(e);o?o.innerHTML=t:n.warn(`Unable to find the DOM element with identifier ${e}`)},ne=async(e,t,o)=>{var u,y,f;let i="";if(e&&e.length>0){let w=R(e),m=H(t,o);i=w+m}else i=B();let s=O(t);D("#filter-count",s),D(x,i);let c=(u=document.querySelector(x))==null?void 0:u.querySelector(".is-previous"),p=(y=document.querySelector(x))==null?void 0:y.querySelector(".is-next"),d=(f=document.querySelector(x))==null?void 0:f.querySelectorAll(".pagination-link"),l=a.after;c==null||c.addEventListener("click",()=>I("prev",l,o,0)),p==null||p.addEventListener("click",()=>I("next",l,o,0)),d==null||d.forEach(w=>{let m=parseInt(w.textContent);w.addEventListener("click",()=>I("goto",l,o,m))}),le(),de()},F=e=>{let t=document.querySelector(N),o=document.querySelector(A);t&&o&&(e?(t.style.display="block",o.style.display="flex"):(t.style.display="none",o.style.display="none"))},ce=()=>{let t=[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(s=>document.querySelector(`[data-type-filter="${s}"]`)),o=a.chain,i=z[o];t.forEach(s=>{let c=s.getAttribute("data-type-filter");i.includes(c)?s.style.display="block":s.style.display="none"})},ae=()=>{let e=a.type;[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(i=>document.querySelector(`[data-type-filter="${i}"]`)).forEach(i=>{var c,p,d,l;(c=i==null?void 0:i.querySelector(".w-radio-input"))==null||c.classList.remove("w--redirected-checked","w--redirected-focus"),(p=i==null?void 0:i.querySelector(".filter-radio-label"))==null||p.classList.remove("is-active");let s=i.getAttribute("data-type-filter");e===s&&((d=i==null?void 0:i.querySelector(".w-radio-input"))==null||d.classList.add("w--redirected-checked"),(l=i==null?void 0:i.querySelector(".filter-radio-label"))==null||l.classList.add("is-active"))})},L=async()=>{n.log("Updating Filters"),ce(),ae()},T=async()=>{n.log("Updating List");let e={chain:a.chain,type:a.type,categories:a.categories,query:a.query,sort:a.sort,after:a.after,limit:a.limit},t=await P(e),{success:o,status:i,data:s,error:c}=t;if(o){let{total:p,records:d,has_more:l}=s;ne(d,p,l)}else n.warn(c)},I=(e,t,o,i)=>{n.log(e),e==="next"&&o?h({after:a.after+a.limit}):e==="prev"&&t>0?h({after:a.after-a.limit}):e==="goto"&&!isNaN(i)&&h({after:(i-1)*a.limit})},le=()=>{document.querySelectorAll(".filtered-projects-tag").forEach(t=>{let o=t.querySelector(".filtered-label"),i=t.querySelector(".filter-close-icon"),s=document.querySelector(`[data-categories-option="${o==null?void 0:o.getAttribute("data-value")}"]`);s||(s=document.querySelector(`[data-subcategories-option="${o==null?void 0:o.getAttribute("data-value")}"]`)),n.log(t,i,s),t.addEventListener("click",c=>{s==null||s.click()})})};function de(){let e=document.getElementById("id-categories"),t=document.getElementById("pos-zkevm-categories"),o=document.getElementById("dapps-categories"),i=a.chain,s=a.type;t.style.display="none",e.style.display="none",o.style.display="none",i===g.id&&s===r.solution_providers?(e.style.display="block",t.style.display="none",o.style.display="none"):(i===g.pos||i===g.zkevm)&&s===r.solution_providers?(e.style.display="none",t.style.display="block",o.style.display="none"):(i===g.pos||i===g.zkevm)&&s===r.dapps&&(e.style.display="none",t.style.display="none",o.style.display="block")}var S=()=>{document.querySelectorAll(".filter-search-field.is-in-dd").forEach(o=>{o.value=""}),document.querySelectorAll(" .w-checkbox-input").forEach(o=>{o.classList.remove("w--redirected-checked")})};var C=(e,t,o)=>{document.querySelectorAll(e).forEach(s=>{s.addEventListener("click",o)})},ge=e=>{var o,i,s;let t=e.currentTarget.getAttribute("data-tab-name");switch(t){case v.public_chains:h({tab:t,after:0,categories:[],type:r.dapps,chain:g.zkevm}),(o=document.querySelector(`[data-chain-name="${g.zkevm}"]`))==null||o.click();break;case v.app_specific_chains:h({tab:t,after:0,categories:[],type:r.chains,chain:g.cdk}),(i=document.querySelector(`[data-chain-name="${g.cdk}"]`))==null||i.click();break;case v.decentralized_identity:h({tab:t,after:0,categories:[],type:r.dapps,chain:g.id}),(s=document.querySelector(`[data-chain-name="${g.id}"]`))==null||s.click();break}S(),n.log(`Tab selected: ${a.tab}`)},pe=e=>{let t=e.currentTarget.getAttribute("data-chain-name");switch(t){case g.zkevm:case g.pos:h({chain:t,after:0,categories:[],type:r.dapps});break;case g.cdk:h({chain:t,after:0,categories:[],type:r.chains});break;case g.id:h({chain:t,after:0,categories:[],type:r.dapps});break}n.log(`Chain selected: ${a.chain}`);let o=[g.cdk,g.id,g.pos,g.zkevm];F(o.includes(t)),S()},ue=e=>{let t=e.currentTarget.getAttribute("data-type-filter");h({type:t,after:0,categories:[]}),n.log(`Type selected: ${a.type}`),S()},he=e=>{let t=e.currentTarget.getAttribute("data-sort-filter");h({sort:t,after:0}),n.log(`Sort selected: ${a.sort}`)},fe=e=>{me(o=>{n.log(o);let i=o.target.value;h({query:i,after:0}),n.log(`Query: ${a.query}`)},500)(e)},j=()=>{let t=[v.public_chains,v.app_specific_chains,v.decentralized_identity].map(o=>`[data-tab-name="${o}"]`).join(",");C(t,"tab",ge)},V=()=>{let t=[g.zkevm,g.pos,g.id,g.cdk,g.miden].map(o=>`[data-chain-name="${o}"]`).join(",");C(t,"chain",pe)},Y=()=>{let t=[r.dapps,r.solution_providers,r.ecosystem_enablers,r.enterprises,r.chains].map(o=>`[data-type-filter="${o}"]`).join(",");C(t,"type",ue)},G=()=>{let t=[b.ascending,b.descending].map(o=>`[data-sort-filter="${o}"]`).join(",");C(t,"sort",he)};function me(e,t=300){let o;return(...i)=>{clearTimeout(o),o=setTimeout(()=>{e.apply(this,i)},t)}}var Z=()=>{let e="#filter-search";document.querySelector(e).addEventListener("input",fe)},E=(e,t)=>{t.forEach(o=>{var c;let s=(((c=o.textContent)==null?void 0:c.toLowerCase())||"").includes(e.toLowerCase());o.style.display=s?"flex":"none"})},ve=e=>{var i;let t=e.currentTarget.value,o=(i=document.querySelector("#pos-zkevm-categories"))==null?void 0:i.querySelectorAll(".filter-checkbox-container");E(t,o),n.log(`Query: ${t}`)},ye=e=>{var i;let t=e.currentTarget.value,o=(i=document.querySelector("#id-categories"))==null?void 0:i.querySelectorAll(".filter-checkbox-container");E(t,o),n.log(`Query: ${t}`)},we=e=>{var i;let t=e.currentTarget.value,o=(i=document.querySelector("#dapps-categories"))==null?void 0:i.querySelectorAll(".filter-checkbox-container");n.log(t,o),E(t,o),n.log(`Query: ${t}`)},U=e=>{e.preventDefault();let t=e.currentTarget.getAttribute("data-categories-option"),o=[...a.categories];n.log(o),o.includes(t)?o=o.filter(s=>s!==t):o.push(t),h({categories:o,after:0});let i=e.currentTarget.querySelector(".w-checkbox-input");a.categories.includes(t)?i==null||i.classList.add("w--redirected-checked"):i==null||i.classList.remove("w--redirected-checked"),n.log(`Categories selected: ${a.categories}`)},be=e=>{e.preventDefault();let t=e.currentTarget.getAttribute("data-subcategories-option");t||(t=e.currentTarget.getAttribute("data-categories-option"));let o=[...a.categories];n.log(o),o.includes(t)?o=o.filter(s=>s!==t):o.push(t),h({categories:o,after:0});let i=e.currentTarget.querySelector(".w-checkbox-input");a.categories.includes(t)?i==null||i.classList.add("w--redirected-checked"):i==null||i.classList.remove("w--redirected-checked"),n.log(`Categories selected: ${a.categories}`)},Q=()=>{var y,f,w;let e="#PoS-zkEVM-Categories-Search",t=document.querySelector(e);t==null||t.addEventListener("input",ve);let o="#ID-Categories-Search",i=document.querySelector(o);i==null||i.addEventListener("input",ye);let s="#dApps-Categories-Search",c=document.querySelector(s);c==null||c.addEventListener("input",we);let p=".filter-checkbox-container",d=(y=document.querySelector("#dapps-categories"))==null?void 0:y.querySelectorAll(p);d==null||d.forEach(m=>{m.addEventListener("click",be)});let l=(f=document.querySelector("#pos-zkevm-categories"))==null?void 0:f.querySelectorAll(p);l==null||l.forEach(m=>{m.addEventListener("click",U)});let u=(w=document.querySelector("#id-categories"))==null?void 0:w.querySelectorAll(p);u==null||u.forEach(m=>{m.addEventListener("click",U)})};var X="https://ecosystem-staging-api.polygon.technology",_="https://ecosystem-staging.polygon.technology",xe="https://ecosystem.polygon.technology",Se="#log-in-btn",Ce="#log-out-btn",ke="#sign-up-btn",W="#user-logged-in",J="#user-not-logged-in";var K=async()=>{try{let t=await(await fetch(`${X}/auth/sessionRefresh`,{credentials:"include"})).json();n.log("session refreshed: ",t)}catch(e){n.log(e)}},Ie=async(e,t,o)=>{try{let i=await fetch(`${X}/auth/sessionCheck`,{credentials:"include"}),s=await i.json();if(n.log(i,s),s.success){n.log("session validated"),e(s.data),await K();let c=localStorage.getItem("sessionRefreshIntervalId");c&&(clearInterval(Number(c)),localStorage.removeItem("sessionRefreshIntervalId"));let p=setInterval(K,60*30*1e3);localStorage.setItem("sessionRefreshIntervalId",JSON.stringify(p)),window.addEventListener("beforeunload",()=>{let d=localStorage.getItem("sessionRefreshIntervalId");d&&(clearInterval(Number(d)),localStorage.removeItem("sessionRefreshIntervalId"))})}else t()}catch(i){n.log(i),o()}},ee=()=>{let e=o=>{n.log("Showing authenticatedView"),$(J).hide(),$(W).show();let{userId:i}=o;console.log(i),i&&$("#view-profile").attr("href",`${xe}/${i}`)},t=()=>{n.log("Showing unauthenticatedView"),$(W).hide(),$(J).show()};$(ke).attr("href",`${_}/signup/?redirect=${encodeURIComponent(window.location.href)}&operation=login`),$(Se).attr("href",`${_}/login/?redirect=${encodeURIComponent(window.location.href)}&operation=login`),$(Ce).attr("href",`${_}/login/?redirect=${encodeURIComponent(window.location.href)}&operation=logout`),Ie(e,t,t)};var Le=()=>{document.addEventListener("filters",function(e){n.log("Event triggered",e),L(),T()})};var Te=()=>{j(),V(),Y(),G(),Z(),Q()},$e=()=>{var i;let e=document.querySelector(`[data-tab-name="${v.public_chains}"]`),t=document.querySelector(`[data-tab-name="${g.zkevm}"]`),o=document.querySelector(`[data-sort-filter="${b.ascending}"]`);(i=o==null?void 0:o.querySelector(".filter-radiobox"))==null||i.classList.add("w--redirected-checked"),e==null||e.click()},Ee=()=>{window.Webflow||(window.Webflow=[]),window.Webflow.push(async()=>{localStorage.getItem("USE_LOCAL")!=="true"&&(ee(),Le(),Te(),$e(),L(),T())})};Ee();})();
