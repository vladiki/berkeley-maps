/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/

/* Repurposed by Vlad Karchevsky to include a parser for .ics files */

(function() {


	var sched_info; 
	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {


		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		if (files){


			// process all File objects
			for (var i = 0, f; f = files[i]; i++) {
				ParseFile(f);
			}
		}else{
			alert("Failed to load file");
		}

	}


	// output file information
	function ParseFile(file) {

		// display an image
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong><br />" +
					'<img src="' + e.target.result + '" /></p>'
				);
			}
			reader.readAsDataURL(file);
		}

		// display text
		if (file.type.indexOf("text") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var contents = e.target.result;
				sched_info = ParseForInfo(e);
				splitByDays(sched_info);
				Output(
					"<p><strong>" + file.name + ":</strong></p><pre>" +
					e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
					"</pre>"+ "<pre>"+contents.substr(0, contents.indexOf("END:VCALENDAR"))+"</pre>"
				);

			}
			reader.readAsText(file);
		}

	}

	//seperates out the classes into objects. 
	function ParseForInfo(f){
		var contents = f.target.result;
		var i = 0;
		var schedule_table = {};
		while(contents.indexOf("BEGIN:VEVENT") != -1){
			sample = contents.substring(contents.indexOf("BEGIN:VEVENT"), contents.indexOf("END:VEVENT"));
			if(sample.indexOf("LOCATION") == -1){

				contents = contents.substr(contents.indexOf("END:VEVENT")+10);
				continue;
			}
			// alert(sample);
			
			sample = sample.substr(sample.indexOf("BEGIN:VEVENT")+12);
			var uid = sample.substring(sample.indexOf("UID:")+4, sample.indexOf("@ninja"));
			sample = sample.substr(sample.indexOf("DTSTART:")+8);
			var start_time = sample.substring(sample.indexOf("T")+1, sample.indexOf("\n")); //grab raw UTC time


			sample = sample.substr(sample.indexOf("DTEND:")+6);
			var end_time = sample.substring(sample.indexOf("T")+1, sample.indexOf("\n"));
			sample = sample.substr(sample.indexOf("LOCATION")+8);
			var location = sample.substring(sample.indexOf(":")+1, sample.indexOf("\n"));
			location = location.replace(/[0-9]/g, '');
			location = location.replace(/\s/g,'');

			location = location.toString();

			sample = sample.substr(sample.indexOf("BYDAY")+5);
			var days = sample.substring(sample.indexOf("=")+1, sample.indexOf(";"));
			contents = contents.substr(contents.indexOf("END:VEVENT")+10);

			schedule_table[uid]=[start_time,end_time,location,days];
			
		}
		return schedule_table;
	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();