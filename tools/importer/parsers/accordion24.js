/* global WebImporter */
export default function parse(element, { document }) {
  // Get the accordion wrapper
  const container = element.querySelector('.accordion-content-wrapper') || element;
  const children = Array.from(container.children);

  // Prepare the table rows
  const rows = [];

  // Header row: must be a cell with colspan=2
  const th = document.createElement('th');
  th.setAttribute('colspan', '2');
  th.textContent = 'Accordion (accordion24)';
  rows.push([th]);

  // Each accordion item is two columns: title and content
  for (let i = 0; i < children.length - 1; i += 2) {
    const button = children[i];
    const contentDiv = children[i + 1];
    // Use the inner span for the title if present
    let titleElem = button.querySelector('span') || document.createTextNode(button.textContent.trim());
    // Use .richtext for answer if present, else whole div
    let contentElem = contentDiv.querySelector('.richtext') || contentDiv;
    rows.push([titleElem, contentElem]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
