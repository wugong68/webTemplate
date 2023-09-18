using Jint;
using System;
using System.Diagnostics;
using System.IO;

namespace WebApplication1
{
    public class JSEngine
    {

        Engine engine = new Engine(
        options =>
        {

            // Limit memory allocations to MB
            //options.LimitMemory(4_000_000)

            // Set a timeout to 4 seconds.
            //options.TimeoutInterval(TimeSpan.FromSeconds(4));

            //// Set limit of 1000 executed statements.
            //options.MaxStatements(1000);

            //// Use a cancellation token.
            //options.CancellationToken(cancellationToken);
        }
        );

        /// <summary>
        /// register object
        /// </summary>
        /// <param name="name"></param>
        /// <param name="ob"></param>
        public void RegeFun(string name, object ob)
        {
            var j = engine.GetValue(name);

            if (j == null || j.ToString() == "undefined")
            {
                engine.SetValue(name, ob);
            }
        }


        public Func<string, Func<string, dynamic>> RunByFile()
        {
            return (script) =>
            {
                var reday = (string srun) =>
                {
                    var sw = new Stopwatch();
                    sw.Start();
                    var ocl = engine.Evaluate(script + ";" + srun);
                    sw.Stop();
                    var runtime = sw.Elapsed.Milliseconds;//
                    return ocl;
                };

                return (runstr) =>
                {
                    var rf = reday(runstr);
                    if (rf.IsArray() || rf.IsObject())
                    {
                        return rf.ToObject();
                    }
                    return rf.ToString();
                };
            };
        }
    }
}
