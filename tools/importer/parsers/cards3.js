/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the requirements and example
  const headerRow = ['Cards (cards3)'];

  // Find all immediate card elements
  const cards = element.querySelectorAll(':scope > .card-item');
  const rows = [];

  cards.forEach((card) => {
    // Image (in left cell)
    let image = null;
    const imgContainer = card.querySelector('.text-center');
    if (imgContainer) {
      image = imgContainer.querySelector('img');
    }

    // Text content (right cell)
    // Collect (in order): Title (h3), Description (allow-breaks or first div under h3), CTA (a)
    const contentCol = card.querySelector('.flex-col.flex');
    const textCellItems = [];
    if (contentCol) {
      // Title
      const title = contentCol.querySelector('h3');
      if (title) {
        textCellItems.push(title);
      }
      // Description (find the first allow-breaks after h3, or the next div)
      let desc = null;
      if (title) {
        // Get next sibling that is a div or has allow-breaks/leading-tighter
        let sibling = title.nextElementSibling;
        while (sibling) {
          if (
            sibling.classList.contains('allow-breaks') ||
            sibling.classList.contains('leading-tighter') ||
            sibling.tagName.toLowerCase() === 'div'
          ) {
            desc = sibling;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
      }
      if (!desc) {
        // fallback: search for .allow-breaks in contentCol
        desc = contentCol.querySelector('.allow-breaks, .leading-tighter');
      }
      if (desc) {
        textCellItems.push(desc);
      }
      // CTA Button (a)
      const cta = contentCol.querySelector('a');
      if (cta) {
        textCellItems.push(cta);
      }
    }
    rows.push([
      image,
      textCellItems
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
