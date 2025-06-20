'use client';

import { useState } from "react";
import { TextInput, PasswordInput, Button, Paper, Title } from "@mantine/core";
import { api } from "../app/api";
import { useRouter } from 'next/navigation';


export default function UserLogin() {    
    const [form, setForm] = useState({
        username: "",
        password: "",
    })
    const router = useRouter();
    
    const handleChange = (e) => {
        setForm((f) => ({...f, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        // 1. Собираем form-data для FastAPI
        const params = new URLSearchParams();
        params.append("username", form.username);
        params.append("password", form.password);

        try {
            // Отправка запроса
            const res = await api.post('/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            // FastAPI возвращает "access_token"
            const { access_token } = res.data
            localStorage.setItem("token", access_token)

            alert(`Вы вошли как ${form.username}`)
            router.push("/")
        } catch (error) {
            alert(error.response?.data?.detail || "Ошибка входа!");
        }
    }

    return (
    <Paper p="md" maw={400} mx="auto" mt="lg">
      <Title order={2}>Вход</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Имя пользователя"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <PasswordInput
          label="Пароль"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          mt="sm"
        />
        <Button type="submit" mt="md" fullWidth>
          Войти
        </Button>
        <Button type="button" mt="md" fullWidth color="green" onClick={() => router.push('/register')}>
          Регистрация
        </Button>
      </form>
    </Paper>
  );

}