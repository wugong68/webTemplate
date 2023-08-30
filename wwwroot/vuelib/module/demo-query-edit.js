/*

    http://localhost/home/po?module=demo-query-edit
*/

const html = `

    <lay-container class="card-container">
        <lay-card shadow="always">
            <template v-slot:title >
                    <lay-page-header style="padding-top:10px;" @back="handleBack">
                        <span style="font-size:15px;">录入</span>
                    </lay-page-header>
            </template>
            <template v-slot:body>
                <div>
                    <lay-form :model="model_query" :pane="true">
                        <lay-form-item label="号码" prop="zno" mode="inline" class="form-item-mg">
                            <lay-input v-model="model_query.zno"></lay-input>
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

                            <template v-slot:toolbar>
                                <lay-button size="sm" type="primary" @click="btnedit(0)">新增</lay-button>
                            </template>
                            <template v-slot:op="{ row }">
            						<a class="layui-btn layui-btn-xs data-count-delete" @click="btnedit(row.id)" >编辑</a>
						            <a class="layui-btn layui-btn-xs data-count-delete" @click="btndelete(row.id)">删除</a>
                            </template>
                </lay-table>


            </template>
        </lay-card>
    </lay-container>


        <!-- 弹框内容在此 -->
    <lay-layer v-model="edit_visible" :shade="true" title="标题设置" :area="['800px', '650px']" :btn="editaction" :closeBtn="1" @close="cclose">
        <div style="padding: 20px;">
            <lay-form :model="model_update" :label-position="md_labelPosition3" required  ref="layFormRef4">
                <lay-form-item label="制造命令号" prop="zno">
                    <lay-input v-model="model_update.zno" required ></lay-input>
                </lay-form-item>
                <lay-form-item label="异常信息" prop="zcontent">
                     <lay-textarea placeholder="请输入描述" v-model="model_update.zcontent"></lay-textarea>
                </lay-form-item>
            </lay-form>
        </div>
    </lay-layer>

`

const App = {

    setup() {

        //========头部返回
        const handleBack = () => {//返回按钮

        }
        //====================================================================

        //========表格-搜索 相关
        const model_query = ref({ //搜索对象模型
            zno: "",
        })
        const edit_visible = ref(false)
        const selectedRows = ref({})
        const loading = ref(false)
        const dataSource = ref([])
        const page = ref({ current: 1, limit: 15, total: 0 })
        const columns = [
            {
                key: 'id',
                width: 80,
                title: 'ID'
            },
            {
                key: 'buildid',
                title: '号码',
                width: 160
            },

            {
                key: 'addtime',
                title: '添加日期',
                width: 180,
            },
            {
                key: '操作',
                width: 120,
                customSlot: 'op',
                //fixed: "right",
                align: "center"
            }
        ]

        const queryList = () => {
            loading.value = true; //启动加载
            get("/xxxx?zno=" + model_query.value.zno + "&page=" + page.value.current + "&limit=" + page.value.limit).then((res1) => {
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
            page.value.current = 1
            queryList();
        }
        const tablepage = (page1) => {//分页按钮
            console.log("cur:" + page1.current, "limt:" + page1.limit)
            page.value.current = page1.current
            page.value.limit = page1.limit
            queryList();
        }
        //====================================================================
        const model_update = ref({ //编辑界面数据模型
            zno: "",
            zcontent: "",
            id: 0,
        })
        const layFormRef4 = ref(); //表单对象
        const btnedit = (id) => {

            if (id == 0) {
                edit_visible.value = true;
                return;
            }
            get("/Admin/DataTable/getoneerryzbyid?id=" + id).then(res1 => {
                const res = res1.data;
                if (res.statusCode == 200) {
                    model_update.zno = res.data.buildid
                    model_update.zcontent = res.data.content
                    model_update.id = id
                    edit_visible.value = true;
                } else {
                    layer.msg(res.msg, {
                        icon: 2,
                        time: 2000
                    });
                }

            })
        }

        const btndelete = (id) => {
            layer.confirm("确认删除？",
                {
                    btn: [
                        {
                            text: '确认', callback: (ids) => {

                                get("/Admin/DataTable/delerryzbyid?id=" + id).then(res1 => {
                                    const res = res1.data;
                                    if (res.statusCode == 200) {
                                        layer.msg("删除成功", { time: 1000, icon: 1 })  //弹框提示
                                        queryList();
                                    }
                                })

                                layer.close(ids);
                            }
                        },
                        {
                            text: '取消', callback: (id) => {

                                layer.close(id);
                            }
                        }
                    ]
                }
            );


        }
        const validata = (funrun) => { //验证表单
            layFormRef4.value.validate((isValidate, model, errors) => {
                if (isValidate) {
                    funrun()
                }
            });
        }
        const editaction = ref([  //弹框按钮事件
            {
                text: "确认",
                callback: () => {

                    validata(() => { //验证成功才提交

                        get("/Admin/DataTable/adderryz?buildid=" + model_update.zno + "&content=" + model_update.zcontent + "&id=" + model_update.id).then(res1 => {
                            const res = res1.data;
                            if (res.statusCode == 200) {
                                //let list = res.data;
                                layer.msg("操作成功", { icon: 1, time: 1000 });
                                queryList();
                            } else {
                                layer.msg(res.msg, { icon: 2, time: 2000 });
                            }
                        })

                    })

                }
            },
            {
                text: "取消",
                callback: () => {
                    edit_visible.value = false;
                }
            }
        ])

        const cclose = () => { //弹框关闭按钮
            model_update.value = {
                zno: "",
                zcontent: "",
                id: 0,
            }
        }



        queryList()
        return {


            model_query,


            selectedRows,
            columns,
            dataSource,
            loading,
            page,
            edit_visible,
            editaction,
            layFormRef4,

            tablepage,
            querybtn,
            handleBack,
            btnedit,
            btndelete,
            cclose,
            model_update,
        }
    },
    template: html

}

export default App
