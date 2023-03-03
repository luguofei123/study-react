import './driver.es5.min.js';

async function createDB () {
  const $idb = new Driver('yondif_db', 1);
  $idb.on("process", function (state) {
    //console.log(state)
  })
  await $idb.open()
  //缓存表
  await $idb.createTable({
    name: 'cache_data',
    primaryKey: 'key',
    // autoIncrement: true,
    /*
    indexes: [
      {name: 'localStore_index', column: 'key'},
    ],
    */
    data: []
  })
  return $idb
}

// 设置缓存，通过接口+参数生成key，存数据为数组
export const setCache = async function (key, value) {
  const $idb = await createDB()
  $idb.delete('cache_data', key)
  $idb.insert('cache_data', { key, value })
}
// 根据接口+参数生成key取值，返回Promise
export const getCache = async function (key) {
  const $idb = await createDB()
  const res = await $idb.selectByKey('cache_data', key)

  if (!res) {
    return
  }
  return res.value
}


