using System.Collections.Generic;

namespace ThreeF_WebPortal.ViewModels
{
    public class VM_PriceListSearch
    {
        public static List<VM_Price> priceData = new List<VM_Price>()
        {
            new VM_Price
            {
                id = 1,
                name = "Dưới 500.000đ",
                fPrice = 0,
                tPrice = 500000
            },
            new VM_Price
            {
                id = 2,
                name = "500.000đ đến 1.000.000đ",
                fPrice = 500000,
                tPrice = 1000000
            },
            new VM_Price
            {
                id = 3,
                name = "1.000.000đ đến 2.000.000đ",
                fPrice = 1000000,
                tPrice = 2000000
            },
            new VM_Price
            {
                id = 4,
                name = "Trên 2.000.000đ",
                fPrice = 2000000,
                tPrice = 0
            }
        };

        public class VM_Price
        {
            public int id { get; set; } = 0;
            public string name { get; set; }
            public int fPrice { get; set; } = 0;
            public int tPrice { get; set; } = 0;
        }
    }
}
