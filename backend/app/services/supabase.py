from core.database import supabase


async def store_meeting_details(meeting_id: str, created_by: str):
    data, error = (
        supabase.table("meetings")
        .insert({"meeting_id": meeting_id, "created_by": created_by})
        .execute()
    )

    if error:
        raise Exception(f"Error storing meeting details: {error}")

    return data


async def get_meeting_details(meeting_id: str):
    data, error = (
        supabase.table("meetings").select("*").eq("meeting_id", meeting_id).execute()
    )

    if error:
        raise Exception(f"Error retrieving meeting details: {error}")

    return data
