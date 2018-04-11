<?php
header("content-Type:application/json");
$maxnum=$_REQUEST['maxnum'];
require ('init.php');
$sql="SELECT `img`,`title`,`href` FROM `index_slide` WHERE `site`=0 order by `isid` LIMIT $maxnum";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data[0]=$result;
$sql="SELECT `img`,`title`,`href` FROM `index_slide` WHERE `site`=1 order by `isid` LIMIT 5";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data[1]=$result;
echo JSON_encode($data);
?>