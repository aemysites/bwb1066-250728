/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main section
  const section = element.querySelector('section');
  if (!section) return;

  // Find the outermost container under section
  let mainWrapper = section.querySelector('div.lg\:mx-auto, div.px-5, div.lg\:px-0');
  if (!mainWrapper) mainWrapper = section.querySelector('div');
  if (!mainWrapper) return;

  // Get all grid children (there are usually 4: logo, contact, navigation columns, legal/social)
  const grids = mainWrapper.querySelectorAll(':scope > div');
  // Defensive: fallback if not enough grids
  if (grids.length < 4) return;

  // --- Column 1: Everything in the first two grid columns (logo, contact info, contact btn) ---
  const leftNodes = [];
  [grids[0], grids[1]].forEach(grid => {
    // Include all child nodes except empty text nodes
    Array.from(grid.childNodes).forEach(node => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        leftNodes.push(node);
      }
    });
  });

  // --- Column 2: Navigation Columns ---
  const midNodes = [];
  const navGrid = grids[2];
  // Get all child columns (usually 3, but could be more/less)
  Array.from(navGrid.children).forEach(col => {
    // Include the entire column for robustness and all text
    midNodes.push(col);
  });

  // --- Column 3: Legal links + copyright + socials ---
  const rightNodes = [];
  const legalSocialGrid = grids[3];
  // Get the first grid (legal link columns)
  const legalGrid = legalSocialGrid.querySelector('div.grid');
  if (legalGrid) {
    Array.from(legalGrid.children).forEach(col => {
      rightNodes.push(col);
    });
  }
  // Copyright
  const copyright = legalSocialGrid.querySelector('p');
  if (copyright) rightNodes.push(copyright);
  // Social icons
  const socialUl = legalSocialGrid.querySelector('ul.flex');
  if (socialUl) rightNodes.push(socialUl);

  // Build the table in a way that matches the example structure
  // Header is always EXACTLY as specified in the task
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftNodes, midNodes, rightNodes];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
