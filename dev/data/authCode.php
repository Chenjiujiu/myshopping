<?php
    session_start();
    $code=$_REQUEST["code"];
    if(strtolower($_SESSION["code"])==strtolower($code)){
        echo 1;
        $_SESSION['code']="";
    }else{
        echo 0;
    }
?>