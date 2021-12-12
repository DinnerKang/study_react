import React, { useCallback, useState } from 'react';
import './App.css';
import axios from 'axios';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

let id = 5;

const getUserWithAxios = async () => {
  const { data } =  await axios.get('http://localhost:8000/users');
  return data;
};

const Users = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number>(5);
  // Queries
  const { isLoading, data, error } = useQuery('users', getUserWithAxios, {
    staleTime: 5000,
  });

  const mutation = useMutation((data) => axios.post('http://localhost:8000/user', data), {
    onMutate: async (data) => {
      const previousValue = queryClient.getQueryData('users');
      console.log('previousValue', previousValue, data);

      queryClient.setQueryData('users', (old: any) => {
        console.log('old', old);
        return [...old, data];
      });

      return previousValue;
    },
    onSuccess: () => {
      setUserId(userId + 1);
    },
  });
  const handleSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
    },
    [mutation],
  )
  console.log(data);
  if (error) return <div>에러</div>;
  return (
    <ul>
      {
        !isLoading && (
          data.map((i: any) => (
            <li key={i.id}>{i.name}</li>
          ))
        )
      }
      <button onClick={() => handleSubmit({id: userId, name: `test${userId}`})}>유저 추가</button>
    </ul>
  );
};

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <button onClick={getUserWithAxios}>Axios</button>
        <Users />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    
  );
}

export default App;
