'use strict'

const cp = require('child_process')
const debug = require('debug')('stub-spawn-once')
const la = require('lazy-ass')
const is = require('check-more-types')
const { Readable } = require('stream')

// save original methods right away
const oldSpawn = cp.spawn
const oldExecFile = cp.execFile

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
        debug('calling exit code %d and signal %s', exitCode, exitSignal)
        cb(exitCode, exitSignal)
      })
    }
  }, 0)

  return child
}

function execFileStub (file, opts, callback, exitCode, stdout, stderr) {
  setTimeout(function () {
    callback(exitCode, stdout, stderr)
  }, 0)
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

function execFileDispatcher (file, options, callback) {
  debug('execFileDispatcher', file, options)
  const command = file
  const mock = commands[command]
  if (mock) {
    debug('removing old exec file mock')
    const { exitCode, stdout, stderr } = mock
    delete commands[command]
    return execFileStub(file, options, callback, exitCode, stdout, stderr)
  } else {
    return oldExecFile(file, options, callback)
  }
}

function stubbed () {
  return cp.spawn === spawnDispatcher
}

if (!stubbed()) {
  cp.spawn = spawnDispatcher
  cp.execFile = execFileDispatcher
} else {
  debug('child_process.spawn/execFile was already stubbed')
}

function stubSpawnOnce (command, exitCode, stdout, stderr) {
  la(is.unemptyString(command), 'missing command to stub', command)

  if (is.string(exitCode)) {
    debug('stub for %s without explicit exit code, assuming 0', command)
    stderr = stdout
    stdout = exitCode
    exitCode = 0
  }

  commands[command] = {
    exitCode,
    stdout,
    stderr
  }
}

// only provide the shell command like 'echo "hello"'
function stubSpawnShellOnce (command, exitCode, stdout, stderr) {
  la(is.unemptyString(command), 'missing shell command to stub', command)

  if (is.string(exitCode)) {
    debug('stub for %s without explicit exit code, assuming 0', command)
    stderr = stdout
    stdout = exitCode
    exitCode = 0
  }

  const fullCommand = `/bin/sh -c ${command}`
  commands[fullCommand] = {
    exitCode,
    stdout,
    stderr
  }
}

module.exports = {
  stubSpawnOnce,
  stubSpawnShellOnce,
  stubExecOnce: stubSpawnOnce,
  stubExecFileOnce: stubSpawnOnce
}
