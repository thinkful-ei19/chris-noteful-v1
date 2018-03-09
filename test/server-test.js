const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

// const {app, runServer, closeServer} = require('../server')

// describe('Reality check... no really?', function() {
//     it('true should be true, derp', function () {
//         expect(true).to.be.true;
//     });

//     it('2 + 2 should equal 4... I think? =)', function() {
//         expect(2 + 2).to.equal(4);
//     });
// });

// describe ('GET request "/" should return the index page', function() {
//     return chai.request(app)
//         .get('/v1')
//         .then(function (res) {
//             expect(res).to.exist;
//             expect(res).to.have.status(200);
//             expect(res).to.be.html;
//         });
// });

describe('run all api tests', function() {
    let server;
    before(function() {
        return app.startServer().then(instance => server = instance);
    })
    after(function() {
        return server.stopServer();
    })
    it('should respond with 404 when given a bad path', function() {
        return chai.request(server)
            .get('/superbad/path')
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status(404);
            });
    });

    it('GET request with proper params should return passing', function() {
        return chai.request(app)
            .get(`/v1/notes`)
            .catch(err => err.response)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys(
                        'id', 'title', 'content');
                });
            });
    });

    it('GET request with proper params should return passing', function() {
        let id = 1003;
        return chai.request(app)
            .get(`/v1/notes/${id}`)
            .catch(err => err.response)
            .then(function(res) {
                // console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys(
                    'id', 'title', 'content');
                expect(res.body.id).to.equal(id);
            });
    });

    it('PUT request should be able to update a JSON object', function() {
        let testObject = {
            'title': 'Why Chai is better than Mocha',
            'content': `AssertionError: expected sque habitamber or a date`
        }
        return chai.request(app)
            .put(`/v1/notes/1000`)
            .send(testObject)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'content');
                expect(res.body.id).to.equal(1000);
                expect(res.body.title).to.equal(testObject.title);
                expect(res.body.content).to.equal(testObject.content);
                // expect(res.body).to.equal(testObject); <= Requires that testObject also contain the id;
            })
    });

    it('should create items on POST', function() {
        let testObject = {
            'title': 'Why Chai is better than Mocha',
            'content': `AssertionError: expected sque habitamber or a date`
        }
        return chai.request(app)
            .post(`/v1/notes`)
            .send(testObject)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'content');
                expect(res.body.title).to.equal(testObject.title);
                expect(res.body.content).to.equal(testObject.content);
            });
    });

    it('should delete an object on DELETE', function() {
       return chai.request(app)
        .delete(`/v1/notes/1000`)
        .then(function(res) {
            expect(res).to.have.status(204);
        })
    });
});


