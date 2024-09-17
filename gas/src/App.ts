function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {

	let bookId = e.parameter.bookId;

	if (bookId == null) {
		//Handle deprecated param - Will be removed in future
		bookId = e.parameter.ledgerId;
	}

	const query = e.parameter.query;

	const book = BkperApp.getBook(bookId);
	const file = createFile_(book, query);
	const textOutput = ContentService.createTextOutput(file.content);
	return textOutput.downloadAsFile(file.name);
}

function createFile_(book: Bkper.Book, query: string) {
	let dataArray = new Array();
	const builder = book.createTransactionsDataTable(query);

	builder.formatValues(true);
	builder.formatDates(true);

	dataArray = builder.build();

	let filename = "";
	filename = "bkper_" + Date.now() + ".csv";

	const file = {
		name: filename,
		content: twoDimensionArrayToCSV_(dataArray)
	}
	return file;
}

function twoDimensionArrayToCSV_(array: any[][]) {
	let content = "";
	for (let i = 0; i < array.length; i++) {
		const line = array[i];
		for (let j = 0; j < line.length; j++) {
			let cell = "" + line[j];
			cell = cell.split(";").join("");
			content += cell;
			if (j < (line.length - 1)) {
				content += ";";
			}
		}
		if (i < (array.length - 1)) {
			content += "\r\n";
		}
	}
	return content;
}
