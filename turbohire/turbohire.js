/**
 *
 * Maintainer: Prateek
 * Email : prateek@epyc.in
 * EPYC ThoughtWorks Pvt. Ltd
 *
 */

var appliedFilter = {
  JobTitle: [],
  Department: [],
  CompanyName: [],
};
const facets = Object.keys(appliedFilter);

var jobData = [];

function renderFieldCards(filterName) {
  var validJobs = [];
  jobData.forEach(function (jobItem) {
    if (jobItem.JobTitle.indexOf(filterName) > -1) {
      validJobs.push(jobItem);
    }
  });
  renderCards(validJobs);
}

function renderDepartmentCards(departmentName) {
  var validJobs = [];
  jobData.forEach(function (jobItem) {
    if (jobItem.Department.indexOf(departmentName) > -1) {
      validJobs.push(jobItem);
    }
  });
  renderCards(validJobs);
}

function renderCompanyCards(companyName) {
  var validJobs = [];
  jobData.forEach(function (jobItem) {
    if (jobItem.CompanyName.indexOf(companyName) > -1) {
      validJobs.push(jobItem);
    }
  });
  renderCards(validJobs);
}

function renderCards(jobs) {
  $("#jobs>.grid-22").empty();
  $("#w-dropdown-list-8").empty();
  $("#w-dropdown-list-9").empty();
  $("#w-dropdown-list-7").empty();
  var departments = [];
  var companies = [];
  var fields = [];

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
    //alert(job.JobId)
    var date1 = new Date(job.UpdatedDate);
    var date2 = new Date();
    //var Difference_In_Time = date2.getTime() - date1.getTime();
    //var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    seconds = Math.floor((date2 - date1) / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    days = Math.floor(hours / 24);
    weeks = Math.floor(days / 7);
    months = Math.floor(weeks / 4);

    weeks = weeks - months * 4;
    days = days - months * 4 * 7 - weeks * 7;
    hours = hours - months * 4 * 7 * 24 - weeks * 7 * 24 - days * 24;
    minutes =
      minutes -
      months * 4 * 7 * 24 * 60 -
      weeks * 7 * 24 * 60 -
      days * 24 * 60 -
      hours * 60;
    seconds =
      seconds -
      months * 4 * 7 * 24 * 60 * 60 -
      weeks * 7 * 24 * 60 * 60 -
      days * 24 * 60 * 60 -
      hours * 60 * 60 -
      minutes * 60;

    $(".text-block-" + job.JobId).html(
      (months != 0 ? months + " Month " : "") +
        (months == 0 && weeks != 0 ? weeks + " Week " : "") +
        (weeks == 0 && days != 0 ? days + " Day " : "") +
        (days == 0 && hours != 0 ? hours + " hrs " : "") +
        (hours == 0 && minutes != 0 ? minutes + " Min " : "") +
        " Ago"
    );

    //alert("Time until new year:\nDays: " + days + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
    //    document.getElementsByClassName("text-block-23")[0].innerHTML = "Ago" + Difference_In_Days;

    if (!departments.includes(job.Department)) {
      departments.push(job.Department);
    }

    if (!companies.includes(job.CompanyName)) {
      companies.push(job.CompanyName);
    }
    if (!fields.includes(job.JobTitle)) {
      fields.push(job.JobTitle);
    }
  });

  departments.forEach(function (item) {
    $("#w-dropdown-list-8").append(
      $(
        `<a onClick="renderDepartmentCards('${item}');" class="dropdown-link-4 w-dropdown-link" tabindex="0">${item}</a>`
      )
    );
  });

  companies.forEach(function (item) {
    $("#w-dropdown-list-9").append(
      $(
        `<a onClick="renderCompanyCards('${item}');" class="dropdown-link-4 w-dropdown-link" tabindex="0">${item}</a>`
      )
    );
  });

  fields.forEach(function (item) {
    $("#w-dropdown-list-7").append(
      $(
        `<a onClick="renderFieldCards('${item}');" class="dropdown-link-4 w-dropdown-link" tabindex="0">${item}</a>`
      )
    );
  });
}

$(document).ready(function () {
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
    renderCards(response.Result);
  });
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
