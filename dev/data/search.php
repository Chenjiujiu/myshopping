<?php
header("content-Type:application/json");
$keywords=$_REQUEST['keywords'];
$keywords=urldecode($keywords);
$keywords=explode(",",$keywords);
$pno=$_REQUEST['pno'];
$nums=$_REQUEST['nums'];
$star=($pno-1)*$nums;
$end=$nums;

require ('init.php');

$sql=" select ss.`sid`,sf.`price`,sb.`name` as bname,sc.`color`,sf.`type`,sz.`size`,sf.`name`,sp.`pic`";
$sql.=" from shoes_family as sf ";
$sql.=" join shoes_color as sc on sf.fid=sc.fid ";
$sql.=" join shoes_size as sz on sf.fid=sz.fid ";
$sql.=" join shoes_brand as sb on sf.bid=sb.bid ";
$sql.=" join (select `fid`,`cid`,`m` as pic from `shoes_pic` group by `fid`,`cid`)";
$sql.=" as sp on sp.fid=sc.fid and sp.cid=sc.cid ";
$sql.=" join shoes as ss on ss.cid=sc.cid and ss.zid=sz.zid ";
$sql.=" where ";

foreach($keywords as $key=>$value){
   $sql.=" concat( ";
   $sql.=" ifnull(sc.`color`,''),',',";
   $sql.=" ifnull(sc.`color_type`,''),',',";
   $sql.=" ifnull(sz.`size`,''),'码',',',";
   $sql.=" ifnull(sb.`name`,''),',',";
   $sql.=" ifnull(sf.`name`,''),',',";
   $sql.=" ifnull(sf.`type`,''),',',";
   $sql.=" ifnull(sf.`price`,''),',',";
   $sql.=" ifnull(sf.`origin`,''),',',";
   $sql.=" ifnull(sf.`sex`,''),',',";
   $sql.=" ifnull(sf.`time`,''),',',";
   $sql.=" ifnull(sf.`trsture`,''),',',";
   $sql.=" ifnull(sf.`height`,''),',',";
   $sql.=" ifnull(sf.`fun`,''),',',";
   $sql.=" ifnull(sf.`close`,''),',',";
   $sql.=" ifnull(sp.`pic`,''),',',";
   $sql.=" ifnull(sf.`tag`,'')";
   $sql.=" )";
   $sql.=" like '%";
   $sql.=$value;
   $sql.="%'";
   if($key!==count($keywords)-1){
        $sql.=" and";
   }
}
/*每个款式只显示一个尺码*/
$sql.=" group by sf.`price`,bname,sc.`color`,sf.`type`,sf.`name`,sp.`pic`";
$sql.=" order by sf.`price` ";
$sql.=" limit $star,$end ";

$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($result);



/*
select ss.`sid`,sf.`price`,sb.`name`,sc.`color`,sf.`type`,sz.`size`,sf.`name`,sp.`m`
from shoes_family as sf
join shoes_color as sc on sf.fid=sc.fid
join shoes_size as sz on sf.fid=sz.fid
join shoes_brand as sb on sf.bid=sb.bid
join (select `fid`,`cid`,`m` from `shoes_pic` group by `fid`,`cid`)
as sp on sp.fid=sc.fid and sp.cid=sc.cid
join shoes as ss on ss.cid=sc.cid and ss.zid=sz.zid
where sb.`name` like '%361%' group by sz.`size`;



*/

?>
















