import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { Button, Form, Input } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { userActions } from "../../utils/userSlice";
import { userPath } from "../../routes/routeConfig";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import { getUser } from "../../api/services/userService";
import { userLogin } from "../../api/services/userService";
import { showLoading, hideLoading } from "../../utils/alertSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const loginResponse = await userLogin(values);
      dispatch(hideLoading());
      if (loginResponse.data.success) {
        if (loginResponse.data.token) {
          localStorage.setItem("userToken", loginResponse.data.token);
          dispatch(userActions.userLogin());
          const userResponse = await getUser();
          const encodedUserData = btoa(
            JSON.stringify(userResponse.data.userData)
          );
          localStorage.setItem("userData", encodedUserData);
          toast.success(loginResponse.data.message);
          navigate(userPath.home);
        }
      } else {
        if (loginResponse.data.message) {
          toast.error(loginResponse.data.message);
        } else {
          toast.error("Unknown Error");
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const responseMessage = async (response) => {
    try {
      let credential = jwtDecode(response.credential);
      const values = {
        name: credential.name,
        email: credential.email,
        password: credential.sub,
        exp: credential.exp,
      };
      dispatch(showLoading());
      const loginResponse = await userLogin(values);
      dispatch(hideLoading());
      if (loginResponse.data.success) {
        if (loginResponse.data.token) {
          localStorage.setItem("userToken", loginResponse.data.token);
          dispatch(userActions.userLogin());
          const userResponse = await getUser();
          const encodedUserData = btoa(
            JSON.stringify(userResponse.data.userData)
          );
          localStorage.setItem("userData", encodedUserData);
          toast.success(loginResponse.data.message);
          navigate(userPath.home);
        }
      } else {
        if (loginResponse.data.message) {
          toast.error(loginResponse.data.message);
        } else {
          toast.error("Unknown Error");
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const errorMessage = (error) => {
    console.log(error);
    toast.error("Something went wrong");
  };

  return (
    <AuthCard>
      <Link to="/admin/signin">
        <h2 className="font-bold text-3xl text-dark-purple">Login</h2>
      </Link>
      <p className="text-sm mt-3 text-dark-purple">
        If you are already a member, easily log in
      </p>
      <Form rm className="flex flex-col mt-4" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
              type: "email",
            },
          ]}
        >
          <label className="relative cursor-pointer">
            <Input
              placeholder="Email"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              Email
            </span>
          </label>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
            {
              pattern: /^(?=.*[A-Za-z])[\s\S]*$/,
              message: "Password cannot be empty",
            },
          ]}
        >
          <Input.Password placeholder="Password" className="p-2" />
        </Form.Item>
        <Button
          size="large"
          className="text-white font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Login
        </Button>
      </Form>
      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>
      <div className="flex justify-center items-center mt-5">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
      <div className="mt-3 text-sm flex justify-center items-center text-dark-purple py-4">
        <p>Don&apos;t have an account?</p>
        <Link
          to={userPath.register}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Register
        </Link>
      </div>
      <div className="text-sm flex justify-center items-center text-dark-purple">
        <Link
          to={userPath.forgotPassword}
          className="text-dark-purple hover:text-blue-500 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthCard>
  );
}

export default Login;
