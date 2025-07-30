/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero37)'];

  // Background Image row: get background-image style
  let bgImageCell = '';
  const styleAttr = element.getAttribute('style') || '';
  const bgMatch = styleAttr.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
  if (bgMatch && bgMatch[1]) {
    const img = document.createElement('img');
    img.src = bgMatch[1];
    bgImageCell = img;
  }

  // Content row: try to extract main heading, subheading, paragraph, CTA
  const colSpans = element.querySelectorAll('.col-span-6');
  const contentEls = [];
  if (colSpans.length > 0) {
    // First col-span-6: normally headline
    const headline = colSpans[0].querySelector('h1,h2,h3,h4,h5,h6');
    if (headline) contentEls.push(headline);
    // If subheading or paragraph present below headline
    const extraPs = colSpans[0].querySelectorAll('p');
    extraPs.forEach((p) => {
      // Only include if not already in contentEls
      if (!contentEls.includes(p)) contentEls.push(p);
    });
  }
  if (colSpans.length > 1) {
    // Second col-span-6: possible subheading, content or CTA
    const ps = colSpans[1].querySelectorAll('p');
    ps.forEach((p) => contentEls.push(p));
    // Also add any direct children that could be links or buttons (CTAs)
    const linksOrButtons = colSpans[1].querySelectorAll('a,button');
    linksOrButtons.forEach((cta) => contentEls.push(cta));
  }

  // Fallback: if still empty, search whole element for at least a headline
  if (contentEls.length === 0) {
    const anyHeading = element.querySelector('h1,h2,h3,h4,h5,h6');
    if (anyHeading) contentEls.push(anyHeading);
  }

  // Always put as array for the cell
  const contentCell = contentEls.length === 1 ? [contentEls[0]] : contentEls.length > 1 ? contentEls : [''];

  // Assemble table rows
  const rows = [
    headerRow,
    [bgImageCell],
    [contentCell],
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
