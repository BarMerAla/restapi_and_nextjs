from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str
  
class UserOut(BaseModel):
    id: int
    username: str
    
    class Config:
        form_attributes = True
    
class TaskCreate(BaseModel):
    title: str
    completed: bool = False
    
class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    user_id: int
    
    class Config:
        form_attributes = True
    
    
    
    