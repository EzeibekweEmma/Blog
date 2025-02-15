import { ReactNode } from 'react';

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <section className="flex justify-center my-10 md:my-20">
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[1250px]">
        {children}
      </div>
    </section>
  );
}

export default PageWrapper;
