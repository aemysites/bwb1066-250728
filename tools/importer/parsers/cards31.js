/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const cells = [
    ['Cards (cards31)'],
  ];

  // The card grid: find direct child with grid classes
  const grid = element.querySelector(':scope > div > div');
  if (!grid) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Find each card: direct children with .border-2 (card) class
  const cardDivs = Array.from(grid.children).filter(div => div.classList && div.classList.contains('border-2'));
  cardDivs.forEach(card => {
    // 1. Image/Icon in first cell
    const img = card.querySelector('img');

    // 2. Text content: collect all content except image
    // Locate the main grow/flex content area
    const textArea = card.querySelector('.grow, .flex');
    let textContentEls = [];
    if (textArea) {
      // Exclude any .w-50 (image wrapper) children
      textContentEls = Array.from(textArea.children).filter(el => !el.classList.contains('w-50'));
    }
    // If none, fallback to .richtext or any <div> excluding image wrapper
    if (textContentEls.length === 0) {
      const rich = card.querySelector('.richtext');
      if (rich) textContentEls = [rich];
    }

    // 3. Add any CTA links/buttons directly from card that aren't already in textArea
    const ctaLinks = Array.from(card.querySelectorAll('a')).filter(a => {
      // Avoid duplicates if already in text area content
      return !textContentEls.includes(a);
    });

    // Compose content cell: always array of elements (preserve formatting)
    const contentCell = [...textContentEls, ...ctaLinks];
    // If nothing found, fallback to card textContent
    const cellContent = contentCell.length > 0 ? contentCell : [document.createTextNode(card.textContent.trim())];

    cells.push([
      img,
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
