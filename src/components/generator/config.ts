export const jsOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: -1,
  preserve_newlines: false,
  space_before_conditional: false,
  indent_empty_lines: false,
  unescape_strings: false,
  keep_array_indentation: false,
  break_chained_methods: false,
  brace_style: 'end-expand',
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: 110,
  e4x: true
}

export const htmlOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: -1,
  preserve_newlines: false,
  indent_scripts: 'separate',
  end_with_newline: false,
  wrap_line_length: 110,
  indent_empty_lines: true
}

// 表单属性【右面板】
export const formConf = {
  formRef: 'dataForm',
  formModel: 'dataForm',
  size: '',
  labelPosition: '',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
  tableRef: 'dataTable',
  tableData: 'tableData',
  editConfig: '{trigger: \'manual\', mode: \'row\', showIcon: false, autoClear: false}',
  editRules: 'rules'
}

export const formTypeList = [
  {label: '单行文本', value: 10},
  {label: '数字框', value: 20},
  {label: '密码框', value: 30},
  {label: '多行文本', value: 40},
  {label: '下拉框', value: 50},
  {label: '单选按钮', value: 60},
  {label: '复选按钮', value: 70},
  {label: '日期', value: 80},
  {label: '日期时间', value: 90},
  {label: '时间', value: 100},
  {label: '上传文件', value: 110},
]


// 组件基本配置
export const components = [
  {
    // 组件的自定义配置
    __config__: {
      formType: 10,
      label: '单行文本',
      tag: 'el-input',
      // 正则校验规则
      regList: [],
      defaultValue: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    clearable: true
  },
  {
    __config__: {
      formType: 20,
      label: '数字',
      tag: 'el-input-number',
      regList: [],
      defaultValue: undefined
    },
    placeholder: '请输入',
    clearable: true
  },
  {
    __config__: {
      formType: 30,
      label: '密码',
      tag: 'el-input',
      regList: [],
      defaultValue: ''
    },
    componentType: 'password',
    placeholder: '请输入',
    clearable: true
  },
  {
    __config__: {
      formType: 40,
      label: '多行文本',
      tag: 'el-input',
      regList: [],
      defaultValue: ''
    },
    componentType: 'textarea',
    placeholder: '请输入',
    row: 3,
    clearable: true
  },
  {
    __config__: {
      formType: 50,
      label: '下拉选择',
      tag: 'el-select',
      regList: [],
      defaultValue: undefined
    },
    placeholder: '请选择',
    clearable: true,
    filterable: false
  },
  {
    __config__: {
      formType: 60,
      label: '单选框组',
      tag: 'el-radio-group',
      optionType: 'default',
      regList: [],
      defaultValue: undefined
    }
  },
  {
    __config__: {
      formType: 70,
      label: '多选框组',
      tag: 'el-checkbox-group',
      optionType: 'default',
      regList: [],
      defaultValue: []
    }
  },
  {
    '__config__': {
      formType: 80,
      label: '日期选择',
      tag: 'el-date-picker',
      regList: [],
      defaultValue: null
    },
    'placeholder': '请选择',
    'type': 'date',
    'clearable': true,
    'format': 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd'
  },
  {
    '__config__': {
      formType: 90,
      label: '日期时间选择',
      tag: 'el-date-picker',
      regList: [],
      defaultValue: null
    },
    'placeholder': '请选择',
    'type': 'datetime',
    'clearable': true,
    'format': 'yyyy-MM-dd HH:mm:ss',
    'value-format': 'yyyy-MM-dd HH:mm:ss'
  },
  {
    '__config__': {
      formType: 100,
      label: '时间范围',
      tag: 'el-time-picker',
      regList: [],
      defaultValue: undefined
    },
    'clearable': true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    'format': 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    '__config__': {
      formType: 110,
      label: '上传',
      tag: 'el-upload',
      buttonText: '点击上传',
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      showTip: false,
      name: 'file',
    },
    '__slot__': {
      'list-type': true
    },
    'action': '',
    'accept': '',
    'auto-upload': true,
    'list-type': 'text',
    'multiple': false
  },
]


export function getTagConfig(type: any) {
  for (let i of components) {
    if (i.__config__.formType === type) {
      return i
    }
  }
}
