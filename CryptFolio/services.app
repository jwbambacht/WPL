module services

service users() {
	var array := JSONArray();
	
	for(user : User) {
		var obj := JSONObject();
  		obj.put("id", user.id);
  		obj.put("username", user.username);
  		obj.put("email", user.email);
  		array.put(obj);
  	}
  
  	return array;
}

// GET parameters can be provided in the URL with:
// servicename/arg1/arg2 or servicename?param1=arg1&param2=arg2
// test with: curl http://localhost:8080/wpl-demo/getUser/[insert one of the ids]
service getUser( userid: String){
	var user := findUser(userid);
	var obj := JSONObject();
	obj.put("id", user.id);
	obj.put("username", user.username);
	obj.put("email", user.email);
	
	return obj;
}

// POST data can be retrieved using readRequestBody()
// test with: curl -d '{"name":"WebDSL", "number":"42"}' -H "Content-Type: application/json" -X POST http://localhost:8080/wpl-demo/addUser
service addUser(){
  if(getHttpMethod() == "POST" ){
    var body := readRequestBody();
    var obj := JSONObject(body);
    User {
      username := obj.getString("username")
      email := obj.getString("email")
      password := (obj.getString("password") as Secret).digest()
    }.save();
    
    var msgs := JSONArray();
    var msg := JSONObject();
    	msg.put( "message", "ok" );
    	msgs.put( msg );
    return msgs;
  }
}