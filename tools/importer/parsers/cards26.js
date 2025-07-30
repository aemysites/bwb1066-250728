/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find correct slider root, cards are inside <ul class="splide__list">
  const slider = element.querySelector('.slider, [class*=slider]');
  if (!slider) return;
  const cardList = slider.querySelector('ul.splide__list');
  if (!cardList) return;

  // Extract each card (li.splide__slide)
  const cardNodes = cardList.querySelectorAll('li.splide__slide');
  cardNodes.forEach((li) => {
    // IMAGE cell
    let imgEl = null;
    const imgContainer = li.querySelector('.bg-gray-warm');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // TEXT cell: grab the title (h3) and description (div.text-white), maintaining order
    const textContainer = li.querySelector('.bg-blue-midnightblue');
    const textParts = [];
    if (textContainer) {
      const heading = textContainer.querySelector('h3');
      if (heading) textParts.push(heading);
      // Grab all description text divs (there could be more than one)
      const descriptions = textContainer.querySelectorAll('div.text-white');
      descriptions.forEach(desc => textParts.push(desc));
    }
    rows.push([
      imgEl,
      textParts.length === 1 ? textParts[0] : textParts
    ]);
  });

  // Create and replace with cards table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
