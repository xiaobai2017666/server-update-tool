const s=require('../main.js');

let n=new s({
    // SSH的配置信息============
    host: '0.0.0.0',
    port: 1,
    username: 'root',
    password: '********'
    //=========================
},
'F:/编程/blog/public', //本地需要上传的文件夹路径，结尾不要带/
'/home/www'); //服务器上传到的文件夹路径，可以在服务器中不存在，结尾不要带/

n.start().then(function() {
    process.exit(); //node进程退出
})