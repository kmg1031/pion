const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const conn = mysql.createConnection({
	"host" : "localhost",
	"port" : "8090",
	"user" : "root",
	"password" : "1111",
	"database" : "mysite"
});

conn.connect();

var app = express();


app.set('view engine', 'ejs');
app.use(express.static(__dirname +'/css'));
app.use(express.static(__dirname +'/js'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/favicon.ico",function(req,res){
});













var option_dec = {
	t1 : 1,
	t2 : 2,
	t3 : 4,
	t4 : 8,
	t5 : 16,
	t6 : 32,
}
var option_enc = [
	"t1",
	"t2",
	"t3",
	"t4",
	"t5",
	"t6"
]
app.post("/user/option/user_option_modify",function(req,res){
	console.log("user option modify");

	var body = req.body;

	console.log(body);
	var userId = body.userId;
	var val = option_dec[body.option]
	var qry_val = "1=1";

	if(body.value){
		// insert
		qry_val = " opt.option_test1 = opt.option_test1 | " + val + " ";
	}else{
		// delete
		qry_val = " opt.option_test1 = opt.option_test1 & ~" + val + " ";
	}

	var query = `UPDATE option_test opt LEFT JOIN member m ON m.seq = opt.member_seq SET ${qry_val} WHERE m.userId = '${userId}'`;
	conn.query(query,(err,rows)=>{
		if(err) console.log(err);
		res.send('');
	})
})

// 옵션 목록
app.post("/user/option/user_option",function(req,res){
	console.log("user option");

	var body = req.body;
	var userId = body.userId;
	var query = `SELECT m.userId, opt.option_test1 as option1 FROM member m LEFT JOIN option_test opt ON m.seq = opt.member_seq WHERE m.userId = '${userId}'`;

	conn.query(query,(err,rows)=>{
		if(err) console.log(err);

		var option1 = rows[0].option1;
		var optionArr = {};
		for(var idx=0, lim=option_enc.length;idx<lim;idx++){
			if(!option_enc[idx]) break;
			optionArr[option_enc[idx]] = option1 & 1;
			option1 = option1 >> 1;
		}

		var result = {
			userId : rows[0].userId,
			optionArr : optionArr
		}
		rows = JSON.stringify(result);
		res.send(rows);
	});
})







// 귀찮으니 나중에 급하면 옵션보고
// 권한 변경
app.post("/user/auth/update",function(seq,res){
	console.log("user auth update");
	// data > db 저장용 구조화


	// 최종값으로 db 저장

})

// 권한 생성
app.post("/user/auth/create",function(req,res){
	console.log("user auth list");
	conn.query(`SELECT userId, userName FROM mysite.member`,(err,rows)=>{
		if(err) console.log(err);
		rows = JSON.stringify(rows);
		res.send(rows);
	});
})

// 권한 목록
app.post("/user/auth/list",function(req,res){
	console.log("user auth list");

	conn.query(`SELECT m.*, a.auth1, a.admin FROM member m left join auth a on m.seq = a.seq`,(err,rows)=>{
		if(err) console.log(err);
		rows = JSON.stringify(rows);
		res.send(rows);
	});
})

// 유저 목록
app.post("/user/list",function(req,res){
	console.log("user list");
	conn.query(`SELECT userId, userName FROM mysite.member`,(err,rows)=>{
		if(err) console.log(err);
		rows = JSON.stringify(rows);
		res.send(rows);
	});
})

// 가입
app.post("/user/create",function(req,res){
	console.log("user create");
	var userInfo = req.body;

	var userId = userInfo.userId;
	var userPw = userInfo.userPw;
	var userName = userInfo.userName;

	// 유효성 검사
	
	conn.query(`select * from member where userId = '${userId}'`,function(err,rows){
		if(err) console.log(err);

		var result = {};
		if(rows.length == 0){
			// 가입
			conn.query(`insert into member(userId, userPw, userName) value('${userId}','${userPw}','${userName}')`,function(err,memberRows){
				if(err) console.log(err);
				// 권한 추가
				conn.query(`insert into auth(seq) value(${memberRows.insertId})`,function(err,autnRows){
					if(err) console.log(err);
				});
				// 옵션 추가
				conn.query(`insert into option_test(member_seq) value(${memberRows.insertId})`,function(err,optionRows){
					if(err) console.log(err);
				});
			});
			result.msg = "가입 되었습니다.";
			result.token = "1";
			result.value = "success";
		}else{
			
			result.msg = "중복된 아이디입니다.";
			result.token = "0";
			result.value = "fail";
		}
		res.send(result);
	})

})

// 로그인
app.post("/login",function(req,res){
	var userInfo = req.body;

	var userId = userInfo.userId;
	var userPw = userInfo.userPw;

	conn.query(`SELECT count(*) as userCheck FROM mysite.member where userId ='${userId}' AND userPw = '${userPw}'`,(err,rows)=>{
		if(err) console.log(err);

		var result = {};
		// 로그인
		if( rows[0].userCheck == 1 ){
			result.msg = "로그인 되었습니다.";
			result.token = "1";
			result.value = "success";

			// 로그인 기록 #
			conn.query(`insert into login_log(userId, loginTime) value('${userId}', now());`,(err,rows)=>{
				if(err) console.log(err);
			})
		}else{
			result.msg = "로그인 실패";
			result.token = "0";
			result.value = "fail";
		}
	
		res.send(result);
	})
})

app.post("/push",function(req,res){
	// var result = req.body.msg;
	res.send(req.body);
})

// ajax test
app.post("/ajaxTest",function(req,res){
	res.send(req.body);
})

app.use("/",function(req,res){
	res.render('home',{});
});

var server = app.listen(8080, function(){
	console.log('connect');
});