/**
 *
 * Maintainer: Prateek
 * Email : prateek@epyc.in
 * EPYC ThoughtWorks Pvt. Ltd
 *
 */

var appliedFilter = {
  JobTitle: {},
  Department: {},
  CompanyName: {},
};
var facetNames = Object.keys(appliedFilter);

var jobData = [];

var facets = {
  JobTitle: [],
  Department: [],
  CompanyName: [],
};

function renderCards(jobs) {
  $("#jobs>.grid-22").empty();

  jobs.forEach(function (job) {
    $("#jobs>.grid-22").append(
      $(`
          <div class="job-item">
          <div>
          <div class="logo-company">
          <a href="${
            job.CompanyUrl
          }" target="_blank" class="logo-link w-inline-block">
          <img src="${job.CompanyLogo}" loading="lazy" alt="" class="image-40">
          <div class="job-company-name">${job.CompanyName}</div>
          </a>
          </div>
          <h4 class="job-profile">${job.JobTitle}</h4>
          <p class="job-description">${job.JobDescription}</p>
          </div>
         <div>
          <div class="job-keyword-block">
              <div class="job-location">${
                JSON.parse(job.Location)[0].Address
              }</div>
          </div>
          <div class="apply-container">
              <a href="${
                job.ApplyUrl
              }" target="_blank" class="job-apply-button w-button">Apply Now</a>
              <div class="text-block-${job.JobId}"></div>
          </div>
         </div>
      </div>`)
    );

    var updatedAt = new Date(job.UpdatedDate);
    var momentAgo = timeago().format(updatedAt);

    $(".text-block-" + job.JobId).html(momentAgo);
  });
}

function setFacets(data) {
  var departments = {};
  var companies = {};
  var jobTitle = {};
  data.forEach(function (job) {
    departments[job.Department] = true;
    companies[job.CompanyName] = true;
    jobTitle[job.JobTitle] = true;
  });
  facets.CompanyName = Object.keys(companies);
  facets.Department = Object.keys(departments);
  facets.JobTitle = ["Director", "Head", "VP"]; //Object.keys(jobTitle);
  console.log("[+] FACETS", facets);
}
function getCheckbox(checkboxLabel, facetName) {
  let id = checkboxLabel.toLowerCase().replace(/ /g, "-");
  return `
  <a class="dropdown-link-4 w-dropdown-link" tabindex="0" style="padding:0">

    <label for="${id}" class="epyc-checkbox" style="padding:16px 16px 16px 44px">${checkboxLabel}
          <input class="filter-checkbox" type="checkbox" id="${id}" name="name-${id}" data-facet="${facetName}" value="${checkboxLabel}">

        <span class="checkmark" style="top: 18px;
        left: 16px;"></span>
    </label>
    
  </a>
  `;
}
function renderRefinementList(selector, data, facetName) {
  $(selector).empty();
  data.forEach(function (item) {
    var checkbox = getCheckbox(item, facetName);
    $(selector).append(checkbox);
  });
}
function addFilterEventListener() {
  const checkboxes = document.getElementsByClassName("filter-checkbox");
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    checkbox.addEventListener("change", (event) => {
      //   console.log("event", event);
      var checked = event.target.checked;
      var facetName = event.target.dataset.facet;
      var filterLabel = event.target.value;
      //   console.log(facetName, filterLabel);
      appliedFilter[facetName][filterLabel] = checked;

      var appliedFilterList = {};

      facetNames.forEach(function (name) {
        var map = appliedFilter[name];
        var list = Object.keys(appliedFilter[name]).filter(function (item) {
          return map[item];
        });
        appliedFilterList[name] = list;
      });

      //   console.log("appliedFilterList", appliedFilterList);
      filterData(appliedFilterList);
    });
  }
}
function fuzzySearchInArray(string, matchArray) {
  var result = false;
  matchArray.forEach(function (item) {
    // console.log(item);
    var regex = new RegExp(item.toLowerCase(), "g");
    // console.log(regex);
    if (string.toLowerCase().match(regex)) {
      result = true;
    }
  });
  return result;
}

function filterData(appliedFilterList) {
  var filteredJobs = [];
  var filterJobMap = {};
  jobData.forEach(function (job) {
    facetNames.forEach(function (facetName) {
      if (fuzzySearchInArray(job[facetName], appliedFilterList[facetName])) {
        filteredJobs.push(job);
        filterJobMap[job.jobId] = true;
      }
    });
  });
  console.log("[+] Filtered Job List", filteredJobs);
  var jobs = filteredJobs.length > 0 ? filteredJobs : jobData;
  renderCards(jobs);
}

function addClearFilterEventListener() {
  $("#clear-filter").on("click", function () {
    renderCards(jobData);
    var checkboxes = $(".filter-checkbox");
    // console.log(checkboxes);
    for (var i = 0; i < checkboxes.length; i++) {
      var checkbox = checkboxes[i];
      //   $(checkbox).checked = false;
      checkbox.checked = false;
    }
    appliedFilter = {
      ...{
        JobTitle: {},
        Department: {},
        CompanyName: {},
      },
    };
  });
}
function getDataFromTurbohire() {
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://api.turbohire.co/api/careerpagejobs",
    method: "POST",
    headers: {
      "X-Api-Key": "B73E8738-E64D-4FBF-A0AC-7534C3951239",
      Accept: "*/*",
      "Cache-Control": "no-cache",
      Host: "api.turbohire.co",
      "Accept-Encoding": "gzip, deflate",
      "Content-Length": "0",
      Connection: "keep-alive",
      "cache-control": "no-cache",
    },
  };
  $.ajax(settings).done(function (response) {
    jobData = response.Result;
    setFacets(jobData);
    renderRefinementList("#w-dropdown-list-8", facets.Department, "Department");
    renderRefinementList(
      "#w-dropdown-list-9",
      facets.CompanyName,
      "CompanyName"
    );
    renderRefinementList("#w-dropdown-list-7", facets.JobTitle, "JobTitle");
    addFilterEventListener();
    addClearFilterEventListener();
    renderCards(response.Result);
  });
}

$(document).ready(function () {
  getDataFromTurbohire();
  $("#search-2").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    var validJobs = [];
    jobData.forEach(function (jobItem) {
      if (
        jobItem.JobTitle.toLowerCase().indexOf(value) > -1 ||
        jobItem.JobDescription.toLowerCase().indexOf(value) > -1 ||
        jobItem.Location.toLowerCase().indexOf(value) > -1 ||
        jobItem.CompanyName.toLowerCase().indexOf(value) > -1 ||
        jobItem.Department.toLowerCase().indexOf(value) > -1
      ) {
        validJobs.push(jobItem);
      }
    });
    renderCards(validJobs);
  });
});
