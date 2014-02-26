//model
'use strict';
module.exports = Album;
var fs = require('fs');
var path = require('path');

function Album(object){
  this._id = object._id;
  this.title = object.title;
  this.taken = new Date(object.taken);
  this.photos = [];
}

Album.prototype.addCover = function(oldpath){
  var dirname = this.title.replace(/\s/g,'').toLowerCase();
  var newpath = __dirname + '/../static/img/' + dirname;
  fs.mkdirSync(path);

  var extension = path.extname(oldpath);
  newpath += '/cover' + extension;
  fs.renameSync(oldpath, newpath);

  this.cover = path.normalize(newpath);
};
