/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children (these are columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // The block header as per the requirement
  const headerRow = ['Columns (columns21)'];

  // For each column, include the main stat content
  // We want to reference the visible stat block as a whole, not clone, to preserve semantic structure
  const contents = columns.map((col) => {
    // Try to grab the direct stat summary
    const statBlock = col.querySelector('div.border-t-4');
    // Defensive: if missing, just use the column itself
    return statBlock || col;
  });

  // Compose the table rows
  const cells = [
    headerRow,
    contents
  ];

  // Create the block table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
