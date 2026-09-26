import assert from 'node:assert/strict';
import {volumeFor} from '../dist/preferences.js';
assert.equal(volumeFor(0),0,'Muted volume must remain zero');
assert.equal(volumeFor(2),1,'Gain cannot exceed the supported maximum');
assert.equal(volumeFor(-1),0);
assert.equal(volumeFor(NaN),.65,'Invalid saved values must not reach AudioParam');
assert.equal(volumeFor(undefined),.65,'Existing profiles get the default volume');
console.log('PASS: sound volume clamps safely and preserves mute');
