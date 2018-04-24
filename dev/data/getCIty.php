<?php
header("content-Type:application/json");
$pid=$_REQUEST['pid'];
require ('init.php');
$sql=" select `id`,`cityname`,`type` from `city` where `pid`=$pid";
$result=mysqli_query($conn,$sql);
$citys=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($citys);

?>