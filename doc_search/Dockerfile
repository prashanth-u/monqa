FROM python:3.7

WORKDIR /usr/src/app
COPY ./requirements.txt ./
RUN pip install --upgrade pip && \
    python3 -m pip install --upgrade pip && \
    pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "app.py" ]