
(function(){

var truncate = {};

truncate.truncateMiddle = function(string, length, opts){
    // truncate string by chopping it in the middle, preferring to cut at word
    // boundaries (whitespace and punctuation), then re-joining with the
    // character join.

    // nothing to do if the length is longer than string:
    if(string.length <= length) return string;
    // special case negative and zero lengths for robustness:
    if(length <= 0) return '';

    if(typeof opts === 'undefined') opts = {};

    var join = opts.join;
    if(typeof join === 'undefined') join = '…';

    var boundary = opts.boundary;
    if(typeof boundary === 'undefined') boundary = /[\s.\-_,;:]/g;

    var tolerance = opts.tolerance;
    if(typeof tolerance === 'undefined') tolerance = Math.min(20, Math.round(length/4));

    var word_boundaries_start = [];
    var word_boundaries_end = [];
    var next;
    var first_cut, second_cut;
    var possible_cuts = [];
    var result_length;
    var i, j;

    var s = process.hrtime();

    while( (next = boundary.exec(string)) ){
        // prune word boundaries to those within length/2 + tolerance of the
        // start/end of the string:
        if((next.index < length/2 + tolerance)){
            word_boundaries_start.push(next.index);
        }else if(next.index < Math.floor(string.length - (length/2 + tolerance + 1))){
            // skip ahead to the end of the string, there's no point testing
            // against all of the middle:
            boundary.lastIndex = Math.floor(string.length - (length/2 + tolerance + 1));
        }

        if((next.index > string.length - (length/2 + tolerance))){
            word_boundaries_end.push(next.index);
        }
    }

    // reset regex state in case caller re-uses it
    boundary.lastIndex = 0;

    var se = process.hrtime(s);

    var m = process.hrtime();

    for(i = word_boundaries_start.length-1; i >= 0; i--){
        // search for a suitable second cut
        first_cut = word_boundaries_start[i];
        for(j = word_boundaries_end.length-1; j >= 0; j--){
            result_length = (string.length-(word_boundaries_end[j]+1)) + word_boundaries_start[i] + 1;
            second_cut = null;
            if((result_length <= length) && result_length > length-tolerance){
                second_cut = word_boundaries_end[j]+1;
            }
            if(second_cut){
                possible_cuts.push({length:result_length, first:first_cut, second:second_cut});
                // The worst case for performance is where the boundary expression matched
                // at every single character and the tolerance is big. To avoid this being
                // quadratic in the tolerance, break as soon as we have an exact
                // match on length:
                if(result_length == length){
                    i = -1;
                    break;
                }
            }
        }
    }

    var me = process.hrtime(m);

    var t = process.hrtime();

    // sort preferring overall length and approximately equal length of both
    // parts:
    possible_cuts.sort(function(a, b){
        // equalness value, [0, 0.999]:
        var equalness_a = 1 / ((Math.abs(a.first - (string.length-a.second)) + 1.001));
        var equalness_b = 1 / ((Math.abs(b.first - (string.length-b.second)) + 1.001));
        return (b.length + equalness_b) - (a.length + equalness_a);
    });

    if(possible_cuts.length){
        first_cut = possible_cuts[0].first;
        second_cut = possible_cuts[0].second;
    }else{
        first_cut = Math.floor(length/2);
        second_cut = string.length - (length - 1 - first_cut);
    }

    var te = process.hrtime(t);

    if(se[0] >= 1 || se[1] > 5000000 ||
       me[0] >= 1 || me[1] > 5000000 ||
       te[0] >= 1 || te[1] > 5000000) console.log(Math.round(se[0]*1000 + se[1]/1e6), Math.round(me[0]*1000 +me[1]/1e6), Math.round(te[0]*1000 + te[1]/1e6));

    var first_part = string.substring(0, first_cut);
    var second_part = string.substring(second_cut);

    return first_part + join + second_part;
};

if (typeof module !== "undefined" && module.exports) {
    // node
    module.exports = truncate;
} else if (typeof define === 'function' && define.amd) {
    // amd / require.js
    define(function () {return truncate;});
}

})();


