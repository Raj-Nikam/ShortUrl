# ShortUrl

Short url converts your long urls into shortened urls.

Clone the repo into your local machine.
Navigate to the main directory that is tinyurl and in terminal do 'npm install'.
Once above command is executed we can start our server with 'npm run dev' command.

API Endpoints -

1. Create short Url (Post Call - https://shorturl-qvu2.onrender.com/url/shorten)  pass 'longUrl' into body. eg. { 'longUrl' : 'http://www.xyz.com'}
2. Get shortened Url (Get Call - https://shorturl-qvu2.onrender.com/:shortId) . Once we hit above url we will be redirected to original url.

