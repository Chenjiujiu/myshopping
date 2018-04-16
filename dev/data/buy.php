<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
require ('init.php');
//详细信息
$sql=" SELECT `name`,`type`,`delprice`,`price`,`origin`, ";
$sql.=" `sex`,`time`,`trsture`,`height`,`fun`,`close`,`tag`,`tag_type` ,";
$sql.=" (SELECT `name` FROM `shoes_brand` WHERE shoes_brand.bid=shoes_family.bid limit 1) AS brand " ;
$sql.=" FROM `shoes_family` WHERE `fid`=$fid ";
$result=mysqli_query($conn,$sql);
$info=mysqli_fetch_assoc($result);
$data["order"]=$info;
//所有颜色
$sql="select `cid`,`color`,`img` from shoes_color where fid=$fid";
$result=mysqli_query($conn,$sql);
$color=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["allColor"]=$color;
//所有尺码
$sql="select `zid`,`size` from shoes_size where fid=$fid";
$result=mysqli_query($conn,$sql);
$size=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["allSize"]=$size;
//详细图片
$sql="select group_concat(img separator ',') as order_pic from order_pic where `fid`=$fid";
$result=mysqli_query($conn,$sql);
$pics=mysqli_fetch_row($result);
$order_pic=explode(',',$pics[0]);
$data["order_pic"]=$order_pic;

$data["fid"]=$fid;

echo JSON_encode($data);
?>