/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex row that splits the content in two columns
  // It has two direct children: one for text, one for image
  const mainFlexRow = Array.from(element.querySelectorAll(':scope div.flex')).find(row => {
    // A row is valid if it has two direct children and at least one child contains an <img>
    const children = Array.from(row.children);
    return children.length === 2 && (children[0].querySelector('img') || children[1].querySelector('img'));
  });
  if (!mainFlexRow) return;

  let [colA, colB] = mainFlexRow.children;
  // Determine which is the text/media column and which is the image column
  // The text/media column has a headline or richtext
  const colAisText = colA.querySelector('.headline, h1, h2, h3, .richtext, .ck-content, p');
  const colBisText = colB.querySelector('.headline, h1, h2, h3, .richtext, .ck-content, p');

  // We want col1 = text, col2 = image (to match screenshot: text left, image right)
  let col1, col2;
  if (colAisText && !colBisText) {
    col1 = colA;
    col2 = colB;
  } else if (colBisText && !colAisText) {
    col1 = colB;
    col2 = colA;
  } else {
    // ambiguous: fallback
    col1 = colA;
    col2 = colB;
  }

  // Create the table block
  const headerRow = ['Columns (columns2)'];
  const contentRow = [col1, col2];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
