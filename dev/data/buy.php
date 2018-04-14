<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
require ('init.php');

$sql="SELECT `name`,`type`,`delprice`,`price`,`origin`,";
$sql.="`sex`,`time`,`trsture`,`height`,`fun`,`close`,`tag`,`order_pic`,`tag_type` ,";
$sql.=" (SELECT `name` FROM `shoes_brand` WHERE `bid`=bid limit 1) AS brand ,";
$sql.=" (SELECT `color` FROM `shoes_color` WHERE `fid`=fid limit 1) AS color ";
$sql.=" FROM `shoes_family` WHERE `fid`=$fid";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["detail"]=$result;

$sql="SELECT `color` FROM `shoes_color` WHERE `fid`=$fid";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result);
$data["color"]=$result;

$sql="SELECT distinct `size` FROM `shoes` WHERE `fid`=$fid";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result);
$data["size"]=$result;

echo JSON_encode($data);
?>