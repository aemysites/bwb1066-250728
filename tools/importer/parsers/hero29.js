/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\((['"]?)([^'")]+)\1\)/i);
    return match ? match[2] : null;
  }

  // 1. Header row, must match EXACTLY
  const headerRow = ['Hero (hero29)'];

  // 2. Background image row: must be an <img> if present, else empty string
  const bgUrl = getBackgroundImageUrl(element);
  let bgRow = [''];
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    bgRow = [img];
  }

  // 3. Content row: preserve semantic structure, reference DOM nodes
  // Goal: include all headline (roofline), heading, subheading, and paragraph content
  // We will reference the actual elements, not their clones, to preserve formatting.
  const contentElements = [];
  const contentRoot = element.querySelector('.col-span-12');
  if (contentRoot) {
    // Roofline (subheading/top line)
    const roofline = contentRoot.querySelector('.roofline');
    if (roofline) contentElements.push(roofline);
    // Headline: h1/h2 in col-span-6 (first one has the heading)
    const headlineCol = contentRoot.querySelectorAll('.col-span-6');
    if (headlineCol.length > 0) {
      // Title (h2/h1 etc.)
      const heading = headlineCol[0].querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) contentElements.push(heading);
    }
    // Subheading/paragraph: second .col-span-6 (if available)
    if (headlineCol.length > 1) {
      // Collect all elements (paragraphs, etc.) from this column
      const children = Array.from(headlineCol[1].childNodes).filter(n => {
        // Only keep elements or meaningful text
        return n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      });
      if (children.length > 0) {
        contentElements.push(...children);
      }
    }
  }
  // Fallback: If for some reason above selectors fail, include all text
  if (contentElements.length === 0 && contentRoot) {
    contentElements.push(document.createTextNode(contentRoot.textContent.trim()));
  }
  if (contentElements.length === 0) {
    contentElements.push(document.createTextNode(element.textContent.trim()));
  }

  const contentRow = [contentElements];
  // Compose table as per example: 1 col, 3 rows (header, image, content)
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
