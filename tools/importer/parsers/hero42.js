/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as specified
  const headerRow = ['Hero (hero42)'];
  // Second row: background image (optional). If present in inline style or CSS class, convert to an image element.
  // In this HTML, there is no <img> or inline background-image, so leave cell empty.
  const bgRow = [''];
  // Third row: Title, subheading, CTA, etc (all main text content)
  // The content is inside .headline, which contains the roofline ("Blog"), and h2 ("The Supply Chain Compass").

  // Try to locate the .headline div
  let headlineDiv = element.querySelector('.headline');
  // Fallback: if for some reason .headline is missing, use all text content in the container
  let contentCell = '';
  if (headlineDiv) {
    contentCell = headlineDiv;
  } else {
    // Fallback: Try to get any h2/h1/strong text
    const fallback = element.querySelector('h2, h1, strong, p');
    if (fallback) {
      contentCell = fallback;
    }
  }
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
