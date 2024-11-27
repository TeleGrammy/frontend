import WelcomeMessage from '../Components/registration/WelcomeMessage';
import SignInForm from '../Components/registration/SignInForm';
const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg md:w-3/4 md:flex-row lg:w-2/3">
        <WelcomeMessage signIn={false} />
        <SignInForm />
      </div>
    </div>
  );
};

export default Login;
