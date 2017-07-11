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

  it('supports child_process.exec', done => {
    const cmd = 'echo "exec test"'
    const mockStdout = 'exec says foo'
    stubSpawnOnce(cmd, 0, mockStdout, 'bar')
    cp.exec(cmd, (code, stdout, stderr) => {
      la(stdout === mockStdout, 'different stdout:', stdout)
      done()
    })
  })

  it.skip('example spying on child_process.execFile', done => {
    const execFile = cp.execFile
    cp.execFile = function (file, options, callback) {
      console.log('execFile')
      console.log(file)
      console.log('options', options)
      return execFile(file, options, callback)
    }
    // cp.exec delegates to cp.execFile
    cp.exec('echo "hello"', (code, stdout, stderr) => {
      console.log('echo stdout:', stdout.trim())
      cp.execFile = execFile
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
