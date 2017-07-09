const execa = require('execa')
const stub = require('.')

stub('/bin/sh -c echo "hello"', 0, 'hi from stub!', '')
execa
  .shell('echo "hello"')
  .then(console.log)
  /*
    output:
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
