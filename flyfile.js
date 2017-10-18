const notifier = require('node-notifier')

export async function compile(fly) {
  await fly.parallel(['bin', 'server', 'lib'])
}

export async function bin(fly, opts) {
  await fly
    .source(opts.src || 'bin/*')
    .babel()
    .target('dist/bin', {mode: '0755'})
  notify('Compiled binaries')
}

export async function lib(fly, opts) {
  await fly
    .source(opts.src || 'lib/**/*.js')
    .babel()
    .target('dist/lib')
  notify('Compiled lib files')
}

export async function server(fly, opts) {
  await fly
    .source(opts.src || 'server/**/*.js')
    .babel()
    .target('dist/server')
  notify('Compiled server files')
}

export async function copy(fly) {
  await fly.source('server/index.html').target('dist/server')
}

export async function build(fly) {
  await fly.serial(['copy', 'compile'])
}

export default async function(fly) {
  await fly.start('build')
  await fly.watch('bin/*', 'bin')
  await fly.watch('server/**/*.js', 'server')
  await fly.watch('lib/**/*.js', 'lib')
}

export async function release(fly) {
  await fly.clear('dist').start('build')
}

// notification helper
function notify(msg) {
  return notifier.notify({
    title: '≈ Zefir',
    message: msg,
    icon: false
  })
}
