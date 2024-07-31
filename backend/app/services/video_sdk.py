import asyncio
import uuid
import httpx
from core.config import settings
import os


async def get_token():
    return settings.VIDEOSDK_TOKEN


async def create_meeting(token: str):
    url = f"{settings.API_BASE_URL}/v2/rooms"
    print(f"url: {url}")
    headers = {"Authorization": token, "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers)
        data = response.json()

        if "roomId" in data:
            return {"meetingId": data["roomId"], "err": None}
        else:
            return {"meetingId": None, "err": data.get("error")}


async def validate_meeting(room_id: str, token: str):
    url = f"{settings.API_BASE_URL}/v2/rooms/{room_id}"
    headers = {"Authorization": token, "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        data = response.json()
        if "roomId" in data:
            return {"meetingId": data["roomId"], "details": data, "err": None}
        else:
            return {"meetingId": None, "details": None, "err": data.get("error")}


# async def export_recording(url: str, format: str):