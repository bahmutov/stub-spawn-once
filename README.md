# stub-spawn-once

> Stubs child_process.spawn for a single command; cleans up afterwards. Perfect for testing.

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Why

Mocking [child_process.spawn][spawn] is hard. See for yourself - the stubbing
api for your tests is hard in [mock-spawn](https://github.com/gotwarlost/mock-spawn#common-cases)
or [spawn-mock](https://github.com/TylorS/spawn-mock#api). I wanted something
much simpler: just specify exit code and `stdout` and `stderr` for a single
execution. This module does this

```js
const execa = require('execa') // or any module
const { stubSpawnOnce } = require('.')
stubSpawnOnce(
  '/bin/sh -c echo "hello"',
  0, // exit code
  'hi from stub!', // stdout
  'and some error output' // stderr
)
execa
  .shell('echo "hello"')
  .then(console.log)
  /*
    output:
    {
      stdout: 'hi from stub!',
      stderr: 'and some error output',
      code: 0,
      failed: false,
      killed: false,
      signal: null,
      cmd: '/bin/sh -c echo "hello"',
      timedOut: false
    }
  */
  .then(() => {
    // call command again - the stub is gone
    return execa.shell('echo "hello"')
  })
  .then(console.log)
  /*
    output:
    {
      stdout: 'hello',
      stderr: '',
      code: 0,
      failed: false,
      killed: false,
      signal: null,
      cmd: '/bin/sh -c echo "hello"',
      timedOut: false
    }
  */
```

***hint** `exit code` argument is optional and you can omit it (then 0 will be
returned)

```js
const { stubSpawnShellOnce } = require('.')
stubSpawnShellOnce('my command', 'hi there', 'error output string')
```

[spawn]: http://devdocs.io/node/child_process#child_process_child_process_spawn_command_args_options

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save-dev stub-spawn-once
```

## Use

Examples from Mocha unit tests. Common information

* only the given command is stubbed,
  other spawn commands are *unaffected* by the stub.
* a stub will be removed after it runs once.

### stubSpawnOnce

```js
const { stubSpawnOnce } = require('stub-spawn-once')
const execa = require('execa')
it('prints mock output', () => {
  const cmd = 'echo "hello"'
  // output "foo" instead of "hello"
  stubSpawnOnce(`/bin/sh -c ${cmd}`, 0, 'foo', 'bar')
  return execa.shell(cmd)
    .then(result => {
      // result.code = 0
      // result.stdout = "foo"
      // result.stderr = "bar"
    })
})
```

### stubSpawnShellOnce

```js
const { stubSpawnShellOnce } = require('stub-spawn-once')
const execa = require('execa')
it('prints mock output', () => {
  const cmd = 'echo "hello"'
  // output "foo" instead of "hello"
  stubSpawnShellOnce(cmd, 0, 'foo', 'bar')
  return execa.shell(cmd)
    .then(result => {
      // result.code = 0
      // result.stdout = "foo"
      // result.stderr = "bar"
    })
})
```

## Bonus

As a bonus, this module also mocks [child_process.execFile][execFile] allowing
you easy testing.

```js
const {stubSpawnOnce} = require('stub-spawn-once')
stubSpawnOnce('echo "hello"', 0, 'foo', 'bar')
const cp = require('child_process')
cp.exec('echo "hello"', (code, out, errors) => {
  // code is 0
  // out is "foo"
  // errors is "bar"
})
```

You can use alias `stubExecOnce` to `stubSpawnOnce`

```js
const {stubExecOnce} = require('stub-spawn-once')
stubExecOnce('echo "hi"', "bye")
```

[execFile]: https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/stub-spawn-once/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/stub-spawn-once.svg?downloads=true
[npm-url]: https://npmjs.org/package/stub-spawn-once
[ci-image]: https://travis-ci.org/bahmutov/stub-spawn-once.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/stub-spawn-once
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
