import React, { useState, useCallback, useRef, useEffect } from 'react';
import {useFormik} from 'formik';
import { PostStatus } from '../../../shared/models/post.model'; 
import styles from './PostFormPage.module.scss'; 
import { postFormValidationSchema, PostCreateFormValues, Attachment } from './postFormValidationSchema';

interface PostFormPageProps {
  mode: 'create' | 'edit';
  postId?: string;
}

const PostFormPage: React.FC<PostFormPageProps> = ({mode, postId}) => {
  const isEditMode = mode === 'edit';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // message
  const [message, setMessage] = useState<string | null>(null);
  const[isDragging, setIsDragging] = useState<boolean>(false);

  // different page titles and button next
  const pageTitle = isEditMode ? 'Edit Post' : 'Create New Post';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Publish Post';
  const draftButtonText = 'Save as Draft';

  
  // Get file icon based on type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document') || mimeType.includes('msword')) return '📑';
    return '📎';
  };

    // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Formik setup
  const formik = useFormik<PostCreateFormValues>({
    initialValues: {
      title: '',
      content: '',
      attachments: [], // init
    },
    validationSchema: postFormValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setMessage(null); // clear previous message
      setSubmitting(true); // status

      try {
        // API simulation
        // in practice, send request using PostCreateFormValues
        // for attachments, it might be necessary to handle them independently
        // then add the returned URL to post's data
        const postData = {
          title: values.title,
          content: values.content,
          // in practice, attachments would be URL or fileId
          attachmentDetails: values.attachments?.map(att => ({
            name: att.name,
            size: att.size,
            type: att.type,
            // url: att.url // if the attachment has been uploaded
          })),
          // example, in practice it is from backend
          userId: 1,
          lastName: 'Test', 
          firstName: 'John',
          status: PostStatus.PUBLISHED, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewCount: 0,
          replyCount: 0,
          isArchived: false
        };

        console.log('Submitting Post Data:', postData);

        // simulating delay 
        await new Promise(resolve => setTimeout(resolve, 1500));

        setMessage(isEditMode ? 'Post updated successfully!' : 'Post created successfully!');
        resetForm(); // reset form, attachments need to be reset independently
        formik.setFieldValue('attachments', []); // manually clear
      } catch (error) {
        console.error('Post operation failed:', error);
        setMessage(`Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // useEffect
  useEffect(() => {
    if (isEditMode && postId) {
      // simulating loading posts from API
      // in practice, fetchPostById(postId)
      const loadPostData = async () => {
        // simulation data
        const mockPost = { 
          id: postId,
          title: 'Existing Post Title for ' + postId,
          content: 'This is the content of the existing post. You can edit it now.',
          // existing attachments
          attachments: [
            { id: 'att1', name: 'document.pdf', size: 123456, type: 'application/pdf', file: new File([], 'document.pdf') },
            { id: 'att2', name: 'image.jpg', size: 789012, type: 'image/jpeg', file: new File([], 'image.jpg') },
          ]
        };

        // set up formik values
        // match initialValues' structure
        formik.setValues({
          title: mockPost.title,
          content: mockPost.content,
          attachments: mockPost.attachments,
        });
      };
      loadPostData();
    }
  }, [isEditMode, postId, formik]); // formik.setValues 是稳定的，所以可以安全地作为依赖


  // fileSelect: from folder or drag
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const currentAttachments: Attachment[] = formik.values.attachments || [];
    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // verfify size
      if (file.size > 10 * 1024 * 1024) { // Max 10MB
        setMessage(`File "${file.name}" exceeds 10MB limit.`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setMessage(`File "${file.name}" has an unsupported type. Allowed: images, PDF, Word.`);
        continue;
      }

      if (currentAttachments.length + newAttachments.length >= 5) { // Max 5 attachments
        setMessage('Maximum 5 attachments allowed.');
        break;
      }

      newAttachments.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID
        file: file, // store real File object
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    formik.setFieldValue('attachments', [...currentAttachments, ...newAttachments]);
  }, [formik]);


  // handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Remove attachment
  const removeAttachment = useCallback((id: string) => {
    const updatedAttachments = (formik.values.attachments || []).filter(att => att.id !== id);
    formik.setFieldValue('attachments', updatedAttachments);
  },[formik]);


  // formik, yup
  console.log('Rendering PostFormPage');
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        {message && (
          <div className={`${styles.message} ${message.includes('successfully') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        {/* Title input */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title *</label>
          <input
            type="text"
            id="title"
            className={`${styles.input} ${formik.touched.title && formik.errors.title ? styles.inputError : ''}`}
            {...formik.getFieldProps('title')} // Formik will manage value, onChange, onBlur
            placeholder="Enter post title"
            disabled={formik.isSubmitting}
            required
          />
          {formik.touched.title && formik.errors.title ? (
            <div className={styles.errorText}>{formik.errors.title}</div>
          ) : null}
        </div>

        {/* Content textarea */}
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>Content *</label>
          <textarea
            id="content"
            className={`${styles.input} ${styles.textarea} ${formik.touched.content && formik.errors.content ? styles.inputError : ''}`}
            {...formik.getFieldProps('content')} // Formik will manage value, onChange, onBlur
            placeholder="Write your post content here..."
            rows={10}
            disabled={formik.isSubmitting}
            required
          />
          {formik.touched.content && formik.errors.content ? (
            <div className={styles.errorText}>{formik.errors.content}</div>
          ) : null}
        </div>

        {/* Attachments section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Attachments</label>

          {/* Drag and drop area */}
          <div
            className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()} // Trigger hidden input click
          >
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef} // Attach ref
              className={styles.hiddenInput}
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              accept="image/*,.pdf,.doc,.docx" // Allowed file types
              disabled={formik.isSubmitting}
            />
            <div className={styles.uploadText}>
              📎 Click to upload or drag files here<br />
              <span className={styles.uploadHint}>
                Images (jpg, png) and Documents (pdf, doc) • Max 10MB • Up to 5 files
              </span>
            </div>
          </div>
          {/* Display validation error for attachments if any */}
          {formik.touched.attachments && formik.errors.attachments && typeof formik.errors.attachments === 'string' ? (
            <div className={styles.errorText}>{formik.errors.attachments}</div>
          ) : null}

          {/* Attachment list */}
          {formik.values.attachments && formik.values.attachments.length > 0 && (
            <div className={styles.attachmentList}>
              {formik.values.attachments.map(attachment => (
                <div key={attachment.id} className={styles.attachmentItem}>
                  <span className={styles.fileIcon}>{getFileIcon(attachment.type)}</span>
                  <span className={styles.fileName}>{attachment.name}</span>
                  <span className={styles.fileSize}>{formatFileSize(attachment.size)}</span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeAttachment(attachment.id)}
                    disabled={formik.isSubmitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              // Handle Save as Draft logic
              // You might want a separate Formik submission for draft if validation is different
              // For simplicity, here we just log
              console.log('Saving as Draft:', formik.values);
              setMessage('Post saved as draft!');
            }}
            disabled={formik.isSubmitting}
          >
            {draftButtonText}
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={formik.isSubmitting || !formik.isValid} // 禁用如果正在提交或表单无效
          >
            {formik.isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormPage;