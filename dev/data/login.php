<?php
header("content-Type:application/json");
$uname=$_REQUEST['uname'];
$upwd=$_REQUEST["upwd"];
require ('init.php');
$sql="SELECT `uid`,`upwd` FROM `user` WHERE `uname`='$uname' OR `uphone`='$uname'";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
if($upwd===$result['upwd'] & $result['upwd'] != null){
    $data['flag']=1;
    $data['uid']=$result['uid'];
    echo JSON_encode($data);
}else{
    $data['flag']=0;
    echo JSON_encode($data);
}
?>