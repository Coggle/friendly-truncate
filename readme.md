# friendly-truncate: Human Friendly String Truncation

Truncate strings in the middle, at a word boundary if possible, so that the
string is at most the specified length.

Supports strings with unicode characters, including surrogate pairs, and
supports customisable joining character and word boundaries.

```js
var truncate = require('friendly-truncate');

for(var i = 0; i < 46; i++){
    console.log(truncate.truncateMiddle('the quick brown fox jumps over the lazy dog', i));
}

// output:
// 
// …
// t…
// t…g
// th…g
// th…og
// the…og
// the…dog
// the…dog
// the … dog
// the q… dog
// the q…y dog
// the qu…y dog
// the quick…dog
// the quick…dog
// the quick…dog
// the quick…dog
// the quic…lazy dog
// the quick…lazy dog
// the quick…lazy dog
// the quick…lazy dog
// the quick brown…dog
// the quick…the lazy dog
// the quick…the lazy dog
// the quick brown…lazy dog
// the quick brown…lazy dog
// the quick brown…lazy dog
// the quick…over the lazy dog
// the quick brown fox…lazy dog
// the quick brown…the lazy dog
// the quick brown…the lazy dog
// the quick brown…the lazy dog
// the quick brown fox…the lazy dog
// the quick brown…over the lazy dog
// the quick brown fox jumps…lazy dog
// the quick brown fox jumps…lazy dog
// the quick brown fox jumps…lazy dog
// the quick brown fox…over the lazy dog
// the quick brown fox jumps…the lazy dog
// the quick brown…jumps over the lazy dog
// the quick brown…jumps over the lazy dog
// the quick brown…jumps over the lazy dog
// the quick brown…jumps over the lazy dog
// the quick brown fox jumps over the lazy dog
// the quick brown fox jumps over the lazy dog
// the quick brown fox jumps over the lazy dog
```


## API

### `truncate.truncateMiddle(string, length, options)`

Supported options:

 * **join**: Character inserted at truncation point. Defaults to '…' (ellipsis)
 * **boundary**: regular expression matching boundaries to prefer breaking at. Must
   match globally. Defaults to `/[\s.\-_,;:]/g`
 * **tolerance**: amount truncated length is allowed to differ from requested
   length. Defaults to the lower of length/4 or 20;
   If the string contains surrogate pairs, the tolerance may be exceeded by 1
   if necessary to avoid cutting a surrogate pair in half.

The length is interpreted in code units, as is normal for javascript strings.
(i.e. an emoji or other character consisting of a surrogate pair is considered
length two.)


## Examples

```js

truncate.truncateMiddle('Lorem ipsum dolor sit amet', 10, {join:'-', tolerance:5})
// 'Lorem-amet'

truncate.truncateMiddle('/a/very/long/path/with/lots/of/parts', 20, {tolerance:8, boundary:/\//g})
// '/a/very/long…parts'

```
