import { useEffect } from "react";
import callApi from "./utils/callApi";

type LoginPayload = {
  email: string;
  password: string;
};

const login = async ({ email, password }: LoginPayload) => {
  try {
    const { token } = await callApi({
      method: "POST",
      endpoint: "/login",
      payload: { email, password },
    });
    return token;
  } catch (error) {}
};

const App = () => {
  useEffect(() => {
    (async () => {
      const token = await login({
        email: "gandalf.the.grey@test.com",
        password: "123code",
      });
      console.log("token", token);
    })();
  }, []);

  return (
    <div className="app">
      <div className="app__header">HEADER</div>
      <div className="app__body">BODY</div>
      <div className="app__footer">FOOTER</div>
    </div>
  );
};

export default App;
