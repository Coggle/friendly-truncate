var assert = require('assert');
var truncate = require('../index');

describe('truncate in middle', function(){
    describe('normal sentence', function(){
        var s = 'The quick brown fox jumps over the lazy dog.';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+10; i++){
                    var x = truncate.truncateMiddle(s, i, {tolerance:t});
                    assert(x.length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('aa bb cc', function(){
        var s = 'aa bb cc dd ee ff gg hh ii jj kk ll mm nn oo pp';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+10; i++){
                    var x = truncate.truncateMiddle(s, i, {tolerance:t});
                    assert(x.length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('no breaks', function(){
        var s = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+10; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('whitespace', function(){
        var s = '                                               ';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+10; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('long words (1)', function(){
        var s = 'a bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb c';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+10; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('long words (2)', function(){
        var s = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa b';
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < s.length+2; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= s.length; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe('extremely long', function(){
        var s = '          ';
        for (var i = 0; i < 8; i++) {
          s += s+s;
        }

        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < 100; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= 100; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t);
                }
            }
        });
    });
    describe("surrogate pairs", function(){
        var s = '😀😀😀😀👨‍🍳👩‍🍳👴🏻👴🏼👴🏽👴🏾👴🏿👪👨😬😬😬😬‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧‍👧👩‍👩‍👦👩‍👩‍👧👩‍👩‍👧‍👦👩‍👩‍👦‍👦👩‍👩‍👧‍👧👨‍👨‍👦👨‍👨‍👧👨‍👨‍👧‍👦👨‍👨‍👦‍👦👨‍👨‍👧‍👧';

        it("doesn't break surrogate pairs", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < 100; i++){
                    // encodeURIComponent throws on invalid surrogate pairs...
                    var r = truncate.truncateMiddle(s, i, {tolerance:t});
                    try{
                        encodeURIComponent(r);
                    }catch(e){
                        throw(new Error("invalid surrogate pair in: '"+r+"'"));
                    }
                }
            }
        });
        it("never exceeds length", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i < 100; i++){
                    assert(truncate.truncateMiddle(s, i, {tolerance:t}).length <= i);
                }
            }
        });
        it("never differs from length by more than tolerance + 1", function(){
            for(var t = 0; t < 30; t++){
                for(var i = 0; i <= 100; i++){
                    assert(i - truncate.truncateMiddle(s, i, {tolerance:t}).length <= t+1);
                }
            }
        });
    });
});
