const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var oracledb = require("oracledb");

const port = 4000;

const app = express()

// enable cors
app.use(cors({ origin: "*" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/get-code-details", (req, res) => {
  
  const code = "'"+req.body.code+"'";

  async function getCodeDetails() {

    let con;

    try {
      con = await oracledb.getConnection({
        user: "BANKOWNER",
        password: "pass1234",
        connectString: "192.168.1.60:9534/UNSGP",
      });
    

      const data = await con.execute(
        `SELECT description, actual_code, ltrim(rtrim(short_descrp,0)) short_descrp 
      FROM code_desc
      WHERE code_type = ${code}`
      );

      if (data.rows) {
        const arr = [];

        for (let i = 0; i < data.rows.length; i++) {
          const description = data.rows[i][0];
          const actual_code = data.rows[i][1];
          const short_descrp = data.rows[i][2];

          arr.push({
            description: description,
            actual_code: actual_code,
            short_descrp: short_descrp, 
          });
        }

        res.send(arr);
      } else {
        res.send(err);
        console.log(err);
      }
    } catch (err) {
      res.send(err);
    }
  }

  getCodeDetails();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})