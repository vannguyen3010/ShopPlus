namespace ThreeF_WebPortal.Models
{
    public class M_GoogleMap
    {
        public PlusCode plus_code { get; set; }
        public List<Results> results { get; set; }
        public string status { get; set; }
        public class PlusCode
        {
            public string compound_code { get; set; }
            public string global_code { get; set; }
        }
        public class Results
        {
            public List<AddressComponents> address_components { get; set; }
            public string formatted_address { get; set; }
            public Geometry geometry { get; set; }
            public string place_id { get; set; }
            public PlusCode plus_code { get; set; }
            public List<string> types { get; set; }
        }
        public class AddressComponents
        {
            public string long_name { get; set; }
            public string short_name { get; set; }
            public List<string> types { get; set; }
        }
        public class Geometry
        {
            public Location location { get; set; }
            public string location_type { get; set; }
            public Viewport viewport { get; set; }
            public List<string> types { get; set; }
        }
        public class Location
        {
            public double lat { get; set; }
            public double lng { get; set; }
        }
        public class Viewport
        {
            public Location northeast { get; set; }
            public Location southwest { get; set; }
        }
    }
}