<?php
session_start();
$uid=$_SESSION["uid"];
$data=$_REQUEST['data'];
require ('init.php');
$data=JSON_decode($data);
var_dump($data);
$sql="inset into order_detail"


////*/详细信息
//$sql=" select `sid` from `shoes` where `fid`=$fid and `cid`=$cid and `zid`=$zid";
//$result=mysqli_query($conn,$sql);
//$sid=mysqli_fetch_row($result);
//$sid=$sid[0];
//
//$sql="select `cid` from `car` where `uid`=$uid and `sid`=$sid";
//$result=mysqli_query($conn,$sql);
//$row=mysqli_fetch_row($result);
//if($row==null){
//    $sql=" insert into `car` (`cid`,`uid`,`sid`,`num`) values (null,$uid,$sid,$num)";
//}else{
//    $sql="update `car` set `num`=`num`+$num where `uid`=$uid and `sid`=$sid ";
//}
//$result=mysqli_query($conn,$sql);
// if($result){
//        echo 'ok';
//    }else{
//        echo 'error';
//    }*/
?>