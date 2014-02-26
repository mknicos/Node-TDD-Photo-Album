//model
'use strict';
module.exports = Album;
var fs = require('fs');
var path = require('path');
var albums = global.nss.db.collection('albums');

function Album(object){
  this._id = object._id;
  this.title = object.title;
  this.taken = new Date(object.taken);
  this.photos = [];
}

Album.prototype.addCover = function(oldpath){
  var dirname = this.title.replace(/\s/g,'').toLowerCase();
  var newpath = __dirname + '/../static/img/' + dirname;
  fs.mkdirSync(newpath);

  var extension = path.extname(oldpath);
  newpath += '/cover' + extension;
  fs.renameSync(oldpath, newpath);

  this.cover = path.normalize(newpath);
};

Album.prototype.insert = function(fn){
  albums.insert(this, function(err, record){
    fn(err);
  });
};
