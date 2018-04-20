<?php
header("content-Type:application/json");
session_start();
@$uid=$_SESSION['uid'];
require ('init.php');
if($uid==null)
	echo json_encode(["ok"=>0]);
else{
	$sql="select uid,uname from user where uid=$uid";
	$result=mysqli_query($conn,$sql);
	$user=mysqli_fetch_assoc($result)['uname'];
	echo json_encode(["ok"=>1, "user"=>$user]);
}
?>