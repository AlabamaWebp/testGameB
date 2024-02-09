import uvicorn


if __name__ == '__main__':
    uvicorn.run('Api.Api:app',
                # host='192.168.183.189',
                port=78)
