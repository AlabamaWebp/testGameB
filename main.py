import uvicorn


if __name__ == '__main__':
    uvicorn.run('Api.Api:app', host='192.168.1.105', port=78, reload=True)
