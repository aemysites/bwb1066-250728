/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Cards (cards43)'];

  // Get all card elements (direct children)
  const cards = element.querySelectorAll(':scope > .card-item');

  const rows = Array.from(cards).map(card => {
    // Image in the left cell
    let img = null;
    const imgContainer = card.querySelector(':scope > .text-center');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Right cell: text content (title, description, CTA)
    const contentWrapper = card.querySelector('.flex-col.flex.gap-4.grow.justify-between');
    const textCellContent = [];
    if (contentWrapper) {
      // There may be two main divs: one for text, one for CTA (optional)
      const sections = contentWrapper.querySelectorAll(':scope > div');
      if (sections.length > 0) {
        // First div: contains title (h3), and description (div)
        const title = sections[0].querySelector('h3');
        if (title) {
          textCellContent.push(title);
        }
        // Description is the first div under sections[0] (not h3)
        const description = Array.from(sections[0].children).find(child => child.tagName === 'DIV');
        if (description) {
          textCellContent.push(description);
        }
      }
      // Second div (if present): may include a CTA link
      if (sections.length > 1) {
        const ctaLink = sections[1].querySelector('a');
        if (ctaLink) {
          textCellContent.push(ctaLink);
        }
      }
    }

    return [img, textCellContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
