import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/core/utils/app_color.dart';
import 'package:ev_point/src/core/utils/validator.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_cubit.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_state.dart';
import 'package:ev_point/src/features/auth/presentations/widgets/text_form_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      context.read<UserCubit>().loginUser(
            _emailController.text.trim(),
            _passwordController.text.trim(),
          );
    }
  }

  Future<void> _handleGoogleSignIn() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Google sign-in coming soon!'),
        backgroundColor: AppColors.iconLogoColor,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: BlocConsumer<UserCubit, UserState>(
          listener: (context, state) {
            if (state is UserCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Đăng nhập thành công!'),
                  backgroundColor: Colors.green,
                ),
              );
              context.go(RouterPaths.homeScreen);
            } else if (state is UserError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
          builder: (context, state) {
            final isLoading = state is UserLoading;

            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 10),

                      // Logo or App Name
                      const Icon(
                        Icons.electric_car,
                        size: 80,
                        color: AppColors.iconLogoColor,
                      ),
                      const SizedBox(height: 15),

                      const Text(
                        'XIN CHÀO,',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppColors.textColor,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),

                      const Text(
                        'Đăng nhập để tiếp tục',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 16,
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Email field
                      TextFormFieldWidget(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        hintText: 'Email',
                        icon: Icons.email_outlined,
                        validator: validateEmail,
                      ),

                      const SizedBox(height: 16),

                      // Password field
                      TextFormFieldWidget(
                        controller: _passwordController,
                        keyboardType: TextInputType.visiblePassword,
                        hintText: 'Mật khẩu',
                        icon: Icons.lock_outline,
                        obscureText: _obscurePassword,
                        validator: validatePassword,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                            color: Colors.white70,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),

                      // Forgot password
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: isLoading ? null : () {
                            // Handle forgot password
                          },
                          child: const Text(
                            'Quên mật khẩu?',
                            style: TextStyle(
                              color: AppColors.iconLogoColor,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Login button
                      ElevatedButton(
                        onPressed: isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.iconLogoColor,
                          minimumSize: const Size(double.infinity, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                        ),
                        child: isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  color: Color(0xFF0A1929),
                                  strokeWidth: 3,
                                ),
                              )
                            : const Text(
                                'Đăng nhập',
                                style: TextStyle(
                                  color: Color(0xFF0A1929),
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),

                      const SizedBox(height: 32),

                      // Divider
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                              color: Colors.white.withOpacity(0.2),
                              thickness: 1,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Text(
                              'HOẶC',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.4),
                                fontSize: 14,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              color: Colors.white.withOpacity(0.2),
                              thickness: 1,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      // Google sign-in button
                      OutlinedButton(
                        onPressed: isLoading ? null : _handleGoogleSignIn,
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 56),
                          side: BorderSide(
                            color: Colors.white.withOpacity(0.2),
                            width: 1,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          backgroundColor:
                              const Color(0xFF1A2F3F).withOpacity(0.3),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Image.network(
                              'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                              height: 24,
                              width: 24,
                              errorBuilder: (context, error, stackTrace) {
                                return const Icon(
                                  Icons.g_mobiledata,
                                  size: 32,
                                  color: Colors.white,
                                );
                              },
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'Tiếp tục với Google',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Sign up link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Bạn chưa có tài khoản? ",
                            style: TextStyle(
                              color: Colors.white60,
                              fontSize: 14,
                            ),
                          ),
                          TextButton(
                            onPressed: isLoading ? null : () {
                              context.go(RouterPaths.registerScreen);
                            },
                            style: TextButton.styleFrom(
                              padding: EdgeInsets.zero,
                              minimumSize: const Size(0, 0),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: const Text(
                              'Đăng ký',
                              style: TextStyle(
                                color: Color(0xFF00D9FF),
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}