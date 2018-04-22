<?php
header("content-Type:application/json");
session_start();
$uid=$_SESSION['uid'];
require ('init.php');
$sql=" select `aid`,`consignee`,`province`,`city`,`county`,`address`,`cellphone`,`fixedphone`,`postcode`,`is_default` ";
$sql.=" from `user_address` where `uid`=$uid";
$result=mysqli_query($conn,$sql);
$address=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data=array();
foreach($address as $key=>$value){
    $data[$value['aid']]=$value;
}

echo JSON_encode($data);

?>