/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container that represents the row with two columns
  let columnsContainer = null;
  // Try to find a .flex that has both a text side and an image side
  const possibleRows = element.querySelectorAll('div.flex');
  for (const row of possibleRows) {
    const children = row.querySelectorAll(':scope > div');
    // Must have at least 2 children
    if (children.length >= 2) {
      columnsContainer = row;
      break;
    }
  }
  if (!columnsContainer) return;

  // Get all direct column children
  const childCols = Array.from(columnsContainer.querySelectorAll(':scope > div'));
  if (childCols.length < 2) return;

  // For each column, create a div and move the column's children in
  // This ensures all text, headings, and formatting from the source are preserved
  const columns = childCols.map(col => {
    const wrapper = document.createElement('div');
    while (col.firstChild) {
      wrapper.appendChild(col.firstChild);
    }
    return wrapper;
  });

  // Build the block table: header row exactly as in the example, then columns
  const cells = [
    ['Columns (columns36)'], // Header row as in the example
    columns                  // One row with as many columns as found
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}