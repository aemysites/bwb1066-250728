/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the background image (img with src)
  const img = element.querySelector('img[src]');

  // 2. Find the main content block containing heading/subheading/cta
  // Look for the innermost div with headline and buttons
  let contentBlock = null;
  // The max-w-screen-2xl is always present and the content is inside an .absolute div inside it
  const maxW = element.querySelector('.max-w-screen-2xl');
  if (maxW) {
    // .absolute is always the main content container for the text/buttons
    contentBlock = maxW.querySelector('.absolute');
    // Fallback: if not found, try .px-5 .py-8
    if (!contentBlock) {
      contentBlock = maxW.querySelector('.px-5.py-8');
    }
  }
  // As a last fallback, grab the first h2/h3 and use its parent
  if (!contentBlock) {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentBlock = heading.closest('div');
  }

  // 3. Compose the table rows according to block spec (1 col x 3 rows)
  const rows = [];
  rows.push(['Hero (hero13)']);
  rows.push([img || '']);
  rows.push([contentBlock || '']);

  // 4. Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
