import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../utils/appState';
import { runValidation } from '../../../utils/validations';
import Button from '../../atoms/button';
import LoadingSpinner from '../../atoms/loadingSpinner';
import TextField from '../../molecules/TextField';
import './styles.scss';

const Login = () => {
  const { resolvers, user } = useAppState();
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setSpinner(true);
      await resolvers.login(values.email, values.password);
      setSpinner(false);
      navigate('/');
    } catch (error: any) {
      setSpinner(false); // Stop spinner on error
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  if (spinner) {
    return <LoadingSpinner />;
  }

  return (
    <div className="auth">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
            <Button type="submit">Sign In</Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
