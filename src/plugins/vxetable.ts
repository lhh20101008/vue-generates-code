import Vue from 'vue'
import XEUtils from 'xe-utils'
import 'vxe-table/lib/style.css'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

import {VXETable, Header, Column, Colgroup, Edit, Select, Switch, Checkbox, Icon, Table, Tooltip} from 'vxe-table'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
    i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
    border: true,
    editConfig: {
        showIcon: true
    }
})

Vue.use(Header)
    .use(Column)
    .use(Colgroup)
    .use(Edit)
    .use(Icon)
    .use(Select)
    .use(Checkbox)
    .use(Switch)
    .use(Tooltip)
    .use(Table)
