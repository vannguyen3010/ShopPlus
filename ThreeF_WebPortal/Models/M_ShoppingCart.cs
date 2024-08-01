using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_ShoppingCart
    {
        public int? id { get; set; }
        public int? customerId { get; set; }
        public List<M_ShoppingCartItemCustom> shoppingCartItemObj { get; set; }
        public class M_ShoppingCartItemCustom
        {
            public M_SupplierCustom supplierObj { get; set; }
            public M_SupplierConfigure supplierConfigureObj { get; set; }
        }
        public class M_SupplierCustom : M_BaseModel.SupplierCustom
        {
            public List<M_SplitShoppingCartCustom> splitShoppingCartObj { get; set; }
        }
        public class M_SplitShoppingCartCustom
        {
            public int id { get; set; }
            public int? shoppingCardId { get; set; }
            public int? supplierId { get; set; }
            public int? productId { get; set; }
            public int? quantity { get; set; }
            public int? productPriceId { get; set; }
            public int? typeSizeId { get; set; }
            public int? typeColorId { get; set; }
            public int? isBigShop { get; set; }
            public int? availableQuantity { get; set; }
            public M_ProductPrice productPriceObj { get; set; }
            public M_Product productObj { get; set; }
            public M_Image imageObj { get; set; }
            //public M_TypeColor typeColorObj { get; set; }
            //public M_TypeSize typeSizeObj { get; set; }
            //public M_Unit unitObj { get; set; }
        }
       
    }
    public class VM_CheckQuantity
    {
        public int? productId { get; set; }
        public int? productPriceId { get; set; }
        public int? supplierId { get; set; }
        public int? quantity { get; set; }
        public int? status { get; set; }
    }
    public class VM_ShoppingCart
    {
        public string id { get; set; }
        public string shopName { get; set; }
        public string shopUrl { get; set; }
        public string code { get; set; }
        public List<M_ProductItem> productItem { get; set; }
        public class M_ProductItem
        {
            public int cartId { get; set; }
            public int? id { get; set; }
            public string name { get; set; }
            public string nameSlug { get; set; }
            public string imageUrl { get; set; }
            public int? quantity { get; set; }
            public int? price { get; set; }
            public int? discount { get; set; }
            public long? productPriceQuantity { get; set; }
            public double? weight { get; set; }
            public int? productPriceIsWarehouse { get; set; }
            public int? availableQuantity { get; set; }
            public int? productPriceStatus { get; set; }
            public string typeName { get; set; }
            public string unitName { get; set; }
        }
    }

   
}
