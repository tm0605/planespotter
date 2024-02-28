# Plane Spotter

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

Example (`src/components/Navbar.js`):
```javascript
import React from 'react';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

export default Navbar;
```

#### /services
Services handle data fetching and interaction with external APIs.
   - Houses functions that handle external interactions, like API calls.
   - This abstraction separates the logic of how data is fetched or sent from the components themselves.


Example (`src/services/flightService.js`):
```javascript
import axios from 'axios';

const getFlightData = async () => {
  try {
    const response = await axios.get('http://yourapi.com/flights');
    return response.data;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    throw error;
  }
};

export { getFlightData };
```

#### /hooks
Custom hooks allow you to extract component logic into reusable functions.
   - For custom React hooks.
   - Hooks allow you to extract component logic into reusable functions (e.g., `useFetch.js` for fetching data).

Example (`src/hooks/useFetch.js`):
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
```

#### /contexts
Context provides a way to pass data through the component tree without having to pass props down manually.
   - Used for React Context API.
   - Contexts provide a way to pass data through the component tree without having to pass props down manually at every level.

Example (`src/contexts/UserContext.js`):
```javascript
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

#### /utils
Utility functions can be used across different components.
   - Contains utility functions which can be used across different components or services.
   - Examples include date formatting functions, data validators, or helper functions.

Example (`src/utils/formatDate.js`):
```javascript
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
```

### Backend (`backend` Folder)

#### /controllers
Controllers handle the business logic for each endpoint.
   - Contains functions that respond to various HTTP requests.
   - Each function handles the business logic for a specific route.

Example (`backend/controllers/flightController.js`):
```javascript
exports.getFlights = async (req, res) => {
  try {
    const flights = await FlightService.getAll(); // Assuming FlightService is defined
    res.json(flights);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
```

#### /models
Models define the schema for database entities.
   - Defines the schema for your database models.
   - Used in applications that interact with databases like MongoDB, PostgreSQL, etc.

Example (`backend/models/Flight.js`):
```javascript
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  number: String,
  departure: String,
  arrival: String
});

module.exports = mongoose.model('Flight', flightSchema);
```

#### /routes
Routes define API endpoints and connect them to controllers.
   - Defines API endpoints and associates them with controller functions.
   - Helps in managing and organizing different API routes.

Example (`backend/routes/flightRoutes.js`):
```javascript
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/flights', flightController.getFlights);

module.exports = router;
```

#### /middleware
Middleware functions can process requests before they reach your controllers.
   - For middleware functions.
   - Middleware functions can modify or interact with incoming requests before they reach the controllers (e.g., authentication, logging, error handling).

Example (`backend/middleware/authMiddleware.js`):
```javascript
const authMiddleware = (req, res, next) => {
  // Authentication logic here
  next();
};

module.exports = authMiddleware;
```

#### server.js
The entry point for the backend application, setting up the server, middleware, and routes.
   - The entry point of your backend application.
   - Sets up the server, middleware, routes, and any other initial configurations.

Example (`backend/server.js`):
```javascript
const express = require('express');
const app = express();
const flightRoutes = require('./routes/flightRoutes');

app.use(express.json());
app.use('/api', flightRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```