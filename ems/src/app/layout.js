
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/LayoutProvider/LayoutProvider";
import { CachedEmployeesProvider } from "@/contexts/cached_employees";
import { IsLoginProvider} from "@/contexts/isLogin"
import { UserDataProvider } from "@/contexts/user_data";
import Loading from "./loading";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EMS",
  description: "Employers' Management System App",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
      <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></Script>
      <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></Script>
      
      </head>
      <body className={inter.className}>
        <IsLoginProvider >
          <UserDataProvider>
            <CachedEmployeesProvider>
              <Suspense fallback={<Loading />}>
                <LayoutProvider>{children}</LayoutProvider>
              </Suspense>
            </CachedEmployeesProvider>
          </UserDataProvider>
        </IsLoginProvider>
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
        <Script src="https://canvasjs.com/assets/script/canvasjs.min.js"></Script>

      </body>
      
    </html>
  );
}
