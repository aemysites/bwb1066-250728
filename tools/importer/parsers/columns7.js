/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const cells = [
    ['Columns (columns7)'],
  ];

  // Find the grid (columns wrapper)
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // Find the BlogPosting card in the grid
  const card = grid.querySelector('[itemscope][itemtype="https://schema.org/BlogPosting"]');
  if (!card) return;

  // There are two main children in this card: text (left), image (right)
  // Get left (text) content
  const flexContainers = card.querySelectorAll(':scope > div');
  let left = null, right = null;
  flexContainers.forEach((child) => {
    if (child.querySelector('h3')) {
      left = child; // The one with the h3 is the left (content)
    }
    if (child.querySelector('img')) {
      right = child.querySelector('img');
    }
  });

  // Fallback: If structure changes, try typical selectors
  if (!left) left = card.querySelector('.flex.flex-col');
  if (!right) right = card.querySelector('img');

  // Only push row if both columns are found
  if (left && right) {
    cells.push([left, right]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
