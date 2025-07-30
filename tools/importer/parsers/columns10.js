/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex container that holds the two columns
  const mainFlex = element.querySelector(
    '.flex.lg\:flex-row-reverse, .flex.lg\:flex-row'
  );
  if (!mainFlex) return;

  // Get direct children as columns
  const colDivs = Array.from(mainFlex.children).filter(el => el.tagName === 'DIV');
  if (colDivs.length < 2) return;

  // Identify which is image col and which is text col
  let imgCol, textCol;
  if (colDivs[0].querySelector('img')) {
    imgCol = colDivs[0];
    textCol = colDivs[1];
  } else if (colDivs[1].querySelector('img')) {
    imgCol = colDivs[1];
    textCol = colDivs[0];
  } else {
    // Fallback: just use order if no images
    textCol = colDivs[0];
    imgCol = colDivs[1];
  }

  // For the text column, include all direct children (headings, text, cta, etc)
  const textContentArr = Array.from(textCol.childNodes).filter(node => {
    // include all elements and text nodes that have content (ignore empty text)
    return (node.nodeType !== 3) || (node.nodeType === 3 && node.textContent.trim().length > 0);
  });

  // For the image column, include entire column so we get image plus any wrapping or future captions
  const imageContentArr = [imgCol];

  // Compose rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = [textContentArr, imageContentArr];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
