<template>
    <div>
        <el-header class="filter-header" height="auto">
            <el-row>
                <el-button type="primary" @click="handlerImportTable">导入Json数据</el-button>
                <el-button type="success" @click="handlerInsertAfter">新增属性</el-button>
                <el-button type="danger" @click="handlerRemoveCheck">删除选中</el-button>
                <el-button type="warning" @click="handlerGenerateCode">生成代码</el-button>
                <el-tooltip class="item" effect="dark" content="封装了增删改查基础方法,其他Api接口需要引用到此crud文件" placement="right">
                    <i class="el-icon-info" @click="visible.crud=true" style="margin-left: 10px; cursor: pointer;"></i>
                </el-tooltip>
            </el-row>
        </el-header>
        <el-row class="rowTop" style="text-align: left">
            <el-col>
                <el-checkbox v-model="tableEdit">使用VxeTable表格编辑</el-checkbox>
                <el-alert title="当表单项比较少时，可以启用表格编辑，在表格内实现增删改功能。" type="info" :closable="false"></el-alert>
            </el-col>
        </el-row>
        <el-row class="rowTop">
            <vxe-table
                    ref="xTable"
                    :data="tableData"
                    :edit-config="{trigger: 'click', mode: 'cell'}"
                    border>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                <vxe-table-colgroup title="属性" align="center">
                    <vxe-table-column title="属性名" field="name"
                                      :edit-render="{name:'input'}"></vxe-table-column>
                    <vxe-table-column title="属性类型" field="type">
                        <template #default="{ row }">
                            <vxe-select size="mini" v-model="row.type" :transfer="true"
                                        :options="typeList"></vxe-select>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="属性说明" field="description"
                                      :edit-render="{name: 'input'}"></vxe-table-column>
                </vxe-table-colgroup>
                <vxe-table-colgroup title="列表" align="center">
                    <vxe-table-column title="列表" field="isShowList">
                        <template #default="{ row }">
                            <vxe-checkbox v-model="row.isShowList"></vxe-checkbox>
                        </template>
                    </vxe-table-column>
                </vxe-table-colgroup>
                <vxe-table-colgroup title="表单" align="center">
                    <vxe-table-column title="表单" field="isShowForm">
                        <template #default="{ row }">
                            <vxe-checkbox v-model="row.isShowForm"></vxe-checkbox>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="必填" field="isRequired">
                        <template #default="{ row }">
                            <vxe-checkbox v-model="row.isRequired"></vxe-checkbox>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="表单类型" field="formType">
                        <template #default="{ row }">
                            <vxe-select size="mini" :transfer="true" v-model="row.formType"
                                        :options="formTypeList">
                            </vxe-select>
                        </template>
                    </vxe-table-column>
                </vxe-table-colgroup>
            </vxe-table>
        </el-row>

        <generator-code v-if="visible.code" :visible.sync="visible.code" :form-data="generatorFormData"
                        @close="close" :table-edit="tableEdit"></generator-code>

        <import-json v-if="visible.table" :visible.sync="visible.table" @close="close"
                     @getTableJson="getTableJson"></import-json>

        <copy-crud v-if="visible.crud" :visible="visible.crud" @close="close"></copy-crud>
    </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import '@/plugins/vxetable.ts'
  import GeneratorDto from '@/models/generator-code.ts'
  import {RowInfo, Table} from 'vxe-table';
  import {Guid} from 'guid-typescript';
  import GeneratorCode from '../components/generator-code.vue'
  import ImportJson from '../components/import-json.vue'
  import {formConf, formTypeList} from '@/components/generator/config'
  import CopyCrud from '@/components/copy-crud.vue'

  @Component({
    components: {
      GeneratorCode,
      ImportJson,
      CopyCrud
    }
  })

  export default class Generator extends Vue {
    private tableData: GeneratorDto[] = []
    private tableEdit = false
    private typeList = [
      {label: 'string', value: 'string'},
      {label: 'number', value: 'number'},
      {label: 'boolean', value: 'boolean'},
      {label: 'date', value: 'date'},
      {label: 'array', value: 'array'},
    ]
    private formTypeList = formTypeList
    private visible: any = {
      code: false,
      table: false,
      crud: false
    }

    private generatorFormData: any = {}
    private formConf: any = formConf
    private sortable1: any

    // 在最后插入行
    public async handlerInsertAfter() {
      const $table = this.$refs.xTable as Table
      const record: GeneratorDto = {
        id: Guid.create(),
        description: '名称',
        formType: 10,
        isRequired: true,
        isShowForm: !this.tableEdit,
        isShowList: true,
        name: 'name',
        type: 'string',
        defaultValue: ''
      }
      await $table.insertAt(record, -1)
      // this.tableData.push(record)
    }

    public async handlerRemoveCheck() {
      // this.tableData = []
      const $table = this.$refs.xTable as Table
      await $table.removeCheckboxRow()
    }

    public close(v: boolean) {
      this.visible.code = v
      this.visible.table = v
      this.visible.crud = v
    }

    private handlerGenerateCode() {
      const $table = this.$refs.xTable as Table
      const currentData: { fullData: RowInfo[]; visibleData: RowInfo[]; tableData: RowInfo[]; footerData: any[][] } = $table.getTableData()
      if (currentData.tableData.length <= 0) {
        this.$message({
          message: '请先添加属性字段',
          type: 'warning'
        });
        return false;
      }
      this.assembleFormData(currentData.tableData)
      this.visible.code = true
    }

    private deactivated() {
      // this.tableData = []
      const $table = this.$refs.xTable as Table
      $table.remove()
    }

    private handlerImportTable() {
      this.visible.table = true
    }

    private assembleFormData(data: RowInfo[]) {
      this.generatorFormData = {
        fields: data,
        ...this.formConf
      }
    }

    private getTableJson(data: any) {
      this.tableData = []
      for (let item in data) {
        let type = this.getType(data[item])
        let dto = this.getGeneratorDto(item, type)
        this.tableData.push(dto)
      }
    }

    private getGeneratorDto(name: string, type: string): GeneratorDto {
      let obj: GeneratorDto = {
        description: name,
        formType: this.getFromType(type),
        id: Guid.create(),
        isRequired: true,
        isShowForm: !this.tableEdit,
        isShowList: true,
        name,
        type,
        defaultValue: ''
      }
      return obj;
    }

    private getType(type: string): string {
      // 判断是否是array
      if (Array.isArray(type)) {
        return 'array'
      }
      return typeof (type)
    }

    private getFromType(type: string): number {
      switch (type) {
        case 'number':
          return 20;
        case 'array':
          return 50;
        case 'boolean':
          return 60;
        case 'date':
          return 80;
        default:
          return 10;
      }
    }
  }
</script>

<style scoped>
    /deep/ .demo-drawer {
        padding: 0px 20px;
    }

    .rowTop {
        margin-top: 20px;
    }

    .drag-btn {
        cursor: move;
        font-size: 12px;
    }

    .vxe-body--row.sortable-ghost,
    .vxe-body--row.sortable-chosen {
        background-color: #dfecfb;
    }

    .filter-header {
        padding: 0px;
    }
</style>
