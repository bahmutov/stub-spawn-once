const execa = require('execa')
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
