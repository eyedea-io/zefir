const notifier = require('node-notifier')

export async function compile(task) {
  await task.parallel(['bin', 'server', 'lib'])
}

export async function bin(task, opts) {
  await task
    .source(opts.src || 'bin/*')
    .babel()
    .target('dist/bin', {mode: '0755'})
  notify('Compiled binaries')
}

export async function lib(task, opts) {
  await task
    .source(opts.src || 'lib/**/*.js')
    .babel()
    .target('dist/lib')
  notify('Compiled lib files')
}

export async function server(task, opts) {
  await task
    .source(opts.src || 'server/**/*.js')
    .babel()
    .target('dist/server')
  notify('Compiled server files')
}

export async function copy(task) {
  await task.source('server/index.html').target('dist/server')
}

export async function build(task) {
  await task.serial(['copy', 'compile'])
}

export default async function(task) {
  await task.start('build')
  await task.watch('bin/*', 'bin')
  await task.watch('server/**/*.js', 'server')
  await task.watch('lib/**/*.js', 'lib')
}

export async function release(task) {
  await task.clear('dist').start('build')
}

// notification helper
function notify(msg) {
  return notifier.notify({
    title: '≈ Zefir',
    message: msg,
    icon: false
  })
}
