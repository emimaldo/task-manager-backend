import express from 'express';
import taskRoutes from './routes/tasks';

const app = express();

// Middleware
app.use(express.json());

// CORS to allow connections from frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow any origin during development
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager Backend API',
    endpoints: {
      tasks: '/api/tasks',
      patterns: 'Observer, Adapter, Factory, Command, Repository, Singleton'
    }
  });
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module && process.env.NODE_ENV !== 'test') {
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
    console.log('Available endpoints:');
    console.log('- GET    /api/tasks        - List all tasks');
    console.log('- POST   /api/tasks        - Create new task');
    console.log('- PUT    /api/tasks/:id    - Update task');
    console.log('- DELETE /api/tasks/:id    - Delete task');
  });
}

// Export app for testing
export { app };
