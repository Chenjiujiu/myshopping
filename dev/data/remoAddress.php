<?php
session_start();
@$uid=$_SESSION["uid"];
@$aid=$_REQUEST['aid'];
require ('init.php');
//详细信息
if($uid && $aid){
    $sql=" delete from `user_address` where `uid`=$uid and `aid`=$aid ";
    $result=mysqli_query($conn,$sql);
    if(!$result){
        die('删除失败');
    }else{
        echo 'ok';
    }
}else{
    echo "未登录";
}
?>