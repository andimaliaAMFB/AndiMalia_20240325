const http = require('node:http');
const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));//Parse application/xxx-www-url form encoded
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

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
  function getSiswa(go2page) {
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
            if (go2page == "index") {
              res.render('pages/index',{ title: 'User List', userData: dataSiswa, kecData: kecamatan, kotaData: kota});
              console.log("Back to Index");
            }
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
    db.query(sql, [id], (err, dataSiswa) => {
      if (err) throw err;
      const sql2 = 'SELECT * FROM kecamatan ORDER BY idkec'
      db.query(sql2, (err, kecamatan) => {
          if (err) throw err;
          
          const sql3 = 'SELECT * FROM kota ORDER BY idkota'
          db.query(sql3, (err, kota) => {
              if (err) throw err;
              res.render('pages/siswa',{ title: 'User List', userData: dataSiswa, kecData: kecamatan, kotaData: kota});
          });
      });
    });
  });
  
  // Insert Siswa
  app.post('/add', (req, res) => {
    const { nama,kota,kec,alamat } = req.body;
    var kotaKab;
    var kecamatan;
    // ubah nama kota dan nama kecamatan menjadi idnya
    const sql2 = 'SELECT * FROM kecamatan ORDER BY idkec';
    db.query(sql2, (err, data) => {
        if (err) throw err;
        data.forEach(list => {
          if (list[Object.keys(list)[1]] == kec) {
            kecamatan = list[Object.keys(list)[0]];
            kotaKab = list[Object.keys(list)[2]];
            console.log(nama,kotaKab,kecamatan,alamat);
            const sql = 'INSERT INTO siswa (nama,kota,kecamatan,alamat) VALUES (?,?,?,?)';
            db.query(sql, [nama,kotaKab,kecamatan,alamat], (err, result) => {
              if (err) throw err;
              console.log("Data Berhasil Ditambahkan");
            });
          }
        });
    });
    res.redirect('back');
    console.log("Back to Index");
  });
  
  // Update Siswa
  app.put('/update:id', (req, res) => {
    const { id } = req.params;
    const { nama,kota,kec,alamat } = req.body;
    var kotaKab;
    var kecamatan;
    // ubah nama kota dan nama kecamatan menjadi idnya
    const sql2 = 'SELECT * FROM kecamatan ORDER BY idkec';
    db.query(sql2, (err, data) => {
        if (err) throw err;
        data.forEach(list => {
          if (list[Object.keys(list)[1]] == kec) {
            kecamatan = list[Object.keys(list)[0]];
            kotaKab = list[Object.keys(list)[2]];
            console.log(nama,kotaKab,kecamatan,alamat);
            const sql = 'UPDATE siswa SET nama = ?, kota = ?, kecamatan = ?, alamat = ? WHERE id = ?';
            db.query(sql, [nama,kotaKab,kecamatan,alamat], (err, result) => {
              if (err) throw err;
              console.log("Data Berhasil Diperbaharui");
            });
          }
        });
    });
    res.redirect('back');
    console.log("Back to Index");
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