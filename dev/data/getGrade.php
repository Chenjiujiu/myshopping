<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
require ('init.php');
$sql="select `grade` from `shoes_grade` where fid=$fid";
$result=mysqli_query($conn,$sql);
$grade=mysqli_fetch_row($result);
$data["grade"]=$grade[0];
$sql="(select `keyword`,`num` ,'good' as type from `comment_keyword` where fid=$fid and type=1 order by `num` desc,`ckid` limit 0,6)";
$sql.=" union ";
$sql.="(select `keyword`,`num`,'bad' as type from `comment_keyword` where fid=$fid and type=0 order by `num` desc,`ckid` limit 0,3)";
$result=mysqli_query($conn,$sql);
$words=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["keyWords"]=$words;
echo JSON_encode($data);
?>