import 'bootstrap/dist/css/bootstrap.min.css';
import Script from "next/script";

export const metadata = {
  title: "SEO Crawler",
  description: "A lightweight crawler similar to Screaming Frog"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}