/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children divs that are column items
  const columnBlocks = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, include the (possibly visually-hidden) link and image
  // We'll wrap the image in the link if both are present, otherwise just include the image
  const rowCells = columnBlocks.map((col) => {
    const link = col.querySelector('a');
    const img = col.querySelector('img');
    if (link && img) {
      // Move the img into the link if not already contained
      if (!link.contains(img)) {
        link.appendChild(img);
      }
      return link;
    } else if (img) {
      return img;
    } else if (link) {
      return link;
    } else {
      return document.createTextNode('');
    }
  });

  // The table header must be a single cell/column with the exact label
  const headerRow = ['Columns (columns9)'];
  const tableData = [headerRow, rowCells];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
