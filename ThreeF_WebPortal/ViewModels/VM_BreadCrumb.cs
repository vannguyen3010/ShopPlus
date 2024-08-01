namespace ThreeF_WebPortal.ViewModels
{
    public class VM_BreadCrumb
    {
        public string lv1Name { get; set; }
        public string lv1Url { get; set; }
        public string lv2Name { get; set; }
        public string lv2Url { get; set; }
        public string lv3Name { get; set; }
        public string lv3Url { get; set; }
        public string currentName { get; set; }
        public bool isHiddenTitle { get; set; } = true;
    }
}
