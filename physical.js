var STYLES = [
  'width', 'height',
  'min-width', 'min-height',
  'max-width', 'max-height',
  'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
  'font-size', 'line-height',
  'top', 'bottom', 'left', 'right'];

var converter = new UnitConverter();

/**
 * Gets all elements in the page.
 */
function getAllElements() {
  var treeWalker = document.createTreeWalker(document.body,
    NodeFilter.SHOW_ELEMENT, {
      acceptNode: function(node) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }, false
  );
  var nodeList = [];
  while(treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
  return nodeList;
}

/**
 * Given an element and a CSS style name, check if real units are specified,
 * and if so, change to pixels.
 */
function convertUnits(element) {
  // Iterate through important styles, and convert to px if they are specified.
  for (var i = 0; i < STYLES.length; i++) {
    var styleName = STYLES[i];
    var style = element.style[styleName]
    if (style) {
      var newStyle = converter.toPixels(style);
      element.style[styleName] = newStyle;
    }
  }
}

var elements = getAllElements();
for (var i = 0; i < elements.length; i++) {
  var el = elements[i];
  convertUnits(el);
}
