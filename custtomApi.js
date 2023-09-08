let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});

// const port = 2410;
var port = process.env.PORT||2410;
app.listen(port ,()=> console.log(`Node app listening on port ${port}!`));

let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "",
    database : "testDB"
}

let {customerData} = require("./customerData");

app.get("/svr/employees/reset",function(req,res){
    let connection = mysql.createConnection(connData);
    sql1 = "DELETE FROM customers";
    connection.query(sql1,function(err,result){
        if(err) console.log(err);
        else{
            let arr = customerData.map((s)=>[s.empCode,s.name,s.department,s.designation,s.salary,s.gender]);
            let sql = "INSERT INTO customers(empCode,name,department,designation,salary,gender) VALUES ?";
            connection.query(sql,[arr],function(err,result){
                if(err) console.log(err);
                else res.send(result);
            });
        }
    })
    
});

app.get("/svr/employees",function(req,res){
    let {department="",designation="",gender=""} = req.query;
    let connection = mysql.createConnection(connData);
    if(department || designation || gender){
        let sql1 = "SELECT * FROM customers WHERE ";
        let a = [];
        let str = "";
        if(department){
            str += " department = ?"
            a = a.concat(department);
        }
        if(designation){
            if(str) str += " AND designation = ?";
            else  str += " designation = ?";
            a = a.concat(designation);
        }
        if(gender){
            if(str) str += " AND gender = ?";
            else  str += " gender = ?";
            a = a.concat(gender);
        }
        sql1 += str;
        connection.query(sql1,a,function(err,result){
            if(err) console.log(err)
            else res.send(result);
        });
    }
    else{
        let sql = "SELECT * FROM customers";
        connection.query(sql,function(err,result){
            if(err) console.log(err)
            else res.send(result);
        });
    }
});

app.get("/svr/employees/:id",function(req,res){
    let id = req.params.id
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM customers WHERE empCode=?";
    connection.query(sql,id,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.get("/svr/employees/designation/:desig",function(req,res){
    let des = req.params.desig;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM customers WHERE designation=?";
    connection.query(sql,des,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    })
})

app.get("/svr/employees/department/:dep",function(req,res){
    let dep = req.params.dep;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM customers WHERE department=?";
    connection.query(sql,dep,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.post("/svr/employees",function(req,res){
    let body = req.body;
    let arr = [body.empCode,body.name,body.department,body.designation,body.salary,body.gender];
    console.log(arr);
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO customers(empCode,name,department,designation,salary,gender) VALUES (?)";
    connection.query(sql,[arr],function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})

app.put("/svr/employees/:id",function(req,res){
    let code = req.params.id; 
    let body = req.body;
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE customers SET ? WHERE empCode=?";
    connection.query(sql,[body,code],function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})


app.delete("/svr/employees/:id",function(req,res){
    let code = req.params.id; 
    let connection = mysql.createConnection(connData);
    let sql = "DELETE from customers WHERE empCode=?";
    connection.query(sql,code,function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})

