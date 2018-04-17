<?php
header("Content-Type:application/json;charset=utf-8");
$floor=$_REQUEST['floor'];
require ('init.php');
$sql=" select `pic`,`price`,`title`,`href`,`tagType`,`isbig`,`class`,`type`,`name` ";
$sql.=" from `index_floor` f,`floor_type` t where f.ifid=t.ifid and floor=$floor" ;
$result=mysqli_query($conn,$sql);
$floor=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($floor);
?>

