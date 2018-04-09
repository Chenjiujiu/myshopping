<?php
header("content-Type:application/json");
$sid=$_REQUEST['sid'];
require ('init.php');
$sql="(SELECT `name`,`desc`,`delprice`,`price`,`origin`,`sex`,`time`,`texture` ,`height`,`fun`,`close`FROM `shoes` WHERE `sid`='$sid')UNION(SELECT `color` FROM `shoes_color` WHERE `sid`='$sid')";
echo $sql;
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($result);
?>