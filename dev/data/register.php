<?php
header("content-Type:application/json");
$uname=$_REQUEST['uname'];
$uphone=$_REQUEST['uphone'];
$upwd=$_REQUEST['upwd'];
require ('init.php');
$sql="INSERT INTO `user` (`uname`,`uphone`,`upwd`) VALUES ('$uname','$uphone','$upwd')";
$result=mysqli_query($conn,$sql);
if($result===true){
     $data['flag']=1;
     $data['uid']=mysqli_insert_id($conn);
     echo JSON_encode($data);
}else{
    $data['flag']=0;
    echo JSON_encode($data);
}
?>