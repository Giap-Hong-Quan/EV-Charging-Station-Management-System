import React, { useState } from "react";
import "./Login.css";
import bgImage from "../../assets/background-login.png";
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   // Hàm xác định route dựa trên role
  const getRoleBasedRoute = (user) => {
    const roleId = user.role_id;
    
    switch (roleId) {
      case 1: 
        return "/admin";
      case 2: 
        return "/staff";
      default:
        return "/unauthorized";
    }
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    // Validate input
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }
    setLoading(true);
    
    setError("")
    try {
      const response = await authService.login(email, password);
      if(response.errCode === 0){
        console.log("Login successful:", response);
        if(response.token){
          localStorage.setItem("token",response.token);
          localStorage.setItem("user",JSON.stringify(response.user))
        }

        // Hiển thị thông báo thành công
        setError(""); // Xóa lỗi nếu có
        const targetRoute = getRoleBasedRoute(response.user);
        console.log(`User role_id: ${response.user.role_id}, redirecting to: ${targetRoute}`);
        toast.success("Đăng nhập thành công");
        setTimeout(()=>{
          navigate(targetRoute);
        },1000)
        
      }
      else{
        let errorMessage = "Đăng nhập thất bại";
        switch (response.errCode) {
          case 1:
            errorMessage = "Email không tồn tại trong hệ thống";
            break;
          case 2:
            errorMessage = "Người dùng không tồn tại";
            break;
          case 3:
            errorMessage = "Mật khẩu không đúng";
            break;
          default:
            errorMessage = response.message || response.errMessage || "Đăng nhập thất bại";
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Xử lý lỗi từ axios
      let errorMessage = "Lỗi kết nối đến server. Vui lòng thử lại.";
      
      if (error.response?.data) {
        const serverError = error.response.data;
        errorMessage = serverError.message || serverError.errMessage || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
    
  }

return( <div className="login-container">
   <div className="login-image" style={{ backgroundImage: `url(${bgImage})` }}
  ></div>
  <div className="login-form">
    <div className="form-box">
      <div className="logo-section">
        <img src={logo} alt="EverCharge" className="logo-img" />
      </div>

      <h2 className="form-title">Đăng nhập vào tài khoản của bạn</h2>

      {/* Hiển thị lỗi */}
          {error && (
            <div className={`error-message ${error.includes("thành công") ? "success" : ""}`}>
              {error}
            </div>
          )}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên đăng nhập" className="input" value={email} onChange={(e)=> setEmail(e.target.value)} disabled={loading}/>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="input"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            disabled={loading}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="eye-icon"
          />
        </div>

        <div className="forgot-password">
          <a href="/forgot-password">Quên mật khẩu?</a>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  </div>
</div>

);
}
