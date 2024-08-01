namespace ThreeF_WebPortal.Lib
{
    public static class CommonConstants
    {
        public const int TIMEOUT_CHECK_AUTHENTICATION = 5; //Minute
        public const int MAX_FILE_SIZE_IMAGE_UPLOAD = 5; //MB
        public const int BANNER_RECORDS = 10; //Banner mid, bot
        public const int DISCOUNT_PRODUCT_RECORDS = 20; //Sp đang khuyến mãi
        public const int SELLING_PRODUCT_RECORDS = 20; //Sp bán chạy (nổi bật)
        public const int POPULAR_PRODUCT_RECORDS = 20; //Sp phổ biến (xem nhiều)
        public const int NEWS_LATEST_RECORDS = 5; //Tin tức mới
        public const int NEWS_RELATED_RECORDS = 5; //Tin tức liên quan

        //public const int OWNER_SUPPLIER_ID = 3; /*1*/
        /*public const string SUPPLIER_CUSTOM = "3"; *//*0*///Supplier can change number

        public const string CACHE_KEY_SUPPLIER_INFO = "supplier_info";
        public const string CACHE_KEY_CATEGORY = "category";
        public const string CACHE_KEY_NEWS_CATEGORY = "news_category";
        public const string CACHE_KEY_INTRODUCE_CATEGORY = "introduces_category";
        public const string DEFAULT_REFCODE_UISYSTEM = "uisystem";
        public const string NAME_SERVICE_MINISHOP_PLUS = "Minishop Plus";


        public const string CODE_SERVICE_MINISHOP_PLUS = "MS365";
        public const string CODE_SERVICE_MINISHOP_PLUS_TRIAL = "MS14";

    }
}
