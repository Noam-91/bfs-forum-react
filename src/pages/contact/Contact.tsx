import { useFormik } from 'formik';
import * as Yup from 'yup';
import {TextField} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {useAlert} from "../../components/alert/AlertHook.tsx";
import {useEffect} from "react";
import styles from './Contact.module.scss';
import {sendMessage} from "../../redux/messageSlice/message.thunks.ts";
import type {ContactFormData} from "../../shared/models/IMessage.ts";

const Contact = () => {
    const dispatch = useAppDispatch();
    const {status, error} = useAppSelector((state) => state.message);

    /** Yup */
    const validationSchema = Yup.object<ContactFormData>({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        subject: Yup.string()
            .trim()
            .required('Subject is required')
            .max(100, 'Subject must be 100 characters or less'),
        content: Yup.string()
            .trim()
            .required('Message is required')
            .min(10, 'Message must be at least 10 characters')
            .max(1000, 'Message must be 1000 characters or less'),
    });

    /** Initialize Formik */
    const formik = useFormik({
        initialValues: {
            email: '',
            subject: '',
            content: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values: ContactFormData, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
                await dispatch(sendMessage(values)).unwrap();
                console.log('Message sent successfully:', values);
                resetForm();
            } catch (err: unknown) {
                console.error('Failed to send message via Redux thunk:', err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    /** Alert */
    const {showAlert} = useAlert();
    useEffect(() => {
        if (status === 'succeeded') {
            showAlert('success', 'Success', 'Message sent successfully!');
            const timer = setTimeout(() => {
                // dispatch(resetContactStatus());
            }, 3000);
            return () => clearTimeout(timer);
        } else if (status === 'failed') {
            showAlert('error', 'Error', error || 'Failed to send message.');
            const timer = setTimeout(() => {
                // dispatch(resetContactStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, error, dispatch]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Contact Us</h1>
            <p className={styles.subHeading}>
                We'd love to hear from you! Please fill out the form below.
            </p>

            <form onSubmit={formik.handleSubmit} className={styles.form}>
                <div className={styles.textFieldWrapper}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </div>

                <div className={styles.textFieldWrapper}>
                    <TextField
                        fullWidth
                        id="subject"
                        name="subject"
                        label="Subject"
                        variant="outlined"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                        helperText={formik.touched.subject && formik.errors.subject}
                    />
                </div>

                <div className={styles.textFieldWrapper}>
                    <TextField
                        fullWidth
                        id="content"
                        name="content"
                        label="Message"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.content && Boolean(formik.errors.content)}
                        helperText={formik.touched.content && formik.errors.content}
                    />
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting || status === 'loading'}
                    className={styles.submitButton}
                >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                <a href="/login">Back to login</a>
            </form>

        </div>
    );
};

export default Contact;