using System.Collections.Generic;
using System.Collections;
using System;
using System.IO;
using SqlSugar;
using System.Linq;

namespace WebApplication1
{
    public class WrapJs
    {
        JSEngine js = new JSEngine();

        ISqlSugarClient db;
        public WrapJs(ISqlSugarClient db)
        {
            js.RegeFun("db", this);
            this.db = db;
            this.db.Aop.OnLogExecuting = (sql, pars) =>
            {
                Console.WriteLine($"sql【{sql}】pars【{pars}】");
            };
        }

        public WrapJs()
        {
            js.RegeFun("db", this);
        }


        /// <summary>
        /// mysql连接
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public List<dynamic> mysqldblist(string sql)
        {
            return db.SqlQueryable<dynamic>(sql).ToList();
        }


        /// <summary>
        /// 参数化查询
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="wp"></param>
        /// <returns></returns>
        public List<dynamic> mysqldblist(string sql,Dictionary<string,object> wp)
        {
            /*
             db.mysqldblist("select * from tbname where id=@id", Object.assign(db.newObject(), { id: 1}))
             */
            var whe = wp.Keys.ToList().Select(m => {
                return new SugarParameter(m, wp[m]);
            });
            return db.SqlQueryable<dynamic>(sql).AddParameters(whe.ToArray()).ToList();
        }


        /// <summary>
        /// 带参数分页查询
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="where"></param>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        public List<dynamic> mysqldblist(string sql,Dictionary<string,object> where,int page,int size)
        {
            /*
             db.mysqldblist("select * from tbname where id=@id", Object.assign(db.newObject(), { id: 1}),1,20)
             */
            var whe = where.Keys.ToList().Select(m => {
                return new SugarParameter(m, where[m]);
            });
            return db.SqlQueryable<dynamic>(sql).AddParameters(whe.ToArray()).ToPageList(page, size);
        }

        /// <summary>
        /// 返回新model对象
        /// JS用
        /// </summary>
        /// <returns></returns>
        public Dictionary<string,object> newObject()
        {
            return new Dictionary<string,object>();
        }


        //C#转化json方法
        public string tojson(dynamic obj)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// 执行操作
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public int mysqldbexe(string sql)
        {
            return db.Ado.ExecuteCommand(sql);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public int mysqldbexe(string sql, Dictionary<string, object> where)
        {

            /*
             
                db.mysqldbexe("delete from tbname where id>@id and nn=@nn", Object.assign(db.newObject(), { id: 0, nn: 'aaaa' }))
             
             */
            return db.Ado.ExecuteCommand(sql,where);
        }

        /// <summary>
        /// 更新操作，主键更新
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="tabname"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public int mysqlUpdate(Dictionary<string,object> dic,string tabname,string id)
        {
            /*
             var dt = new Dictionary<string, object>();
                dt.Add("id", 1);
                dt.Add("name", "jack");
                dt.Add("createTime", DateTime.Now);
                var t66 = db.Updateable(dt).AS("student").WhereColumns("id").ExecuteCommand();
             */
            return db.Updateable(dic).AS(tabname).WhereColumns(id).ExecuteCommand();
        }



        /// <summary>
        /// 数据库更新，其他条件更新
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="tabname"></param>
        /// <param name="where"></param>
        /// <param name="wp"></param>
        /// <returns></returns>
        public int mysqlUpdate(Dictionary<string, object> dic, string tabname, string where, Dictionary<string, object>  wp)
        {
            /*
                db.mysqlUpdate(Object.assign(db.newObject(), { "name": "myname", css: 1 }),
                    "table",
                    "id>@id and name!=@name",
                    Object.assign(db.newObject(), { id: 1, name: 'cf' }))
             */

            //var dss = db.Updateable(dic).AS(tabname).Where(where, wp).ToSqlString();

            return db.Updateable(dic).AS(tabname).Where(where, wp).ExecuteCommand();
        }

        /// <summary>
        /// 插入操作
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="tabname"></param>
        /// <returns></returns>
        public int mysqlInsert(Dictionary<string, object> dic, string tabname)
        {
            return db.Insertable(dic).AS(tabname).ExecuteCommand();
        }



        public dynamic Run(string file,string precontent, Hashtable hs)
        {
            var fs = Path.Combine(Environment.CurrentDirectory, "wwwroot", "api", file + ".js");
            var filecontent = File.ReadAllText(fs);
            if (hs == null)
            {
                hs = new Hashtable();
            }
            filecontent = precontent + filecontent;
            var param = Newtonsoft.Json.JsonConvert.SerializeObject(hs);
            var rtstr = js.RunByFile().Invoke(filecontent).Invoke($"todo({param});"); 
            return rtstr;
        }
    }


    public static class LingExtensions
    {
        public static IEnumerable<T> ForEach<T>(this IEnumerable<T> collection, Action<T> action)
        {
            foreach (T item in collection)
            {
                action(item);
            }

            return collection;
        }
    }
}
