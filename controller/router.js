/**
 * Created by Administrator on 2017/5/27 0027.
 */
var file = require("../models/file.js");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");

//首页
exports.showIndex = function(req,res,next){
    //res.render("index",{
    //    "albums" : file.getAllAlbums()
    //});
    file.getAllAlbums(function(err,allAlbums){
        if(err){
            //res.render("err");
            next(); //交给下面适合它的中间件
            return;
        }
        res.render("index",{
            "albums":allAlbums
        });
    });
};

//相册页
exports.showAlbum = function(req,res,next){
    //遍历相册中的所有图片
    var albumName = req.params.albumName;
    //具体业务交给model:
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
        if(err){
            //res.render("err");
            next(); //交给下面适合它的中间件
            return;
        }
        res.render("album",{
            "albumname": albumName,
            "images" : imagesArray
        });
    });
};

//显示长传
exports.showUp = function (req,res,next) {
    file.getAllAlbums(function(err,albums){
        if(err){
            next();
            return;
        }
        res.render("up",{
            "albums" : albums
        });
    });
};

//上传表单
exports.doPost = function(req,res,next){
    var form = new formidable.IncomingForm();

    //先把图片传到一个中转文件夹:
    var tempUrl = __dirname +　"/../tempup/";
    form.uploadDir = path.normalize(tempUrl);

    form.parse(req, function(err, fields, files) {
        if(err){
            next();
            return;
        }
        //判断文件尺寸：
        var size = parseInt(files.tupian.size);
        if(size > 1024){
            res.send("图片尺寸不能超过1M");
            //删除图片
            fs.unlink(files.tupian.path,function(err){

            });
            return;
        }


        //改名：
        var ttt = sd.format(new Date(), "YYYYMMDDHHmmss");
        var ran = parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.tupian.name);

        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path;
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath,newpath,function(err){
            //改名失败
            if(err){
                res.send("改名失败");
                return;
            }
            res.send("成功");
        });
        console.log(fields);
        console.log(files);
    });
    return;
}
