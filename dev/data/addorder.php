<?php
session_start();
$uid=$_SESSION["uid"];
$data=$_REQUEST['data'];
$_SESSION["order"]=$data;
?>