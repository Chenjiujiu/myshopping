<?php
header("content-Type:application/json");

require ('init.php');
$sql="SELECT `site`,`img`,`title`,`href` FROM `index_slide`";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($result);

?>