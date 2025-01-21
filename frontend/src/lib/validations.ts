import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('E-posta adresi zorunludur')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: yup
    .string()
    .required('Şifre zorunludur')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Ad Soyad zorunludur')
    .min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  email: yup
    .string()
    .required('E-posta adresi zorunludur')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: yup
    .string()
    .required('Şifre zorunludur')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const componentSchema = yup.object({
  name: yup
    .string()
    .required('Component adı zorunludur')
    .min(3, 'Component adı en az 3 karakter olmalıdır'),
  selector: yup
    .string()
    .required('Selector zorunludur')
    .matches(/^[#.]?[a-zA-Z0-9_-]+$/, 'Geçerli bir CSS seçici giriniz'),
  position: yup
    .string()
    .oneOf(['before', 'after'], 'Geçerli bir pozisyon seçiniz')
    .required('Pozisyon zorunludur'),
  html: yup
    .string()
    .required('HTML kodu zorunludur'),
  css: yup
    .string()
    .default(''),
  javascript: yup
    .string()
    .default(''),
  isActive: yup
    .boolean()
    .default(true)
}); 