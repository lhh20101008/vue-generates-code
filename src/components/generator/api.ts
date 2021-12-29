// @ts-nocheck

import {exportDefault} from './index'
import {getTagConfig} from './config'

export function makeApi(formConfig, apiUrl, defaultStr) {
  console.log(formConfig)
  const str = buildExport(apiUrl, defaultStr)
  return str
}

function buildExport(apiUrl, defaultStr) {
  if (!defaultStr) {
    defaultStr = 'crudApi'
  }

  const str = `import CRUD from '@/crud-api';

const url = '${apiUrl}';

const crud = new CRUD(url);

const extensions = {}

const ${defaultStr} = Object.assign(crud, extensions);

export default ${defaultStr};`

  return str
}

function buildExportTypeScript(apiUrl, defaultStr) {
  const str = `import request from '@/utils/requests'
                 import CrudAppService from '../framework/CrudAppService'
                 import {${defaultStr}Dto, CreateOrUpdate${defaultStr}Dto, GetList${defaultStr}Dto} from '@/models/${defaultStr}'
                 import {Guid} from 'guid-typescript'
                 import {ListResultDto} from '@/models/ResultDto'
                 export default class ${defaultStr}Api extends CrudAppService<${defaultStr}Dto, ${defaultStr}Dto, Guid, GetList${defaultStr}Dto, CreateOrUpdate${defaultStr}Dto, CreateOrUpdate${defaultStr}Dto> {
                    constructor() {
                        super("${apiUrl}");
                    }
                 }`
  return str
}
