import uvicorn


if __name__ == '__main__':
    uvicorn.run('Api.Api:app', host='127.0.0.1', port=78, reload=True)
