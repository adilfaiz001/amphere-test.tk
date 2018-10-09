
exports.ValidatePhone = (user) => {    
    return new Promise((resolve,reject)=>{
        if(user !== "")
        {
            const request = new XMLHttpRequest();
            const url = `user=${encodeURI(user)}&` +
                        `verify=false`;

            request.open('POST',`/validatePhone?${url}`,true);
            request.send();

            request.onreadystatechange = (event) => {
                if(request.readyState === 4 && request.status === 200)
                {
                    let response = JSON.parse(request.reponse);
                    console.log(response);
                    if(response.state === 'SUCCESS')
                    {
                        resolve({
                            'valid':true,
                            user
                        });
                    }
                    else
                    {
                        resolve({
                            'valid':false
                        });
                    }
                }
            }
        }
    });
}