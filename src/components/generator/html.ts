// @ts-nocheck

import {getTagConfig} from './config'

let confGlobal

export function dialogWrapper(str) {
  return `<el-dialog :title="dialog.title" :visible.sync="dialog.visible">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(tableStr, fromStr) {
  return `<template>
    <div>
        <el-header class="filter-header" height="auto">
            <el-row>
                <el-input v-model="listQuery.filter" class="filter-input" placeholder="请输入" clearable></el-input>
                <el-button type="primary" class="filter-button" @click="getList">查询</el-button>
            </el-row>
            <el-row class="row-add">
                <el-button @click="handleCreate">新增</el-button>
            </el-row>
        </el-header>
        <el-row>
            ${tableStr}
        </el-row>
        ${fromStr}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script lang="ts">
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style scoped>
    ${cssStr}
  </style>`
}

function buildTableTemplate(scheme, child) {
  let str = `<el-table ref="${scheme.tableRef}" :data="${scheme.tableData}" border stripe>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                ${child}
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="updateHandle(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" size="mini" @click="handlerDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
               </el-table>
    `
  return str
}

/**
 * 启动表格编辑功能
 * */
function buildVxeTableTemplate(scheme, child) {
  let str = `<vxe-table ref="${scheme.tableRef}"
                    :data="${scheme.tableData}" :edit-config="${scheme.editConfig}" :edit-rules="${scheme.editRules}"
                    keep-source border>
                    <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
                    ${child}
                    <vxe-table-column title="操作">
                        <template #default="{ row }">
                            <template v-if="$refs.${scheme.tableRef}.isActiveByRow(row)">
                            <el-button type="primary" size="mini" @click="saveEvent(row)">保存</el-button>
                            <el-button size="mini" @click="cancelRowEvent(row)">取消</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary"
                                       size="mini" @click="updateHandle(row)">编辑
                            </el-button>
                            <el-button type="danger"
                                       size="mini" @click="handlerDelete(row)">删除
                            </el-button>
                        </template>
                        </template>
                    </vxe-table-column>
               </vxe-table>`
  return str
}

function buildFormTemplate(scheme, child, type) {
  let str = `<el-form ref="${scheme.formRef}" :model="${scheme.formModel}" :rules="${scheme.formRules}"  label-width="${scheme.labelWidth}px">
      ${child}
      ${buildFromBtns(scheme, type)}
    </el-form>`
  return str
}

function buildFromBtns(scheme, type) {
  let str = ''
  if (scheme.formBtns && type === 'file') {
    str = `<el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`
  }
  return str
}

const layouts = {
  colFormItem(scheme) {
    const defaultConf = getTagConfig(scheme.formType);
    const config = {...scheme, ...defaultConf}
    let label = `label="${config.description}"`
    const tagDom = tags[config.__config__.tag] ? tags[config.__config__.tag](config) : null
    let str = `<el-form-item ${label} prop="${scheme.name}">
        ${tagDom}
      </el-form-item>`
    return str
  },
  tableItem(scheme, tableEdit) {
    const defaultConf = getTagConfig(scheme.formType);
    const config = {...scheme, ...defaultConf}
    let str = `<el-table-column label="${config.description}" prop="${scheme.name}"></el-table-column>`
    if (tableEdit) {
      str = `<vxe-table-column title="${config.description}" field="${scheme.name}" :edit-render="{name: 'input'}"></vxe-table-column>`
    }
    return str;
  }
}

const tags = {
  'el-input': (el) => {
    const {
      tag, vModel, clearable, placeholder
    } = attrBuilder(el)
    const type = el.componentType ? `type="${el.componentType}"` : ''
    const row = el.row ? `:row="${el.row}"` : ''
    return `<${tag} ${type} ${row} ${vModel} ${placeholder} ${clearable}></${tag}>`
  },
  'el-input-number': (el) => {
    const {
      tag, vModel, clearable, placeholder
    } = attrBuilder(el)
    return `<${tag} ${vModel} :controls="false" ${placeholder} ${clearable}></${tag}>`
  },
  'el-select': (el) => {
    const {
      tag, vModel, clearable, placeholder
    } = attrBuilder(el)
    const filterable = el.filterable ? 'filterable' : ''
    let child = buildElSelectChild(el)

    if (child) {
      child = `\n${child}\n`
    } // 换行
    return `<${tag} ${vModel} ${placeholder} ${filterable} ${clearable}>${child}</${tag}>`
  },
  'el-radio-group': (el) => {
    const {tag, vModel} = attrBuilder(el)
    let child = buildElRadioGroupChild(el)

    if (child) {
      child = `\n${child}\n`
    } // 换行
    return `<${tag} ${vModel}>${child}</${tag}>`
  },
  'el-checkbox-group': (el) => {
    const {tag, vModel} = attrBuilder(el)
    let child = buildElCheckboxGroupChild(el)

    if (child) {
      child = `\n${child}\n`
    } // 换行
    return `<${tag} ${vModel}>${child}</${tag}>`
  },
  'el-time-picker': (el) => {
    const {
      tag, vModel, clearable, placeholder
    } = attrBuilder(el)
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const isRange = el['is-range'] ? 'is-range' : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''

    return `<${tag} ${vModel} ${isRange} ${format} ${valueFormat} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable}></${tag}>`
  },
  'el-date-picker': (el) => {
    const {
      tag, vModel, clearable, placeholder
    } = attrBuilder(el)

    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const type = el.type === 'date' ? '' : `type="${el.type}"`

    return `<${tag} ${type} ${vModel} ${format} ${valueFormat} ${placeholder} ${clearable}></${tag}>`
  },
  'el-upload': (el) => {
    const {tag} = el.__config__
    const disabled = el.disabled ? ':disabled=\'true\'' : ''
    const action = el.action ? `:action="${el.name}Action"` : ''
    const multiple = el.multiple ? 'multiple' : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const name = el.name !== 'file' ? `name="${el.name}"` : ''
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
    const beforeUpload = `:before-upload="${el.name}BeforeUpload"`
    const fileList = `:file-list="${el.name}fileList"`
    const ref = `ref="${el.name}"`
    let child = buildElUploadChild(el)

    if (child) {
      child = `\n${child}\n`
    } // 换行
    return `<${tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${tag}>`
  }
}

function attrBuilder(el) {
  return {
    tag: el.__config__.tag,
    vModel: `v-model` + ((el.formType === 20) ? '.number' : '') + `="${confGlobal.formModel}.${el.name}"`,
    clearable: el.clearable ? ':clearable="true"' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}${el.description}"` : '',
  }
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = []
  children.push(`<el-option v-for="(item, index) in ${scheme.name}Options" :key="index" :label="item.label" :value="item.value"></el-option>`)
  return children.join('\n')
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = []
  const config = scheme.__config__
  const tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio'
  children.push(`<${tag} v-for="(item, index) in ${scheme.name}RadioOptions" :key="index" :label="item.value">{{item.label}}</${tag}>`)
  return children.join('\n')
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = []
  const config = scheme.__config__
  const tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
  children.push(`<${tag} v-for="(item, index) in ${scheme.name}CheckOptions" :key="index" :label="item.value">{{item.label}}</${tag}>`)
  return children.join('\n')
}

