"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/constants.ts
  var BASE_URL = "https://explorer-backend-1.onrender.com";
  var CHAINS = {
    zkevm: "Polygon zkEVM",
    pos: "Polygon POS",
    cdk: "Polygon CDK",
    id: "Polygon ID",
    miden: "Polygon Miden"
  };
  var TYPES = {
    dapps: "dApps",
    solution_providers: "Solution Providers",
    ecosystem_enablers: "Ecosystem Enablers",
    enterprises: "Enterprises",
    chains: "Chains"
  };
  var SORTS = { ascending: "ascending", descending: "descending" };
  var TABS = {
    public_chains: "Public Chains",
    app_specific_chains: "App Specific Chains",
    decentralized_identity: "Decentralized Identity"
  };
  var FILTERS_CONTAINER_IDENTIFIER = "#filter-wrapper";
  var LIST_CONTAINER_IDENTIFIER = "#list-wrapper";
  var LIST_NEWS_CONTAINER_IDENTIFIER = "#list-news-wrapper";
  var CHAIN_TYPE_OPTIONS = {
    "Polygon zkEVM": [
      TYPES.dapps,
      TYPES.solution_providers,
      TYPES.ecosystem_enablers,
      TYPES.enterprises
    ],
    "Polygon POS": [
      TYPES.dapps,
      TYPES.solution_providers,
      TYPES.ecosystem_enablers,
      TYPES.enterprises
    ],
    "Polygon CDK": [TYPES.chains, TYPES.solution_providers],
    "Polygon ID": [TYPES.dapps, TYPES.solution_providers]
  };

  // src/state.ts
  function store(data = {}, name = "store") {
    let changeCount = 0;
    function emit(type, detail) {
      const event = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail
      });
      if (changeCount > 0) {
        document.dispatchEvent(event);
        changeCount = 0;
      }
    }
    function handler(name2, data2) {
      return {
        get: function(obj, prop) {
          if (prop === "_isProxy")
            return true;
          if (["object", "array"].includes(
            Object.prototype.toString.call(obj[prop]).slice(8, -1).toLowerCase()
          ) && !obj[prop]._isProxy) {
            obj[prop] = new Proxy(obj[prop], handler(name2, data2));
          }
          return obj[prop];
        },
        set: function(obj, prop, value) {
          if (obj[prop] === value)
            return true;
          obj[prop] = value;
          changeCount += 1;
          return true;
        },
        deleteProperty: function(obj, prop) {
          delete obj[prop];
          changeCount += 1;
          return true;
        }
      };
    }
    const setState2 = (newData) => {
      console.log("ran setState");
      for (const prop in newData) {
        if (newData.hasOwnProperty(prop)) {
          data[prop] = newData[prop];
        }
      }
      changeCount += 1;
      emit(name, data);
    };
    return { state: new Proxy(data, handler(name, data)), setState: setState2 };
  }
  var { state, setState } = store(
    {
      tab: TABS.public_chains,
      chain: CHAINS.zkevm,
      type: TYPES.dapps,
      categories: [],
      sort: "ascending",
      query: "",
      after: 0,
      limit: 9
    },
    "filters"
  );

  // src/utils/logger.ts
  var logger = {
    log: (data) => {
      console.log(data);
    },
    deep: (data) => {
      console.dir(data);
    },
    info: (data) => {
      console.info(data);
    },
    warn: (data) => {
      console.warn(data);
    },
    error: (data) => {
      console.error(data);
    }
  };

  // src/utils/data.ts
  var buildQueryString = (params) => {
    return Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((element) => `${encodeURIComponent(key)}=${encodeURIComponent(element)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
  };
  var fetchData = async (url, method, body) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };
    if (body) {
      options.body = body;
    }
    const response = await fetch(`${BASE_URL}/${url}`, options);
    const responseJSON = await response.json();
    logger.deep(responseJSON);
    return responseJSON;
  };
  var getCompanies = async (params) => {
    logger.deep(params);
    const queryString = buildQueryString(params);
    return fetchData(`companies?${queryString}`, "GET");
  };

  // src/utils/template.ts
  var generateFiltersHTML = (total) => {
    const categories = state["categories"];
    const innerHTML = `
  <div class="filtered-projects-container">
  <div class="text-size-med text-gray6">
    <span class="filter-number-text">${total} projects</span> 
  ${categories && categories.length > 0 ? "filtered by" : ""}
  </div>
  ${categories && categories.length > 0 ? categories.map(
      (category) => `<div class="filtered-projects-tags-container">
    <div class="filtered-projects-tag">
      <div class="filtered-label">${category}</div>
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
    </div>`
    ).join("") : ""}
    </div>
  </div>
</div>
`;
    return innerHTML;
  };
  var generateListHTML = (data) => {
    const elements = data.map((item) => {
      return generateListItemHTML(item);
    });
    const innerHTML = `
  <div fs-cmsnest-element="list-2" role="list" class="items-cl w-dyn-items">${elements.join(
      ""
    )}</div>`;
    return innerHTML;
  };
  var generateListItemHTML = (item) => {
    const {
      id,
      name,
      description,
      icon,
      cardBackground,
      twitterHandle,
      githubRepo,
      category,
      subCategories,
      discordServer,
      telegramChannel,
      coingeckoLink,
      websiteLink,
      linkedinLink,
      spnProfile
    } = item;
    return `<div role="listitem" class="items-ci w-dyn-item">
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
          src="${icon}"
          class="item-icon-img"
        />
        <div class="item-name-tags">
          <h3 class="text-h3">${name}</h3>
        ${category ? `<div class= "item-tags">${category.map((cat) => {
      return `<div class="items-tag is-primary" > ${cat} </div >`;
    }).join("")} </div>` : ""}
        ${subCategories ? `<div class="item-tags"> ${subCategories.map((sub) => {
      return `<div class="items-tag">${sub}</div>`;
    }).join("")}</div >` : ""}
        </div>
      </div>
    </div>
    <div
      style="
        background-image: url('${cardBackground}');
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg)
          rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        display: none;
      "
      class="items-card-hover-content"
    >
      <div class="item-card-link">
        <h3 class="text-h3">${name}</h3>
        <p class="text-size-med is-item-card-desc">
          ${description}
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
              ${description}
            </div>
          </div>
        </div>
      </div>
      <div class="items-links-wrapper">
        <div class="items-social-links-wrapper">
          ${websiteLink ? `<a
            href="${websiteLink}"
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
          >` : ""}
          ${twitterHandle ? `<a
            href="${twitterHandle}"
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
          >` : ""}${githubRepo ? `<a
            href="${githubRepo}"
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
          ></a>` : ""}
        </div>
        ${spnProfile ? `<a href="${spnProfile}" class="featured-item-link w-inline-block"
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
        ></a>` : ""}
      </div>
    </div>
  </div>
</div>

`;
  };
  var generatePaginationHTML = (total, hasMore) => {
    const after = state["after"];
    const limit = state["limit"];
    const maxPagesToShow = 3;
    const pages = [];
    const currentPageIndex = parseInt(after / limit) + 1;
    const totalPages = parseInt(total / limit) + 1;
    pages.push(1);
    if (currentPageIndex > 3) {
      pages.push("...");
    }
    let startPage = Math.max(currentPageIndex - Math.floor(maxPagesToShow / 2), 2);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);
    if (endPage - startPage < maxPagesToShow - 2) {
      startPage = Math.max(endPage - maxPagesToShow + 2, 2);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    const innerHTML = `
        <div class="pagination-wrapper">
  <button
    class="pagination-btn is-previous w-inline-block ${!after ? "is-disabled" : ""}"
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

  ${pages.map((page) => {
      return `<button class="pagination-link ${page === currentPageIndex ? "w--current" : ""}"> ${page}</button>`;
    }).join("")}
  <button
    class="pagination-btn is-next w-inline-block ${hasMore ? "" : "is-disabled"}"
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
    `;
    return innerHTML;
  };
  var generateEmptyState = () => {
    const search = state["query"];
    return `<div class="no-results-wrapper">
  <div class="no-results-abs-overlay">
    <img
      src="https://assets-global.website-files.com/652772322237331bccec35f0/655dc0be222b8fc5ca76f1fa_no-results-icon.svg"
      loading="lazy"
      alt=""
      class="no-results-icon"
    />
    <div class="spacer-1"></div>
    ${search ? `<div class="text-size-large">
          No results for \u201C<span id="no-results-search-text">${search}</span>\u201D
        </div>` : ""}
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
`;
  };

  // src/utils/ui.ts
  var updateDOM = (identifier, innerHTML) => {
    const element = document.querySelector(identifier);
    if (element) {
      element.innerHTML = innerHTML;
    } else {
      logger.warn(`Unable to find the DOM element with identifier ${identifier}`);
    }
  };
  var renderExplorer = async (items, total, hasMore) => {
    let generatedHTML = "";
    if (items.length > 0) {
      const listHTML = generateListHTML(items);
      const paginationHTML = generatePaginationHTML(total, hasMore);
      generatedHTML = listHTML + paginationHTML;
    } else {
      generatedHTML = generateEmptyState();
    }
    const filtersHTML = generateFiltersHTML(total);
    updateDOM("#filter-count", filtersHTML);
    updateDOM(LIST_CONTAINER_IDENTIFIER, generatedHTML);
    const prevButton = document.querySelector(LIST_CONTAINER_IDENTIFIER)?.querySelector(".is-previous");
    const nextButton = document.querySelector(LIST_CONTAINER_IDENTIFIER)?.querySelector(".is-next");
    const pageButtons = document.querySelector(LIST_CONTAINER_IDENTIFIER)?.querySelectorAll(".pagination-link");
    const after = state["after"];
    prevButton?.addEventListener("click", () => updatePagination("prev", after, hasMore, 0));
    nextButton?.addEventListener("click", () => updatePagination("next", after, hasMore, 0));
    pageButtons?.forEach((page) => {
      const pageNumber = parseInt(page.textContent);
      page.addEventListener("click", () => updatePagination("goto", after, hasMore, pageNumber));
    });
    removeFilter();
    showCategoriesBasedOnChain();
  };
  var toggleExplorerVisibility = (visible) => {
    const filters = document.querySelector(FILTERS_CONTAINER_IDENTIFIER);
    const list = document.querySelector(LIST_NEWS_CONTAINER_IDENTIFIER);
    if (filters && list) {
      if (visible) {
        filters.style.display = "block";
        list.style.display = "flex";
      } else {
        filters.style.display = "none";
        list.style.display = "none";
      }
    }
  };
  var toggleTypeFiltersVisibility = () => {
    const typeNames = [
      TYPES.dapps,
      TYPES.solution_providers,
      TYPES.ecosystem_enablers,
      TYPES.enterprises,
      TYPES.chains
    ];
    const typeOptions = typeNames.map((tabName) => {
      return document.querySelector(`[data-type-filter="${tabName}"]`);
    });
    const currentChain = state["chain"];
    const visibleTypes = CHAIN_TYPE_OPTIONS[currentChain];
    typeOptions.forEach((typeElement) => {
      const typeValue = typeElement.getAttribute("data-type-filter");
      if (visibleTypes.includes(typeValue)) {
        typeElement.style.display = "block";
      } else {
        typeElement.style.display = "none";
      }
    });
  };
  var highlightActiveTypeFilter = () => {
    const currentType = state["type"];
    const typeNames = [
      TYPES.dapps,
      TYPES.solution_providers,
      TYPES.ecosystem_enablers,
      TYPES.enterprises,
      TYPES.chains
    ];
    const typeOptions = typeNames.map((tabName) => {
      return document.querySelector(`[data-type-filter="${tabName}"]`);
    });
    typeOptions.forEach((typeElement) => {
      typeElement?.querySelector(".w-radio-input")?.classList.remove(...["w--redirected-checked", "w--redirected-focus"]);
      typeElement?.querySelector(".filter-radio-label")?.classList.remove(...["is-active"]);
      const typeValue = typeElement.getAttribute("data-type-filter");
      if (currentType === typeValue) {
        typeElement?.querySelector(".w-radio-input")?.classList.add("w--redirected-checked");
        typeElement?.querySelector(".filter-radio-label")?.classList.add(...["is-active"]);
      }
    });
  };
  var updateFilters = async () => {
    logger.log("Updating Filters");
    toggleTypeFiltersVisibility();
    highlightActiveTypeFilter();
  };
  var updateList = async () => {
    logger.log("Updating List");
    const params = {
      chain: state["chain"],
      type: state["type"],
      categories: state["categories"],
      query: state["query"],
      sort: state["sort"],
      after: state["after"],
      limit: state["limit"]
    };
    const response = await getCompanies(params);
    const { success, status, data, error } = response;
    if (success) {
      const { total, records, has_more } = data;
      renderExplorer(records, total, has_more);
    } else {
      logger.warn(error);
    }
  };
  var updatePagination = (operation, after, hasMore, page) => {
    logger.log(operation);
    if (operation === "next" && hasMore) {
      setState({ after: state.after + state.limit });
    } else if (operation === "prev" && after > 0) {
      setState({ after: state.after - state.limit });
    } else if (operation === "goto" && !isNaN(page)) {
      setState({ after: (page - 1) * state["limit"] });
    }
  };
  var removeFilter = () => {
    const filterTags = document.querySelectorAll(".filtered-projects-tag");
    console.log(filterTags);
    filterTags.forEach((filterTag) => {
      console.log(filterTag);
      const label = filterTag.querySelector(".filtered-label");
      const closeButton = filterTag.querySelector(".filter-close-icon");
      const mirroredButton = document.querySelector(
        `[data-categories-option="${label?.textContent}"]`
      );
      console.log(filterTag, closeButton, mirroredButton);
      filterTag.addEventListener("click", (event) => {
        console.log("removing filter");
        mirroredButton?.click();
      });
    });
  };
  function showCategoriesBasedOnChain() {
    const idCategories = document.getElementById("id-categories");
    const posZkevmCategories = document.getElementById("pos-zkevm-categories");
    const chain = state["chain"];
    const type = state["type"];
    posZkevmCategories.style.display = "none";
    idCategories.style.display = "none";
    console.log(idCategories, posZkevmCategories, chain, type);
    if (chain === CHAINS.id && type === TYPES.solution_providers) {
      idCategories.style.display = "block";
      posZkevmCategories.style.display = "none";
    } else if ((chain === CHAINS.pos || chain === CHAINS.zkevm) && type === TYPES.solution_providers) {
      idCategories.style.display = "none";
      posZkevmCategories.style.display = "block";
    }
  }
  var resetCategoryUI = () => {
    const searchFields = document.querySelectorAll(".filter-search-field.is-in-dd");
    searchFields.forEach((searchField) => {
      console.log(searchField);
      searchField.value = "";
    });
    const checkboxes = document.querySelectorAll(" .filter-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.classList.remove("w--redirected-checked");
    });
  };

  // src/utils/listeners.ts
  var initializeListeners = (selector, property, callback) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.addEventListener("click", callback);
    });
  };
  var handleTabClick = (event) => {
    const tabName = event.currentTarget.getAttribute("data-tab-name");
    setState({ tab: tabName, after: 0, categories: [] });
    switch (tabName) {
      case TABS.public_chains:
        setState({ type: TYPES.dapps });
        document.querySelector(`[data-chain-name="${CHAINS.zkevm}"]`)?.click();
        break;
      case TABS.app_specific_chains:
        setState({ type: TYPES.chains });
        document.querySelector(`[data-chain-name="${CHAINS.cdk}"]`)?.click();
        break;
      case TABS.decentralized_identity:
        setState({ type: TYPES.dapps });
        document.querySelector(`[data-chain-name="${CHAINS.id}"]`)?.click();
        break;
    }
    resetCategoryUI();
    logger.log(`Tab selected: ${state.tab}`);
  };
  var handleChainClick = (event) => {
    const chainName = event.currentTarget.getAttribute("data-chain-name");
    setState({ chain: chainName, after: 0, categories: [] });
    switch (chainName) {
      case CHAINS.zkevm:
      case CHAINS.pos:
        setState({ type: TYPES.dapps });
        break;
      case CHAINS.cdk:
        setState({ type: TYPES.chains });
        break;
      case CHAINS.id:
        setState({ type: TYPES.dapps });
        break;
    }
    logger.log(`Chain selected: ${state.chain}`);
    const supportedChains = [CHAINS.cdk, CHAINS.id, CHAINS.pos, CHAINS.zkevm];
    toggleExplorerVisibility(supportedChains.includes(chainName));
    resetCategoryUI();
  };
  var handleTypeClick = (event) => {
    const typeOption = event.currentTarget.getAttribute("data-type-filter");
    setState({ type: typeOption, after: 0, categories: [] });
    logger.log(`Type selected: ${state.type}`);
    resetCategoryUI();
  };
  var handleSortClick = (event) => {
    const sortOption = event.currentTarget.getAttribute("data-sort-filter");
    setState({ sort: sortOption, after: 0 });
    logger.log(`Sort selected: ${state.sort}`);
  };
  var handleSearchInput = (event) => {
    const search = debounce((event2) => {
      console.log(event2);
      const query = event2.target.value;
      setState({ query, after: 0 });
      logger.log(`Query: ${state.query}`);
    }, 500);
    console.log(event);
    search(event);
  };
  var initializeTabsListeners = () => {
    const tabNames = [TABS.public_chains, TABS.app_specific_chains, TABS.decentralized_identity];
    const selector = tabNames.map((tabName) => `[data-tab-name="${tabName}"]`).join(",");
    initializeListeners(selector, "tab", handleTabClick);
  };
  var initializeChainsListeners = () => {
    const chainTabNames = [CHAINS.zkevm, CHAINS.pos, CHAINS.id, CHAINS.cdk, CHAINS.miden];
    const selector = chainTabNames.map((chainName) => `[data-chain-name="${chainName}"]`).join(",");
    initializeListeners(selector, "chain", handleChainClick);
  };
  var initializeTypeListeners = () => {
    const typeNames = [
      TYPES.dapps,
      TYPES.solution_providers,
      TYPES.ecosystem_enablers,
      TYPES.enterprises,
      TYPES.chains
    ];
    const selector = typeNames.map((typeName) => `[data-type-filter="${typeName}"]`).join(",");
    initializeListeners(selector, "type", handleTypeClick);
  };
  var initializeSortListeners = () => {
    const sortNames = [SORTS.ascending, SORTS.descending];
    const selector = sortNames.map((sortName) => `[data-sort-filter="${sortName}"]`).join(",");
    initializeListeners(selector, "sort", handleSortClick);
  };
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  var initializeSearchListeners = () => {
    const selector = "#filter-search";
    const element = document.querySelector(selector);
    element.addEventListener("input", handleSearchInput);
  };
  var filterElements = (query, elements) => {
    elements.forEach((element) => {
      const textContent = element.textContent?.toLowerCase() || "";
      const shouldShow = textContent.includes(query.toLowerCase());
      element.style.display = shouldShow ? "flex" : "none";
    });
  };
  var handlePosZkevmCategorySearchInput = (event) => {
    const query = event.currentTarget.value;
    const elementsToFilter = document.querySelector("#pos-zkevm-categories")?.querySelectorAll(".filter-checkbox-container");
    console.log(query, elementsToFilter);
    filterElements(query, elementsToFilter);
    logger.log(`Query: ${query}`);
  };
  var handleIdCategorySearchInput = (event) => {
    const query = event.currentTarget.value;
    const elementsToFilter = document.querySelector("#id-categories")?.querySelectorAll(".filter-checkbox-container");
    console.log(query, elementsToFilter);
    filterElements(query, elementsToFilter);
    logger.log(`Query: ${query}`);
  };
  var handleCheckboxClick = (event) => {
    event.preventDefault();
    const categoryOption = event.currentTarget.getAttribute(
      `data-categories-option`
    );
    let cat = [...state.categories];
    console.log(cat);
    if (cat.includes(categoryOption)) {
      cat = cat.filter((c) => c !== categoryOption);
    } else {
      cat.push(categoryOption);
    }
    setState({ categories: cat, after: 0 });
    const element = event.currentTarget.querySelector(".w-checkbox-input");
    if (!state.categories.includes(categoryOption)) {
      element?.classList.remove("w--redirected-checked");
    } else {
      element?.classList.add("w--redirected-checked");
    }
    logger.log(`Categories selected: ${state.categories}`);
  };
  var initializeCategoriesListeners = () => {
    const posZkevmSearchSelector = "#PoS-zkEVM-Categories-Search";
    const posZkevmSearch = document.querySelector(posZkevmSearchSelector);
    posZkevmSearch?.addEventListener("input", handlePosZkevmCategorySearchInput);
    const idSearchSelector = "#ID-Categories-Search";
    const idSearch = document.querySelector(idSearchSelector);
    idSearch?.addEventListener("input", handleIdCategorySearchInput);
    const checkboxSelector = ".filter-checkbox-container";
    initializeListeners(checkboxSelector, "click", handleCheckboxClick);
  };

  // src/index.ts
  var setupEventListeners = () => {
    document.addEventListener("filters", function(event) {
      console.log("Event triggered", event);
      updateFilters();
      updateList();
    });
  };
  var initializeUIListeners = () => {
    initializeTabsListeners();
    initializeChainsListeners();
    initializeTypeListeners();
    initializeSortListeners();
    initializeSearchListeners();
    initializeCategoriesListeners();
  };
  var initializeDefaultSelections = () => {
    const defaultTab = document.querySelector(`[data-tab-name="${TABS.public_chains}"]`);
    const defaultChain = document.querySelector(`[data-tab-name="${CHAINS.zkevm}"]`);
    const defaultSort = document.querySelector(`[data-sort-filter="${SORTS.ascending}"]`);
    defaultSort?.querySelector(".filter-radiobox")?.classList.add("w--redirected-checked");
  };
  var initializeWebflow = () => {
    window.Webflow ||= [];
    window.Webflow.push(async () => {
      setupEventListeners();
      initializeUIListeners();
      initializeDefaultSelections();
      updateFilters();
      updateList();
    });
  };
  initializeWebflow();
})();
//# sourceMappingURL=index.js.map
