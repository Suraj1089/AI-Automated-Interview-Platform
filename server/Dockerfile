# Use an official Python runtime as a parent image
FROM python:3.12-slim

# set a directory for the app
WORKDIR /app

# Copy only the requirements file to the container
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt


# copy all the files to the container
COPY . .


# define the port number the container should expose
EXPOSE 8000

