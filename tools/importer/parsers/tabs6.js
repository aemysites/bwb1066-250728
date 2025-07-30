/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row: block name only, in a single column
  const headerRow = ['Tabs (tabs6)'];

  // Find the .tab-container, which has both tab menu and content wrapper
  const tabContainer = element.querySelector('.tab-container');
  if (!tabContainer) return;

  // The first child is the menu of .tab buttons, the second is content panels
  const tabMenu = tabContainer.children[0];
  const tabContentWrapper = tabContainer.children[1];
  if (!tabMenu || !tabContentWrapper) return;

  // Get all tab buttons (for tab labels)
  const tabLabels = Array.from(tabMenu.querySelectorAll('.tab'));
  // Get all tab content panels (for tab content)
  const tabPanels = Array.from(tabContentWrapper.children);

  // Only process as many tabs as there are both labels and panels
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Each row: [tab label string, referenced tab content block element]
  const rows = [];
  for (let i = 0; i < count; i++) {
    // Label: textContent, trimmed
    const label = tabLabels[i].textContent.trim();
    // Content: reference the main content div inside the tab panel (usually .flex)
    // Fallback to the panel itself if .flex is missing
    let contentBlock = tabPanels[i].querySelector('.flex') || tabPanels[i];
    // If .flex is empty or hidden, fallback to the panel
    if (!contentBlock || contentBlock.childElementCount === 0) contentBlock = tabPanels[i];
    rows.push([label, contentBlock]);
  }

  // Compose table: header row (block name only, single cell), then one row per tab: [label, content]
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
