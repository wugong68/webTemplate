using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WrapJs _rjs;
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            _rjs = new WrapJs(); // new WrapJs(_attment.Context);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        /// <summary>
        /// 模板载入页
        /// </summary>
        /// <param name="module"></param>
        /// <returns></returns>
        public async Task<IActionResult> Po(string module = "a")
        {
            this.ViewBag.module = module;

            var from = await FromClient();

            this.ViewBag.d = from;

            return View();
        }

        public async Task<IActionResult> Ro(string module = "a")
        {
            this.ViewBag.module = module;

            var from = await FromClient();

            this.ViewBag.d = from;

            return View();
        }



        string help = @"
参考写法
/**
    http://localhost:5000/api/dyn/index?filename=test&a=10


 * 
 * db.mysqldbexe(""update xxx set aa='xx' where id =1"")
 * db.mysqldblist(""select * from sysxxxx limit 3"");
 * todo 固定名字 参数任一
 */
function todo({ a, b,c }) {

    //调用数据库
    return db.mysqldblist(""select * from sysxxxx limit 3"");

    return ""get-a:""+a+""|b:""+b+"" now c is ""+c
}


";

        public async Task<IActionResult> Api(string module = "test")
        {

            Hashtable hs = new Hashtable();
        
            hs = await FromClient();
            hs["module"] = module;

            if (string.IsNullOrEmpty(module))
            {
                return Content(help);
            }

            try
            {
                var now = DateTime.Now.ToLocalTime().ToString();
                var cfg =
    @" function cfg(){{ 
        return {{now:""{0}""  }} 
    }};
";
                cfg = string.Format(cfg, now);

                var result = _rjs.Run(module,cfg, hs);
                return Json(new { code = 1, msg = "ok", data = result });
            }
            catch (Exception ex)
            {
                return Json(new { code = 0, msg = "fail", data = ex.Message });
            }
        }


        [NonAction]
        public async Task<Hashtable> FromClient()
        {
            Hashtable hs = new Hashtable();

            if (Request.Query != null)
                foreach (var m in Request.Query)
                {
                    hs[m.Key] = m.Value.ToString();
                }


            if (Request.HasFormContentType)
                foreach (var m in Request.Form)
                {
                    hs[m.Key] = m.Value.ToString();
                }


            if (Request.HasJsonContentType())
            {
                var c = await Request.ReadFromJsonAsync<Dictionary<string, object>>();

                foreach (var item in c)
                {
                    var sdc = item.Value.ToString();
                    hs[item.Key] = sdc;
                }

            }
            return hs;
        }







    }
}