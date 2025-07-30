/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area that holds the contents
  // There should be a flex row representing the columns (look for 2 direct children)
  let columnsRow = element.querySelector('.flex.lg\:flex-row-reverse, .flex.lg\\:flex-row-reverse');
  if (!columnsRow) {
    // fallback: find the first .flex that has exactly 2 children
    columnsRow = Array.from(element.querySelectorAll('.flex')).find(div => div.children.length === 2);
  }
  if (!columnsRow) return;

  // Get the two column divs. Always reference the original elements!
  const colDivs = Array.from(columnsRow.children);
  if (colDivs.length !== 2) return;

  // The block name header must be exact
  const cells = [
    ['Columns (columns46)'],
    [colDivs[0], colDivs[1]]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
