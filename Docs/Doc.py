from fastapi.openapi.docs import (
    get_swagger_ui_html,
    get_redoc_html,
    get_swagger_ui_oauth2_redirect_html)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

sub_app = FastAPI(docs_url=None, redoc_url=None, openapi_url="/api/openapi.json")
sub_app.mount("/static", StaticFiles(directory="Docs/Static"), name="static")

@sub_app.get("/", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=sub_app.openapi_url,
        title=sub_app.title + " - Swagger UI",
        oauth2_redirect_url=sub_app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/api/docs/static/swagger-ui-bundle.js",
        swagger_css_url="/api/docs/static/swagger-ui.css",
        swagger_favicon_url="/api/docs/static/favicon.png",
    )


@sub_app.get(sub_app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


@sub_app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=sub_app.openapi_url,
        title=sub_app.title + " - ReDoc",
        redoc_js_url="/api/docs/static/redoc.standalone.js",
    )
