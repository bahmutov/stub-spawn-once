'use strict'

const execa = require('execa')
const snapshot = require('snap-shot')

/* global describe, it */
// const stubSpawnOnce = require('.')

describe('stub-spawn-once', () => {
  it('plain execa.shell', () => {
    return snapshot(execa.shell('echo "hello"'))
  })
})
