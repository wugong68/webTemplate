/*

    http://localhost/home/po?module=a
*/

const html = `

    <lay-button @click="increment" >
       hello {{ message }} 
    </lay-button >

`

const css = `
    body{
     padding: 200px;
    }
`

const message = ref("Hello World")
const active2 = ref(true)
const md_labelPosition3 = ref("right")
const md_model3 = ref({
    username: "",
    password: "",
    hobby: "",
    desc: "",
})
const increment = () => {//点击事件
    layer.msg("成功消息", { time: 1000, icon: 1 })
}

const App = {

    setup() {
        //alert(1)
        return {
            message,
            active2,
            md_labelPosition3,
            md_model3,
            increment
        }
    },
    template: html,
    templatecss: css,

}

export default App
