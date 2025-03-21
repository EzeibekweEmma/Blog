const Footer = () => {
  return (
    <footer className="w-full h-20 bg-[#2c586a]/40 flex items-center justify-center">
      <p className="text-[#2c586a] text-sm sm:text-base text-center">
        Copyright © {new Date().getFullYear()} Empire Report All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;
