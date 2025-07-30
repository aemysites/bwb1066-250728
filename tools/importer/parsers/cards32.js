/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header as in the example
  const cells = [['Cards (cards32)']];

  // Find the slider card list
  const list = element.querySelector('ul.splide__list');
  if (list) {
    const slides = list.querySelectorAll(':scope > li.splide__slide');
    slides.forEach((slide) => {
      // First column: image (first <img> inside the card)
      const img = slide.querySelector('img');
      // Second column: text content container with heading & description
      const textWrapper = slide.querySelector('.flex.flex-col.gap-4.grow.p-6');
      // For robustness, fallback: if above doesn't exist, use the deepest .flex.flex-col in slide
      const textCell = textWrapper || slide.querySelector('.flex.flex-col');
      // Only include row if both image and text content are found
      if (img && textCell) {
        cells.push([img, textCell]);
      }
    });
  }

  // Replace the original element with the constructed table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
