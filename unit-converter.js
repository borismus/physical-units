(function(exports) {
// Array of mappings between user agent regular expressions and DPIs.
var DPIs = {
  "iPhone": 163,
  "iPad": 132,
  "Galaxy Nexus": 158,
  "Transformer Prime": 149,
  ".*": 128                 // Fallback to MacBook Air 13" and MacBook Pro 15".
};

// Chrome ignores units that it doesn't understand, so forced to override
// behavior of existing units. Browser vendors should create new units so that
// sites aren't broken.
//
//var PHYSICAL_UNITS = {'realin': 1, 'realmm': 25.4, 'realcm': 2.54};
var PHYSICAL_UNITS = {'in': 1, 'mm': 25.4, 'cm': 2.54};
var UNIT_REGEX = /([.0-9]+)([a-z]+)/;

function UnitConverter() {
  var scalingFactor = null;

  for (var reString in DPIs) {
    // Check if the user agent matches against one of the DPIs
    var re = new RegExp(reString);
    if (navigator.userAgent.match(re)) {
      // If it does, calculate the scaling factor
      scalingFactor = DPIs[reString];
      break;
    }
  }

  this.scalingFactor = scalingFactor;
}

/**
 * @return The number of pixels, given inches.
 */
UnitConverter.prototype.inchesToPixels = function(inches) {
  return inches * scalingFactor;
};

/**
 * @return The number of inches, given pixels.
 */
UnitConverter.prototype.pixelsToInches = function(pixels) {
  return pixels / scalingFactor;
};

/**
 * Given a string in the format Nunit, return the corresponding string in
 * pixels.
 *
 * Example input: "5realin", output: "23px".
 *
 * If an unknown unit is specified, return the original string.
 */
UnitConverter.prototype.toPixels = function(dimensionString) {
  var match = dimensionString.match(UNIT_REGEX);
  var value = match[1];
  var unit = match[2];

  // Check if the unit is supported.
  if (!PHYSICAL_UNITS[unit]) {
    return dimensionString;
  }
  // If it is, convert to inches.
  var unitsPerInch = PHYSICAL_UNITS[unit];
  var inches = value / unitsPerInch;
  // Convert inches to pixels.
  var pixels = parseInt(inches * this.scalingFactor);
  return pixels + 'px';
};

/**
 * @return The number of pixels, given inches.
 */
UnitConverter.prototype.mmToPixels = function(mms) {
  var inches = mms / PHYSICAL_UNITS['mm'];
  return this.inchesToPixels(inches);
}

UnitConverter.prototype.physicalWidth = function() {
  return pixelsToInches(window.offsetWidth);
}

UnitConverter.prototype.physicalHeight = function() {
  return pixelsToInches(window.offsetHeight);
}

exports.UnitConverter = UnitConverter;

})(window);
