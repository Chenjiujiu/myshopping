<?php
header("content-Type:application/json");
@$logonum=$_REQUEST['logonum'];
require ('init.php');
if($logonum){
    $sql="SELECT `bid`,`name`,`logo` FROM `shoes_brand` order by `bid` LIMIT $logonum";
}else{
    $sql="SELECT `bid`,`name`,`logo` FROM `shoes_brand`";
}
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo JSON_encode($result);
?>