export interface MockupScenario {
  id: string;
  name: string;
  description: string;
  userMessage: string;
  aiResponse: string;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export const mockupScenarios: MockupScenario[] = [
  {
    id: 'short-both',
    name: 'Short Messages',
    description: 'Both user and AI messages are short',
    userMessage: 'Hello, how are you?',
    aiResponse: 'I\'m doing well, thank you for asking! How can I help you today?'
  },
  {
    id: 'long-user-short-ai',
    name: 'Long User, Short AI',
    description: 'Long user message with short AI response',
    userMessage: 'I\'m working on a complex project that involves multiple components and I need to understand how to properly structure the architecture. The project has various modules including authentication, data processing, user interface components, and API integrations. I\'m particularly concerned about maintainability and scalability as the project grows.',
    aiResponse: 'Focus on modular architecture with clear separation of concerns.'
  },
  {
    id: 'short-user-long-ai',
    name: 'Short User, Long AI',
    description: 'Short user message with long AI response',
    userMessage: 'Explain React hooks',
    aiResponse: `React hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and provide a more direct API to the React concepts you already know.

## Key Hooks:

### useState
The most basic hook for managing state in functional components:
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
Handles side effects like data fetching, subscriptions, or manually changing the DOM:
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

### useContext
Provides a way to consume context without wrapping components:
\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

## Rules of Hooks:
1. Only call hooks at the top level of your function
2. Only call hooks from React functions
3. Use the ESLint plugin to enforce these rules

Hooks enable you to reuse stateful logic between components without changing your component hierarchy.`
  },
  {
    id: 'long-both',
    name: 'Long Messages',
    description: 'Both user and AI messages are long',
    userMessage: 'I\'m building a full-stack web application using React for the frontend and Node.js for the backend. The application needs to handle user authentication, real-time chat functionality, file uploads, and complex data visualization. I\'m struggling with state management across the application, particularly when it comes to handling real-time updates, managing user sessions, and keeping the UI in sync with the backend data. Additionally, I need to ensure the application is scalable and can handle a growing number of users. Could you provide comprehensive guidance on architecture patterns, state management solutions, and best practices for this type of application?',
    aiResponse: `Building a full-stack application with those requirements is definitely complex, but I can help you break it down into manageable pieces. Let me provide a comprehensive architecture guide:

## Frontend Architecture

### State Management
For an application of this complexity, I recommend using **Redux Toolkit** with **RTK Query** for several reasons:

1. **Centralized State**: All your application state lives in one place
2. **Real-time Updates**: RTK Query has excellent caching and invalidation
3. **TypeScript Support**: Excellent type safety throughout your app
4. **DevTools**: Great debugging capabilities

\`\`\`javascript
// store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', \`Bearer \${token}\`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Chat', 'File'],
  endpoints: (builder) => ({
    // Your endpoints here
  }),
});
\`\`\`

### Real-time Communication
For real-time chat, use **Socket.io** with proper integration:

\`\`\`javascript
// hooks/useSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const socket = io();
    
    socket.on('message', (message) => {
      dispatch(api.util.invalidateTags(['Chat']));
    });
    
    return () => socket.disconnect();
  }, [dispatch]);
};
\`\`\`

## Backend Architecture

### API Structure
Use a layered architecture:

1. **Routes**: Handle HTTP requests
2. **Controllers**: Business logic
3. **Services**: Data access and external APIs
4. **Models**: Data structures

\`\`\`javascript
// controllers/chatController.js
class ChatController {
  async createMessage(req, res) {
    try {
      const message = await ChatService.createMessage(req.body);
      io.emit('message', message); // Real-time broadcast
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
\`\`\`

### Authentication Strategy
Implement JWT with refresh tokens:

\`\`\`javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
\`\`\`

## Scalability Considerations

### Database Optimization
1. **Indexing**: Proper database indexes for queries
2. **Connection Pooling**: Manage database connections efficiently
3. **Caching**: Redis for session storage and frequently accessed data

### File Handling
Use cloud storage (AWS S3, Google Cloud Storage) with signed URLs:

\`\`\`javascript
// services/fileService.js
const uploadFile = async (file, userId) => {
  const fileName = \`\${userId}/\${Date.now()}-\${file.originalname}\`;
  const signedUrl = await s3.getSignedUrl('putObject', {
    Bucket: 'your-bucket',
    Key: fileName,
    ContentType: file.mimetype,
    Expires: 60 * 5 // 5 minutes
  });
  
  return { signedUrl, fileName };
};
\`\`\`

## Performance Best Practices

### Frontend Optimization
1. **Code Splitting**: Use React.lazy for route-based splitting
2. **Memoization**: React.memo and useMemo for expensive computations
3. **Virtual Scrolling**: For large lists (react-window)

### Backend Optimization
1. **Rate Limiting**: Prevent abuse
2. **Compression**: gzip middleware
3. **Monitoring**: Application performance monitoring

This architecture will scale well and handle your requirements effectively. Would you like me to elaborate on any specific part?`
  },
  {
    id: 'code-example',
    name: 'Code Example',
    description: 'Response with code examples',
    userMessage: 'Show me a React component example',
    aiResponse: `Here's a comprehensive React component example that demonstrates modern patterns:

\`\`\`tsx
import React, { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  onUserSelect: (user: User) => void;
  selectedUserId?: number;
}

const UserList: React.FC<UserListProps> = ({ onUserSelect, selectedUserId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list">
      {users.map(user => (
        <div
          key={user.id}
          className={\`user-item \${selectedUserId === user.id ? 'selected' : ''}\`}
          onClick={() => onUserSelect(user)}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
\`\`\`

This component demonstrates:
- TypeScript interfaces
- Proper state management
- Error handling
- Loading states
- useCallback for optimization
- Modern React patterns`
  },
  {
    id: 'loading-state',
    name: 'Loading State',
    description: 'Shows the loading state',
    userMessage: 'What is machine learning?',
    aiResponse: '',
    isLoading: true
  },
  {
    id: 'error-state',
    name: 'Error State',
    description: 'Shows an error state',
    userMessage: 'Tell me about quantum computing',
    aiResponse: '',
    hasError: true,
    errorMessage: 'Failed to generate response. Please try again.'
  },
  {
    id: 'very-long-user',
    name: 'Very Long User Message',
    description: 'Extremely long user message to test truncation',
    userMessage: 'I am working on a comprehensive project that involves multiple different technologies and frameworks. The project requires integration between various systems including a React frontend with TypeScript, a Node.js backend with Express, a PostgreSQL database, Redis for caching, Docker for containerization, and deployment on AWS with proper CI/CD pipelines. Additionally, I need to implement real-time features using WebSockets, handle file uploads to S3, implement proper authentication and authorization with JWT tokens, set up monitoring and logging, ensure the application is scalable and can handle high traffic loads, implement proper error handling and recovery mechanisms, add comprehensive testing including unit tests, integration tests, and end-to-end tests, and ensure the application follows security best practices. I also need to consider performance optimization, code splitting, lazy loading, and implementing proper SEO strategies. The application should be responsive and work well on both desktop and mobile devices, and should be accessible to users with disabilities following WCAG guidelines.',
    aiResponse: 'That\'s a comprehensive project! Let me help you break this down into manageable phases.'
  },
  {
    id: 'markdown-formatting',
    name: 'Rich Markdown',
    description: 'Response with various markdown formatting',
    userMessage: 'Explain the differences between SQL and NoSQL databases',
    aiResponse: `# SQL vs NoSQL Databases

## SQL Databases (Relational)

### Characteristics:
- **Structured**: Data is organized in tables with rows and columns
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability
- **Schema**: Fixed schema that must be defined before data entry
- **Relationships**: Strong relationships between tables via foreign keys

### Popular Examples:
- PostgreSQL
- MySQL
- SQL Server
- Oracle

### When to Use:
- ✅ Complex queries and transactions
- ✅ Strong consistency requirements
- ✅ Well-defined relationships
- ✅ Financial applications

## NoSQL Databases (Non-Relational)

### Types:

#### 1. Document Stores
- Store data as documents (JSON, BSON)
- Examples: MongoDB, CouchDB

#### 2. Key-Value Stores
- Simple key-value pairs
- Examples: Redis, DynamoDB

#### 3. Column-Family
- Store data in column families
- Examples: Cassandra, HBase

#### 4. Graph Databases
- Store data as nodes and edges
- Examples: Neo4j, Amazon Neptune

### When to Use:
- ✅ Flexible schema requirements
- ✅ Horizontal scaling needs
- ✅ Rapid development cycles
- ✅ Big data applications

## Key Differences Table

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed | Flexible |
| Scaling | Vertical | Horizontal |
| Consistency | ACID | BASE |
| Query Language | SQL | Various |

> **Note**: The choice between SQL and NoSQL depends on your specific use case, not one being universally better than the other.`
  }
];

export const getRandomMockup = (): MockupScenario => {
  const randomIndex = Math.floor(Math.random() * mockupScenarios.length);
  return mockupScenarios[randomIndex];
};

export const getMockupById = (id: string): MockupScenario | undefined => {
  return mockupScenarios.find(scenario => scenario.id === id);
};