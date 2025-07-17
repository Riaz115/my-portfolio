'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { ThemeProvider } from 'next-themes';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('portfolio_auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.token && authData.user) {
          dispatch(setCredentials(authData));
        }
      } else {
        localStorage.removeItem('portfolio_auth');
      }
    } catch (error) {
      localStorage.removeItem('portfolio_auth');
    }
  }, [dispatch]);
  return <>{children}</>;
}



export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}