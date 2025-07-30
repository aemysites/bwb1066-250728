/* global WebImporter */
export default function parse(element, { document }) {
  // Find the flex row that arranges the columns (handles both left-image and right-image layouts)
  let flexRow = null;
  element.querySelectorAll('div').forEach((div) => {
    const cls = div.className || '';
    if ((cls.includes('flex-row') || cls.includes('flex-row-reverse')) && cls.includes('flex')) {
      flexRow = div;
    }
  });
  if (!flexRow) return;

  // The columns are direct children of the flex row
  const columns = Array.from(flexRow.children);
  // Defensive: filter out any zero-width/empty columns
  const columnEls = columns.filter(col => col && (col.textContent.trim() || col.querySelector('img')));
  if (columnEls.length === 0) return;

  // Table structure: header row, then columns row
  const headerRow = ['Columns (columns1)'];
  const contentRow = columnEls;
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
