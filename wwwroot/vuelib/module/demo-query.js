/*

    http://localhost/home/po?module=demo-query
*/

const html = `

    <lay-container class="card-container">
        <lay-card shadow="always">
            <template v-slot:title >
                    <lay-page-header style="padding-top:10px;" @back="handleBack">
                        <span style="font-size:15px;">检查记录</span>
                    </lay-page-header>
            </template>
            <template v-slot:body>
                <div>
                    <lay-form :model="model_query" :pane="true">
                        <lay-form-item label="编号" prop="bno" mode="inline" class="form-item-mg">
                            <lay-input v-model="model_query.bno"></lay-input>
                        </lay-form-item>
                        <lay-form-item mode="inline" class="form-item-mg">
                            <lay-button type="primary" @click="querybtn" >
                                <lay-icon type="layui-icon-search">&nbsp;&nbsp;</lay-icon>
                            </lay-button>
                        </lay-form-item>
                    </lay-form>
                </div>

                <lay-table :page="page"
                           even
                           :height="'560px'"
                           :columns="columns"
                           :loading="loading"
                           :default-toolbar="['filter','export']"
                           :data-source="dataSource"
                           @change="tablepage"
                           v-model:selectedKey="selectedRows">

                            <template v-slot:gptmp="{ row }">
                                <span title="规则id：{{row.groupid}}">{{row.title}}</span>
                            </template>
                            <template v-slot:itemtmp="{ row }">
                                 <span title="id：{{row.tagid}}">{{row.pro_name}}</span>
                            </template>
                </lay-table>


            </template>
        </lay-card>
    </lay-container>


`

const App = {

    setup() {

        const handleBack = () => {

        }
        const model_query = ref({ //搜索对象模型
            bno: "",
        }) 
        const selectedRows = ref({})
        const loading = ref(true)
        const dataSource = ref([])
        const page = ref({ current: 1, limit: 15, total: 0 })
        const columns = [
            { key: 'id', width: 70, title: 'ID' },
            { key: 'bno', title: '编号', width: 96 },
            { key: 'title', title: '规则', customSlot: 'gptmp', },
            { key: 'addtime', title: '时间', width: 160, },
        ]

        const queryList = () => {
            loading.value = true; //启动加载
            get("/xxx/xxx?bno=" + model_query.value.bno+ "&page=" + page.value.current + "&limit=" + page.value.limit).then((res1) => {
                const res = res1.data;
                //if(res.)
                {
                    page.value.total = res.data.totalItems
                    dataSource.value = res.data.items
                    loading.value = false;
                }
            })
        }
        const querybtn = () => {//搜索按钮
            page.value.current = 1//页面归1
            queryList();
        }
        const tablepage = (page1) => {//分页按钮
            page.value.current = page1.current
            page.value.limit = page1.limit
            queryList();
        }
        //====================================================================

        return {


            model_query,


            selectedRows,
            columns,
            dataSource,
            loading,
            page,

            tablepage,
            querybtn,
            handleBack,
        }
    },
    template: html

}

export default App
