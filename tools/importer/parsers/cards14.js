/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in example
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find the actual grid containing cards - second .grid.grid-cols-12
  const grids = element.querySelectorAll('.grid.grid-cols-12');
  let cardsGrid = null;
  if (grids.length > 1) {
    cardsGrid = grids[1];
  } else if (grids.length === 1) {
    cardsGrid = grids[0];
  } else {
    return;
  }

  // Each card is either an <a> or (rarely) a <div> (if structural html changes); here, we use direct children
  const cards = Array.from(cardsGrid.children).filter(node => {
    // Only pick elements that have an img or h3 (icon and heading present in each card)
    return (
      (node.querySelector && node.querySelector('img')) ||
      (node.querySelector && node.querySelector('h3'))
    );
  });
  
  cards.forEach(card => {
    // Find the first <img> (for the icon)
    const img = card.querySelector('img') || '';
    // Compose the entire text block from the card
    // The heading is the <h3>
    const heading = card.querySelector('h3');
    // The description is the first div.allow-breaks AFTER h3, or fallback for any div.allow-breaks
    let desc = null;
    const allowBreaks = card.querySelectorAll('div.allow-breaks');
    if (allowBreaks.length === 1) {
      desc = allowBreaks[0];
    } else if (allowBreaks.length > 1 && heading) {
      // Get the allow-breaks after the heading
      for (let i = 0; i < allowBreaks.length; i++) {
        if (allowBreaks[i].compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING) {
          desc = allowBreaks[i];
          break;
        }
      }
      // fallback
      if (!desc) desc = allowBreaks[0];
    }
    // If no allow-breaks, fallback to next div or p
    if (!desc) {
      desc = card.querySelector('p');
    }
    // Check for a CTA/link inside the description
    let cta = null;
    if (desc) {
      cta = desc.querySelector('a[href]:not([role="presentation"])');
    }
    // If not inside desc, is there one outside?
    if (!cta) {
      cta = card.querySelector('a[href]:not([role="presentation"])');
      if (cta && cta.closest('a[role="presentation"]') === cta) {
        // This is the card wrapper itself, ignore
        cta = null;
      }
    }
    // Compose text content array
    const textElements = [];
    if (heading) textElements.push(heading);
    if (desc) {
      // If desc contains a link, remove it from desc so it is not included twice
      if (cta && desc.contains(cta)) {
        const cleanDesc = desc.cloneNode(true);
        cleanDesc.querySelectorAll('a[href]:not([role="presentation"])').forEach(a => a.remove());
        // Only push if the cleaned description has text
        if (cleanDesc.textContent.trim()) textElements.push(cleanDesc);
      } else {
        textElements.push(desc);
      }
    }
    if (cta) textElements.push(cta);
    // Defensive: if no content, grab all text except the icon
    if (textElements.length === 0) {
      let possibleText = card.cloneNode(true);
      const iconDiv = possibleText.querySelector('.h14');
      if (iconDiv) iconDiv.remove();
      possibleText.querySelectorAll('img').forEach(im => im.remove());
      if (possibleText.textContent.trim()) textElements.push(document.createTextNode(possibleText.textContent.trim()));
    }
    rows.push([img, textElements.length === 1 ? textElements[0] : textElements]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
