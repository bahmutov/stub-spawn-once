'use strict'

const cp = require('child_process')
const debug = require('debug')('stub-spawn-once')
const la = require('lazy-ass')
const is = require('check-more-types')
const { Readable } = require('stream')

// save original spawn right away
const oldSpawn = cp.spawn

const noop = () => {}

function readableString (text) {
  const s = new Readable()
  s._read = noop
  s.destroy = noop

  if (text !== undefined) {
    s.push(text)
    s.push(null)
  }

  return s
}

function spawnStub (command, exitCode, stdout, stderr) {
  debug('in spawn stub for command', command)

  const listeners = {}
  const on = (name, cb) => {
    if (!listeners[name]) {
      listeners[name] = []
    }
    listeners[name].push(cb)
  }

  const stdoutStream = readableString(stdout)
  const stderrStream = readableString(stderr)

  const kill = () => {}
  const child = {
    on,
    kill,
    stdout: stdoutStream,
    stderr: stderrStream
  }

  const exitSignal = null

  setTimeout(() => {
    if (listeners.exit) {
      listeners.exit.forEach(cb => {
        console.log('calling exit code %d and signal %s', exitCode, exitSignal)
        cb(exitCode, exitSignal)
      })
    }
  }, 0)

  return child
}

// list of stubbed commands
const commands = {}

function spawnDispatcher (file, args, options) {
  debug('spawnDispatcher', file, arguments)
  const command = file + ' ' + args.join(' ')
  const mock = commands[command]
  if (mock) {
    debug('removing old mock')
    const { exitCode, stdout, stderr } = mock
    delete commands[command]
    return spawnStub(command, exitCode, stdout, stderr)
  } else {
    return oldSpawn(file, args, options)
  }
}

function stubbed () {
  return cp.spawn === spawnDispatcher
}

if (!stubbed()) {
  cp.spawn = spawnDispatcher
} else {
  debug('child_process.spawn was already stubbed')
}

function stubSpawnOnce (command, exitCode, stdout, stderr) {
  la(is.unemptyString(command), 'missing command to stub', command)
  commands[command] = {
    exitCode,
    stdout,
    stderr
  }
}

module.exports = { stubSpawnOnce }
