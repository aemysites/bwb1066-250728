/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('.splide');
  if (!carousel) return;

  // Find all slides
  const slides = carousel.querySelectorAll('li.splide__slide');
  if (!slides.length) return;

  // Header row now has two columns to match the slide rows
  const cells = [['Carousel', '']];

  slides.forEach((slide) => {
    // IMAGE (mandatory)
    const img = slide.querySelector('img');
    const imageElem = img ? img : '';

    // TEXTUAL CONTENT (optional)
    const contentGrid = slide.querySelector('.gap-5.grid');
    let textElems = [];
    if (contentGrid) {
      // Title (h2)
      const h2 = contentGrid.querySelector('h2');
      if (h2) textElems.push(h2);
      // Description
      const description = contentGrid.querySelector('.richtext');
      if (description) textElems.push(description);
      // CTA(s) - inside flex-row container
      const ctaRow = contentGrid.querySelector('.flex');
      if (ctaRow) {
        const links = Array.from(ctaRow.querySelectorAll('a'));
        if (links.length > 0) {
          const ctaDiv = document.createElement('div');
          links.forEach(link => ctaDiv.appendChild(link));
          textElems.push(ctaDiv);
        }
      }
    }
    if (!textElems.length) textElems = [''];
    cells.push([imageElem, textElems]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
