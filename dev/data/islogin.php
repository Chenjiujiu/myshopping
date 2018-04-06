<?php
header("content-Type:application/json");
$uid=$_REQUEST['uid'];
require ('init.php');
$sql="SELECT `uname` FROM `user` WHERE `uid`='$uid'";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
echo $result['uname'];
?>