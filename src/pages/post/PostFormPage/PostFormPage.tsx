import React, { useState, useCallback, useRef, useEffect } from 'react';
import {useFormik} from 'formik';
import { IPost } from '../../../shared/models/IPost';
import styles from './PostFormPage.module.scss'; 
import { postFormValidationSchema, PostCreateFormValues, Attachment } from './postFormValidationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createPost, getPostById, updatePost } from '../../../redux/postSlice/post.thunks';
// navigate to PostDetailPage
import {useNavigate} from 'react-router-dom';
// 导入 AWS S3 SDK
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


// *** 严重警告：在生产环境中，绝不能在前端直接硬编码或暴露 AWS 凭证 ***
// 这是不安全的，仅用于演示如何实现。
const S3_BUCKET_NAME = 'bfs-forum-assets'; // 替换为你的 S3 桶名称
const S3_REGION = 'us-east-2'; // 替换为你的 AWS 区域，例如 'us-east-1'
const AWS_ACCESS_KEY_ID = 'AKIAQ54B6CQQE6AJQIEJ'; // <--- 严重的风险！！！
const AWS_SECRET_ACCESS_KEY = 'jG/BGiN8OBHPqrZaslUsd+B+Y86d1fsLq5aolt+z'; // <--- 严重的风险！！！


// 创建 S3 客户端实例
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

interface PostFormPageProps {
  mode: 'create' | 'edit';
  postId?: string;
}

const PostFormPage: React.FC<PostFormPageProps> = ({mode, postId}) => {
  const isEditMode = mode === 'edit';
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const currentPost = useSelector((state: RootState) => state.post.currentPost);

  // message
  const [message, setMessage] = useState<string | null>(null);
  const[isDragging, setIsDragging] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]); // 存储文件状态，包括本地File对象和最终的S3 URL
  const [isUploading, setIsUploading] = useState<boolean>(false); // 上传状态
  const [postStatus, setPostStatus] = useState<'PUBLISHED' | 'UNPUBLISHED'>('PUBLISHED');

  // different page titles and button next
  const pageTitle = isEditMode ? 'Edit Post' : 'Create New Post';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Publish Post';
  const draftButtonText = 'Save as Draft';
  const deleteButtonText = 'Delete Post';

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

    // Helper to generate presigned PUT URL
  const generatePresignedPutUrl = async (key: string, contentType: string) => {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      // setup permission
      ACL: 'public-read',
    });
    // const presigner = createRequestPresigner(s3Client.config);
    // const request = await presigner(command, { expiresIn: 3600 });
    // return formatUrl(request);
    const url = await getSignedUrl(s3Client, command, {expiresIn: 3600});
    return url;
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
      setMessage(null); 
      setSubmitting(true); 

      try {
        // API simulation
        // in practice, send request using PostCreateFormValues
        // for attachments, it might be necessary to handle them independently
        // then add the returned URL to post's data
        const postData: Partial<IPost> = {
          title: values.title,
          content: values.content,
          status: postStatus,
          userInfo: {
            id: localStorage.getItem('userId') || 'anonymous',
          },
          images: [],
          attachments: (values.attachments || [])
              .map(att => att.url)
              .filter((url): url is string => typeof url === 'string'),
          replies: [],
          viewCount: 0,
          replyCount: 0
        };
        
        if (isEditMode && postId){
          await dispatch(updatePost({ postId, postData: postData as any })); // adjust type if needed          
          setMessage('Post updated successfully!');
        } else {
          const response = await dispatch(createPost(postData as any));  
          // @ts-ignore
          const {unwrapResult} = await import('@reduxjs/toolkit');    
          const createdPost = unwrapResult(response);  
          setMessage(`Post created successfully!`);
          navigate(`/posts/${createdPost.id}`);
          resetForm();
          setAttachments([]);
        } 
      } catch (error) {
        console.error('Post submit failed:', error);
        setMessage('❌ Failed to submit post');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // useEffect - testing
  useEffect(() => {
    if (isEditMode && postId) {
      // simulating loading posts from API
      // in practice, fetchPostById(postId)
      dispatch(getPostById(postId));
    }
  }, [isEditMode, postId, dispatch]); 


  useEffect(() => {
    if (isEditMode && currentPost) {
      const loadedAttachments = (currentPost.attachments || []).map((url: string) => ({
        id: url,
        name: url.split('/').pop() || 'attachment',
        size: 0,
        type: '',
        url,
        uploaded: true,
      }));
      setAttachments(loadedAttachments);

      formik.setValues({
        title: currentPost.title,
        content: currentPost.content,
        // attachments: (currentPost.attachments || []).map((url: string) => ({
        //   id: url,
        //   name: url.split('/').pop() || 'attachment',
        //   size: 0,
        //   type: '',
        //   url,
        // }))
        attachments: loadedAttachments,
      });
    }
  }, [isEditMode, currentPost, formik]);

  // fileSelect: from folder or drag
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true); // 开始上传
    setMessage(null);

    const currentAttachments: Attachment[] = attachments || [];
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

      try {
        // Generate unique key for S3
        const key = `uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        // Generate presigned PUT URL
        const presignedUrl = await generatePresignedPutUrl(key, file.type);

        // Upload file using fetch PUT
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        const fileUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`;

        newAttachments.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID
          file: file, 
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploaded: true,
        });
      } catch (err) {
        setMessage(`Failed to upload ${file.name}`);
      }
    }

    const updatedAttachments = [...currentAttachments, ...newAttachments];
    setAttachments(updatedAttachments);
    formik.setFieldValue('attachments', updatedAttachments);
    setIsUploading(false);
  }, [attachments, formik]);


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
    const updatedAttachments = attachments.filter(att => att.id !== id);
    setAttachments(updatedAttachments);
    formik.setFieldValue('attachments', updatedAttachments);
  },[attachments, formik]);

  // formik, yup
  // console.log('Rendering PostFormPage');
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
            {...formik.getFieldProps('title')} 
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
            {...formik.getFieldProps('content')} 
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
            onClick={() => fileInputRef.current?.click()} 
          >
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef} 
              className={styles.hiddenInput}
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              accept="image/*,.pdf,.doc,.docx"
              disabled={formik.isSubmitting || isUploading}
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
          {attachments.length > 0 && (
              <div className={styles.attachmentList}>
                  {attachments.map(attachment => (
                  <div key={attachment.id} className={styles.attachmentItem}>
                    <span className={styles.fileIcon}>{getFileIcon(attachment.type)}</span>
                    <span className={styles.fileName}>{attachment.name}</span>
                    <span className={styles.fileSize}>{formatFileSize(attachment.size)}</span>
                    {attachment.uploaded ? (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>View</a>
                      ) : (
                      <span className={styles.uploadingText}>Uploading...</span>
                    )}
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeAttachment(attachment.id)}
                      disabled={formik.isSubmitting || isUploading}
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
          {isEditMode && (
            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => {
                if (confirm('Are you sure you want to delete this post?')) {
                  console.log('Deleting post:', postId);
                  setMessage('Post deleted successfully!');
                }
              }}
              disabled={formik.isSubmitting}
            >
              {deleteButtonText}
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setPostStatus('UNPUBLISHED');
              formik.handleSubmit(); 
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
            onClick={() => setPostStatus('PUBLISHED')}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormPage;