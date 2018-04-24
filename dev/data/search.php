<?php
header("content-Type:application/json");
$searchInfo=$_REQUEST['searchInfo'];
$searchInfo=JSON_decode($searchInfo);
$pno=$_REQUEST['pno'];
$nums=$_REQUEST['nums'];
$star=($pno-1)*$nums;
$end=$nums;
require ('init.php');
$sql=" select ss.`sid`,sf.`price`,sb.`name` as bname,sc.`color`,sf.`type`,sz.`size`,sf.`name`,sp.`pic`,sf.`fid`";
$sql.="  from shoes_family as sf ";
$sql.=" join shoes_color as sc on sf.fid=sc.fid ";
$sql.=" join shoes_size as sz on sf.fid=sz.fid ";
$sql.=" join shoes_brand as sb on sf.bid=sb.bid ";
$sql.=" join (select `fid`,`cid`,`m` as pic from `shoes_pic` group by `fid`,`cid`)";
$sql.=" as sp on sp.fid=sc.fid and sp.cid=sc.cid ";
$sql.=" join shoes as ss on ss.cid=sc.cid and ss.zid=sz.zid ";
$sql.=" where ";
if($searchInfo->keywords){
    $keywords=$searchInfo->keywords;
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
}else{
    $proper=$searchInfo->proper;
    $index=0;
    $len=$searchInfo->prolength;
    foreach($proper as $key=>$value){
        if($value->key==='color'){
            $sql.=" (color like '%$value->value%'";
            $sql.=" or color_type like '%$value->value%') ";
        }else{
            $sql.=" $value->key like '%$value->value%'";
        }
        if($index!==$len-1){
           $sql.=" and";
        }
        $index=$index+1;
    }
}
/*每个款式只显示一个尺码*/
$sql.=" group by sf.`price`,bname,sc.`color`,sf.`type`,sf.`name`,sp.`pic`,sf.`fid`";
$sql.=" order by sf.`price` ";
//$sql.=" limit $star,$en
$result=mysqli_query($conn,$sql);
$products=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data['products']=$products;

$data["now"]=$pno;
$data["proNums"]=count($products);
$data["pages"]=ceil(count($products)/$nums);

echo JSON_encode($data);


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










