/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards40)'];
  // Get the list of cards
  const list = element.querySelector('ul.splide__list');
  if (!list) return;
  const cards = Array.from(list.children).filter(li => li.classList.contains('splide__slide'));
  const rows = [headerRow];
  cards.forEach((card) => {
    // Image (first .bg-gray-warm > img)
    const imgContainer = card.querySelector('.bg-gray-warm');
    const img = imgContainer ? imgContainer.querySelector('img') : null;
    // Main content (title, description, CTA)
    const contentContainer = card.querySelector('.flex.flex-col.gap-4');
    let textCellContent = [];
    if (contentContainer) {
      // Title: heading if present
      const heading = contentContainer.querySelector('h3');
      if (heading) textCellContent.push(heading);
      // Description: first div.text-white (not nested in a)
      const desc = contentContainer.querySelector('div.text-white');
      if (desc) textCellContent.push(desc);
      // CTA: a (if present)
      const cta = contentContainer.querySelector('a');
      if (cta) textCellContent.push(cta);
    }
    if (textCellContent.length === 0) textCellContent = '';
    if (textCellContent.length === 1) textCellContent = textCellContent[0];
    rows.push([img, textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
