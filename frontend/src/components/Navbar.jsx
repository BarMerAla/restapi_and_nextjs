'use client';

import { Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [isAuth, SetIsAuth] = useState(false);


    useEffect(() => {
        SetIsAuth(!!localStorage.getItem("token"));
        const handleStorage = () => SetIsAuth(!!localStorage.getItem('token'));
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = () => {   // выход
        localStorage.removeItem('token');
        SetIsAuth(false);
        router.push('/login');
    };
    
    return (
    <Group position="left" p="md" justify="flex-end">
      <Button color="red" variant="outline" onClick={handleLogout}>
        Выйти
      </Button>
    </Group>
  );
}
