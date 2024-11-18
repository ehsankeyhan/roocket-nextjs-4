const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import the cookie-parser middleware
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const csvParser = require('csv-parser');
const csv = require('csv-writer');
const { URL } = require('url'); // Add this line to parse URLs
// Add this line to import the csv-writer library
// Import the UUID v4 function from the uuid library
// const ZarinpalCheckout = require('zarinpal-checkout');
// const zarinpalInstance = ZarinpalCheckout.create('b314785a-e851-11e8-91e3-005056a205be', true);



const csvFilePath = 'users.csv';
const app = express();
app.use(express.json());

const port = 3000; // Choose a port number that is not in use.
app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware to allow all origins. You can configure it with specific options if needed.
// API route for user registration (sign-up)
app.use(cookieParser()); // Use cookie-parser middleware


function convertToCSV(data) {
  const header = ['ID', 'Username', 'Password', 'Name', 'Number', 'Wallet', 'Discount', 'Admin', 'Debt'];
  const rows = data.map((user) => [
    user.ID,
    user.Username,
    user.Password,
    user.Name,
    user.Number.toString(), // Convert number to string before writing
    user.Wallet,
    user.Discount,
    user.Admin,
    user.Debt,
  ]);
  return [header, ...rows].map((row) => row.join(',')).join('\n');
}
// Function to read user data from the CSV file
function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
const cookieFilePath = 'cookie.csv';
function readUserDataFromCSV(callback) {
  const usersData = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      usersData.push(row);
    })
    .on('end', () => {
      callback(usersData);
    });
}
function writeUserDataToCSV(data, callback) {
  const csvData = convertToCSV(data);

  fs.writeFile(csvFilePath, csvData, (err) => {
    if (err) {
      console.error('Error saving user data to CSV:', err);
    } else {
      console.log('User data has been saved to CSV file:', csvFilePath);
      callback();
    }
  });
}

// Function to verify the sessionToken and get the user from the token
function getUserFromSessionToken(sessionToken) {
  const usersData = readUserDataFromCSVSync(); // Read user data from the CSV file synchronously
  const user = usersData.find((user) => user.id === sessionToken); // Find user based on ID
  return user;
}



// Middleware to restrict access to the dashboard if the sessionToken is invalid
function restrictToDashboard(req, res, next) {
  const sessionToken = req.cookies.sessionToken;
  if (!sessionToken) {
    // No sessionToken found, return an error response
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = getUserFromSessionToken(sessionToken);
  if (!user) {
    // Invalid sessionToken, return an error response
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Valid sessionToken, continue to the dashboard
  next();
}


app.get('/api/users', (req, res) => {
  readUserDataFromCSV((usersData) => {
    res.json(usersData);
  });
});
// Route for the dashboard page, restrict access with the middleware
app.get('/dashboard', restrictToDashboard, (req, res) => {
  // Render the dashboard page
  res.send('<h1>Welcome to the Dashboard!</h1>');
});
// API route for user registration (sign-up)
app.post('/signup', (req, res) => {
  const { username, password, name, number } = req.body;

  readUserDataFromCSV((usersData) => {
    // Check if the username is already taken
    const isUsernameTaken = usersData.some((user) => user.Username === username);

    if (isUsernameTaken) {
      // Username already taken
      return res.status(409).json({ message: 'Username already taken!' });
    }

    // Generate a new unique ID for the user
    const id = uuidv4();
    const wallet = "0"
    const discount = 0
    const admin = 0
    const debt = 0

    // Create a new user object
    const newUser = { ID: id, Username: username, Password: password, Name: name, Number: number, Wallet: wallet, Discount: discount, Admin: admin, Debt: debt };
    usersData.push(newUser);

    writeUserDataToCSV(usersData, () => {
      // Respond with success message and the newly created user object
      res.json({ message: 'User registration successful!', user: newUser });
    });
  });
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  readUserDataFromCSV((usersData) => {
    const user = usersData.find((user) => user.Username === username && user.Password === password);
    if (user) {
      // Successful login

      // Generate a new unique session token
      const sessionToken = uuidv4();

      // Set the sessionToken cookie in the response
      res.cookie('sessionToken', sessionToken, { httpOnly: true });

      res.json({ message: 'Login successful!', user });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid credentials!' });
    }
  });
});

// API route to get user data by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  readUserDataFromCSV((usersData) => {
    const user = usersData.find((user) => user.ID === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  });
});


