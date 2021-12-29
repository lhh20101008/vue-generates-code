export function crudTemplate() {
  return 'import request from \'../utils/request\';\n' +
    '\n' +
    'export function fetchList(url) {\n' +
    '  return (listQuery) => request({\n' +
    '    url: url,\n' +
    '    method: \'get\',\n' +
    '    params: listQuery\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'export function fetch(url) {\n' +
    '  return (id) => request({\n' +
    '    url: `${url}/${id}`,\n' +
    '    method: \'get\'\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'export function create(url) {\n' +
    '  return (entity) => request({\n' +
    '    url: url,\n' +
    '    method: \'post\',\n' +
    '    data: entity\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'export function update(url) {\n' +
    '  return (entity) => request({\n' +
    '    url: `${url}/${entity.id}`,\n' +
    '    method: \'put\',\n' +
    '    data: entity\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'export function remove(url) {\n' +
    '  return (id) => request({\n' +
    '    url: `${url}/${id}`,\n' +
    '    method: \'delete\'\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'export default function CRUD(url) {\n' +
    '  return {\n' +
    '    fetchList: fetchList(url),\n' +
    '    fetch: fetch(url),\n' +
    '    create: create(url),\n' +
    '    update: update(url),\n' +
    '    remove: remove(url)\n' +
    '  };\n' +
    '}\n'
}
