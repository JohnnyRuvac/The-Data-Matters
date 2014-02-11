<?
/**
 * Implementation of preprocess_page().
 */
function datamatters_static_preprocess_page(&$vars) {

  //
  // Loading taxonomy for template usage
  //

  $vars['field'] = taxonomy_get_tree(3);
  $vars['countries'] = taxonomy_get_tree(2);

}