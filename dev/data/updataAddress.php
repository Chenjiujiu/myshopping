<?php
session_start();
@$uid=$_SESSION["uid"];
@$consignee=$_REQUEST['consignee'];
@$province=$_REQUEST['province'];
@$city=$_REQUEST['city'];
@$county=$_REQUEST['county'];
@$address=$_REQUEST['address'];
@$cellphone=$_REQUEST['cellphone'];
@$fixedphone=$_REQUEST['fixedphone'];
@$postcode=$_REQUEST['postcode'];
@$aid=$_REQUEST['aid'];
@$is_default=$_REQUEST['is_default'];
require ('init.php');
//详细信息
if($uid && $consignee && $province && $city && $county && @$address && $cellphone){
    if($aid){
       $sql="update `user_address` set `consignee`='$consignee',`province`='$province',`city`='$city',`county`='$county',`address`='$address',`cellphone`='$cellphone',`fixedphone`='$fixedphone',`postcode`='$postcode where', `uid`=$uid and `aid`=$aid ";
    }else{
       $sql =" insert into `user_address` ";
       $sql.=" (`uid`,`consignee`,`province`,`city`,`county`,`address`,`cellphone`,`fixedphone`,`postcode`,`is_default`)";
       $sql.=" values ($uid,'$consignee','$province','$city','$county','$address','$cellphone',$fixedphone,$postcode,$is_default)";
    }
    echo $sql;
    $result=mysqli_query($conn,$sql);
    if($result){
      echo "ok";
    }else{
      echo '添加地址失败';
    }
}else{
    echo "信息不全";
}
?>