import { SignUp } from '@clerk/clerk-react';
import PageWrapper from '../components/pageWrapper';

const RegisterPage = () => {
  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <SignUp signInUrl="/register" />
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
