/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs (labels/buttons)
  const tabContainer = element.querySelector('.tab-container');
  if (!tabContainer) return;
  const tabButtons = Array.from(tabContainer.querySelectorAll('button.tab'));

  // 2. Find all tab content sections (should be in order)
  const tabContentWrapper = element.querySelector('.tab-content-wrapper');
  if (!tabContentWrapper) return;
  const tabContents = Array.from(tabContentWrapper.children);

  // Defensive: ensure we have the same number of labels and contents
  const count = Math.min(tabButtons.length, tabContents.length);

  // 3. Build the rows for the table. Header first
  const rows = [];
  rows.push(['Tabs (tabs39)']);

  // 4. For each tab, extract the label and its content
  for (let i = 0; i < count; i++) {
    const tabBtn = tabButtons[i];
    // Extract label text from the button.
    // Remove any trailing SVG chevrons/mobile icons
    let label = '';
    // Get text nodes only
    tabBtn.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        label += node.textContent;
      }
    });
    label = label.trim();
    // Fallback if no text node found
    if (!label) {
      label = tabBtn.textContent.trim();
    }

    // The corresponding content block
    const tabContent = tabContents[i];
    // To ensure we only get relevant content & maintain semantic structure,
    // we'll reference the main flex container inside tabContent, if present
    let contentCell = tabContent.querySelector('.flex');
    // If missing, fallback to tabContent itself
    if (!contentCell) contentCell = tabContent;

    rows.push([label, contentCell]);
  }

  // 5. Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
