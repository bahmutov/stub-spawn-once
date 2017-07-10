const execa = require('execa')
const stub = require('.')

stub('/bin/sh -c echo "hello"', 0, 'hi from stub!', 'and some error output')
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
