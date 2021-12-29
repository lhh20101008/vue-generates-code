<template>
    <div>
        <el-drawer title="生成代码" :visible.sync="visible" size="50%" :before-close="closeDrawer">
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
                <el-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>template
                </span>
                </el-tab-pane>
                <el-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>
                  script
                </span>
                </el-tab-pane>
                <el-tab-pane name="api">
                <span slot="label">
                  <i v-if="activeTab==='api'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>
                  api
                </span>
                </el-tab-pane>
            </el-tabs>
            <div v-show="activeTab==='html'" class="tab-editor">
                <prism-editor class="my-editor" v-model="htmlCode" :highlight="highlighterHtml"
                              line-numbers></prism-editor>
            </div>
            <div v-show="activeTab==='js'" class="tab-editor">
                <prism-editor class="my-editor" v-model="jsCode" :highlight="highlighterJs" line-numbers></prism-editor>
            </div>
            <div v-show="activeTab==='api'" class="tab-editor">
                <prism-editor class="my-editor" v-model="apiCode" :highlight="highlighterJs"
                              line-numbers></prism-editor>
            </div>

        </el-drawer>

    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  import GenerateFile from '@/components/generate-file.vue'

  import {jsOptions, htmlOptions} from '@/components/generator/config'

  import {makeUpHtml} from '@/components/generator/html'
  import {makeUpJs} from '@/components/generator/js'
  import {makeApi} from '@/components/generator/api'

  import {PrismEditor} from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css';

  import {highlight, languages} from 'prismjs';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css';

  import beautifier, {HTMLBeautifyOptions, JSBeautifyOptions} from 'js-beautify'

  @Component({
    components: {
      PrismEditor
    }
  })
  export default class GeneratorCode extends Vue {
    @Prop({required: true, default: false}) public visible!: boolean
    @Prop({}) public formData!: any
    @Prop({default: false}) public tableEdit!: boolean

    private activeTab = 'html'
    private htmlCode = ''
    private jsCode = ''
    private apiCode = ''
    private gf = false

    public closeDrawer() {
      this.$emit('close', false);
    }

    public closeDialog(v: boolean) {
      this.gf = v
    }

    public openDialog() {
      this.gf = true
    }

    private created() {
      this.open()
    }

    private open() {
      this.htmlCode = makeUpHtml(this.formData, '页面', this.tableEdit)
      this.htmlCode = beautifier.html(this.htmlCode, htmlOptions as HTMLBeautifyOptions)
      const type = this.tableEdit ? 'table' : 'dialog'
      this.jsCode = makeUpJs(this.formData, type, this.tableEdit)
      this.jsCode = beautifier.js(this.jsCode, jsOptions as JSBeautifyOptions)
      this.apiCode = makeApi(this.formData, '', '')
      this.apiCode = beautifier.js(this.apiCode, jsOptions as JSBeautifyOptions)
    }

    private highlighterHtml(code: string) {
      return highlight(code, languages.html, 'html')
    }

    private highlighterJs(code: string) {
      return highlight(code, languages.js, 'js')
    }
  }
</script>

<style scoped>
    .tab-editor {
        height: 85%;
        font-size: 16px;
    }

    /* required class */
    .my-editor {

        background: #2d2d2d;
        color: #ccc;
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding-top: 5px;
    }

    /deep/
    .prism-editor__line-numbers {
        height: auto;
    }

    /* optional class for removing the outline */
    .prism-editor__textarea:focus {
        outline: none;
    }
</style>
