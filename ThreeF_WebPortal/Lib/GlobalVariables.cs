namespace ThreeF_WebPortal.Lib
{
    public static class GlobalVariables
    {
        public static bool is_development = false;
        public static string default_site_portal = "demo.happygreen.vn";
        public static void SetVariablesEnviroment(bool isDevelop)
        {
            is_development = isDevelop;
        }
    }
}
