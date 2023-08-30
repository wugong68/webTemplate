using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
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