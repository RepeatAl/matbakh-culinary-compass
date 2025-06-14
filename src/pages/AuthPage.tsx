
import AuthForm from '@/components/AuthForm';

const AuthPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
