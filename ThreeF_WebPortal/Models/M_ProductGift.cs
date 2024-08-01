using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_ProductGift
    {
        public string id { get; set; }
        public int? productId { get; set; }
        public int? missingAmount { get; set; }
        public int? orderPriceApply { get; set; }
        public int? quantityDonation { get; set; }
        public int? limitQuantity { get; set; }
        public int? usedQuantity { get; set; }
        public string status { get; set; }
        public M_Product productObj { get; set; }
        public M_Image imageObj { get; set; }
    }
}
