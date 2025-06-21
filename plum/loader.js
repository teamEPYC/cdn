
document.addEventListener("DOMContentLoaded", () => {

    const loader = document.querySelector(".loader");
    const loaderShape = document.querySelector(".loader-shape.out");
    const loaderLogo = document.querySelector(".loader-logo");
    const loaderShapeIn = document.querySelector(".loader-shape.in");

    //loader.classList.remove("hide");

    const tl = gsap.timeline();

    tl.to(loaderLogo, 
        { opacity: 0, duration: 0.2, ease: "power2.inOut"}
    ).fromTo(loaderShape, 
        { scaleX: 2, scaleY: 3 },
        {
        scaleX: 1,
        scaleY: 0,
        duration: 1.5,
        ease: "expo.inOut",
        }, "<"
    );

    const playOutroAndNavigate = (url) => {
      const tl = gsap.timeline();   
      tl.fromTo(loaderShapeIn,
        { scaleX: 1, scaleY: 0 },
        { scaleX: 2, scaleY: 3, duration: 1.2, ease: "expo.inOut"}
      ).to(loaderLogo,
          { opacity: 1, duration: 0.2, ease: "power2.inOut", onComplete: () => {window.location.href = url}}, "-=0.5"
      );
    };

    document.body.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]"); 
      if (!link) return;    
      const href = link.getAttribute("href");   
      if (
        !href || 
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        link.hostname !== window.location.hostname ||
        href === window.location.pathname + window.location.search + window.location.hash
      ) {
        return;
      } 
      e.preventDefault();
      playOutroAndNavigate(href);
    });

});
