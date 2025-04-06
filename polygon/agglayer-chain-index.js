document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://hook.us1.make.com/jtqefyg8v17opsn13ld498pe58dnokzh";
    const table = document.querySelector(".fs-table_table");
    const tbody = document.querySelector(".fs-table_body");
    const preloader = document.querySelector(".chain-table-preloader");
    const preloaderText = document.querySelector(".chain-table-preloader-text");
    const searchInput = document.querySelector(".agglayer-index-search-field");
    const sortButtons = document.querySelectorAll(".sort-btn");
    let data = [];

    // Hide table, show preloader
    table.style.display = "none";
    preloader.style.display = "flex";
    preloaderText.textContent = "Fetching chains... One sec!";

    try {
        // ✅ Fetch Data from Webhook
        const response = await fetch(API_URL);
        data = await response.json();

        if (data.length === 0) {
            preloaderText.textContent = "No chains found.";
            return;
        }

        // ✅ Populate Table with Data
        populateTable(data);

        // ✅ Show Table, Hide Preloader
        table.style.display = "";
        preloader.style.opacity = "0";
        setTimeout(() => (preloader.style.display = "none"), 250);

    } catch (error) {
        console.error("Error fetching data:", error);
        preloaderText.textContent = "Failed to load chains. Try again.";
    }

    function populateTable(data) {
        tbody.innerHTML = ""; // Clear existing rows
        data.forEach(chain => {
            const row = document.createElement("tr");
            row.classList.add("fs-table_row");

            row.innerHTML = `
                <td class="fs-table_cell"><img src="${chain.fieldData.logo.url}" alt="${chain.fieldData.name}" class="chain-logo"></td>
                <td class="fs-table_cell chain-name">${chain.fieldData.name}</td>
                <td class="fs-table_cell">${chain.fieldData.description}</td>
                <td class="fs-table_cell chain-category">${chain.catName}</td>
                <td class="fs-table_cell chain-status">
                    <div class="chain-status-wrap">
                        <div class="chain-status-icon"></div>
                        <div>${chain.chainStatusName[0]}</div>
                    </div>
                </td>
                <td class="fs-table_cell chain-agglayer">
                    <div class="agglayer-status-wrap">
                        <div>${chain.agglayerStatusName[0]}</div>
                    </div>
                </td>
                <td class="fs-table_cell"><a href="${chain.fieldData["explore-link"]}" class="v2-btn is-secondary is-black">Explore</a></td>
                <td class="fs-table_cell"><a href="${chain.fieldData["build-link"] || "#"}" class="v2-btn is-chain">Build</a></td>
            `;

            tbody.appendChild(row);
        });
    }

    // ✅ Search Filtering
    searchInput.addEventListener("input", () => filterTable(searchInput.value));

    function filterTable(query) {
        const rows = document.querySelectorAll(".fs-table_row");
        const lowerQuery = query.toLowerCase();

        rows.forEach(row => {
            const chain = row.querySelector(".chain-name")?.textContent.toLowerCase() || "";
            const category = row.querySelector(".chain-category")?.textContent.toLowerCase() || "";
            const chainStatus = row.querySelector(".chain-status div:last-child")?.textContent.toLowerCase() || "";
            const agglayerStatus = row.querySelector(".chain-agglayer div:last-child")?.textContent.toLowerCase() || "";

            if (chain.includes(lowerQuery) || category.includes(lowerQuery) || chainStatus.includes(lowerQuery) || agglayerStatus.includes(lowerQuery)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // ✅ Sorting
    sortButtons.forEach(button => {
        button.addEventListener("click", function () {
            const column = this.closest(".fs-table_header").textContent.trim();
            sortTable(column);
            resetSortButtons(this);
        });
    });

    function sortTable(column) {
        const rows = Array.from(tbody.children);
        const headers = Array.from(document.querySelectorAll(".fs-table_header"));
        const colIndex = headers.findIndex(header => header.textContent.trim() === column);

        if (colIndex === -1) return;

        const sortedRows = rows.sort((a, b) => {
            const aText = a.children[colIndex]?.textContent.trim().toLowerCase() || "";
            const bText = b.children[colIndex]?.textContent.trim().toLowerCase() || "";
            return aText.localeCompare(bText);
        });

        sortedRows.forEach(row => tbody.appendChild(row));
    }

    function resetSortButtons(activeButton) {
        sortButtons.forEach(btn => {
            if (btn !== activeButton) btn.style.transform = "rotate(0deg)";
        });
        activeButton.style.transform = "rotate(180deg)";
    }
});
