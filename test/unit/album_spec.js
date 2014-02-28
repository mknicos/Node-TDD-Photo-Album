//unit test
/*jshint expr: true*/
'use strict';

process.env.DBNAME= 'album-test';
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');
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
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/family.jpg';
      var copyfile = __dirname + '/../fixtures/family-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err,result){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new Album object', function(){
      var obj = {};
      obj.title = 'Test Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('Test Euro Vacation');
      expect(a1.taken).to.be.instanceof(Date);
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the album', function(){
      var obj = {};
      obj.title = 'Test Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);
      var oldname = __dirname + '/../fixtures/family-copy.jpg';
      a1.addCover(oldname);
      expect(a1.cover).to.equal('/img/testeurovacation/cover.jpg');
    });
  });

  describe('#insert', function(){
    it('should insert an Album into the database', function(done){
      var obj = {};
      obj.title = 'Test Euro Vacation';
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
  describe('#update', function(){
    it('should update an existing photo album', function(done){
      var obj = {};
      obj.title = 'Euro Vacation';
      obj.taken = '2014-03-25';
      var a1 = new Album(obj);

      a1.insert(function(){
        var id = a1._id.toString();
        Album.findById(id, function(album){
          var photo = __dirname + '/../fixtures/family-copy2.jpg';
          album.addPhoto(photo, 'ocean.jpg');
          expect(album.photos).to.have.length(1);
          expect(album.photos[0]).to.equal('/img/testeurovacation/ocean.jpg');
          album.update(function(err, count){
            expect(count).to.equal(1);
            done();
          });
        });
      });
    });
  });

  describe('Find Methods', function(){
    var id, a1;
    beforeEach(function(done){
      a1 = new Album({title:'TestCalifornia', taken:'2012-03-25'});
      var a2 = new Album({title:'B', taken:'2012-03-26'});
      var a3 = new Album({title:'C', taken:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            id = a2._id.toString();
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the albums in the database', function(done){
        Album.findAll(function(albums){
          expect(albums).to.have.length(3);
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find an Album by its ID', function(done){
        Album.findById(id, function(album){
          expect(album.title).to.equal('B');
          done();
        });
      });
    });

    describe('#addPhoto', function(){
      it('should add a photo to a Albums photo array property', function(){
        var origfile = __dirname + '/../fixtures/family.jpg';
        var copyfile = __dirname + '/../fixtures/family-copy.jpg';
        var copyfile2 = __dirname + '/../fixtures/family-copy2.jpg';
        fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));

        a1.addCover(copyfile);
        a1.addPhoto(copyfile2, 'family-copy2.jpg');
        expect(a1.photos).to.have.length(1);
        expect(a1.photos[0]).to.equal('/img/testcalifornia/family-copy2.jpg');
      });
    });
  });

});
