document.addEventListener("DOMContentLoaded", function () {
  function positionPolyRelativeToWord() {
    document.querySelectorAll(".u-h2[data-relative]").forEach((heading) => {
      const targetWord = heading.dataset.relative;
      const svg = heading.nextElementSibling?.classList.contains(
        "uc-heading-poly"
      )
        ? heading.nextElementSibling
        : heading.parentElement.querySelector(".uc-heading-poly");

      if (!svg) return;

      const existing = heading.querySelector(".word-relative-wrap");
      if (existing) {
        existing.appendChild(svg);
        return;
      }

      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent;
        const wordIndex = text.toLowerCase().indexOf(targetWord.toLowerCase());

        if (wordIndex !== -1) {
          const before = text.slice(0, wordIndex);
          const word = text.slice(wordIndex, wordIndex + targetWord.length);
          const after = text.slice(wordIndex + targetWord.length);

          const wrap = document.createElement("span");
          wrap.className = "word-relative-wrap";
          wrap.style.cssText = "position: relative; display: inline-block;";
          wrap.textContent = word;

          svg.style.display = "block"; // unhide here
          wrap.appendChild(svg);

          const frag = document.createDocumentFragment();
          if (before) frag.appendChild(document.createTextNode(before));
          frag.appendChild(wrap);
          if (after) frag.appendChild(document.createTextNode(after));

          node.parentNode.replaceChild(frag, node);
          break;
        }
      }
    });
  }

  positionPolyRelativeToWord();
});
