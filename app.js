const express = require('express')
const app = express() 
let login = require('./routes/login');
let billingCategories = require('./routes/billingCategory'); // Ensure the path to billing category routes is correct
let dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const cors = require('cors');

const port = 3000
let mongoose = require('./database/index');
let userRole = require('./routes/userRole'); // Ensure the path to user role routes is correct
let userPermission = require('./routes/userPermission'); // Ensure the path to user permission routes
let auth = require('./routes/auth'); // En`sure you have an auth middleware for authenticatio
let paymentType = require('./routes/paymentType'); // Ensure the path to payment type routes is correct
let setting = require('./routes/setting'); // Ensure the path to setting routes is correct
const errorLogRoutes = require('./routes/errorLog');
let billingCategory = require('./routes/billingCategory'); // Ensure the path to billing category model is correct
let financialYear = require('./routes/financialYear'); // Ensure the path to financial year routes is correct
let billingItems = require('./routes/billingItems'); // Ensure the path to billing items routes is correct
let billing = require('./routes/billing'); // Ensure the path to billing routes is correct
let dashboard = require('./routes/dashboard'); // Ensure the path to dashboard routes is correct
const bodyParser = require('body-parser');
// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to handle CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific methods
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204); // Respond to preflight requests
//   }
//   next(); // Proceed to the next middleware or route handler
// });
// allow all origins by default
app.use(cors()); // Allow all origins by default
// Define Routes Here
app.use(process.env.API_BASE_URL+'/login', login);
app.use(process.env.API_BASE_URL+'/category', billingCategories);
app.use(process.env.API_BASE_URL+'/auth', auth);
app.use(process.env.API_BASE_URL+'/paymentType', paymentType);
app.use(process.env.API_BASE_URL+'/userRole', userRole);
app.use(process.env.API_BASE_URL+'/userPermission', userPermission);
app.use(process.env.API_BASE_URL+'/settings', setting);
app.use(process.env.API_BASE_URL+'/financialYear', financialYear);
app.use(process.env.API_BASE_URL+'/billingItems', billingItems);
app.use(process.env.API_BASE_URL+'/billing', billing);
app.use(process.env.API_BASE_URL+'/billingCategory', billingCategory);
app.use(process.env.API_BASE_URL+'/dashboard', dashboard);


app.use(process.env.API_BASE_URL+'/static', express.static('uploads'))
app.use(process.env.API_BASE_URL+'/error-logs', errorLogRoutes); 

app.get('/', (req, res) => {
  res.send('Hello World!')
}) 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
