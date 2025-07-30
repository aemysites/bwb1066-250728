/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name exactly as required)
  const headerRow = ['Hero (hero17)'];

  // 2. Background image row (none in provided HTML)
  const bgRow = [''];

  // 3. Content row: include all headline and text content (reference existing elements for resiliency)

  // Locate the main headline, which is inside a .headline element (usually a h2, but could be h1-h6)
  let headline = null;
  const headlineContainer = element.querySelector('.headline');
  if (headlineContainer) {
    // Find the first heading inside the headline container
    headline = headlineContainer.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Locate the text/copy block, which may be inside .copy or .text-content-section
  let copyBlock = null;
  copyBlock = element.querySelector('.text-content-section') || element.querySelector('.copy');

  // Collect the parts to include, preserving order and structure
  const contentParts = [];
  if (headline) contentParts.push(headline);
  if (copyBlock) {
    // Avoid duplicating the heading if it's already inside the copy block
    if (!headline || !copyBlock.contains(headline)) {
      contentParts.push(copyBlock);
    } else {
      // If headline is inside copyBlock, just use the copyBlock
      if (contentParts.length === 0) contentParts.push(copyBlock);
    }
  }
  // If nothing found, fallback to including the whole element
  if (contentParts.length === 0) contentParts.push(element);

  const contentRow = [contentParts];

  // Build the table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
