<?php
header("content-Type:application/json");
session_start();
//$uid=$_SESSION["uid"];
$uid=1;
require ('init.php');
//详细信息
$sql=" select name,delprice,price,color,size,big.sid, big.num,";
$sql.=" (select s from shoes_pic as spp where spp.fid=fid and spp.cid=big.cid limit 1 ) as pic ";
$sql.=" from shoes_family as sf, ";
$sql.=" (select color,size,sid,cz.fid,cz.zid,cz.cid ,cz.num";
$sql.=" from ";
$sql.=" shoes_color as sc, ";
$sql.=" shoes_size as ss , ";
$sql.=" (select shoes.cid,shoes.zid,shoes.sid,shoes.fid,car.num from shoes,car  where shoes.sid=car.sid and car.uid=1) as cz ";
$sql.=" where sc.cid=cz.cid and ss.zid=cz.zid) as big ";
$sql.=" where sf.fid= big.fid ";

$result=mysqli_query($conn,$sql);
$data=mysqli_fetch_all($result,MYSQLI_ASSOC);

$all=array();
foreach($data as $key=>$value){
  $all[$value['sid']]=$value;
}
echo JSON_encode($all);





/*select name,delprice,price,color,size,big.sid,
(select s from shoes_pic as spp where spp.fid=fid and spp.cid=big.cid limit 1 )
from shoes_family as sf,
(select color,size,sid,cz.fid,cz.zid,cz.cid
from
shoes_color as sc,
shoes_size as ss ,
(select shoes.cid,shoes.zid,shoes.sid,shoes.fid  from shoes,car  where shoes.sid=car.sid and car.uid=1) as cz
where sc.cid=cz.cid and ss.zid=cz.zid) as big
where sf.fid= big.fid*/

?>




