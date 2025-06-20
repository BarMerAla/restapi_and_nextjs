'use client';

import { useState } from "react";
import { api } from '../app/api';
import { TextInput, Button, Group, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function CreateTask({ onTaskAdded }) {  // создания таска
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
         console.log("SUBMIT!");

        if (!text.trim()) {
            setError("Текст не может быть пустым!")
            return;
        }
        setError('');
        setLoading(true);

        try {
        const res = await api.post("/tasks/", {
            title: text, completed: false
        });
        setText('');   // очищаем поле ввода
        if (onTaskAdded) onTaskAdded(res.data); // обновляем

        } catch (error) {
            setError(error.response?.data?.detail || "Ошибка при создании задачи");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Group align="flex-end">
                <TextInput 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Напишите задачу"
                style={{ flex: 0.8, marginLeft: 200, marginTop: 50}}
                />
                <Button type="submit" loading={loading}>
                    Добавить
                </Button>
            </Group>
            {error && (
                <Alert
                icon={<IconAlertCircle size={16} />}
                color="red" mt="md"
                >
                {error}
                </Alert>
            )}
        </form>
    );
}
