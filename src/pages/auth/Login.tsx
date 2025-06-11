import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login } from '../../redux/authSlice/auth.thunks.ts';
import { selectIsLoggedIn } from '../../redux/authSlice/auth.slice';
import { useAlert } from '../../components/alert/AlertHook';
import {useEffect} from "react";
import './Login.css';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const initialValues = {
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string()
            .email('Please enter a valid email')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Minimum 6 characters')
            .required('Password is required'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        dispatch(login(values));
    };

    useEffect(() => {
        if (isLoggedIn) {
            showAlert('success', 'Login', 'Login successful!');
            navigate('/admin/users');
        }
    }, [isLoggedIn, navigate, showAlert]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>BFS Forum</h2>
                <h3>Login</h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Field name="username" type="email" placeholder="Email" className="login-input" />
                        <ErrorMessage name="username" component="div" className="error-message" />

                        <Field name="password" type="password" placeholder="Password" className="login-input" />
                        <ErrorMessage name="password" component="div" className="error-message" />

                        <button type="submit" className="login-button">Login</button>
                    </Form>
                </Formik>
                <a href="/register" className="login-link">No account yet? Register one</a>
            </div>
        </div>
    );
};

export default Login;
