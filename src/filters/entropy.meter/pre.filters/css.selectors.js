/**
 * Remove strings which look like CSS selectors.
 *
 * Example <[entropy] : selector>:
 * - [3.70] .disable-user-selection
 * - [3.50] #username-input
 **/

/* eslint no-useless-escape: "off" */
const regex = new RegExp(
  // #foo, .bar, #foo-bar, .foo_bar, .foo.bar, #foo.bar */
  '(^([#.][a-z0-9_-]+){1,}$)|' +
  // foo>bar
  '(^([#.]?[a-z0-9_-]+>){1,}([#.]?[a-z0-9_-]+)$)|' +
  // input[val='test'], button[value="submit"]
  '(^[#.]?[a-z]+\\[[a-z]+(.?=)[^\\]]+\\]$)|' +
  // [name="submit"], [name^="submit"]
  '(^\\[[a-z]+(.?=)[^\\]]+\\]$)'
, 'i');

module.exports = s => !regex.test(s);
