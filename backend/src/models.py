from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from passlib.hash import bcrypt
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    tasks = relationship("Task", back_populates="user")  # связь: у пользователя много задач
    
    @staticmethod
    def create(db, user_in):      # user_in — pydantic-схема, UserCreate
        hashed_password = bcrypt.hash(user_in.password)
        db_user = User(username=user_in.username, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def verify_password(self, password):
        return bcrypt.verify(password, self.hashed_password)
    
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    completed = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))   
    user = relationship("User", back_populates="tasks")
    
    