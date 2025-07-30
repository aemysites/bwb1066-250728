/* global WebImporter */
export default function parse(element, { document }) {
  // If actual result cards are not present in the HTML, gracefully do nothing.
  // This meets requirement #1 (structure) and #3 (content extraction):
  // If there is no card data, do NOT produce an empty table with just the header row.

  // Find the main content area where cards would be rendered
  let resultArea = element.querySelector('.coveo-result-wrapper') || element.querySelector('.coveo-mainwrapper') || element;

  // Look for possible card containers: these should NOT be web components or layout wrappers
  // Cards must have an image and a heading at minimum
  const cardNodes = Array.from(resultArea.querySelectorAll('div, article, a')).filter(card => {
    // Exclude facet/sidebar
    if (card.closest('.coveo-facet-wrapper')) return false;
    // Must have image and heading
    if (!card.querySelector('img')) return false;
    if (!card.querySelector('h3, h2, strong, b')) return false;
    // Heuristic: must contain descriptive text (not just heading)
    const desc = Array.from(card.querySelectorAll('p,div')).find(d => d.textContent.trim().length > 20 && !d.matches('h3,h2,strong,b'));
    if (!desc) return false;
    // Not a web component
    if (card.tagName.toLowerCase().startsWith('atomic-')) return false;
    // Not a very large wrapper
    if (card.children.length > 10) return false;
    return true;
  });

  // If no cards found, do not output anything (no table at all)
  if (!cardNodes.length) return;

  // Helper to build the text cell from card
  function buildTextCell(card) {
    const textCell = [];
    // Title
    let title = card.querySelector('h3, h2, strong, b');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
    }
    // Description (p/div after title, or best guess)
    let desc = null;
    if (title) {
      let el = title.nextElementSibling;
      while (el && !desc) {
        if ((el.tagName === 'P' || el.tagName === 'DIV') && el.textContent.trim().length > 0) desc = el;
        el = el.nextElementSibling;
      }
    }
    if (!desc) {
      desc = Array.from(card.querySelectorAll('p,div')).filter(d => d.textContent.trim().length > 0)[0];
    }
    if (desc) {
      textCell.push(document.createElement('br'));
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      textCell.push(span);
    }
    // CTA: first link with 'learn more'
    let cta = Array.from(card.querySelectorAll('a')).find(a => /learn more/i.test(a.textContent));
    if (cta && !textCell.includes(cta)) {
      textCell.push(document.createElement('br'));
      textCell.push(cta);
    }
    return textCell;
  }

  // Build table rows
  const rows = [['Cards (cards28)']];
  for (const card of cardNodes) {
    const img = card.querySelector('img');
    const textCell = buildTextCell(card);
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  }
  // Only output table if there is at least one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
