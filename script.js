class Application
{
	constructor()
	{
		this.box = $('.register-box');
		this.card = this.box.find('.card');
		this.cardBody = this.card.find('.card-body');
		this.tokenUrl = 'http://middle.micro.local/v1/oauth/token';
		this.registerUrl = 'http://middle.micro.local/v1/oauth/test';
		this.grantType = ['client_credentials','password'];
		this.credentials = [
			[1,'42eVt5P40Hgx2rcPVkfNVhS50I1l8nlGKnzkNew2'], //client credentials : grantType[0]
			[2,'8qgXtIZ8dSh1TzcG23TP2VbD3yQLpBeVOY8xQ0kx'] //password : grantType[1]
		];
		this.events();
		this.token = null;
		this.loader = "<p class='loader text-center'><img src='loader.gif' /></p>";
		this.regForm = `<form role="form">
						<div class="form-group">
							<label for="email">
								Email
							</label>
							<input type="email" class="form-control" id="email" />
							<span class='text-danger email-error'></span>
						</div>

						<div class="form-group">
							<label for="phone">
								Phone
							</label>
							<input type="text" class="form-control" id="phone" />
							<span class='text-danger phone-error'></span>
						</div>
						<button type="button" class="btn btn-primary reg-btn" onclick='$application.registration();' id='regBtn'>
							Submit
						</button>
					</form>`;
		this.clientError = `<div class='text-center'>
								<h4>UnAuthorize</h4>
								<p>Invalid Client</p>
							</div>`			
	}


	// events
	events()
	{
		$(document).ready(this.getToken.bind(this));
		// this.regBtn.on('click','.card',this.registration.bind(this));

	}

	// methods

	getToken()
	{
		this.toggleLoader(1);
		axios.post(this.tokenUrl, {
		    client_id : this.credentials[0][0],
			client_secret : this.credentials[0][1],
			grant_type : this.grantType[0]
		  })
		  .then((response) => {
		    console.log(response);
		    if (response.status == 200 && response.statusText=='OK') {
			    this.toggleLoader(0);
			    this.token = response.data.access_token;
			    this.cardBody.html(this.regForm);
			    this.regBtn = this.cardBody.find('#regBtn');
		    }

		  })
		  .catch((error) => {
		    console.log(error.response);
		    this.toggleLoader(0);
		    this.cardBody.html(`
					<div class='text-center'>
						<h4>${error.response.statusText}</h4>
						<p>${error.response.data.message}</p>
					</div>
		    	`);
		  });
	}

	registration()
	{
		if (!this.token) {

			this.cardBody.html(this.clientError);

		} else {
			let emailVal = email.value;
			let phoneVal = phone.value;
			let isOk = true;
			this.cardBody.find('.email-error').html('');
			this.cardBody.find('.phone-error').html('');
			if (!this.validateEmail(email)) {
				this.cardBody.find('.email-error').html('Please Enter valid email address');
				isOk = false;
			} 

			if (phoneVal.length < Application.PHONE_LENGTH) {
				this.cardBody.find('.phone-error').html('Please Enter valid phone number');
				isOk = false;
			}

			if (isOk) {

				window.axios.defaults.headers.common = {
				  'X-Requested-With': 'XMLHttpRequest'
				};

				let headers = {
		            'Content-Type' :'application/x-www-form-urlencoded',
		            'Authorization': 'Bearer '+this.token 
		        };

				axios.post(this.registerUrl, {
				    phone:phoneVal,
				    email:emailVal
				  }, headers)
				  .then((response) => {
				    console.log(response);
				    if (response.status == 200 && response.statusText=='OK') {
					   console.log(response);
				    }

				  })
				  .catch((error) => {
				    console.log(error.response);
				    this.toggleLoader(0);
				    this.cardBody.html(`
							<div class='text-center'>
								<h4>${error.response.statusText}</h4>
								<p>${error.response.data}</p>
							</div>
				    	`);
				  });
			}
	
		}
		return false;
	}

	toggleLoader(status)
	{
		status ? this.cardBody.html(this.loader) : this.card.find('.card-body .loader').remove();  
	}

	static get PHONE_LENGTH()
	{
		return 10;
	}

	validateEmail(email)
	{
		let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(email.value.match(mailformat))
		{
			// document.form1.text1.focus();
			return true;
		}
		
	}
}

$application = new Application();

