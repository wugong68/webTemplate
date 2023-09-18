
/**
 * db.oracledbexe("update xxxxx set aa='xx' where id =1")
 * db.oracledblist("SELECT '1' FROM xxxxx where rownum=1");
 * 
 * db.mysqldbexe("update xxxxx set aa='xx' where id =1")
 * db.mysqldblist("select * from xxxxx limit 3");
 * db.mysqldbpglist("select * from xxxxx",1,3)
 * 
 * 
 * let {  now } = cfg(); //取得系统信息
 * 
 * todo 固定名字 参数任一
 * http://localhost:xxx/home/api?module=test&a=1&b=2
 */
function todo({ a, b,c ,module}) {


    let dd = db.newObject()
    dd.FROMUSER = "username"
    dd.S = 10
    let { now } = cfg();
    return { "jsonfromback": db.tojson(dd), "jsonfromstringify": JSON.stringify(dd), "fromurl_a": a, "fromurl_b": b, "module": module, "cfg_now":now  }

}

