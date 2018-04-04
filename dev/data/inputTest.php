<?php
header("content-Type:application/json");
@$uname=$_REQUEST['uname'];
@$uphone=$_REQUEST['uphone'];
require ('init.php');
if($uname==""){
    $sql="SELECT `uid` FROM `user` WHERE `uphone`='$uphone'";
}else if($uphone==""){
    $sql="SELECT `uid` FROM `user` WHERE `uname`='$uname'";
}
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result);
if($result!=null){
    echo 1; //已被注册
}else{
    echo 0;
}
?>