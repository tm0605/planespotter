# Plane Spotter
Plane Spotter is a web application project that redefines the experience of aviation enthusiast by offering live flight tracking data across the globe with a unique feature of airplane spotting. The app pinpoints aircraft observation spots which are extracted via Flickr API.
The app is developed using React for the Frontend, Node.js, ExpxressJS for the Backend and hosted on AWS using Docker. Also uses external services such as Mapbox, Airlabs API for flight datas and Flicker API for aircraft observation spots.
## File Structure

```
/my-app
|-- /src
|   |-- /components
|   |-- /services
|   |-- /hooks
|   |-- /contexts
|   |-- /utils
|   |-- /assets
|   |-- /types
|   |-- App.tsx
|   |-- index.tsx
|
|-- /backend
    |-- /controllers
    |-- /models
    |-- /routes
    |-- /middleware
    |-- /utils
    |-- server.js (or server.ts)
|
|-- package.json
|-- README.md
|-- .gitignore
|-- (other config files)
```

### Frontend (`src` Folder)

#### /components
Components are the building blocks of your React UI. They are reusable and can manage their state.
   - Contains React components.
   - Each component represents a part of the UI.
   - Components can be further divided into smaller units (e.g., `Button.js`, `Navbar.js`) and larger units (e.g., `Header.js`, `Footer.js`).

#### /services
Services handle data fetching and interaction with external APIs.
   - Houses functions that handle external interactions, like API calls.
   - This abstraction separates the logic of how data is fetched or sent from the components themselves.

#### /hooks
Custom hooks allow you to extract component logic into reusable functions.
   - For custom React hooks.
   - Hooks allow you to extract component logic into reusable functions (e.g., `useFetch.js` for fetching data).

#### /contexts
Context provides a way to pass data through the component tree without having to pass props down manually.
   - Used for React Context API.
   - Contexts provide a way to pass data through the component tree without having to pass props down manually at every level.

#### /utils
Utility functions can be used across different components.
   - Contains utility functions which can be used across different components or services.
   - Examples include date formatting functions, data validators, or helper functions.

### Backend (`backend` Folder)

#### /controllers
Controllers handle the business logic for each endpoint.
   - Contains functions that respond to various HTTP requests.
   - Each function handles the business logic for a specific route.

#### /models
Models define the schema for database entities.
   - Defines the schema for your database models.
   - Used in applications that interact with databases like MongoDB, PostgreSQL, etc.

#### /routes
Routes define API endpoints and connect them to controllers.
   - Defines API endpoints and associates them with controller functions.
   - Helps in managing and organizing different API routes.

#### /middleware
Middleware functions can process requests before they reach your controllers.
   - For middleware functions.
   - Middleware functions can modify or interact with incoming requests before they reach the controllers (e.g., authentication, logging, error handling).

#### server.js
The entry point for the backend application, setting up the server, middleware, and routes.
   - The entry point of your backend application.
   - Sets up the server, middleware, routes, and any other initial configurations.
