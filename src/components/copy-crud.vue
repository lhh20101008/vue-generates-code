<template>
    <el-dialog title="crud基础封装文件--可复制到项目中" :visible="visible" :before-close="close">
        <prism-editor v-model="dataJson" class="my-editor" :highlight="highlighter" line-numbers></prism-editor>
    </el-dialog>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  import {PrismEditor} from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css';

  import {highlight, languages} from 'prismjs';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css';

  import {crudTemplate} from './generator/crud'

  @Component({
    components: {
      PrismEditor
    }
  })
  export default class CopyCrud extends Vue {
    @Prop({default: () => false, required: true}) private visible!: boolean;

    private dataJson = ''

    private mounted() {
      this.dataJson = crudTemplate()
    }

    private close() {
      this.$emit('close', false)
    }

    private highlighter(code: string) {
      return highlight(code, languages.js, 'js')
    }
  }
</script>

<style scoped>
    /* required class */
    .my-editor {
        background: #2d2d2d;
        color: #ccc;
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding-top: 5px;
        height: 500px;
    }

    /* optional class for removing the outline */
    .prism-editor__textarea:focus {
        outline: none;
    }
</style>