app.get('/api/data/:region?', async (req, res) => {
  try {
    const idForCsv = req.params.region+'h'; // id csv to give token
    const cookiesData = await readCSVFile(cookieFilePath);
    const matchingCookie = cookiesData.find((item) => item.ID === idForCsv);
    if (!matchingCookie) {
      // Handle the case where the provided ID does not have a corresponding cookie in the CSV
      return res.status(404).json({ error: 'Cookie not found for the provided ID' });
    }
    const url = `http://${req.params.region || "iro"}h.giftomo.net:44445/xui/inbound/list`;
    const headers = {
      'Cookie': matchingCookie.Cookies,
      'Content-Type': 'application/json',
    };
    const data = {};
    const response = await axios.post(url, data, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Request error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/update/:region/:id/:remark/:port/:uid/:date/:total', async (req, res) => {
  try {
    const idForCsv = req.params.region+'h'; // id csv to give token
    const cookiesData = await readCSVFile(cookieFilePath);
    const matchingCookie = cookiesData.find((item) => item.ID === idForCsv);
    if (!matchingCookie) {
      // Handle the case where the provided ID does not have a corresponding cookie in the CSV
      return res.status(404).json({ error: 'Cookie not found for the provided ID' });
    }
    const apiUrl = `http://${req.params.region}h.giftomo.net:44445/xui/inbound/update/${req.params.id}`;
    const headers = {
      'Cookie': matchingCookie.Cookies,
    };
    let setting;
    if(req.params.region==="irb"){
      setting = "streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22none%22%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D"
    }else{
      setting = "streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22http%22%2C%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%22path%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%22%2F%22%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22Host%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22uptvs.com%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22response%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22version%22%3A%20%221.1%22%2C%0A%20%20%20%20%20%20%20%20%22status%22%3A%20%22200%22%2C%0A%20%20%20%20%20%20%20%20%22reason%22%3A%20%22OK%22%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D&up=0&down=0&total=53687091200&remark=irf008&enable=true&expiryTime=0&listen=&port=1108&protocol=vmess&settings=%7B%0A%20%20%22clients%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22id%22%3A%20%2256bcd24f-7c28-47ec-c89a-eda49f5f3710%22%2C%0A%20%20%20%20%20%20%22alterId%22%3A%200%0A%20%20%20%20%7D%0A%20%20%5D%2C%0A%20%20%22disableInsecureEncryption%22%3A%20false%0A%7D&streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22http%22%2C%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%22path%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%22%2F%22%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22Host%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22uptvs.com%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22response%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22version%22%3A%20%221.1%22%2C%0A%20%20%20%20%20%20%20%20%22status%22%3A%20%22200%22%2C%0A%20%20%20%20%20%20%20%20%22reason%22%3A%20%22OK%22%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D"
    }
    const data = "up=0&down=0&total=" + `${req.params.total}` + "&remark=" + `${req.params.remark}` + "&enable=true&expiryTime=" + `${req.params.date}` + "&listen=&port=" + `${req.params.port}` + "&protocol=vmess&settings=%7B%0A%20%20%22clients%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22id%22%3A%20%22" + `${req.params.uid}` + "%22%2C%0A%20%20%20%20%20%20%22alterId%22%3A%200%0A%20%20%20%20%7D%0A%20%20%5D%2C%0A%20%20%22disableInsecureEncryption%22%3A%20false%0A%7D&" + `${setting}` + "";
    const response = await axios.post(apiUrl, data, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Request error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/inbound/update/:region/:id', async (req, res) => {
  const { id } = req.params;
  const { enable, region, userId, up, down, total, remark, expiryTime, listen, port, protocol, settings, streamSettings, tag, sniffing } = req.body;

  // Define the cookies file path
  const idForCsv = `${req.params.region}h`; // Assuming region is sent in the body
  const cookiesData = await readCSVFile(cookieFilePath);
  const matchingCookie = cookiesData.find((item) => item.ID === idForCsv);

  // Construct the requestData object dynamically
  const requestData = {
      id,
      userId,
      up,
      down,
      total,
      remark,
      enable,
      expiryTime,
      listen,
      port,
      protocol,
      settings,
      streamSettings,
      tag,
      sniffing
  };

  const apiUrl = `http://${req.params.region}h.giftomo.net:44445/xui/inbound/update/${req.params.id}`;
  
  if (!matchingCookie) {
    // Handle the case where the provided ID does not have a corresponding cookie in the CSV
    return res.status(404).json({ error: 'Cookie not found for the provided ID' });
  }
  
  const headers = {
    'Cookie': matchingCookie.Cookies,
  };
  
  const data = new URLSearchParams(requestData).toString();
  
  try {
    // Log or handle the requestData
    
    const response = await axios.post(apiUrl, data, { headers });

    // Send response with all requestData and matching cookie
    return res.status(200).json({
        message: `Inbound ${enable ? 'enabled' : 'disabled'}`,
        requestData,
        cookie: matchingCookie,
        apiResponse: response.data // Include response from API if needed
    });
  } catch (error) {
    // Handle any errors that occurred during the axios request
    console.error('Error updating inbound:', error);
    return res.status(500).json({ error: 'Failed to update inbound', details: error.message });
  }
});


// API route for processing payments
app.post('/payment', (req, res) => {
  const { number, inputRemarkValue } = req.body;

  readUserDataFromCSV((usersData) => {
    // Get the sessionToken from the request headers
    const sessionToken = req.headers.authorization.split(' ')[1];

    // Find the user based on the sessionToken
    const user = usersData.find((user) => user.ID === sessionToken);

    if (!user) {
      // Invalid sessionToken, user not found
      return res.status(404).json({ message: 'User not found!' });
    }

    const newNum = (number - ((user.Discount / 100) * number));

    // Check if the user's wallet has sufficient balance
    if (user.Wallet >= newNum) {
      // Calculate the new wallet balance
      const newWallet = user.Wallet - newNum;
      user.Wallet = newWallet;

      // Write the updated data back to the CSV file
      writeUserDataToCSV(usersData, () => {
        // Write payment record to the CSV file
        const csvWriter = csv.createObjectCsvWriter({
          path: 'orders.csv',
          header: [
            { id: 'ID', title: 'ID' },
            { id: 'Remark', title: 'Remark' },
            { id: 'Date', title: 'Date' },
            { id: 'Price', title: 'Price' }
          ],
          append: true  // Append to the existing file
        });

        const paymentRecord = {
          ID: user.ID,
          Remark: inputRemarkValue,
          Date: new Date().toISOString(),
          Price: newNum,  // Format the price as needed
        };

        csvWriter.writeRecords([paymentRecord])
          .then(() => {
            res.json({ message: 'Payment successful!', newWallet, discount: user.Discount });
          })
          .catch((error) => {
            console.error('Error writing to CSV:', error);
            res.status(500).json({ message: 'Error writing payment data' });
          });
      });
    } else {
      // Insufficient balance, payment needed
      res.status(403).json({ message: 'Your account payment needed!' });
    }
  });
});

app.post('/checkpayment', (req, res) => {
  const { number } = req.body;

  readUserDataFromCSV((usersData) => {
    // Get the sessionToken from the request headers
    const sessionToken = req.headers.authorization.split(' ')[1];

    // Find the user based on the sessionToken
    const user = usersData.find((user) => user.ID === sessionToken);

    if (!user) {
      // Invalid sessionToken, user not found
      return res.status(404).json({ message: 'User not found!' });
    }
    const newNum = (number - ((user.Discount / 100) * number));
    // Check if the user's wallet has sufficient balance
    if (user.Wallet >= newNum) {
      // Calculate the new wallet balance
      const newWallet = user.Wallet
      // Update the user's wallet balance in the data
      user.Wallet = newWallet;
      const discount = user.Discount;


      // Write the updated data back to the CSV file
      writeUserDataToCSV(usersData, () => {
        // Respond with success message and the new wallet balance
        res.json({ message: 'Wallet balance is ok', newWallet, discount });
      });
    } else {
      // Insufficient balance, payment needed
      res.status(403).json({ message: 'Your account payment needed!' });
    }
  });
});

app.get('/orders/:token', (req, res) => {
  const data = [];
  const sessionToken = req.params.token;

  fs.createReadStream('orders.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      // Format the date to include only hh:mm
      const userId = row.ID;
      if (sessionToken === userId) {
        // Format the date to include only hh:mm
        const formattedDate = new Date(row.Date).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        // Push the formatted data to the array
        data.push({
          ID: row.ID,
          Remark: row.Remark,
          Date: formattedDate,
          Price: row.Price
        });
      }
    })
    .on('end', () => {
      res.json(data);
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).json({ message: 'Error reading CSV data' });
    });
});
app.get('/getAndRemoveRow', (req, res) => {
  const rows = [];

  // Read the CSV file and store rows in an array
  fs.createReadStream('Account.csv')
    .pipe(csvParser())
    .on('data', (row) => rows.push(row))
    .on('end', () => {
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No rows left in CSV file.' });
      }

      // Get the first row and remove it from the array
      const removedRow = rows.shift();

      // Write updated rows back to the CSV file
      const csvStream = fs.createWriteStream('Account.csv');
      csvStream.write('ID,Remark,Link\n');
      rows.forEach((row) => {
        csvStream.write(`${row.ID},${row.Remark},${row.Link}\n`);
      });

      csvStream.end();

      res.json(removedRow);
    });
});

app.get('/api/newAcc/:region/:id/:remark/:port/:uid/:date/:total', async (req, res) => {
  try {
    const idForCsv = req.params.region+'h'; // id csv to give token
    const cookiesData = await readCSVFile(cookieFilePath);
    const matchingCookie = cookiesData.find((item) => item.ID === idForCsv);
    if (!matchingCookie) {
      // Handle the case where the provided ID does not have a corresponding cookie in the CSV
      return res.status(404).json({ error: 'Cookie not found for the provided ID' });
    }
    const apiUrl = `http://${req.params.region}.giftomo.net:44445/xui/inbound/update/${req.params.id}`;
    const headers = {
      'Cookie': matchingCookie.Cookies,
    };
    let setting
    if(req.params.region==="irb"){
      setting = "streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22none%22%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D"
    }else{
      setting = "streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22http%22%2C%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%22path%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%22%2F%22%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22Host%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22uptvs.com%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22response%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22version%22%3A%20%221.1%22%2C%0A%20%20%20%20%20%20%20%20%22status%22%3A%20%22200%22%2C%0A%20%20%20%20%20%20%20%20%22reason%22%3A%20%22OK%22%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D&up=0&down=0&total=53687091200&remark=irf008&enable=true&expiryTime=0&listen=&port=1108&protocol=vmess&settings=%7B%0A%20%20%22clients%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22id%22%3A%20%2256bcd24f-7c28-47ec-c89a-eda49f5f3710%22%2C%0A%20%20%20%20%20%20%22alterId%22%3A%200%0A%20%20%20%20%7D%0A%20%20%5D%2C%0A%20%20%22disableInsecureEncryption%22%3A%20false%0A%7D&streamSettings=%7B%0A%20%20%22network%22%3A%20%22tcp%22%2C%0A%20%20%22security%22%3A%20%22none%22%2C%0A%20%20%22tcpSettings%22%3A%20%7B%0A%20%20%20%20%22header%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22http%22%2C%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%22path%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%22%2F%22%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22Host%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22uptvs.com%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22response%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22version%22%3A%20%221.1%22%2C%0A%20%20%20%20%20%20%20%20%22status%22%3A%20%22200%22%2C%0A%20%20%20%20%20%20%20%20%22reason%22%3A%20%22OK%22%2C%0A%20%20%20%20%20%20%20%20%22headers%22%3A%20%7B%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&sniffing=%7B%0A%20%20%22enabled%22%3A%20true%2C%0A%20%20%22destOverride%22%3A%20%5B%0A%20%20%20%20%22http%22%2C%0A%20%20%20%20%22tls%22%0A%20%20%5D%0A%7D"
    }
    const data = "up=0&down=0&total=" + `${req.params.total}` + "&remark=" + `${req.params.remark}` + "&enable=true&expiryTime=" + `${req.params.date}` + "&listen=&port=" + `${req.params.port}` + "&protocol=vmess&settings=%7B%0A%20%20%22clients%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22id%22%3A%20%22" + `${req.params.uid}` + "%22%2C%0A%20%20%20%20%20%20%22alterId%22%3A%200%0A%20%20%20%20%7D%0A%20%20%5D%2C%0A%20%20%22disableInsecureEncryption%22%3A%20false%0A%7D&" + `${setting}` + "";
    const response = await axios.post(apiUrl, data, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Request error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//newwwww 6


app.get('/api/orders', (req, res) => {
  const ordersData = [];
  const usersData = [];

  // Read orders.csv and store data in ordersData array
  fs.createReadStream('orders.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      ordersData.push(row);
    })
    .on('end', () => {
      console.log('Orders data loaded');
      // Once orders data is loaded, read users.csv
      fs.createReadStream('users.csv')
        .pipe(csvParser())
        .on('data', (row) => {
          usersData.push(row);
        })
        .on('end', () => {
          console.log('Users data loaded');

          const responseData = [];

          ordersData.forEach((order) => {
            const user = usersData.find((userData) => userData.ID === order.ID);
            if (user) {
              const formattedDate = new Date(order.Date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
              responseData.push({
                name: user.Name,
                remark: order.Remark,
                date: formattedDate,
                price: order.Price,
              });
            }
          });

          res.json(responseData);
        });
    });
});

app.post('/api/users/update', (req, res) => {
  const { userId, newValue } = req.body;

  const users = [];

  // Read the CSV file and update the wallet value
  fs.createReadStream('users.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      if (row.ID === userId) {
        row.Wallet = newValue;
      }
      users.push(row);
    })
    .on('end', () => {
      // Write the updated data back to the CSV file
      const csvStream = fs.createWriteStream('users.csv');
      csvStream.write('ID,Username,Password,Name,Number,Wallet,Discount,Admin,Debt\n');
      users.forEach(user => {
        csvStream.write(`${user.ID},${user.Username},${user.Password},${user.Name},${user.Number},${user.Wallet},${user.Discount},${user.Admin},${user.Debt}\n`);
      });
      csvStream.end();

      res.json({ message: 'Wallet value updated successfully' });
    });
});


app.get('/loginCookie', async (req, res) => {
  try {
    // Array to hold the extracted session cookie values and corresponding IDs
    const sessionCookies = [];
    const ids = [];

    // URLs of the three APIs
    const apiUrls = [
      'http://irnh.giftomo.net:44445/login',
      'http://iroh.giftomo.net:44445/login',
      'http://irkh.giftomo.net:44445/login',
      'http://irmh.giftomo.net:44445/login',
      'http://irph.giftomo.net:44445/login',
      'http://irsh.giftomo.net:44445/login',
      'http://iruh.giftomo.net:44445/login',
      'http://irwh.giftomo.net:44445/login',
      'http://irxh.giftomo.net:44445/login',
      'http://iryh.giftomo.net:44445/login',
      'http://irzh.giftomo.net:44445/login',
      'http://irth.giftomo.net:44445/login',
      'http://ireh.giftomo.net:44445/login',
      'http://irvh.giftomo.net:44445/login',
      'http://irah.giftomo.net:44445/login',
    ];

    // Make asynchronous requests to all three APIs in parallel
    await Promise.all(
      apiUrls.map(async (apiUrl) => {
        const response = await axios.post(apiUrl, {
          username: 'ehsan',
          password: '019313276'
        });

        // Get the Set-Cookie header value from the response
        const setCookieValue = response.headers['set-cookie'][0];

        // Extract the session cookie value using regex
        const sessionCookie = setCookieValue.match(/session=[^;]*/)[0];

        // Parse the URL to extract the ID
        const parsedUrl = new URL(apiUrl);
        const id = parsedUrl.hostname.split('.')[0]; // Extract the subdomain as the ID


        // Add the extracted session cookie value and ID to their respective arrays
        sessionCookies.push(sessionCookie);
        ids.push(id);
      })
    );

    // Send all the extracted session cookie values and IDs as the API response
    res.send({ ids, sessionCookies });

    // Save the data to a CSV file
    saveToCSV(ids, sessionCookies);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Function to save data to a CSV file
function saveToCSV(ids, sessionCookies) {
  // Prepare the CSV content
  let csvData = 'ID,Cookies\n';

  for (let i = 0; i < ids.length; i++) {
    csvData += `${ids[i]},${sessionCookies[i]}\n`;
  }

  // Write the CSV content to a file named 'cookie.csv'
  fs.writeFileSync('cookie.csv', csvData);

}


// app.post('/create-payment', async (req, res) => {
//   const { Amount, Mobile } = req.body;

//   try {
//     const paymentResponse = await zarinpalInstance.PaymentRequest({
//       Amount,
//       CallbackURL: `http://localhost:3000/example/zarinpal/validate/?Mobile=${Mobile}`,
//       Description: 'A Payment from Node.JS',
//       Email: 'hi@siamak.work',
//       Mobile,
//     });

//     if (paymentResponse.status === 100) {
//       res.json({ paymentUrl: paymentResponse.url });
//     } else {
//       res.status(500).json({ message: 'Failed to create payment request' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred' });
//   }
// });
// app.get('/example/zarinpal/validate/', (req, res) => {
//   const authority = req.query.Authority;
//   const status = req.query.Status;
//   const mobile = req.query.Mobile;

//   if (status === 'OK') {
//     res.redirect(`https://www.google.com/${mobile}`);
//   } else if (status === 'NOK') {
//     res.redirect('https://www.yahoo.com/');
//   } else {
//     res.status(400).send('Invalid status');
//   }
// });



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




