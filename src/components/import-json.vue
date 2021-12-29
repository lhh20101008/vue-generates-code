<template>
    <el-dialog title="导入Json数据" :visible="visible" :before-close="close">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-upload
                        ref="upload"
                        class="upload-demo"
                        :action="action"
                        :limit="1"
                        accept=".json,.txt"
                        :before-upload="upload"

                        :show-file-list="false">
                    <el-button icon="el-icon-upload" type="primary" style="width: 200px;">解析json文件
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传json/text文件，且不超过500kb</div>
                </el-upload>
            </el-col>
            <el-col :span="18">
                <prism-editor v-model="dataJson" class="my-editor" :highlight="highlighter" line-numbers></prism-editor>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
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

@Component({
    components: {PrismEditor}
})
export default class ImportJson extends Vue {
    @Prop({default: () => false, required: true}) private visible!: boolean;

    private dataJson = ''
    private action = ''

    private close() {
        this.$emit('close', false)
    }

    private highlighter(code: string) {
        return highlight(code, languages.js, 'js')
    }

    private submit() {
        try {
            const dataJson = JSON.parse(this.dataJson)
            this.$emit('getTableJson', dataJson)
            this.close()
        } catch (e) {
            this.$message({
                message: 'json格式不正确',
                type: 'warning'
            });
        }
    }

    private upload(file: any) {
        let reader = new FileReader()
        let myThis = this
        reader.readAsText(file)
        reader.onload = function() {
            if (typeof (reader.result) === 'string') {
                myThis.dataJson = reader.result
            }
        }
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
