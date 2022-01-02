import React, { useCallback, useState } from 'react';
import './App.css';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from 'react-query';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

const getUserWithAxios = async () => {
  const { data } = await axios.get('http://localhost:8000/users');
  return data;
};

const Users = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number>(5);
  // Query
  const { isLoading, data, isError } = useQuery('users', getUserWithAxios, {
    staleTime: 5000,
    suspense: false,
  });

  const mutation = useMutation((data: User) => axios.post('http://localhost:8000/user', data), {
    onMutate: (data: User) => {
      const previousValue = queryClient.getQueryData('users');
      console.log('previousValue', data);
      queryClient.setQueryData('users', (old: any) => {
        console.log('old', old);
        return [...old, data];
      });

      return previousValue;
    },
    onSuccess: (result, variables, context) => {
      console.log('성공 메시지:', result);
      console.log('변수', variables);
      console.log('onMutate에서 넘어온 값', context);
      setUserId(userId + 1);
    },
  });
  const handleSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
    },
    [mutation],
  )
  if (isError) return <div>에러</div>;
  return (
    <ul>
      {
        !isLoading && (
          data.map((i: User) => (
            <li key={i.id}>{i.name}</li>
          ))
        )
      }
      <button onClick={() => handleSubmit({id: userId, name: `test${userId}`})}>유저 추가</button>
    </ul>
  );
};

export default Users;