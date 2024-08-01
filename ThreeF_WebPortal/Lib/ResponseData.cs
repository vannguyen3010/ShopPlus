namespace ThreeF_WebPortal.Lib
{
    public class ResponseData<T>
    {
        public ResponseData()
        {
            result = 0;
            time = Utilities.CurrentTimeSeconds();
            isListData = false;
            dataDescription = string.Empty;
            data = default(T);
            data2nd = null;
            error = new error();
        }
        public int result { get; set; } // 0:fail | 1:success
        public long time { get; set; }
        public bool isListData { get; set; }
        public string dataDescription { get; set; }
        public T data { get; set; }
        public dynamic data2nd { get; set; }
        public error error { get; set; }
    }
    public class M_JResult
    {
        public M_JResult()
        {
            this.result = 0;
            this.error = new error();
            this.data = null;
            this.data2nd = null;
        }
        public M_JResult(int result, error error, dynamic data)
        {
            this.result = result;
            this.error = error;
            this.data = data;
            this.data2nd = default(dynamic);
        }
        public M_JResult(int result, error error, dynamic data, dynamic data2nd)
        {
            this.result = result;
            this.error = error;
            this.data = data;
            this.data2nd = data2nd;
        }
        public M_JResult(dynamic response)
        {
            this.result = response.result;
            this.error = response.error;
            this.data = response.data;
            this.data2nd = response.data2nd;
        }
        public M_JResult(dynamic response, dynamic data)
        {
            this.result = response.result;
            this.error = response.error;
            this.data = data;
            this.data2nd = response.data2nd;
        }
        public M_JResult(dynamic response, dynamic data, dynamic data2nd)
        {
            this.result = response.result;
            this.error = response.error;
            this.data = data;
            this.data2nd = data2nd;
        }
        public M_JResult MapData(dynamic response)
        {
            return new M_JResult(response);
        }
        public M_JResult MapData(dynamic response, dynamic data, dynamic data2nd = default(dynamic))
        {
            return new M_JResult(response, data, data2nd);
        }
        public int result { get; set; }
        public error error { get; set; }
        public dynamic data { get; set; }
        public dynamic data2nd { get; set; }
    }
    public class error
    {
        public error()
        {
            code = 200;
            message = string.Empty;
        }
        public error(int _code, string _messege)
        {
            code = _code;
            message = _messege;
        }
        public int code { get; set; }
        public string message { get; set; }
    }
}
