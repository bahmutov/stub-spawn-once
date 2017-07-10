'use strict'

const execa = require('execa')
const snapshot = require('snap-shot')
const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */

describe('stub-spawn-once', () => {
  const { stubSpawnOnce } = require('.')

  it('plain execa.shell', () => {
    return snapshot(execa.shell('echo "hello"'))
  })

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
