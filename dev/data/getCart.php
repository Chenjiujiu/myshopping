<?php
header("content-Type:application/json");
session_start();
@$uid=$_SESSION["uid"];
if(!$uid){
    echo "未查询到登录信息";
}else{
    require ('init.php');
    //详细信息
    $sql=" select name,delprice,price,color,size,big.sid, big.num, big.carid, ";
    $sql.=" (select s from shoes_pic as spp where spp.fid=fid and spp.cid=big.cid limit 1 ) as pic ";
    $sql.=" from shoes_family as sf, ";
    $sql.=" (select color,size,sid,cz.fid,cz.zid,cz.cid ,cz.num,cz.carid";
    $sql.=" from ";
    $sql.=" shoes_color as sc, ";
    $sql.=" shoes_size as ss , ";
    $sql.=" (select shoes.cid,shoes.zid,shoes.sid,shoes.fid,car.num,car.cid as carid from shoes,car  where shoes.sid=car.sid and car.uid=$uid) as cz ";
    $sql.=" where sc.cid=cz.cid and ss.zid=cz.zid) as big ";
    $sql.=" where sf.fid= big.fid ";

    $result=mysqli_query($conn,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    $all=array();
    foreach($data as $key=>$value){
      $all[$value['sid']]=$value;
    }
    echo JSON_encode($all);
}


?>




