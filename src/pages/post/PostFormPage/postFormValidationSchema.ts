import * as Yup from 'yup';

// define types of attachments
export interface Attachment {
  id: string; // Unique ID for the attachment (e.g., timestamp + random)
  file?: File; // The actual File object
  name: string;
  size: number;
  type: string; // MIME type, e.g., ' /jpeg', 'application/pdf'
  url?: string; // Optional URL if uploaded to a temporary location
  uploaded?:boolean;
}

export const postFormValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim() // remove space
    .required('Title is required') 
    .min(5, 'Title must be at least 5 characters') 
    .max(100, 'Title cannot exceed 100 characters'), 
  content: Yup.string()
    .trim()
    .required('Content is required') 
    .min(20, 'Content must be at least 20 characters') 
    .max(5000, 'Content cannot exceed 5000 characters'), 
  attachments: Yup.array(
    Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().required(),
      size: Yup.number().required().max(10 * 1024 * 1024, 'File size cannot exceed 10MB'), // 10MB
      type: Yup.string().required(),
      url: Yup.string().url().notRequired(),
    })
  ).max(5, 'You can upload a maximum of 5 attachments').nullable(), 
});

// 定义表单值的接口，方便 TypeScript 类型推断
export type PostCreateFormValues = Yup.InferType<typeof postFormValidationSchema> & {
  attachments?: Attachment[]; // Add attachments as it's not strictly part of the schema but used in form
};