/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header as per block spec
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find all card containers (direct children with slidein-animation class)
  const cards = element.querySelectorAll(':scope > .slidein-animation');
  cards.forEach((card) => {
    // CARD IMAGE CELL
    // First child div (contains the image)
    let imgCell = null;
    const imgDiv = card.querySelector(':scope > div');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      imgCell = img || imgDiv;
    }

    // CARD TEXT CELL
    // Second child: usually heading/title
    // Third child: usually description (richtext)
    const textCellParts = [];
    if (card.children.length > 1) {
      const titleDiv = card.children[1];
      // Use the contained <h4> if present, else use everything in the div
      const heading = titleDiv.querySelector('h4, .heading-sm');
      if (heading) textCellParts.push(heading);
    }
    if (card.children.length > 2) {
      const descDiv = card.children[2];
      // Use the contained .richtext if present, else use the div itself
      const richtext = descDiv.querySelector('.richtext');
      if (richtext) textCellParts.push(richtext);
      else textCellParts.push(descDiv);
    }
    // Defensive: if neither title nor description found, fall back to card text
    if (textCellParts.length === 0) {
      textCellParts.push(card);
    }

    rows.push([imgCell, textCellParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
