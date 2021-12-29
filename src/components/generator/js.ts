// @ts-nocheck

import {exportDefault} from './index'
import ruleTrigger from './ruleTrigger'
import {getTagConfig} from './config'

let confGlobal: any

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 * @param {Boolean} tableEdit 是否启用表格编辑功能
 */
export function makeUpJs(formConfig: any, type: any, tableEdit: any) {
  confGlobal = formConfig
  const dataList: any = []
  const ruleList: any = []
  const optionsList: any = []
  const propsList: any = []
  const methodList = mixinMethod(type)
  const uploadVarList: any = []
  const created: any = []

  formConfig.fields.forEach((el: any) => {
    buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created)
  })

  let formData = ''
  let dialogData = ''
  if (!tableEdit) {
    formData = `${formConfig.formModel}:{
                        ${dataList.join('\n')}
                    },`

    dialogData = `dialog: {
                         title: '',
                         visible: false,
                         handlerFlag:''
                      },`
  }

  const script = buildExport(
    formConfig,
    formData,
    ruleList.join('\n'),
    optionsList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    methodList.join('\n'),
    created.join('\n'),
    dialogData
  )
  confGlobal = null
  return script
}

// 构建组件属性
function buildAttributes(scheme: any, dataList: any, ruleList: any, optionsList: any, methodList: any, propsList: any, uploadVarList: any, created: any) {
  const defaultConf = getTagConfig(scheme.formType);
  const config = {...scheme, ...defaultConf}
  buildData(config, dataList)
  buildRules(config, ruleList)

  console.log(optionsList, propsList, uploadVarList, created)
}

// 在Created调用函数
// function callInCreated(methodName, created) {
//     created.push(`this.${methodName}()`)
// }

// 混入处理函数
function mixinMethod(type: any) {
  const list: any = [];
  const
    minxins = {
      table: {
        handleCreate: `handleCreate(){
                    this.insertEvent()
                },`,
        updateHandle: `updateHandle(row){
                    const $table = this.$refs['${confGlobal.tableRef}']
                    $table.setActiveRow(row)
                },`,
        cancelRowEvent: `cancelRowEvent(row){
                    const $table = this.$refs['${confGlobal.tableRef}']
                    $table.clearActived().then(() => {
                        // 还原行数据
                        $table.revertData(row)
                        // TODO 如果是新添加的行，需要删除该行
                        if (!row.id) {
                            $table.remove(row)
                        }
                    })
                },`,
        insertEvent: `async insertEvent(row){
                    const $table = this.$refs['${confGlobal.tableRef}']
                    const record = {}
                    const {row: newRow} = await $table.insertAt(record, row)
                    await $table.setActiveRow(newRow)
                },`,
        saveEvent: `async saveEvent(row){
                    const $table = this.$refs['${confGlobal.tableRef}']
                    const errMap = await $table.validate().catch(errMap => errMap)
                    if (!errMap) {
                        $table.clearActived().then(() => {
                            if ($table.isUpdateByRow(row)) {
                                this.editing(row)
                            } else if (!row.id) {
                                this.creating(row)
                            }
                        })
                    }
                },`
      },
      dialog: {
        handelConfirm: `handelConfirm() {
                                    this.$refs['${confGlobal.formRef}'].validate(valid => {
                                      if(!valid) return
                                      if (this.dialog.handlerFlag === '新增') {
                                          this.creating(this.${confGlobal.formRef})
                                      } else if (this.dialog.handlerFlag === '编辑') {
                                          this.editing(this.${confGlobal.formRef})
                                      }
                                    })
                                  },`,
        resetForm: `resetForm(){},`,
        handleCreate: `handleCreate(){
                    this.resetForm();
                    this.dialog.visible = true
                    this.dialog.handlerFlag = '新增'
                    this.dialog.title = this.dialog.handlerFlag + this.titleStr
                    this.$nextTick(() => {
                        this.$refs.['${confGlobal.formRef}'].clearValidate()
                    });
                },`,
        updateHandle: `updateHandle(row){
                    this.resetForm();
                    this.dialog.visible = true
                    this.dialog.handlerFlag = '编辑'
                    this.dialog.title = this.dialog.handlerFlag + this.titleStr
                    this.${confGlobal.formRef} = Object.assign({}, row)
                    this.$nextTick(() => {
                        this.$refs.['${confGlobal.formRef}'].clearValidate()
                    });
                },`
      }
    }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach((key) => {
      list.push(methods[key])
    })
  }

  return list
}

// 构建data
function buildData(scheme: any, dataList: any) {
  const config = scheme.__config__
  if (confGlobal.formModel === undefined) {
    return
  }
  const defaultValue = JSON.stringify(config.defaultValue)
  dataList.push(`${scheme.name}: ${defaultValue},`)
}

// 构建校验规则
function buildRules(scheme: any, ruleList: any) {
  const config = scheme.__config__
  if (confGlobal.formModel === undefined) {
    return
  }
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (scheme.isRequired) {
      let message = `${scheme.description}不能为空`
      rules.push(`{ required: true, message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
      ruleList.push(`${scheme.name}: [${rules.join(',')}],`)
    }
  }
}


// ts整体拼接
function buildExport(conf: any, formData: any, rules: any, selectOptions: any, uploadVar: any, props: any, methods: any, created: any, dialog: any) {
  const str = `
  import crudApi from '@/api/api_url'
  ${exportDefault}{
  components: {},
  props: [],
  data () {
    return {
      listQuery:{
        filter:''
      },
      ${dialog}
      titleStr:'',
      tableData: [],
      ${formData}
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${props}
    }
  },
  computed: {},
  watch: {},
  created () {
    ${created}
  },
  mounted () {
    this.getList();
  },
  methods: {
    getList(){
      crudApi.fetchList(this.listQuery).then(res => {
                    if (res) {
                        this.tableData = res.data.items
                    }
                })
    },
    creating(row) {
        crudApi.create(row).then(() => {
                            this.$notify({
                                message: "添加成功",
                                type: "success"
                            });
                            this.handleClose();
                        })
    },
    editing(row) {
        crudApi.update(row).then(() => {
                            this.$notify({
                                message: "编辑成功",
                                type: "success"
                            });
                            this.handleClose();
                        })
    },
    ${methods}
    handleClose(){
      this.getList();
      this.dialog.visible=false
    },
    handlerDelete(row){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    crudApi.remove(row.id).then(res => {
                        if (res) {
                            this.getList();
                            this.$notify({
                                message: "删除成功",
                                type: "success"
                            });
                        }
                    })
                }).catch(() => {
                });
    }
  }
}`
  return str
}
