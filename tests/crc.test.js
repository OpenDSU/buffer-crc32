const crc32 = require('..');
const test = require('tap').test;

test('simple crc32 is no problem', function (t) {
    const input = new $$.Buffer('hey sup bros');
    const expected = new $$.Buffer([0x47, 0xfa, 0x55, 0x70]);
    t.same(crc32(input), expected);
    t.end();
});

test('another simple one', function (t) {
    const input = new $$.Buffer('IEND');
    const expected = new $$.Buffer([0xae, 0x42, 0x60, 0x82]);
    t.same(crc32(input), expected);
    t.end();
});

test('slightly more complex', function (t) {
    const input = new $$.Buffer([0x00, 0x00, 0x00]);
    const expected = new $$.Buffer([0xff, 0x41, 0xd9, 0x12]);
    t.same(crc32(input), expected);
    t.end();
});

test('complex crc32 gets calculated like a champ', function (t) {
    const input = new $$.Buffer('शीर्षक');
    const expected = new $$.Buffer([0x17, 0xb8, 0xaf, 0xf1]);
    t.same(crc32(input), expected);
    t.end();
});

test('casts to buffer if necessary', function (t) {
    const input = 'शीर्षक';
    const expected = new $$.Buffer([0x17, 0xb8, 0xaf, 0xf1]);
    t.same(crc32(input), expected);
    t.end();
});

test('can do signed', function (t) {
    const input = 'ham sandwich';
    const expected = -1891873021;
    t.same(crc32.signed(input), expected);
    t.end();
});

test('can do unsigned', function (t) {
    const input = 'bear sandwich';
    const expected = 3711466352;
    t.same(crc32.unsigned(input), expected);
    t.end();
});


test('simple crc32 in append mode', function (t) {
    const input = [new $$.Buffer('hey'), new $$.Buffer(' '), new $$.Buffer('sup'), new $$.Buffer(' '), new $$.Buffer('bros')];
    const expected = new $$.Buffer([0x47, 0xfa, 0x55, 0x70]);
    let crc = 0;
    for (let i = 0; i < input.length; i++) {
        crc = crc32(input[i], crc);
    }
    t.same(crc, expected);
    t.end();
});


test('can do signed in append mode', function (t) {
    const input1 = 'ham';
    const input2 = ' ';
    const input3 = 'sandwich';
    const expected = -1891873021;

    let crc = crc32.signed(input1);
    crc = crc32.signed(input2, crc);
    crc = crc32.signed(input3, crc);

    t.same(crc, expected);
    t.end();
});

test('make sure crc32 can accept integers as first arg ', function (t) {
    try {
        t.same(crc32(0), new $$.Buffer([0x00, 0x00, 0x00, 0x00]));
    } catch (e) {
        t.fail("should be able to accept integer");
    } finally {
        t.end();
    }
});

test('make sure crc32 throws on bad input', function (t) {
    try {
        crc32({});
        t.fail("should fail on garbage input");
    } catch (e) {
        t.ok("should pass");
    } finally {
        t.end();
    }
});

test('can do unsigned in append mode', function (t) {
    const input1 = 'bear san';
    const input2 = 'dwich';
    const expected = 3711466352;

    let crc = crc32.unsigned(input1);
    crc = crc32.unsigned(input2, crc);
    t.same(crc, expected);
    t.end();
});
