/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const cells = [['Cards']];

  // Find the list of slides
  const slidesList = element.querySelector('.splide__list');
  if (!slidesList) return;
  const slides = Array.from(slidesList.children);

  slides.forEach((li) => {
    // Each card is a li; content is in a .grow div
    const growDiv = li.querySelector('.grow');
    if (growDiv) {
      // Try to extract heading and description from growDiv
      const heading = growDiv.querySelector('h1, h2, h3, h4, h5, h6');
      // Get the first div (with text content), or if not, look for p
      let desc = null;
      let textDiv = growDiv.querySelector('.ck-content, [class*="text-16"], p, div');
      if (textDiv) {
        // If .ck-content is inside, prefer that.
        if (textDiv.classList.contains('ck-content')) {
          desc = textDiv;
        } else {
          const innerCk = textDiv.querySelector('.ck-content');
          desc = innerCk ? innerCk : textDiv;
        }
      }
      // Some cards don't have a .ck-content (plain text in div)
      // Compose the card cell using original elements
      const content = [];
      if (heading) content.push(heading);
      if (desc && desc !== heading) content.push(desc);
      cells.push([content.length ? content : growDiv]);
    } else {
      // fallback: just use all content of li
      cells.push([li]);
    }
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
