exports.ValidateEmail = (email) => {
    return new Promise((resolve,reject)=>{
        if(email !==""){
            const request = new XMLHttpRequest();
            const url = `email=${encodeURI(email)}&` + 
                        `verify=true`;
            
            request.open('POST',`/validateEmail?${url}`,true);
            request.send();

            request.onreadystatechange = (event) =>{
                if(request.readyState===4 && request.status === 200)
                {
                    let response = JSON.parse(request.response);
                        if(response.state==="SUCCESS")
                        {
                            resolve({
                                "state":true
                            });
                        }
                        else
                        {
                            resolve({
                                "state" : false
                            });
                        }
                    }
                }


        }
    });
}