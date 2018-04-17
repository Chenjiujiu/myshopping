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
$data["pic"]=$pic;
if($cid){
    $sql=" select group_concat(`zid` separator ';')as allZid ";
    $sql.=" from `shoes` where fid=$fid and `cid`=$cid";
    $result=mysqli_query($conn,$sql);
    $size=mysqli_fetch_row($result);
    $data["allZid"]=$size[0];
}

echo JSON_encode($data);
?>

