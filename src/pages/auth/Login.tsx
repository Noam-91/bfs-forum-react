import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {login} from '../../redux/authSlice/auth.thunks.ts';
import { selectIsLoggedIn} from '../../redux/authSlice/auth.slice';
import { useAlert } from '../../components/alert/AlertHook';
import {useEffect} from "react";
import './Login.css';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

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

    const handleSubmit = async (values: typeof initialValues) => {
        const resultAction = await dispatch(login(values));

        if (login.fulfilled.match(resultAction)) {
            showAlert('success', 'Login Successful', 'Welcome back!');
            navigate('/');
        } else {
            showAlert('error', 'Login Failed', 'Invalid username or password');
        }
    };


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
                <br/>
                <div style={{marginTop:30}}>

                    <a href="/contact">Talk to Administrators</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
