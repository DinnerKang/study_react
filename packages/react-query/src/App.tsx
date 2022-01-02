import React from 'react';
import './App.css';
import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from 'react-query';
import { ErrorBoundary } from 'react-error-boundary'
import { ReactQueryDevtools } from 'react-query/devtools';
import Users from './Users';
import ErrorComponent from './components/ErrorComponent';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });
  const { reset } = useQueryErrorResetBoundary();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
       onReset={reset}
       fallbackRender={({ resetErrorBoundary }) => (
         <ErrorComponent />
       )}
     >
       <div className="App">
          <Users />
        </div>
     </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
