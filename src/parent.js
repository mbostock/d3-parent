'use strict';
var all_parents,
    direct_parent,
    closest_parent,
    single_parent,
    iterator,
    selector_to_nodes,
    parent;
// match all parents with linear iteration
all_parents = function(node, candidates) {
  var candidate,
      results;
  results = [];
  for (var i = 0, ilength = candidates.length; i < ilength; i++) {
    candidate = candidates[i];
    if (candidate.contains(node)) {
      results.push(candidate);
    }
  }
  return results;
};
// return the immediate parentNode
direct_parent = function(node) {
  if (node.parentNode) {
    return node.parentNode;
  } else {
    return null;
  }
};
// match by iterating upward through the DOM. this is an
// expensive operation and should be avoided when another
// method will suffice.
closest_parent = function(node, candidates) {
  var results,
      match,
      end;
  results = [];
  // iterate upward from starting node
  while (!match && !end && node.parentNode) {
    // reassign node to its own parent
    node = node.parentNode;
    end = !node.parentNode;
    // test selection for current iterator node
    match = candidates.indexOf(node) !== -1;
  }
  // if there is a match, add it to the results
  if (match) {
    results.push(node);
  }
  return results;
};
// find exactly one parent node, optimizing iteration when possible
single_parent = function(node, candidates) {
  var results;
  // try linear search first
  results = all_parents(node, candidates);
  // if linear search matches multiple candidates,
  // retry hierarchically to find the single closest parent
  if (results.length && results.length > 1) {
    results = closest_parent(node, candidates);
  }
  return results;
};
// reformat a multidimensional array of nodes as a d3 selection
// optionally inserting a processing function along the way
iterator = function(input_selection, processor) {
  var output_selection,
      input_group,
      output_group,
      input_node,
      output_node;
  if (typeof d3 !== 'undefined') {
    output_selection = d3.select();
  } else {
    output_selection = {_groups: [], _parents: []};
    output_selection.prototype = input_selection;
  }
  output_selection._groups.shift();
  // loop through groups
  for (var i = 0, ilength = input_selection._groups.length; i < ilength; i++) {
    input_group = input_selection._groups[i]
    output_group = Object.create(input_group);
    // loop through nodes
    for (var j = 0, jlength = input_group.length; j < jlength; j++) {
      input_node = input_group[j];
      output_node = processor(input_node)[0]
      output_group[j] = output_node;
    }
    output_selection._groups.push(output_group);
    output_selection._parents = input_selection._parents;
  }
  return output_selection;
};
// fetch an array of matching nodes for a DOM selector string
selector_to_nodes = function(selector) {
  var node_list,
      nodes;
  if (!selector) {
    console.error('missing DOM selector string');
    return;
  }
  node_list = document.querySelectorAll(selector);
  // convert to array
  nodes = Array.prototype.slice.call(node_list);
  return nodes;
};
// public function to select single parent matching a selector
parent = function(selector) {
  var selection,
      candidates,
      processor,
      results;
  selection = this;
  if (!selector) {
    processor = function(node) {
      return direct_parent(node);
    };
  } else {
    candidates = selector_to_nodes(selector);
    processor = function(node) {
      return single_parent(node, candidates);
    };
  }
  results = iterator(selection, processor);
  return results;
};

export default parent