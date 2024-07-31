import os
import time
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import requests
from services import video_sdk
from pydantic import BaseModel
import dotenv
from core.database import supabase

dotenv.load_dotenv()

router = APIRouter()


class ExportRequest(BaseModel):
    url: str
    format: str


class FetchAndStoreMeetingRecRequest(BaseModel):
    room_id: str
    user_id: str


@router.post("/", response_model=dict)
async def create_meeting():
    token = await video_sdk.get_token()
    result = await video_sdk.create_meeting(token)

    if result["err"]:
        raise HTTPException(status_code=400, detail=result["err"])

    return {"meetingId": result["meetingId"]}


@router.get("/validate/{meeting_id}", response_model=dict)
async def validate_meeting(meeting_id: str):
    token = await video_sdk.get_token()
    result = await video_sdk.validate_meeting(meeting_id, token)

    if result["err"]:
        raise HTTPException(status_code=400, detail=result["err"])

    return {"meetingId": result["meetingId"], "details": result["details"]}


@router.post("/export")
async def export_recording(request: ExportRequest):
    url = request.url
    format = request.format.lower()
    if format == "mp4":
        return JSONResponse(content={"url": url})
    elif format == "mp3":
        convert_url = os.environ.get("CLOUDCONVERT_API")
        api_key = os.environ.get("CLOUDCONVERT_API_KEY")
        if not convert_url or not api_key:
            raise HTTPException(
                status_code=500, detail="CloudConvert API URL or API key is not set"
            )
        payload = {
            "tasks": {
                "import-my-file": {"operation": "import/url", "url": url},
                "convert-my-file": {
                    "operation": "convert",
                    "input": "import-my-file",
                    "output_format": "mp3",
                    "engine": "ffmpeg",
                },
                "export-my-file": {
                    "operation": "export/url",
                    "input": "convert-my-file",
                },
            }
        }
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        response = requests.post(f"{convert_url}", json=payload, headers=headers)
        if response.status_code != 201:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to create conversion job",
            )
        job_data = response.json()["data"]
        try:
            download_url = wait_for_job_completion(job_data["id"], api_key)
            return JSONResponse(content={"url": download_url})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


def wait_for_job_completion(job_id, api_key, max_wait_time=300, check_interval=10):
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    job_url = f"https://api.cloudconvert.com/v2/jobs/{job_id}"

    start_time = time.time()
    while time.time() - start_time < max_wait_time:
        response = requests.get(job_url, headers=headers)
        if response.status_code == 200:
            job_data = response.json()["data"]
            if job_data["status"] == "finished":
                for task in job_data["tasks"]:
                    if (
                        task["name"] == "export-my-file"
                        and task["status"] == "finished"
                    ):
                        return task["result"]["files"][0]["url"]
            elif job_data["status"] in ["error", "canceled"]:
                error_tasks = [
                    task for task in job_data["tasks"] if task["status"] == "error"
                ]
                if error_tasks:
                    error_details = [
                        f"{task['name']}: {task['message']}" for task in error_tasks
                    ]
                    raise Exception(f"Job failed. Errors: {', '.join(error_details)}")
                else:
                    raise Exception(f"Job failed with status: {job_data['status']}")
        else:
            raise Exception(f"Failed to get job status: {response.status_code}")

        time.sleep(check_interval)

    raise Exception("Job did not complete within the maximum wait time")


@router.get("/recordings/{user_id}")
async def fetch_rec_from_supabase(user_id: str):
    response = supabase.from_("recordings").select("*").eq("user_id", user_id).execute()
    return response.data
