<?php

/**
 * @file
 * This template is used to print a single grouping in a view.
 *
 * It is not actually used in default Views, as this is registered as a theme
 * function which has better performance. For single overrides, the template is
 * perfectly okay.
 *
 * Variables available:
 * - $view: The view object
 * - $grouping: The grouping instruction.
 * - $grouping_level: Integer indicating the hierarchical level of the grouping.
 * - $rows: The rows contained in this grouping.
 * - $title: The title of this grouping.
 * - $content: The processed content output that will normally be used.
 */  
 	global $group_index;
 	if($grouping_level == 0) $group_index++;
 	
?>
<div class="view-grouping grouping-level<?=$grouping_level?> grouping<?=$group_index?>">
  <? if($grouping_level == 0): ?><h4><?php print $title; ?></h4><? endif;?>
  <div class="view-grouping-content">
    <?php print $content; ?>
  </div>
</div>
