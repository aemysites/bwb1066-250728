/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion content wrapper
  const container = element.querySelector('.pccordion-container, .accordion-container');
  if (!container) return;
  const wrapper = container.querySelector('.accordion-content-wrapper');
  if (!wrapper) return;
  const children = Array.from(wrapper.children);

  // Parse button/content pairs
  const rows = [['Accordion (accordion38)']];
  for (let i = 0; i < children.length; i++) {
    const btn = children[i];
    if (btn.tagName === 'BUTTON') {
      // Title: get the span inside button, fallback to button if missing
      const titleSpan = btn.querySelector('span');
      const titleElem = titleSpan ? titleSpan : btn;
      // Content: next sibling div, use .richtext content if present
      const contentDiv = children[i + 1];
      let contentElem = null;
      if (contentDiv && contentDiv.tagName === 'DIV') {
        const rich = contentDiv.querySelector('.richtext');
        contentElem = rich ? rich : contentDiv;
        i++; // Skip the content div for next iteration
      } else {
        contentElem = document.createTextNode('');
      }
      rows.push([titleElem, contentElem]);
    }
  }
  // Build and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
