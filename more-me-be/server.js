require('@babel/register');
/* eslint-disable no-console */
const chalk = require('chalk');
const dotenv = require('dotenv');
const cluster = require('cluster');
const numCores = require('os').cpus().length;
const http = require('http');

const app = require('./app');
const jwt = require('jsonwebtoken');
const { Socket_Maker } = require('./socket');// Correct path to socket.js
console.log('Imported Socket_Maker:', Socket_Maker);
// Handle uncaught exceptions
process.on('uncaughtException', (uncaughtExc) => {
  console.log(chalk.bgRed('UNCAUGHT EXCEPTION! 💥 Shutting down...'));
  console.log('uncaughtException Err::', uncaughtExc);
  console.log('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
  process.exit(1);
});

const workers = [];

// Function to set up worker processes
const setupWorkerProcesses = () => {
  console.log(`Master cluster setting up ${numCores} workers`);

  for (let i = 0; i < numCores; i++) {
    const worker = cluster.fork();
    workers.push(worker);

    worker.on('message', function (message) {
      console.log(message);
    });
  }

  cluster.on('online', function (worker) {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    const newWorker = cluster.fork();
    workers.push(newWorker);
    newWorker.on('message', function (message) {
      console.log(message);
    });
  });
};

// Create HTTP server and bind Express app to it
const server = http.createServer(app);

// Setup Socket.IO




// Export the io object properly for use in controllers or other parts of the application

// Start the server
const startServer = () => {
  const port = process.env.APP_PORT || 3000;

  server.listen(port, () => {
    console.log(`App running on port ${chalk.greenBright(port)}...`);
  });
   Socket_Maker(server);

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log(chalk.bgRed('UNHANDLED REJECTION! 💥 Shutting down...'));
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

// Set up server with clustering support
const setupServer = (isClusterRequired) => {
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    startServer();
  }
};

// Call setup based on the environment
if (process.env.NODE_ENV === 'production') {
  setupServer(true);
} else {
  setupServer(false);
}





