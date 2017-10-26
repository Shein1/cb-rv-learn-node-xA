const moment = require ('moment');
const colors = require ('colors')

let date = moment().format('MMMM D, YYYY h:mm A');

module.exports = {

	info: function(string) {
		console.log(`[${date}] INFO :: ${string}`.blue);
	},

	error: function(string) {
		console.log(`[${date}] ERR :: ${string} doesn't exist`.red);
	}

}
