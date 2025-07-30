/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Find all card items - direct children only
  const cards = element.querySelectorAll(':scope > .card-item');
  cards.forEach((card) => {
    // FIRST CELL: image or icon (mandatory)
    let img = null;
    // The image is inside a .text-center div
    const imgWrapper = card.querySelector(':scope > .text-center');
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }
    // If not found, leave as null, which will create an empty cell

    // SECOND CELL: text cell (title, description, CTA)
    // The text/cta area is inside .flex-col.flex.gap-4
    const contentArea = card.querySelector('.flex-col.flex.gap-4');
    let textCellContent = [];
    if (contentArea) {
      // Find the title and description (first :scope > div)
      const firstDiv = contentArea.querySelector(':scope > div');
      if (firstDiv) {
        // Title (h3, optional)
        const title = firstDiv.querySelector('h3');
        if (title) textCellContent.push(title);
        // Description (div, optional, the one after h3)
        // Only push if not same as h3
        const descs = firstDiv.querySelectorAll('div');
        descs.forEach((desc) => {
          if (desc && desc !== title) textCellContent.push(desc);
        });
      }
      // Look for CTA (a) in the flex-row at the bottom
      const ctaFlexRow = contentArea.querySelector(':scope > .flex-row');
      if (ctaFlexRow) {
        const ctas = ctaFlexRow.querySelectorAll('a');
        ctas.forEach((cta) => {
          // Only include links with an actual href
          if (cta && cta.href) textCellContent.push(cta);
        });
      }
    }
    // If nothing found, fallback to the whole content area
    if (textCellContent.length === 0 && contentArea) {
      textCellContent = [contentArea];
    }
    // If still nothing found, fallback to empty string
    if (textCellContent.length === 0) {
      textCellContent = [''];
    }
    rows.push([img, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
