import './globals.css';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <head />
      <body>{children}</body>
    </html>
  );
};

export default Layout;
