import {join} from 'path'
import mv from 'mv'

export default async function replaceCurrentBuild (dir, buildDir) {
  const _dir = join(dir, '.zefir')
  const _buildDir = join(buildDir, '.zefir')
  const oldDir = join(buildDir, '.zefir.old')

  try {
    await move(_dir, oldDir)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
  await move(_buildDir, _dir)
  return oldDir
}

function move (from, to) {
  return new Promise((resolve, reject) =>
    mv(from, to, err => err ? reject(err) : resolve()))
}
