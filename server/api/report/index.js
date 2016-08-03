var express = require('express');
var Report = require('../../models/report');
var Template_Entity = require('../../models/template_entity');
var Template = require('../../models/template');
var json2csv = require('json2csv');
var fs = require('fs');
var nodemailer = require('nodemailer');
var router = express.Router();



// view reports
router.get('/:category_id', function(req, res, next) {
	
	var p_category = req.params.category_id;
	Report
	.find({ category: p_category })
	.populate('category')
	.exec(function(err, reports_list){
		if(err) return res.status(500).json(err);
		res.json(reports_list);
	});
});


// display report
router.get('/individual/:uid', function(req, res, next) {
	var p_uid = req.params.uid;
	Report
	.findOne({ _id: p_uid })
	.populate('template')
	.exec(function(err, report_data) {
		Template_Entity
		.find({report_id: p_uid})
		.exec(function(err, entity_data){
			var return_json = {};
			return_json.reports_list = report_data;
			return_json.entities_list = entity_data;
			res.status(200).json(return_json);
		});
		
	});
});

// create file of report and send email to the administrator
router.post('/send', function(req, res, next) {
	var p_report_json = req.body.report_json;
	//p_report_json = [{'a':'1', 'b':'2','c':'3'}];

	
	//  convert to csv and save it to /store/[time].csv
	var report_csv = json2csv({ data: p_report_json});
	var save_path = 'store/' + Date.now() + '.csv';
	fs.writeFile(save_path, report_csv, function(err) {
		if(err) throw err;
		console.log('file saved');


		// send email to administrator with report attachment
		var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'SendGrid',
			auth: {
				user: '!!! YOUR SENDGRID USERNAME !!!',
				pass: '!!! YOUR SENDGRID PASSWORD !!!'
			}
		});
		var mailOptions = {
			to: "admin@mail.com",	// replace with real email address
			from: 'report@demo.com',
			subject: 'Monthly Report',
			text: 'Monthly Report',
			attachments: [{'filename': 'report.csv', 'content': report_csv}]
		};
		smtpTransport.sendMail(mailOptions, function(err) {
			if(err)	return res.status(500).json(err);
			return res.status(200).jsonp("Successfully sent report to the administrator");
		});
	});
});

router.post('/create', function(req, res, next) {
	var p_title = req.body.name;
	var p_template = req.body.template;
	var p_category = req.body.category;

	var insert_data;

	insert_data = new Report({
		title: p_title,
		category: p_category,
		template: p_template
	});

	insert_data.save(function(err){
		if(err) return res.status(500).json(err);
		return res.json('report created');
	});

});


// later, delete the template_entity related this report if template changed.
// now,   exists even if the template changed.
router.post('/update', function(req, res, next) {

	var p_title = req.body.name;
	var p_template = req.body.template;
	var p_category = req.body.category;
	var p_uid = req.body.uid;

	Report.findById(p_uid, function (err, report_data){
		if(p_title)
			report_data.title = p_title;
		if(p_template)
			report_data.template = p_template;
		if(p_category)
			report_data.category = p_category;

		report_data.save(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json('update failed');
			}
			//console.log("success");
			return res.status(200).json('update success');
		});
	});

});


router.delete('/', function(req, res, next){
	var p_uid = req.body.uid;

	Report.findById(p_uid, function (err, report_data){
		report_data.remove(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json("failed");
			}
			else{

				// delete related template entities.
				Template_Entity.find({report_id: p_uid}, function(err, entity_data) {
					for(i = 0; i < entity_data.length; i++){
						entity_data[i].remove();
					}
				});
				return res.status(200).json("delete success");
			}
		});
	});
});

module.exports = router;