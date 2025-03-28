from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")
# Mount assets directory
app.mount("/assets", StaticFiles(directory="assets"), name="assets")


@app.get("/")
async def read_index():
    return FileResponse("static/with_animation.html")
