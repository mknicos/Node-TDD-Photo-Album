'use strict';

process.env.DBNAME = 'album-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Album;

describe('albums', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm-rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/family.jpg';
      var copyfile = __dirname + '/../fixtures/family-copy.jpg';
      var copyfile2 = __dirname + '/../fixtures/family-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile2));

      global.nss.db.dropDatabase(function(err,result){
        done();
      });
    });
  });

  describe('GET /albums/new', function(){
    it('should display the new album html page', function(done){
      request(app)
      .get('/albums/new')
      .expect(200, done);
    });
  });

  describe('POST /albums', function(){
    it('should create a new album and send user back to home', function(done){
      var filename = __dirname + '/../fixtures/family-copy.jpg';
      request(app)
      .post('/albums')
      .attach('cover', filename)
      .field('title', 'European Vacation')
      .field('taken', '2014-02-25')
      .expect(302, done);
    });
  });
});
