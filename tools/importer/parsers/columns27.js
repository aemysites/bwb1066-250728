/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector(':scope > .grid');
  if (!grid) return;
  const cols = grid.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Extract left and right column content
  const leftContent = document.createElement('div');
  const leftHeadline = cols[0].querySelector('h3');
  if (leftHeadline) leftContent.appendChild(leftHeadline);
  const leftPara = cols[0].querySelector('p');
  if (leftPara) leftContent.appendChild(leftPara);

  const rightContent = document.createElement('div');
  const img = cols[1].querySelector('img');
  if (img) rightContent.appendChild(img);

  // Build the table:
  // Header row: single cell (spanning both columns visually)
  // Data row: two cells for the columns
  const cells = [
    ['Columns (columns27)'],
    [leftContent, rightContent]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Manually set the header cell to have colspan equal to the number of columns
  const th = table.querySelector('tr:first-child th');
  if (th && table.rows[1] && table.rows[1].cells.length > 1) {
    th.setAttribute('colspan', table.rows[1].cells.length);
  }

  element.replaceWith(table);
}
