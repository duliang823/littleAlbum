/**
 * Created by Administrator on 2017/5/30 0030.
 */
var fs = require("fs");

//此函数的callback中含有err和allAlbums（所有文件夹的array）
exports.getAllAlbums = function(callback){
    //我们现在集中精力找到所有文件夹
    fs.readdir("./uploads",function(err,files){
        if(err){
            callback("没有找到upload文件夹",null);
        }
        var allAlbums = [];
        (function iterator(i){
            if(i == files.length){
                //遍历结束
                //console.log(allAlbums);
                callback(null,allAlbums);
                return;
            }
            fs.stat("./uploads/" + files[i],function(err,stats){
                if(err){
                    callback("找不到文件" + files[i],null);
                }
                if(stats.isDirectory()){
                    allAlbums.push(files[i])
                }
                iterator(i+1);
            });
        })(0);
    });
};

//通过文件名得到所有图片
exports.getAllImagesByAlbumName = function(albumName,callback){
    fs.readdir("./uploads/" +　albumName,function(err,files){
        if(err){
            callback("没有找到upload文件夹",null);
            return;
        }
        var allImages = [];
        (function iterator(i){
            if(i == files.length){
                //遍历结束
                //console.log(allImages);
                callback(null,allImages);
                return;
            }
            fs.stat("./uploads/" + albumName + "/" + files[i],function(err,stats){
                if(err){
                    callback("找不到文件" + files[i],null);
                    return;
                }
                if(stats.isFile()){
                    allImages.push(files[i])
                }
                iterator(i+1);
            });
        })(0);
    });
};
