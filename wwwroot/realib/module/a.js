/*

    http://localhost/home/ro?module=a
*/


const css = `
    body{
         background-color:#fff
    }
`


const { Button, DatePicker, DatePickerProps,message } = antd;
const { useState, useEffect } = React;


function B1() {

    return (
        <div>测试用的B啦</div>
    )
}


function App() {

    const [ txt, settxt ] =  useState(0);
    
    const yes = () => {
        //alert(1)
        message.info("hello")
    }

    const changedate = (date, dateString) => {
        console.log(date,"select your time", dateString);
    };


    return (
        <div style={{ padding:'10px'} } >
            <Button onClick={async () => {
                    settxt(txt+1)
                }} >
                {txt}
            </Button>
            <div>
                <DatePicker onChange={changedate} format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }} defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD ')} />
            </div>
            <h1 onClick={ yes}>Hello World</h1>
            {<B1 />}
        </div>
    );
}
