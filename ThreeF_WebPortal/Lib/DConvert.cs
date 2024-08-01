using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Threading.Tasks; 
namespace ThreeF_WebPortal.Lib
{

    public static class DConvert
    {
        public static dynamic DictionaryToStringJson(Dictionary<dynamic, dynamic> dict)
        {
            return JsonConvert.SerializeObject(dict);
        }
        public static string DictionaryToStringJson(Dictionary<int, List<int>> dict)
        {
            var entries = dict.Select(d => string.Format("\"{0}\": [{1}]", d.Key, string.Join(",", d.Value)));
            return "{" + string.Join(",", entries) + "}";
        }
        public static string DictionaryToStringJson(Dictionary<dynamic, List<dynamic>> dict)
        {
            var entries = dict.Select(d => string.Format("\"{0}\": [{1}]", d.Key, string.Join(",", d.Value)));
            return "{" + string.Join(",", entries) + "}";
        }
        public static JObject JsonStringToJsonObject(string jstring)
        {
            JObject jobject = new JObject();
            try
            {
                jobject = JObject.Parse(jstring);
            }
            catch (Exception)
            {

            }
            return jobject;
        }
        public static DataTable ListToDataTable<T>(IList<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable dt = new DataTable();
            for (int i = 0; i < properties.Count; i++)
            {
                PropertyDescriptor property = properties[i];
                dt.Columns.Add(property.Name, property.PropertyType);
            }
            object[] values = new object[properties.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = properties[i].GetValue(item);
                }
                dt.Rows.Add(values);
            }
            return dt;
        }
        public static dynamic ListToJsonString<T>(List<T> list)
        {
            string _json = "";
            try
            {
                //JsonSerializerSettings jsetting = new JsonSerializerSettings();
                //jsetting.FloatFormatHandling
                _json = JsonConvert.SerializeObject(list);

            }
            catch (Exception)
            {
                _json = "";
            }
            return _json;
        }
        public static List<T> DataTableToList<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        public static async Task<List<T>> DataTableToListAsync<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return await Task.Run(() => data);
        }
        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();
            foreach (DataColumn column in dr.Table.Columns)
            {
                if (dr[column.ColumnName].ToString().Trim().Equals("") && column.DataType == typeof(DateTime))
                    dr[column.ColumnName] = Convert.ToDateTime("1900-01-01");

                if (dr[column.ColumnName].ToString().Trim().Equals("") && column.DataType != typeof(DateTime) && column.DataType == typeof(string))
                    dr[column.ColumnName] = string.Empty;

                if (dr[column.ColumnName].ToString().Trim().Equals("") && column.DataType != typeof(DateTime) && column.DataType != typeof(string))
                    dr[column.ColumnName] = 0;

                temp.GetProperties().Where(w => w.Name.Equals(column.ColumnName)).FirstOrDefault().SetValue(obj, dr[column.ColumnName], null);

                //foreach (System.Reflection.PropertyInfo pro in temp.GetProperties())
                //{
                //    if (pro.Name == column.ColumnName)
                //        pro.SetValue(obj, dr[column.ColumnName], null);
                //    else
                //        continue;
                //}
            }
            return obj;
        }
    }
}
