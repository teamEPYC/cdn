document.querySelectorAll(".blog-radio.is-bi").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    const value = this.querySelector("div").textContent.trim();
    const url = new URL(this.href, window.location.origin);
    url.searchParams.set("filter", value);
    window.location.href = url.href;
  });
});
