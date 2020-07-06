FROM python:3
WORKDIR /codeplayer_worker
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
CMD ["python3", "./test.py"]

