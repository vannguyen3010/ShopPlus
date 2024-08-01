namespace ThreeF_WebPortal.Models
{
    public class M_ShoppingCartItem
    {
        public int id { get; set; }
        public int? shoppingCardId { get; set; }
        public int? supplierId { get; set; }
        public int? productId { get; set; }
        public int? productPriceId { get; set; }
        public int? quantity { get; set; }
        public int? typeSizeId { get; set; }
        public int? typeColorId { get; set; }
        public int? status { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public string relativeUrl { get; set; }
        public string smallUrl { get; set; }
        public string mediumUrl { get; set; }
    }
    public class EM_ShoppingCartItem
    {
        public EM_ShoppingCartItem()
        {
            shoppingCartId = this.shoppingCartId;
            supplierId = this.supplierId;
            productId = this.productId;
            productPriceId = this.productPriceId;
            quantity = 1;
            typeSizeId = 0;
            typeColorId = 0;
            isBigShop = 0;
        }

        public string shoppingCartId { get; set; }
        public int productPriceId { get; set; }
        public string supplierId { get; set; }
        public int productId { get; set; }
        public int quantity { get; set; }
        public int typeSizeId { get; set; } = 0;
        public int typeColorId { get; set; } = 0;
        public int isBigShop { get; set; } = 0;
    }
}
