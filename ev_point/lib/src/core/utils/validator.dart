final RegExp _emailRegex = RegExp(r'^[\w\.\-]+@([\w\-]+\.)+[\w\-]{2,}$');

//kiểm tra email có đúng dạng hay chưa
String? validateEmail(String? v) {
  final value = (v ?? '').trim();
  if (value.isEmpty) return 'Vui lòng nhập email';
  if (!_emailRegex.hasMatch(value)) return 'Email không đúng định dạng';
  return null;
}

//kiểm tra mật khẩu
String? validatePassword(String? v) {
  final value = (v ?? '').trim();
  if (value.isEmpty) return 'Vui lòng nhập mật khẩu';
  if (value.length < 6) return 'Mật khẩu phải ≥ 6 ký tự';
  return null;
}

String? validateName(String? v) {
  final value = (v ?? '').trim();
  if (value.isEmpty) return 'Vui lòng nhập tên';
  if (value.length < 2) return 'Tên phải ≥ 2 ký tự';
  return null;
}

String? validateConfirmPassword(String? password, String? confirmPassword) {
  final pass = (password ?? '').trim();
  final confirmPass = (confirmPassword ?? '').trim();
  if (confirmPass.isEmpty) return 'Vui lòng nhập lại mật khẩu';
  if (pass != confirmPass) return 'Mật khẩu không khớp';
  return null;
}

