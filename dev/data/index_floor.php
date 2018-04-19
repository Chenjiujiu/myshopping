<?php
header("Content-Type:application/json;charset=utf-8");
$floor=$_REQUEST['floor'];
@$class=$_REQUEST['class'];
//if($class){return}else{$class=1};
require ('init.php');
if($floor==6){
    for($i=0;$i<10;$i++){
        $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`tag` ";
        $sql.=" from `index_floor`  where `ifid`=$i+1" ;
        $result=mysqli_query($conn,$sql);
        $result=mysqli_fetch_assoc($result);
        $small[$i]=$result;
    }
    $data['small']=$small;
}else if ($floor==4){
     $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`isbig`,`class`,`tag` ";
     $sql.=" from `index_floor`  where floor=$floor and `isbig`=0 and `class`=$class"  ;
     $result=mysqli_query($conn,$sql);
     $small=mysqli_fetch_all($result,MYSQLI_ASSOC);
     $data['small']=$small;

     $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`isbig`,`class`,`tag`";
     $sql.=" from `index_floor`  where floor=$floor and `isbig`=1" ;
     $result=mysqli_query($conn,$sql);
     $big=mysqli_fetch_assoc($result);
     $data['big']=$big;
     $data['class']=$class;
}else{
    $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`isbig`,`class`,`tag` ";
    $sql.=" from `index_floor`  where floor=$floor and `isbig`=0" ;
    $result=mysqli_query($conn,$sql);
    $small=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $data['small']=$small;

    $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`isbig`,`class`,`tag`";
    $sql.=" from `index_floor`  where floor=$floor and `isbig`=1" ;
    $result=mysqli_query($conn,$sql);
    $big=mysqli_fetch_assoc($result);
    $data['big']=$big;
}
$sql=" select `name`,`type` from `floor_type`  where floor=$floor " ;
$result=mysqli_query($conn,$sql);
$name=mysqli_fetch_assoc($result);
$data['name']=$name['name'];
$data['type']=$name['type'];
echo JSON_encode($data);
?>

