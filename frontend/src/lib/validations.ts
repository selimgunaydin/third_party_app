import * as yup from 'yup';
import type { Component } from '@/types';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const componentSchema = yup.object().shape({
  name: yup
    .string()
    .required('Component name is required')
    .min(3, 'Component name must be at least 3 characters'),
  selector: yup
    .string()
    .required('Selector is required')
    .matches(/^[#.]?[a-zA-Z0-9_-]+$/, 'Please enter a valid CSS selector'),
  position: yup
    .mixed<'before' | 'after'>()
    .required('Position is required')
    .oneOf(['before', 'after'] as const, 'Please select a valid position'),
  html: yup.string().required('HTML is required'),
  css: yup.string().default(''),
  javascript: yup.string().default(''),
  isActive: yup.boolean().default(true),
}) satisfies yup.ObjectSchema<Omit<Component, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>; 