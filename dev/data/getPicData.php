<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
@$cid=$_REQUEST['cid'];
require ('init.php');
if($cid){
    $sql="select `s`,`m`,`l`,`xl` from `shoes_pic` where `fid`=$fid and `cid`=$cid";
}else{
    $sql="select `s`,`m`,`l`,`xl` from `shoes_pic` where `fid`=$fid and `cid`=(select `cid` from `shoes_pic` where `fid`=101 group by `cid` limit 1)";
}
$result=mysqli_query($conn,$sql);
$pic=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($pic);
?>

