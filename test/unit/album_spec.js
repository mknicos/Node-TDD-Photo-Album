//test
/*jshint expr: true*/
'use strict';

process.env.DBNAME= 'album-test';
var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var path = require('path');
var Album;

describe('Album', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var imgdir = __dirname + '/../../app/static/img/';
    rimraf.sync(imgdir);
    fs.mkdirSync(imgdir);
    var origfile = __dirname + '/../fixtures/family.jpg';
    var copyfile = __dirname + '/../fixtures/family-copy.jpg';
    fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));

    global.nss.db.dropDatabase(function(err,result){
        done();
      });
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
      var oldname = __dirname + '/../fixtures/family-copy.jpg';
      a1.addCover(oldname);
      expect(a1.cover).to.equal(path.normalize(__dirname + '/../../app/static/img/eurovacation/cover.jpg'));
    });
  });
  describe('#insert', function(){
    it('should insert an Album into the database', function(done){
      var obj = {};
      obj.title = 'Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);
      var oldname = __dirname + '/../fixtures/family-copy.jpg';
      a1.addCover(oldname);

      a1.insert(function(err){
        expect(err).to.be.null;
        expect(a1).to.be.instanceof(Album);
        expect(a1).to.have.property('_id').and.be.ok;
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });
});
