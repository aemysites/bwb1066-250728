/* global WebImporter */
export default function parse(element, { document }) {
  // The jump-links block is a multi-column block: each link goes in its own column in a single table row
  // 1. Find the <ul> with links
  const ul = element.querySelector('ul');
  if (!ul) return;
  // 2. Extract all direct <a> links from <li>
  const links = Array.from(ul.querySelectorAll(':scope > li > a'));
  // 3. Compose the header row (single cell)
  const headerRow = ['Columns (columns8)'];
  // 4. Compose the content row (one link per column)
  const contentRow = links;
  // 5. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // 6. Replace the original element
  element.replaceWith(table);
}
