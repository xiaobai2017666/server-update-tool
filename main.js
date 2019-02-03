const SSH=require('node-ssh');
const { exec } = require('child_process');

function SSHUPDATE(sshconf,localpath,serverpath) {
    this.sshconf=sshconf;

    let reg1=/.*\//;
    let reg2=/[^\/]*$/;

    this.localparentdir=localpath.match(reg1)[0];
    this.localfoldername=localpath.match(reg2)[0];

    this.serverparentdir=serverpath.match(reg1)[0];
    this.serverfoldername=serverpath.match(reg2)[0];
};

SSHUPDATE.prototype.start=function() {
    // ===提示信息===
    console.log('开始更新工作');
    console.log('=============');
    console.log('连接终端中...');
    // =============

    return new Promise((resolve,reject) => {
        const app=new SSH();

        app.connect(this.sshconf).then(() => {
            // ===提示信息===
            console.log('终端已连接');
            console.log('=============');
            console.log('删除原文件中...');
            // =============
    
            return app.exec('cd '+ this.serverparentdir +' && rm -rf '+ this.serverfoldername);
        }).then(() => {
            // ===提示信息===
            console.log('原文件已删除');
            console.log('=============');
            console.log('压缩本地文件中...');
            // =============   
    
            return new Promise((resolve,reject) => {
                exec('cd '+ this.localparentdir +' && tar -cvf temp.tar '+ this.localfoldername,(err) => {
                    if(err) reject('error： 本地压缩错误' + err);
            
                    resolve();
                });            
            });
        }).then(() => {
            // ===提示信息===
            console.log('压缩完成');
            console.log('=============');
            console.log('上传文件中...');
            // =============
    
            return app.putFiles([{local: this.localparentdir +'temp.tar',remote: this.serverparentdir +'temp.tar'}]);        
        }).then(() => {
            // ===提示信息===
            console.log('上传完成');
            console.log('=============');
            console.log('解压文件中...');
            // =============
    
            return app.exec('cd '+ this.serverparentdir +' && tar -xf temp.tar && mv '+ this.localfoldername +' '+ this.serverfoldername +' && rm -f temp.tar');        
        }).then(() => {
            // ===提示信息===
            console.log('解压完成');
            console.log('=============');
            console.log('更新工作完成');
            // =============
    
            resolve();
        }).catch(function(err) {
            console.log(err);
            reject();
        });
    })
}

module.exports = SSHUPDATE;