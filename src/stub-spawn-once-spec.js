'use strict'

const execa = require('execa')
const snapshot = require('snap-shot')
const la = require('lazy-ass')
const is = require('check-more-types')
const cp = require('child_process')

/* global describe, it */

describe('stub-spawn-once', () => {
  const { stubSpawnOnce } = require('.')

  it('plain execa.shell', () => {
    return snapshot(execa.shell('echo "hello"'))
  })

  it('plain child_process.exec', done => {
    cp.exec('echo "hello"', (code, stdout, stderr) => {
      console.log('echo stdout', stdout.trim())
      done()
    })
  })

  it.skip('supports child_process.exec', done => {
    const cmd = '/bin/sh -c echo "hello"'
    stubSpawnOnce(cmd, 0, 'foo', 'bar')
    cp.exec('echo "hello"', (code, stdout, stderr) => {
      console.log('echo stdout', stdout.trim())
      done()
    })
  })

  describe('stubSpawnOnce', () => {
    it('is a function', () => {
      la(is.fn(stubSpawnOnce))
    })

    it('mocks command with exit code, stdout and stderr', () => {
      const cmd = 'echo "hello"'
      // this is command for execa.shell
      stubSpawnOnce(`/bin/sh -c ${cmd}`, 0, 'foo', 'bar')
      return snapshot(execa.shell(cmd))
    })
  })

  describe('stubSpawnShellOnce', () => {
    const { stubSpawnShellOnce } = require('.')

    it('is a function', () => {
      la(is.fn(stubSpawnShellOnce))
    })

    it('mocks echo hello', () => {
      const cmd = 'echo "hello"'
      stubSpawnShellOnce(cmd, 0, 'foo', 'bar')
      return snapshot(execa.shell(cmd))
    })
  })
})
