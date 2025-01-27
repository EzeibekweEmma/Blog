import { SignIn } from '@clerk/clerk-react';
import PageWrapper from '../components/pageWrapper';

const LoginPage = () => {
  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <SignIn signUpUrl="/register" />
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
