import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List

import frontmatter
import markdown
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

_cached_posts: List[Dict[str, Any]] = []
templates = Jinja2Templates(directory="templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _cached_posts
    for template_name in ["blog_list.html", "blog.html"]:
        templates.get_template(template_name)
    _cached_posts = get_blog_posts()
    yield


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")


def get_blog_posts() -> List[Dict[str, Any]]:
    """Load and parse all blog posts from the blog_posts directory."""
    posts = []
    blog_dir = "blog_posts"

    if not os.path.exists(blog_dir):
        return posts

    for filename in os.listdir(blog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(blog_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                post = frontmatter.load(f)

                # Create slug from filename
                slug = filename[:-3]  # Remove .md extension

                # Convert markdown to HTML
                html_content = markdown.markdown(
                    post.content, extensions=["codehilite", "fenced_code"]
                )

                posts.append(
                    {
                        "slug": slug,
                        "title": post.metadata.get("title", "Untitled"),
                        "date": post.metadata.get("date", ""),
                        "author": post.metadata.get("author", "Leonardo Conti"),
                        "description": post.metadata.get("description", ""),
                        "tags": post.metadata.get("tags", []),
                        "content": html_content,
                    }
                )

    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x["date"], reverse=True)
    return posts


@app.get("/")
async def read_index():
    return FileResponse("static/index.html")


@app.get("/blog", response_class=HTMLResponse)
async def blog_list(request: Request):
    return templates.TemplateResponse(
        "blog_list.html", {"request": request, "posts": _cached_posts}
    )


@app.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_post(request: Request, slug: str):
    post = next((p for p in _cached_posts if p["slug"] == slug), None)

    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    return templates.TemplateResponse("blog.html", {"request": request, **post})