// el-upload 子级
function buildElUploadChild(scheme) {
  const list = []
  const config = scheme.__config__
  if (scheme['list-type'] === 'picture-card') {
    list.push('<i class="el-icon-plus"></i>')
  } else {
    list.push(`<el-button size="small" type="primary" icon="el-icon-upload">${config.buttonText}</el-button>`)
  }
  if (config.showTip) {
    list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`)
  }
  return list.join('\n')
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 * @param {Boolean} tableEdit 是否启动表格编辑功能
 */
export function makeUpHtml(formConfig, type, tableEdit) {
  const formList = []
  const tableList = []
  confGlobal = formConfig
  // 遍历渲染每个组件成html
  formConfig.fields.forEach((el) => {
    if (el.isShowForm) {
      formList.push(layouts.colFormItem(el))
    }
    if (el.isShowList) {
      tableList.push(layouts.tableItem(el, tableEdit))
    }
  })
  const formHtmlStr = formList.join('\n')
  const tableHtmlStr = tableList.join('\n')
  // 将组件代码放进table标签
  let tableTemp = ''
  let formTemp = '';
  // TODO 启用表格编辑功能
  if (!tableEdit) {
    tableTemp = buildTableTemplate(formConfig, tableHtmlStr)
    // 将组件代码放进form标签
    formTemp = buildFormTemplate(formConfig, formHtmlStr, type)
    // dialog标签包裹代码
    formTemp = dialogWrapper(formTemp)
  } else {
    tableTemp = buildVxeTableTemplate(formConfig, tableHtmlStr)
  }

  let vue = vueTemplate(tableTemp, formTemp)

  confGlobal = null
  return vue
}
