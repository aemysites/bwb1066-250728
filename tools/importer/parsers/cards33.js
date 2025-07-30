/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards33)'];
  // Find the grid of cards
  const grid = element.querySelector('.grid');
  if (!grid) return;
  const cardDivs = Array.from(grid.children);

  // Helper to build text content cell for a card
  function buildTextCell(card) {
    const infoCol = card.querySelector('.flex.flex-col.gap-6');
    if (!infoCol) return '';
    // Use direct children for structure
    const [metaRow, headingRow, descRow] = Array.from(infoCol.children);
    // Create a container div for card text content
    const contentDiv = document.createElement('div');

    // Extract and append meta/category if present
    if (metaRow) {
      // Try to extract the label text
      const labelSpan = metaRow.querySelector('span:last-child');
      if (labelSpan && labelSpan.textContent) {
        const metaDiv = document.createElement('div');
        metaDiv.appendChild(document.createTextNode(labelSpan.textContent));
        contentDiv.appendChild(metaDiv);
      }
    }

    // Extract title as a heading
    if (headingRow && headingRow.textContent) {
      const h3 = document.createElement('h3');
      h3.textContent = headingRow.textContent.trim();
      contentDiv.appendChild(h3);
    }

    // Extract description
    if (descRow && descRow.textContent) {
      const p = document.createElement('p');
      p.textContent = descRow.textContent.trim();
      contentDiv.appendChild(p);
    }

    // Extract CTA link from the overlay anchor
    const link = card.querySelector('a');
    if (link && link.href) {
      const ctaDiv = document.createElement('div');
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.textContent.trim();
      ctaDiv.appendChild(cta);
      contentDiv.appendChild(ctaDiv);
    }

    return contentDiv;
  }

  // For each card, build a row [image, text content]
  const rows = cardDivs.map(card => {
    // Get the image
    const img = card.querySelector('img');
    let imageEl = '';
    if (img) {
      imageEl = img;
    }
    const textCell = buildTextCell(card);
    return [imageEl, textCell];
  });

  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
