/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches EXACTLY the required naming
  const headerRow = ['Cards (cards12)'];
  // The card grid is always inside the third div: section > div > div > div.grid.grid-cols-12.gap-6
  // Defensive: Find the grid with class including 'gap-6' and 'grid-cols-12' that is a descendant of the section
  const cardsGrid = element.querySelector('.grid.grid-cols-12.gap-6');
  if (!cardsGrid) return; // Robust: gracefully do nothing if not present
  // Find all direct card-item children
  const cardDivs = Array.from(cardsGrid.querySelectorAll(':scope > .card-item'));
  // Build table rows for each card
  const rows = cardDivs.map((card) => {
    // IMAGE CELL: must include the image element (reference, not clone)
    const img = card.querySelector('img');
    // TEXT CELL: Find the first <h3> for title and the div with .allow-breaks for description
    let textCell = document.createElement('div');
    // Title
    const title = card.querySelector('h3');
    if (title) {
      // Use the same tag and content, referenced directly
      textCell.appendChild(title);
    }
    // Description
    const desc = card.querySelector('.allow-breaks');
    if (desc) {
      // Use the element directly
      textCell.appendChild(desc);
    }
    return [img, textCell];
  });
  // Compose rows (header + each card row)
  const tableRows = [headerRow, ...rows];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
