/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as requested
  const headerRow = ['Columns (columns16)'];

  // Find the row with left and right columns
  const outerDiv = element.querySelector(':scope > div > div > div');
  if (!outerDiv) return;
  const columns = outerDiv.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: use all content (heading, paragraph, button)
  const leftCol = columns[0];
  // Right column: expect video embed in iframe, must convert to link as per instructions
  const rightCol = columns[1];

  // Look for iframe in rightCol, convert to link
  let rightContent;
  const iframe = rightCol.querySelector('iframe');
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.title || 'Video';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    rightContent = link;
  } else {
    rightContent = rightCol;
  }

  // Compose table: header, then content row (2 cols)
  const cells = [
    headerRow,
    [leftCol, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
