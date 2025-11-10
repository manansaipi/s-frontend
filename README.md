# Movie App Frontend

This is the frontend for a movie browsing application, built with React and Vite. It allows users to explore movies, view details, search, and manage a personal "Favorites" list by authenticating with a custom backend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (LTS version recommended)
* npm (comes with Node.js)

## 🛠️ How to Run

Follow these steps to get the frontend running locally.

### 1. Clone the Repository

Clone the repository [https://github.com/manansaipi/s-frontend.git](https://github.com/manansaipi/s-frontend.git)
```
git clone https://github.com/manansaipi/s-frontend.git
```
Navigate into the project directory
```
cd s-frontend
```

### 2. Install Dependencies
Install all the required npm packages.
```
npm install
```
### 3. Set Up the Backend
This frontend requires a backend server to handle user authentication and favorites.
#### 1. In a separate terminal window or directory
clone the backend repository:  [https://github.com/manansaipi/s-backend.git](https://github.com/manansaipi/s-backend.git)

```
git clone https://github.com/manansaipi/s-backend.git
```
#### 2 Navigate into the backend directory:
```
cd s-backend
```
#### 3. Follow the instructions in the backend's README.md file 
To install its dependencies (e.g., pip install -r requirements.txt) and run the server (e.g., uvicorn main:app --reload).

Important: For the login and favorites features to work, this backend server must be running. By default, it runs at http://127.0.0.1:8000.


### 4. Set Up Environment Variables
Now, back in the s-frontend directory, you need to create a .env file to tell the frontend where to find the APIs.

- Create an account if you don't have on [TMDB](https://www.themoviedb.org/)
  to consume movie/tv data.
- And then follow the [documentation](https://developers.themoviedb.org/3/getting-started/introduction) to create API Key.
- You can use this key '2824692e8b1b14a21907b1fd78b9e192' or get your own from https://www.themoviedb.org/
- Finally, if you use v3 of TMDB API, create a file named `.env`, and copy and paste the content of `.env.example`. And then paste the API Key you just created.
##### And This must match the URL where your backend server is running.
- VITE_BACKEND_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
- VITE_TMDB_API_KEY=2824692e8b1b14a21907b1fd78b9e192

### 5. Run the Frontend Application
Once the dependencies are installed, the backend is running, and the ```.env``` al file is set up, you can start the frontend development server.

```
npm run dev
```

The application should now be running. Open your browser and go to the local URL provided in your terminal (usually http://localhost:5173).
