/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary grid (columns container)
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // Get all immediate child column sections
  const columns = Array.from(grid.querySelectorAll(':scope > div'));
  if (!columns.length) return;

  // Header must match the spec exactly
  const headerRow = ['Columns (columns23)'];
  // Each column is included as a single cell in the row
  const contentRow = columns.map(col => col);

  // Only one table as per the structure example
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
