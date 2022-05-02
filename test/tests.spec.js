const assert = require('assert');
const moduleJS = require('../index.cjs.js');
describe('callAPI', function () {
    it('callAPI should be defined', function () {
        assert.equal(typeof moduleJS, 'object');
        assert.equal(typeof moduleJS.callAPI, 'function');
    });
    it('call a page and response an error 404', function(done) {
        moduleJS.callAPI('GET', 'https://www.google.com/404', null, null, () => {
            assert.fail('Callback Success should not be called');
        }, () => {
            assert.fail('Callback Fail should not be called');
        }, ({error}) => {
            assert.equal(typeof error, 'string');
            assert.equal(error, 'Status HTTP 404');
        }, () => done());
    });
    it('call a page and response an error 200', function(done){
        moduleJS.callAPI('GET', 'https://www.jules-et-john.fr/todomy/api/getToken.php', null, null, () => {
            assert.fail('Callback Success should not be called');
        }, ({error}) => {
            assert.equal(typeof error, 'string');
            assert.equal(error, 'Bad request method');
        },  () => {
            assert.fail('Callback Error should not be called');
        }, () => done());
    });
    it('call a page and response an JSON', function (done) {
        moduleJS.callAPI('GET', 'https://www.jules-et-john.fr/todomy/api/getFamilies.php', null, null, ({error,response}) => {
            assert.equal(typeof error, 'string');
            assert.equal(error, 'no');
            assert.equal(typeof response, 'object');
            assert.equal(typeof response[0], 'object');
        },  () => {
            assert.fail('Callback Fail should not be called');
        },  () => {
            assert.fail('Callback Error should not be called');
        }, () => done());
    });

    it('call a page and response 200 with bad format', function(done) {
        moduleJS.callAPI('GET', 'https://www.jules-et-john.fr/todomy/api/test/testBadFormat.php', null, null, response => {
            assert.equal(typeof response, 'object');
        }, () => {
            assert.fail('Callback Fail should not be called');
        }, () => {
            assert.fail('Callback Error should not be called');
        }, () => done());
    });
});