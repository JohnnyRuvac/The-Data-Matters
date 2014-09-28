<?

function datamatters_static_js_alter(&$js, &$vars){
	$path = drupal_get_path_alias();
	
	$js['sites/all/modules/jquery_update/replace/jquery/1.8/jquery.min.js']['weight'] = -300;
	$js['sites/all/modules/jquery_update/replace/jquery/1.8/jquery.min.js']['data'] = 'sites/all/themes/datamatters_static/js/jquery.js';
	
	drupal_add_js( path_to_theme().'/js/bootstrap.min.js', array('weight' => -1000));
	drupal_add_js( path_to_theme().'/js/modernizr.js');
    if($path == "home" || $path == "map") drupal_add_js( path_to_theme().'/js/snap.svg-min.js');
	drupal_add_js( path_to_theme().'/js/jquery.mobile.custom.min.js');
	
	drupal_add_js( path_to_theme().'/js/jquery.mixitup.min.js');
	drupal_add_js( path_to_theme().'/js/script.js');
	
	if($path == "map" || $path == "home") drupal_add_js( path_to_theme().'/js/TweenMax.min.js');
  if($path == "home") drupal_add_js( path_to_theme().'/js/home.js');
	if($path == "map") drupal_add_js( path_to_theme().'/js/map.js', array('weight' => 1000));
  
}


function datamatters_static_preprocess_html(&$vars){
  global $base_path;

  if($vars['head_title_array']['title'] == "Page not found"){
    $vars['page']['content']['system_main']['main']['#markup'] = "404 - The page not found";
  }
  
  $node = menu_get_object();
  if(isset($node)){
      if($node->title == "Projects") $vars['classes_array'][] = "show_filter";
  }
  
    if( strpos($vars['head_title'], "Access denied") !== false) {
      $vars['classes_array'][] = "access-denied";  
    }
    
  
  if(isset($vars['page']['content']['system_main']['summary']['member_for'])){
    header('Location: '.$base_path);
    exit;
  }
  
}


function datamatters_static_form_alter(&$form, &$form_state, $form_id){
  if($form['#form_id'] == "user_login"){
    $form['name']['#attributes'] = array('placeholder' => t('Username'));
    $form['pass']['#attributes'] = array('placeholder' => t('Password'));
    $form['#suffix'] = "<a href='/user/password' class='forgot_button'>Forgot password?</a>";
    array_push($form['#submit'], 'datamatters_static_userlogin_submit');
  }

  
  if($form['#form_id'] == "user_pass"){
    $form['actions']['submit']['#value'] = "Send new password";
    $form['name']['#attributes'] = array('placeholder' => t('User or e-mail'));
  }
  
}


function datamatters_static_userlogin_submit(&$form, &$form_state){
  $form_state['redirect'] = 'node/22';
}

  
  
 //
 // Implementation of preprocess_page().
 //
function datamatters_static_preprocess_page(&$vars) {

  //
  // Loading taxonomy for template usage
  //

  $countries = taxonomy_get_tree(2);
  foreach($countries as $key => $value):
    $term = taxonomy_term_load($value->tid);
    if($term->field_status['und'][0]['value'] == 1){
      $vars['countries'][$key]['name'] = $value->name;
  	  $vars['countries'][$key]['tid'] = $value->tid;
  	  $vars['countries'][$key]['url']  = explode("/", drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid));
  	  $vars['countries'][$key]['url'] = "projects#country=".$vars['countries'][$key]['url'][1];
  	  $vars['tax_names'][$value->tid] = $value->name;
    }
  endforeach;

  $field = taxonomy_get_tree(3);
  foreach($field as $key => $value):
    $term = taxonomy_term_load($value->tid);
    if($term->field_status['und'][0]['value'] == 1){
  	  $vars['field'][$key]['name'] = $value->name;
  	  $vars['field'][$key]['tid'] = $value->tid;
      $vars['field'][$key]['url'] = explode("/", drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid));
  	  $vars['field'][$key]['url'] = "projects#field=".$vars['field'][$key]['url'][1];
  	  $vars['tax_names'][$value->tid] = $value->name;
	  }
  endforeach;
  
  $ngo = taxonomy_get_tree(4);
  foreach($ngo as $key => $value):
  	$term = taxonomy_term_load($value->tid);
		if($term->field_status['und'][0]['value'] == 1){
    	$vars['ngo'][$key]['name'] = $value->name;
    	$vars['ngo'][$key]['tid'] = $value->tid;
    	if(isset($term->field_email['und'][0])) $vars['ngo'][$key]['mail'] = $term->field_email['und'][0]['safe_value'];
    	if(isset($term->field_phone['und'][0])) $vars['ngo'][$key]['phone'] = $term->field_phone['und'][0]['safe_value'];
	  }
  endforeach;
  
  
  // Template override
  $path = drupal_get_path_alias();
  if($path == "map") $vars['theme_hook_suggestions'][] = 'page__map';
  if($path == "home") $vars['theme_hook_suggestions'][] = 'page__home';

  
  //
  // ACTIVE TRAIL
  //  
  // Taxonomy filter
  
  $vars['active_menu'] = "Projects";
  if($path == "map") $vars['active_menu'] = "Interactive Map";
  if($path == "home") $vars['active_menu'] = "Home";
  if($path == "about") $vars['active_menu'] = "About";
  if($path == "organizations") $vars['active_menu'] = "Organizations";
  
  $vars['active_dictionary'] = "";
  if(strpos($_GET['q'], "axonomy/term/")){
	  $vars['active_term'] = str_ireplace("taxonomy/term/", "", $_GET['q']);
	  $uhm = explode("/", $path);
	  $vars['active_dictionary'] = $uhm[0];
	  
  }
  	
  if(isset($vars['node']->field_country['und'][0])) $menu_country = taxonomy_term_load($vars['node']->field_country['und'][0]['tid']);
  
}




function datamatters_static_preprocess(&$vars){
	
	
	
	
}