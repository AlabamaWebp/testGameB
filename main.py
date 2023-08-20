import uvicorn


if __name__ == '__main__':
    uvicorn.run('Api.Api:app', host='26.142.40.233', port=78, reload=True)
