//model
'use strict';
module.exports = Album;
var fs = require('fs');

function Album(object){
  this._id = object._id;
  this.title = object.title;
  this.taken = new Date(object.taken);
  this.photos = [];
}

Album.prototype.addCover = function(oldname, newname){
  var dirname = this.title.replace(/\s/g,'').toLowerCase();
  var path = __dirname + '/../static/img/' + dirname;
  fs.mkdirSync(path);
};
