<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
$pno=$_REQUEST['pno'];
$num=8;
$star=($pno-1)*$num;
$end=$num;
require ('init.php');
$sql=" select `txt`,`pic`,`time`,`reply`,`tag`,`author`,";
$sql.=" (select `color` from `shoes_color` where cid=cid  limit 1 ) as color, ";
$sql.=" (select `size` from `shoes_size` where zid=zid limit 1) as size";
$sql.=" from `comment` m join `shoes` s ";
$sql.=" where s.sid=m.sid and fid=$fid ";
$sql.=" order by mid desc ";
$sql.=" limit $star,$end ";
$result=mysqli_query($conn,$sql);
$info=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["info"]=$info;

$sql=" select count(mid) from comment c ,shoes s  where s.sid =c.sid and fid=$fid";
$result=mysqli_query($conn,$sql);
$pnosum=mysqli_fetch_row($result);
$pages["pageAll"]=ceil($pnosum[0]/$num);
$pages["now"]=$pno;
$data["page"]=$pages;
echo JSON_encode($data);
?>

