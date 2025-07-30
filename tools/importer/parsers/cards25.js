/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Cards (cards25)'];
  const cells = [headerRow];

  // Find the UL containing the slides
  const ul = element.querySelector('ul.splide__list');
  if (!ul) return;
  const slides = ul.querySelectorAll('li.splide__slide');

  slides.forEach((slide) => {
    // IMAGE: Find first img in card
    let imgEl = null;
    const img = slide.querySelector('img');
    if (img) imgEl = img;

    // TEXT CELL: Gather title, description, CTA
    const cardTextContainer = slide.querySelector('.flex.flex-col.gap-6.grow');
    const textCellContent = [];
    if (cardTextContainer) {
      // Remove the first icon-row if present (the category row)
      let cardChildren = Array.from(cardTextContainer.children);
      // First row is likely the icon+category
      let startIdx = 0;
      if (
        cardChildren[0] &&
        cardChildren[0].classList.contains('flex') &&
        cardChildren[0].classList.contains('gap-1.5')
      ) {
        startIdx = 1;
      }
      // Heading
      if (cardChildren[startIdx]) {
        textCellContent.push(cardChildren[startIdx]);
      }
      // Description
      if (cardChildren[startIdx + 1]) {
        textCellContent.push(cardChildren[startIdx + 1]);
      }
      // CTA (always last)
      if (cardChildren[startIdx + 2]) {
        textCellContent.push(cardChildren[startIdx + 2]);
      }
    }
    // Add this row to the table
    cells.push([imgEl, textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
