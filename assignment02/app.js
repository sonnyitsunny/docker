let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}
users[1] = {
	"userId" : 1,
	"name" : "son",
	"password" : "ccc",
	"isAdmin" : false
}

app.put('/login', (req, res) => {
	if(req.body.userId==users[req.body.userId].userId && req.body.password==users[req.body.userId].password){
		
		req.session.userId=users[req.body.userId].userId;
		req.session.isAdmin=users[req.body.userId].isAdmin;
		req.session.save(function(){                              
			
		});

		res.send("Login");
	}
	else
		res.send("invalid");
	
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	
	
});

app.put('/logout', (req, res) => {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	
	if (req.session.userId && req.session.isAdmin){
		req.session.destroy(function() {
			req.session.userId;
			req.session.isAdmin;
		});
		
		res.send("LogOut");}
	else
		res.send("LogOut");

});

let auth = (req, res, next) => {
	// Session Check
	// 어드민 여부 체크 필요
	if ((req.session.userId=!null) && req.session.isAdmin==true)
		next();
	else
		res.send("Error");

};
app.get('/users/:userId', auth, (req, res) => {
	// get User Information
	let userId= req.params.userId;
	console.log(users[userId]);
	
	//req.session.userId=true;
	res.send(users[userId]);
	//res.send("OK");
});

app.post('/users', auth, (req, res) => {
	
	users[req.body.userId]=[req.body.userId,req.body.name,req.body.password,req.body.isAdmin];
		
	
	//req.session.userId=true;
	res.send(users[req.body.userId]);
	//res.send("OK");
});
app.put('/users/:userId', auth, (req, res) => {
	users[req.body.userId]=["수정" ,req.body.userId, req.body.name,req.body.password,req.body.isAdmin
];
	
	//req.session.userId=true;
	res.send(users[req.body.userId]);
	//res.send("OK");
});
app.delete('/users/:userId', auth, (req, res) => {
	users[req.body.userId]=["삭제"];
	//req.session.userId=true;


	res.send(users[req.body.userId]);
	//res.send("OK");
});


// 사용자 추가 시에 admin 여부도 추가해야 함
let server = app.listen(80);