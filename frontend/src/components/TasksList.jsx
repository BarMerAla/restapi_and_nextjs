'use client';

import { useState, useEffect } from "react";
import { api } from '../app/api';
import { useRouter } from 'next/navigation';
import { Stack, Card, Text, Button, Modal, Loader, Title, Pagination, Center} from '@mantine/core';
import CreateTask from './CreateTask';
import EditTask from "./EditTask";



export default function TasksList() {   // главная страница со списком задач
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalStatus, setModalStatus] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = api.token;
            const response = await api.get("/tasks/", {
                headers: { Authorization: `Token ${token}` }
            });
            setTasks(response.data);
            console.log(response)
        } catch (error) {
            alert("Вы должны войти!")
            router.push("/login")
            setTasks([])
        } finally {
            setLoading(false);
        }
        };

         // функция для добавления задачи
        const handleTaskAdded = () => {
            fetchTasks(1); 
        };

        if (loading) {
            return <Loader mt="xl" />
        }

        // функция редактирования в модальном окне
        const handleView = (task) => setEditTask(task);
        

        const handleClose = () => setEditTask(null);   
        
        
        const handleTaskSaved = () => {
            fetchTasks(); // перезагрузить список после редактирования
            handleClose();
        };

        const handleTaskDeleted = () => {
            fetchTasks(); // перезагрузить список после удаления
            handleClose();
        };

        // функция просмотра статуса задачи
        const handleStatusClick = (completed) => {
            setModalStatus(completed);
            setModalOpened(true);
        }

        return (
            <Stack spacing="lg">
                <Title order={2} style={{ textAlign: "center", marginTop: "20px"}}>Новая задача</Title>
                <CreateTask onTaskAdded={handleTaskAdded} />
                {tasks.length === 0 && (
                    <Text c="dimmed">Нет задач</Text>
                )}
                <Title order={2} style={{ textAlign: "center", marginTop: "20px"}}>Список задач</Title>
        
                {tasks.map((task) => (
                    <Card key={task.id} shadow="xs" radius="md" withBorder p="md" mb="sm" 
                    style={{ maxWidth: 500, margin: "0 auto", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <span style={{ fontSize: 28, cursor: "pointer" }}
                            onClick={()=> handleStatusClick(task.completed)}
                            title="Показать статус">
                            {task.completed ? "✔️" : "❓"}
                        </span>
                        <Text size="md" style={{ flex: 0.7, textAlign: "center" }}>{task.title}</Text>
                        <Button onClick={() => handleView(task)}>Редактировать</Button>
                    </div>
                    </Card>
                ))}

                {editTask && (
                <EditTask opened={!!editTask} onClose={handleClose} task={editTask} onSave={handleTaskSaved}
                onDelete={handleTaskDeleted}
                />
                )}
                
                <Modal opened={modalOpened} onClose={() => setModalOpened(false)} centered title="Статус задачи">
                    <Text size="lg" align="center">{modalStatus === true ? "Задача выполнена!" : "Задача не выполнена"}</Text>
                </Modal> 

            </Stack>
        );   
}