using System;
using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_Account
    {
        public int? id { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public string accountType { get; set; }
        public int? shoppingCartId { get; set; }
        public int? systemId { get; set; }
        public int? personId { get; set; }
        public int? status { get; set; }
        public string access_token { get; set; }
        public M_Person personObj { get; set; }
        public M_Image imageObj { get; set; }
        public M_VertifyPhone vertifyObj { get; set; }
    }
    public class EM_AccountRegister
    {
        public string userName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        [StringLength(50, ErrorMessage = "Mật khẩu có độ dài tối đa 50 ký tự")]
        [RegularExpression(@"^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$", ErrorMessage = "Mật khẩu không được chứa ký tự dấu và khoảng trắng")]
        public string password { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập họ và tên đệm")]
        [StringLength(30, ErrorMessage = "Họ có độ dài tối đa 30 ký tự")]
        public string lastName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên")]
        [StringLength(30, ErrorMessage = "Tên có độ dài tối đa 10 ký tự")]
        public string firstName { get; set; }
        [DataType(DataType.Date, ErrorMessage = "Ngày sinh không hợp lệ!")]
        public DateTime? birthday { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        [StringLength(12, ErrorMessage = "Điện thoại có độ dài tối đa 12 ký tự")]
        [RegularExpression("^[0-9]{0,12}$", ErrorMessage = "Điện thoại không hợp lệ")]
        public string phoneNumber { get; set; }
        [StringLength(50, ErrorMessage = "Email có độ dài tối đa 50 ký tự")]
        [RegularExpression(@"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", ErrorMessage = "Email không hợp lệ")]
        public string email { get; set; }
        public int gender { get; set; }
    }
    public class EM_AccountSignIn
    {
        [Required(ErrorMessage = "Nhập số điện thoại")]
        [RegularExpression("^[a-z0-9_-]{3,50}$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string userName { get; set; }
        [Required(ErrorMessage = "Nhập mật khẩu")]
        [RegularExpression(@"^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$", ErrorMessage = "Mật khẩu không được chứa ký tự dấu và khoảng trắng.")]
        //[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#?\-\$%\^&\*\[\];:_<>\.,=\+\/\\]).{8,50}$", ErrorMessage = "Mật khẩu không hợp lệ!")]
        public string password { get; set; }
        public bool stayLoggedIn { get; set; }
        public string deviceToken { get; set; }
    }
    public class EM_ChangePassword
    {
        [StringLength(50, ErrorMessage = "Mật khẩu có độ dài tối đa 50 ký tự")]
        [Required(ErrorMessage = "Nhập mật khẩu cũ!")]
        [RegularExpression(@"^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$", ErrorMessage = "Mật khẩu không được chứa ký tự dấu và khoảng trắng.")]
        //[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#?\-\$%\^&\*\[\];:_<>\.,=\+\/\\]).{8,50}$", ErrorMessage = "Mật khẩu phải có độ dài tối thiểu là 8 và thỏa 4 tiêu chí: chứa ít nhất một chữ in, chữ thường, số và ký tự đặc biệt.")]
        public string password { get; set; }

        [StringLength(50, ErrorMessage = "Mật khẩu có độ dài tối đa 50 ký tự")]
        [Required(ErrorMessage = "Nhập mật khẩu mới!")]
        [RegularExpression(@"^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$", ErrorMessage = "Mật khẩu không được chứa ký tự dấu và khoảng trắng.")]
        //[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#?\-\$%\^&\*\[\];:_<>\.,=\+\/\\]).{8,50}$", ErrorMessage = "Mật khẩu phải có độ dài tối thiểu là 8 và thỏa 4 tiêu chí: chứa ít nhất một chữ in, chữ thường, số và ký tự đặc biệt.")]
        public string newPassword { get; set; }
    }
}