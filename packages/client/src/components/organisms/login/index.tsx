import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOADING_TYPES, useAppState } from '../../../utils/appState';
import { runValidation } from '../../../utils/validations';
import { wait } from '../../../utils/wait';
import Button from '../../atoms/button';
import TextField from '../../molecules/TextField';
import './styles.scss';

const Login = () => {
  const { resolvers, user, isLoading, setLoading } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(LOADING_TYPES.authLogin);
    try {
      await wait(2000);
      await resolvers.login(values.email, values.password);
    } catch (error: any) {
      console.error('Error during login - ', error.message);
    } finally {
      setLoading(LOADING_TYPES.off);
    }
  };

  return (
    <div className="auth">
      <Formik initialValues={initialValues} onSubmit={onSubmit} noValidate>
        <Form className="auth__form">
          <h2 className="auth__headline">Sign In</h2>
          <div className="form__field-container">
            <Field
              component={TextField}
              name="email"
              label="Email"
              type="email"
              validate={(value: string) => runValidation(value, 'email')}
            />
          </div>
          <div className="form__field-container">
            <Field
              component={TextField}
              name="password"
              label="Password"
              type="password"
              validate={(value: string) => runValidation(value, 'password')}
            />
          </div>
          <div className="form__field-container auth__button">
            <Button
              type="submit"
              isLoading={isLoading === LOADING_TYPES.authLogin}
            >
              Sign In
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
