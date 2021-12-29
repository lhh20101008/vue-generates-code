// @ts-nocheck

let fs = require('fs')
let path = require('path')

export function build(content, dataForm, type) {
  const func = `build${type}`
  func && eval(func + `(content,dataForm,type)`)
}

function buildapi(content, dataForm, type) {
  let paths = createPath(dataForm.apiPathTou, dataForm.moduleName, type)
  createFilePath(content, paths, dataForm.fileName, 'ts')
}

function builddto(content, dataForm, type) {
  let paths = createPath(dataForm.dtoPathTou, dataForm.moduleName, type)
  createFilePath(content, paths, dataForm.fileName, 'ts')
}

function buildviews(content, dataForm, type) {
  let paths = createPath(dataForm.vuePathTou, dataForm.moduleName, type)
  createFilePath(content, paths, dataForm.fileName, 'vue')
}

// 判断路径是否存在
function createPath(rootPath, moduleName, type) {
  if (!rootPath) {
    rootPath = `../template/${type}/`
  }

  let templatePath = path.resolve(rootPath)
  // 判断文件是否存在
  if (!fs.existsSync(templatePath)) {
    fs.mkdirSync(templatePath)
  }

  let pathModule = path.resolve(rootPath + moduleName)
  let exists = fs.existsSync(pathModule)
  if (!exists) {
    fs.mkdirSync(pathModule)
  }
  return pathModule
}

// 判断文件是否存在
function createFilePath(content, rootPath, fileName, ext) {
  let filePath = rootPath + '/' + fileName + `.${ext}`
  let existsFile = fs.existsSync(filePath)
  if (!existsFile) {
    fs.writeFileSync(filePath, content)
  }
}
