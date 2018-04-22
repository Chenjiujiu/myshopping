<?php
session_start();
@$order=$_SESSION['order'];
@$uid=$_SESSION['uid'];
@$aid=$_REQUEST['aid'];

require ('init.php');
//详细信息
if($order && $aid && $uid){
    $sql=" insert into `order` (`uid`,`aid`,`status`,`order_time`) values ($uid,$aid,1,now())";
    $result=mysqli_query($conn,$sql);
    $oid=mysqli_insert_id($conn);
    if($result){
        $order=JSON_decode($order);
        foreach($order as $value){
            $sid=$value->sid;
            $count=$value->count;
            $cid=$value->cid;
            $sql=" insert into `order_detail` (`oid`,`sid`,`count`) values ($oid,$sid,$count)";
            $result=mysqli_query($conn,$sql);
            if($result){
                $sql=" delete from `car` where `uid`=$uid and `cid`=$cid ";
                $result=mysqli_query($conn,$sql);
                if(!$result){
                    die('清除相应购物车失败');
                }
            }else{
                die('创建订单详情失败');
            }
        }
         $_REQUEST['aid']=null;
         $_SESSION['order']=null;
     }else{
        die('创建订单失败');
     }
}else{
    die('重复提交订单');
}

 ?>