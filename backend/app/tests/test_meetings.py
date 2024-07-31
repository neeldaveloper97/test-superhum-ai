from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch

client = TestClient(app)

@patch('app.services.video_sdk.create_meeting')
def test_create_meeting(mock_create_meeting):
    mock_create_meeting.return_value = {"meetingId": "test-meeting-id", "err": None}

    response = client.post("/api/meetings")
    assert response.status_code == 200
    assert response.json() == {"meetingId": "test-meeting-id"}

@patch('app.services.video_sdk.get_meeting_details')
def test_get_meeting(mock_get_meeting_details):
    mock_get_meeting_details.return_value = {
        "meetingId": "test-meeting-id",
        "details": {"roomId": "test-meeting-id", "participants": []},
        "err": None
    }

    response = client.get("/api/meetings/test-meeting-id")
    assert response.status_code == 200
    assert response.json() == {
        "meetingId": "test-meeting-id",
        "details": {"roomId": "test-meeting-id", "participants": []}
    }

@patch('app.services.video_sdk.export_recording')
def test_export_recording(mock_export_recording):
    mock_export_recording.return_value = {"downloadUrl": "https://example.com/recording.mp4", "err": None}

    response = client.post("/api/meetings/test-meeting-id/recordings/export", json={"format": "mp4"})
    assert response.status_code == 200
    assert response.json() == {"downloadUrl": "https://example.com/recording.mp4"}

def test_export_recording_invalid_format():
    response = client.post("/api/meetings/test-meeting-id/recordings/export", json={"format": "invalid"})
    assert response.status_code == 400
    assert "Invalid format" in response.json()["detail"]