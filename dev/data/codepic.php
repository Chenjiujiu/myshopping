<?php
/**
 * 字母+数字的验证码生成
 */

session_start();    // 开启session
$image = imagecreatetruecolor(140, 50); //创建画布
$bgcolor = imagecolorallocate($image, 255, 255, 255);//为画布定义(背景)颜色
imagefill($image, 0, 0, $bgcolor);  //填充颜色
$content = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";//定义验证码的内容
$code = "";  //创建一个变量存储产生的验证码数据，便于用户提交核对
for ($i = 0; $i < 4; $i++) {
    $fontsize = 12; //字体大小
    $fontcolor = imagecolorallocate($image, rand(0, 120), rand(0, 120), rand(0, 120));//字体颜色
    $fontcontent = substr($content, rand(0, strlen($content)), 1);    //设置字体内容
    $code .= $fontcontent;
    $x = ($i * 140 / 4) + rand(0, 8);    // 显示的坐标
    $y = mt_rand(10, 20);
    imagestring($image, $fontsize, $x, $y, $fontcontent, $fontcolor);    //填充内容到画布中
}
$_SESSION["code"] = $code;

//设置背景干扰元素
for ($$i = 0; $i < 200; $i++) {
    $pointcolor = imagecolorallocate($image, rand(50, 200), rand(50, 200), rand(50, 200));
    imagesetpixel($image, rand(1, 99), rand(1, 29), $pointcolor);
}
//设置干扰线
for ($i = 0; $i < 5; $i++) {
    $linecolor = imagecolorallocate($image, rand(50, 200), rand(50, 200), rand(50, 200));
    imageline($image, rand(1, 139), rand(1, 49), rand(1, 139), rand(1, 49), $linecolor);
}
//向浏览器输出图片头信息
header('content-type:image/png');
//输出图片到浏览器
imagepng($image);
//销毁图片
imagedestroy($image);　
?>　