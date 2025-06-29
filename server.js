const { stkPush } = require('./mpesa_stkpush'); 
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(__dirname));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'camps_db'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});


app.post('/book', (req, res) => {
  console.log('Received body:', req.body);
  const { name, email, phone_number, camp, dates } = req.body;

  
  let campName = '', price = '';
  switch (camp) {
    case 'amboseli':
      campName = 'Amboseli Camp';
      price = 'KSH 5,000';
      break;
    case 'masai_mara':
      campName = 'Masai Mara Reserve Camp';
      price = 'KSH 4,500';
      break;
    case 'nairobi':
      campName = 'Nairobi Camps';
      price = 'KSH 8,500';
      break;
  }

  
  console.log('Booking values:', { name, email, phone_number, campName, price, dates });
  if (!name || !email || !campName || !price || !dates) {
    console.error('Missing required booking field');
    return res.status(400).json({ error: 'Missing required booking field' });
  }

  
  db.query(
    'INSERT INTO bookings (name, email, phone_number, camp_name, price, dates, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone_number, campName, price, dates, 'pending'],
    (err, result) => {
      if (err) {
        console.error('Insert error:', err); 
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ 
          name, 
          email, 
          Phone_Number: phone_number, 
          camp: camp, 
          camp_name: campName, 
          price,
          dates 
        });
      }
    }
  );
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM admins WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).send('DB error');
      if (results.length > 0) {
        
        res.redirect('/admin_bookings.html');
      } else {
        res.redirect>('/admin_login.html');
      }
    }
  );
});

app.get('/bookings/data', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

app.post('/pay', async (req, res) => {
  console.log('PAY endpoint received:', req.body); 
  const { phone_number, camp } = req.body;
  let price = '';
  switch (camp) {
    case 'amboseli': price = 5000; break;
    case 'masai_mara': price = 4500; break;
    case 'nairobi': price = 8500; break;
    default: return res.json({ success: false, error: 'Invalid camp selected.' });
  }

  try {
    const mpesaRes = await stkPush({ phone_number, amount: price });
    res.json({ success: true, mpesa: mpesaRes });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(port,  '0.0.0.0',() => {
  console.log(`Server running at http://localhost:${port}`);
});
