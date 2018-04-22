<?php
header("content-Type:application/json");
session_start();
@$order=$_SESSION['order'];
@$uid=$_SESSION['uid'];
@$order=JSON_decode($order);
require ('init.php');
if($uid && $order){
$confim=array();
$sumPrice=0;
foreach($order as $k=>$value){
    $sid=$value->sid;
    $num=$value->count;
    $sql=" select `pic`,`name`,`price`,`color`,`size`,('$num') as num ,";
    $sql.=" (`delprice`-`price`) as sale,";
    $sql.=" (`price`*'$num') as sum  from";
    $sql.=" (select `color`,`size`,";
    $sql.=" (select `fid` from shoes where sid=1001 limit 1) as fid ,";
    $sql.=" (select `m` from `shoes` as s,`shoes_pic` as p";
    $sql.=" where s.fid=p.fid and s.cid=p.cid and s.sid='$sid' limit 1) as pic";
    $sql.=" from shoes as s,shoes_color as c,shoes_size z";
    $sql.=" where  s.cid=c.cid and s.zid=z.zid and s.sid=$sid) as f";
    $sql.=" join `shoes_family` as sf on f.fid=sf.fid";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_assoc($result);
    $sumPrice=$sumPrice+$row['num']*$row['price'];
    $row['sum']=sprintf("%.2f",$row['sum']);
    $confim[$k]=$row;
}
$data['order']=$confim;
$data['sumPrice']=sprintf("%.2f",$sumPrice);
$data['type']=1;
echo JSON_encode($data);
} else {
    $data['msg']="请勿重复提交订单";
    $data['type']="0";
    die(JSON_encode($data));
}
?>

