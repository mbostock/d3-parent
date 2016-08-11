var tape = require('tape'),
    jsdom = require('jsdom'),
    d3_selection = require('d3-selection'),
    d3_parent = require('../');
    
tape('d3.parent() returns an instance of d3.selection', function(test) {
  var html,
      document,
      c;
  html = '<div class="a"><div class="b"><div class="c"></div></div></div>';
  document = jsdom.jsdom(html);
  a = d3_parent.select(document).select('div.a');
  b = d3_parent.select(document).select('div.b').parent();
  test.end();
});