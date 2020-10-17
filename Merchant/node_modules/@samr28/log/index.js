let c = require("./const.js");

// Constructed color map
let colors = c.DEFAULT_TYPES;
let colorOn = true;
let date = true;

let debug = false;

module.exports = {
  /**
   * Setup colors
   * @param   {Object}  params  Colors
   */
  setColors: function(params) {
    // Map keys with colors to actual color values
    for (let key in params) {
      if (!c.COLORS.hasOwnProperty(params[key].toUpperCase())) {
        console.log(`LogJS Internal Error: ${new Error(`${params[key]} is not a valid color. Please see the readme for a list of valid colors.`)}`);
      } else {
        colors[key.toUpperCase()] = c.COLORS[params[key].toUpperCase()];
      }
    }
  },
  color: function(isOn) {
    colorOn = isOn;
  },
  date: function(isOn) {
    date = isOn;
  },
  on: function() {
    debug = true;
  },
  off: function() {
    debug = false;
  },
  log: function(info, mod) {
    if (debug) {
      let msg = "";
      if (date) {
        if (colorOn) {
          msg = `\x1b[90m[${new Date()}]\x1b[0m `;
        } else {
          msg = `[${new Date()}] `;
        }
      }
      if (mod) {
        if (colors[mod.toUpperCase()] && colorOn) {
          msg += colors[mod.toUpperCase()];
        }
        msg += `[${mod.charAt(0).toUpperCase() + mod.substr(1).toLowerCase()}]`;
        msg += colors.RESET;
        msg += ` `;
      }
      msg += info;
      console.log(msg);
    }
  }
};
