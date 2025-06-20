'use client';

import { useState } from "react";
import { api } from '../app/api';
import { TextInput, Checkbox, Button, Group, Modal } from '@mantine/core';


export default function EditTask({ opened, onClose, task, onSave, onDelete }) {  // редактирование таска
    if (!task) return null;
    const [title, setTitle] = useState(task.title);
    const [completed, setCompleted] = useState(task.completed);
    const [loading, setLoading] = useState(false);

    // Сохраняем изменения
    const handleSave = async () => {
        setLoading(true);
      
        try {
        const res = await api.patch(`/tasks/${task.id}`, 
            { title, completed },
            { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
        onSave(res.data);
        onClose();
        } catch (error) {
            console.error("Ошибка при сохранении задачи:", error, error.response?.data);
            alert("Ошибка при сохранении!");
        } finally {
            setLoading(false);
        }
    };

    // Удаляем задачу
    const handleDelete = async () => {
        if (!window.confirm("Удалить задачу?")) return;
        setLoading(true);
        try {
            await api.delete(`/tasks/${task.id}`,
                { headers: { Authorization: `Token ${localStorage.getItem("token")}` } 
            });
            onDelete(task.id);
            onClose();
        } catch (error) {
            console.log(error)
            alert("Ошибка при удалении!")
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Редактировать задачу">
            <TextInput label="текст задачи" value={title} onChange={e => setTitle(e.target.value)} mb="md" />
            <Checkbox label="выполнена" checked={completed} onChange={e => setCompleted(e.currentTarget.checked)} mb="md" />
            <Group position="right" mt="md">
                <Button variant="default" onClick={onClose}>Отмена</Button>
                <Button color="red" onClick={handleDelete} loading={loading}>Удалить задачу</Button>
                <Button onClick={handleSave}  loading={loading}>Сохранить изменения</Button>
            </Group>
        </Modal>
    );
}
