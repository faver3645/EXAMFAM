using Microsoft.AspNetCore.Mvc;

namespace ITPE3200FAM.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

    }
}
