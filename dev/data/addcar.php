<?php
session_start();
@$uid=$_SESSION["uid"];
@$fid=$_REQUEST['fid'];
@$cid=$_REQUEST['cid'];
@$zid=$_REQUEST['zid'];
@$num=$_REQUEST['num'];
@$sid=$_REQUEST['sid'];
require ('init.php');
//详细信息
if(!$sid){
    $sql=" select `sid` from `shoes` where `fid`=$fid and `cid`=$cid and `zid`=$zid";
    $result=mysqli_query($conn,$sql);
    $sid=mysqli_fetch_row($result);
    $sid=$sid[0];
}
if($uid && $sid){
    $sql="select `cid` from `car` where `uid`=$uid and `sid`=$sid";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_row($result);
    if($row==null){
        $sql=" insert into `car` (`cid`,`uid`,`sid`,`num`) values (null,$uid,$sid,$num)";
    }else{
        $sql="update `car` set `num`=`num`+$num where `uid`=$uid and `sid`=$sid ";
    }
    $result=mysqli_query($conn,$sql);
    if(!$result){
       echo '添加购物车失败';
    }else{
        echo "ok";
    }
}else{
    echo "nologin";
}
?>