document.querySelectorAll(".oms-acc-wrap").forEach((acc) => {
  const header = acc.querySelector(".oms-acc-header-wrap");
  const body = acc.querySelector(".oms-acc-body");
  const chev = acc.querySelector(".oms-acc-chev svg");

  if (!header || !body) return;

  body.style.height = "0";
  body.style.overflow = "hidden";

  header.addEventListener("click", () => {
    const isActive = acc.classList.contains("active");

    // Close all
    document.querySelectorAll(".oms-acc-wrap").forEach((item) => {
      item.classList.remove("active");
      item.querySelector(".oms-acc-body").style.height = "0";
      const itemChev = item.querySelector(".oms-acc-chev svg");
      if (itemChev) itemChev.style.transform = "rotate(0deg)";
    });

    // Open clicked if it wasn't active
    if (!isActive) {
      acc.classList.add("active");
      body.style.height = body.scrollHeight + "px";
      if (chev) chev.style.transform = "rotate(180deg)";
    }
  });
});
