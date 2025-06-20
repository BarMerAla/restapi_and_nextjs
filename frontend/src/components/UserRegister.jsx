'use client';

import { useState } from "react";
import { TextInput, PasswordInput, Button, Paper, Title } from "@mantine/core";
import axios from "axios";
import { API_BASE_URL } from "../app/api";

export default function UserRegister() {    
    const [form, setForm] = useState({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((f) => ({...f, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v) formData.append(k, v);
        })
        try {
            await axios.post(`${API_BASE_URL}/register`, form);
            alert("Успешная регистрация!")
        } catch (error) {
            alert(error.response?.data?.detail || "Ошибка регистрации!");
        } finally {
        setLoading(false);
        }
    }

    return (
    <Paper p="md" maw={400} mx="auto" mt="lg">
      <Title order={2}>Регистрация</Title>
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
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );

}