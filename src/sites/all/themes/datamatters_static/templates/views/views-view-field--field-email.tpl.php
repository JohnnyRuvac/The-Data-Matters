<?php 
  if(strpos($output,'@') !== false): ?>
    <a href="mailto:<?=$output?>"><?=$output?></a>
  <? else: ?>
    <a href="http://<?=$output?>"><?=$output?></a>
  <? endif;?>