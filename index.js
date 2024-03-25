const http = require('node:http');

const express = require('express');
const mysql = require('mysql2');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

const path = require('path');
const filePath = path.resolve(__dirname, 'index.html');

app.use(express.json());
// app.get('/', (req, res) => {
// //     res.sendFile(filePath);
//     res.render('pages/index');
// })
app.set('view engine', 'ejs');

// Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'drapicrud',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

  // Get * Siswa
  function getSiswa() {
    app.get('/', (req, res) => {
        const sql = 'SELECT idSiswa,nama,kota.namaKota,kecamatan.namaKec,alamat FROM (siswa INNER JOIN (kecamatan INNER JOIN kota)) WHERE siswa.kota = kota.idKota AND siswa.kecamatan = kecamatan.idKec ORDER BY idSiswa'
        db.query(sql, (err, dataSiswa) => {
            if (err) throw err;
    
            const sql2 = 'SELECT * FROM kecamatan ORDER BY idkec'
            db.query(sql2, (err, kecamatan) => {
                if (err) throw err;
                
                const sql3 = 'SELECT * FROM kota ORDER BY idkota'
                db.query(sql3, (err, kota) => {
                    if (err) throw err;
                    res.render('pages/index',{ title: 'User List', userData: dataSiswa, kecData: kecamatan, kotaData: kota});
                });
            });
        });
        
      });
  }
  app.get('/', (req, res) => {
    const sql = 'SELECT idSiswa,nama,kota.namaKota,kecamatan.namaKec,alamat FROM (siswa INNER JOIN (kecamatan INNER JOIN kota)) WHERE siswa.kota = kota.idKota AND siswa.kecamatan = kecamatan.idKec ORDER BY idSiswa'
    db.query(sql, (err, dataSiswa) => {
        if (err) throw err;

        const sql2 = 'SELECT * FROM kecamatan ORDER BY idkec'
        db.query(sql2, (err, kecamatan) => {
            if (err) throw err;
            
            const sql3 = 'SELECT * FROM kota ORDER BY idkota'
            db.query(sql3, (err, kota) => {
                if (err) throw err;
                res.render('pages/index',{ title: 'User List', userData: dataSiswa, kecData: kecamatan, kotaData: kota});
            });
        });
    });
    
  });
  
  // Get Siswa by ID
  app.get('/:id', (req, res) => {
    const sql = 'SELECT idSiswa,nama,kota.namaKota,kecamatan.namaKec,alamat FROM (siswa INNER JOIN (kecamatan INNER JOIN kota)) WHERE siswa.kota = kota.idKota AND siswa.kecamatan = kecamatan.idKec AND idSiswa = ?'
    const { id } = req.params;
    db.query(sql, [id], (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  });
  
  // Insert Siswa
  app.post('/add', (req, res) => {
    const sql = 'INSERT INTO siswa (nama,kota,kecamatan,alamat) VALUES (?,?,?,?)'
    const { nama,kota,kec,alamat } = req.body;
    db.query(sql, [nama,kota,kec,alamat], (err, result) => {
      res.json({ message: 'Data Berhasil Ditambahkan'});
      console.log("Data Berhasil Ditambahkan");
      getSiswa();
    });
  });
  
  // Update Siswa
  app.put('/update:id', (req, res) => {
    const sql = 'UPDATE siswa SET nama = ?, kota = ?, kecamatan = ?, alamat = ? WHERE id = ?'
    const { id } = req.params;
    const { nama,kota,kec,alamat } = req.body;
    db.query(sql, [nama,kota,kec,alamat, id], (err) => {
      if (err) throw err;
      res.json({ message: 'Data Siswa Berhasil Diperbaharui' });
    });
  });
  
  // Delete Siswa
  app.delete('/delete:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM siswa WHERE id = ?', [id], (err) => {
      if (err) throw err;
      res.json({ message: 'Data Siswa Berhasil Dihapus' });
    });
  });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});