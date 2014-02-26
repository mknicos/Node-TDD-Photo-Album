//test
'use strict';

process.env.DBNAME= 'album-test';
var expect = require('chai').expect;
var Album;
var fs = require('fs');
var rimraf = require('rimraf');

describe('Album', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(){
    var imgdir = __dirname + '/../../app/static/img/';
    rimraf.sync(imgdir);
    fs.mkdirSync(imgdir);
  });

  describe('new', function(){
    it('should create a new Album object', function(){
      var obj = {};
      obj.title = 'Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('Euro Vacation');
      expect(a1.taken).to.be.instanceof(Date);
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the album', function(){
      var obj = {};
      obj.title = 'Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);

      var oldname = __dirname + '/../fixtures/family.jpg';
      var newname = 'cover.jpg';
      a1.addCover(oldname, newname);
      expect(a1.cover).to.equal(__dirname + '/../../app/static/img/eurovacation/cover.jpg');
    });
  });
});
