from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from .auth import get_current_user, authenticate_user, create_access_token
from .database import Base, engine, get_db
from .models import User, Task
from .schemas import UserCreate, TaskCreate, UserOut, TaskOut, Token

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


# АВТОРИЗАЦИЯ

@app.post("/register", response_model = UserOut)              # регистрация
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Такой пользователь уже есть")
    db_user = User.create(db, user)
    return db_user

@app.post("/login", response_model = Token)              # вход
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Неправильный пароль или username")
    access_token = create_access_token({"sub": user.username})   # JWT token
    return ({"access_token": access_token, "token_type": "bearer"})

# CRUD

@app.post("/tasks/", response_model = TaskOut)   # создание таска
def create_task(task: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db_task = Task(title=task.title, completed=task.completed, user_id=user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model = list[TaskOut])  # список тасков
def get_tasks(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == user.id).all()

@app.patch("/tasks/{task_id}", response_model = TaskOut)  # редактирование таска
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Такой задачи нет")
    
    db_task.title = task.title
    db_task.completed = task.completed
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Такой задачи нет")
    
    db.delete(db_task)
    db.commit()
    return {"Ok": True}
    


    






    



 