# Fullstack-Backend Test Task

## Objective
Design and sketch an architecture for a scalable chatbot dialogue management system similar to ChatGPT.

## Requirements

### 1. Architecture Design
- **Session Management:** Users should be able to create and manage multiple chat sessions.
- **Sequential Interaction:** Within each session, interactions should be processed in sequence, maintaining a consistent context.
- **Persistence:** Sessions should be persistent to ensure continuity even after disruptions.
- **In-Memory Contexts:** The chatbot's context should preferably be stored in RAM for faster access.
- **Scalability:** Design the system with scalability in mind, allowing for the accommodation of dozens of thousands (or more) of simultaneous sessions.

### 2. Backend sketch with a dummy bot implementation
- Using **Python** for the backend, create a mock-up or proof-of-concept where the bot simply echoes back the user's input.

### 3. Front-end Sketch
- Develop a simple front-end interface for the chatbot using a framework of your choice.
- Provide a brief justification for your choice of framework.

## Notes
- It's recommended to use best-in-class AI assistants, but this is not mandatory.
- If you believe that a certain requirement is unnecessary or would hinder the system, feel free to omit it. However, provide a detailed reasoning for the exclusion.
- Additional requirements may be introduced based on evolving project needs or insights gained during the task.


# Chat Bot App

Chat Bot App is a full-stack web application built using React, Django, Django Rest Framework, and Tailwind CSS. It provides chat bot functionality along with user authentication, including registration and login, as well as the ability to manage chat sessions.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend](#backend)
- [Frontend](#frontend)
- [API Documentation](#api-documentation)


## Project Overview

Chat Bot App is designed to allow users to interact with a chat bot and manage chat sessions. It provides a seamless user experience with a modern frontend interface built using React and Tailwind CSS. The backend is powered by Django and Django Rest Framework, offering user authentication and chat session management.

## Prerequisites

Before setting up the Chat Bot App, ensure that you have the following prerequisites installed:

- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Django](https://www.djangoproject.com/download/)
- [Django Rest Framework](https://www.django-rest-framework.org/#installation)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Git](https://git-scm.com/)

## Installation

Follow these steps to set up the Chat Bot App locally:

### Backend

1. Clone the repository:

   ```bash
   https://github.com/Faisal-Sey/Mini-Chat-GPT.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create and apply database migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

6. Configure backend environment variables, such as database settings, in `.env` or through your preferred method.

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd Frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```
4. Configure frontend environment variables, such as backend URL, in `.env` or through your preferred method.

### API Documentation

You can find the API documentation for this project in the [Postman Collection](https://documenter.getpostman.com/view/12600570/2s9YBxYFc7) provided.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/12600570/2s9YBxYFc7)
