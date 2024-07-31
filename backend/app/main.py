from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import meetings

app = FastAPI(
    title="Video Meeting Service API",
    description="API for managing video meetings and exporting recordings",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)