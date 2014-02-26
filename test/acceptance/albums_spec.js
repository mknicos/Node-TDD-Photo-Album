'use strict';

process.env.DBNAME = 'album-test';
var app = require('../../app/app');
var request = require('supertest');
var rimraf = require('rimraf');
var fs = require('fs');
//var expect = require('chai').expect;
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
