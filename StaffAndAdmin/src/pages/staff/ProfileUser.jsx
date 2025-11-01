import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userService } from "@/services/userService"
import { ArrowLeft, Save, User, Mail, MapPin, Shield, Camera } from "lucide-react"

const ProfileUser = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    address: "",
    avatar: ""
  })
  const [userRole, setUserRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const fetchUserData = () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        setUserData({
          fullName: user.fullName || user.name || "",
          email: user.email || "",
          address: user.address || "Chưa cập nhật",
          avatar: user.avatar || user.profileImage || ""
        })
        
        setAvatarPreview(user.avatar || user.profileImage || "")
        setUserRole(user.role || "staff")
        
      } catch (error) {
        console.error('Fetch user data error:', error)
        setUserData({
          fullName: "Người dùng",
          email: "example@email.com",
          address: "Chưa cập nhật",
          avatar: ""
        })
        setAvatarPreview("")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Chỉ chấp nhận file ảnh!")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setAvatarFile(file)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('fullName', userData.fullName)
      formData.append('address', userData.address)
      
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const response = await userService.updateProfile(formData)
      
      if (response.errCode === 0 && response.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const newUserData = {
          ...currentUser,
          ...response.user
        }
        
        localStorage.setItem('user', JSON.stringify(newUserData))
        
        const updatedAvatar = response.user.avatar
        setUserData(prev => ({
          ...prev,
          fullName: response.user.fullName,
          address: response.user.address,
          avatar: updatedAvatar
        }))
        
        setAvatarPreview(updatedAvatar)
        setAvatarFile(null)
        
        setIsEditing(false)
        alert("Cập nhật thông tin thành công!")
      } else {
        throw new Error(response.message || "Update failed")
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const originalAvatar = user.avatar || user.profileImage || ""
    setAvatarPreview(originalAvatar)
    setAvatarFile(null)
    
    setUserData({
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      address: user.address || "Chưa cập nhật",
      avatar: originalAvatar
    })
    
    setIsEditing(false)
  }

  const getInitials = (name) => {
    if (!name) return "US"
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      staff: "Nhân viên trạm sạc",
      admin: "Quản trị viên",
      user: "Người dùng"
    }
    return roleNames[role] || "Nhân viên"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar Section */}
                  <div className="relative">
                    <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={avatarPreview || userData.avatar || "https://github.com/shadcn.png"} 
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl bg-emerald-600 text-white font-semibold">
                        {getInitials(userData.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label 
                        htmlFor="avatar-upload"
                        className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-all duration-200 shadow-lg border-2 border-white"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">{userData.fullName || "Chưa có tên"}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <p className="text-gray-600 text-sm">{getRoleDisplayName(userRole)}</p>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="w-full space-y-3 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm truncate">{userData.email || "Chưa có email"}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{userData.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn tại đây
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={userData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Nhập họ và tên"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="h-11 bg-gray-50"
                      placeholder="Nhập email"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Nhập địa chỉ"
                    className="h-11"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="h-11 px-6"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="h-11 px-6"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="h-11 px-6"
                      >
                        Hủy
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileUser