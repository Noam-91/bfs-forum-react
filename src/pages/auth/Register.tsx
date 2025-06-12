import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link, useNavigate} from 'react-router-dom';
import './Register.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { register } from '../../redux/userSlice/user.thunks';
import {useAlert} from "../../components/alert/AlertHook.tsx";
import {
    selectRegisterStatus,
    selectRegisterError
} from '../../redux/userSlice/user.slice';
import {useEffect} from "react";

const Register = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectRegisterStatus);
    const error = useAppSelector(selectRegisterError);

    const initialValues = {
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().email('Please enter a valid email').required('Username is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm your password'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        dispatch(register(values));
    };

    const navigate = useNavigate();

    const { showAlert } = useAlert();

    useEffect(() => {
        if (status === 'succeeded') {
            showAlert('success', 'Success', 'Registration successful! Please check your email.');
            navigate('/login');
        } else if (status === 'failed') {
            showAlert('error', 'Error', error || 'Registration failed.');
        }
    }, [status, error]);

    return (
        <div className="register-container">
            <div className="register-card">
                <h3>Register</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form>
                        <Field name="username" type="email" placeholder="Username" className="register-input" />
                        <ErrorMessage name="username" component="div" className="error-message" />

                        <Field name="firstName" type="text" placeholder="First name" className="register-input" />
                        <ErrorMessage name="firstName" component="div" className="error-message" />

                        <Field name="lastName" type="text" placeholder="Last name" className="register-input" />
                        <ErrorMessage name="lastName" component="div" className="error-message" />

                        <Field name="password" type="password" placeholder="Password" className="register-input" />
                        <ErrorMessage name="password" component="div" className="error-message" />

                        <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="register-input" />
                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                        <ErrorMessage name="avatar" component="div" className="error-message" />

                        <button type="submit" className="register-button">Submit</button>
                    </Form>
                </Formik>
                <Link to="/login" className="register-link">Already have account? Login here</Link>
            </div>
        </div>
    );
};

export default Register;
