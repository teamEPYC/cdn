document.addEventListener("DOMContentLoaded", function () {
  fetch("https://jobs-api.polygon.technology")
    .then((res) => res.json())
    .then((data) => {
      const wrap = document.querySelector(".careers-or-cards-wrap");
      const template = wrap.querySelector(".career-or-card-container");

      data.results.forEach((job, i) => {
        const card = template.cloneNode(true);

        card.setAttribute("fs-list-element", "item");
        card.href = job.applyLink;

        // Open job link in new tab
        card.setAttribute("target", "_blank");
        card.setAttribute("rel", "noopener noreferrer");

        const eyebrow = card.querySelector(".career-or-eyebrow div");
        eyebrow.textContent = String(i + 1).padStart(2, "0");

        card.querySelector("h3").textContent = job.title;

        const dept = card.querySelector(".h-eyebrow-container div");
        dept.textContent = job.departmentName;
        dept.setAttribute("fs-list-field", "department");

        const loc = card.querySelector(".u-body-large");
        loc.textContent = job.locationName;
        loc.setAttribute("fs-list-field", "location");

        wrap.appendChild(card);
      });

      template.remove();

      setTimeout(() => {
        const fs = document.createElement("script");
        fs.src =
          "https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js";
        fs.type = "module";
        fs.async = true;
        fs.setAttribute("fs-list", "");
        document.body.appendChild(fs);
      }, 400);
    });
});
