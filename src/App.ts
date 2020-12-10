function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {

  //@ts-ignore
  var bookId = e.parameter.bookId;
  
  if (bookId == null) {
    //Handle deprecated param - Will be removed in future
    //@ts-ignore
    bookId = e.parameter.ledgerId;
  }
  //@ts-ignore
  var query = e.parameter.query;
  
  var book = BkperApp.getBook(bookId);    
  var file = createFile_(book, query);
  var textOutput = ContentService.createTextOutput(file.content);
  return textOutput.downloadAsFile(file.name);
}

function createFile_(book: Bkper.Book, query: string) {
  var dataArray = new Array();
  var builder = book.createTransactionsDataTable(query);
  
  builder.formatValues(true);
  builder.formatDates(true);
  
  dataArray = builder.build();
  
  var filename = "";
  filename = "bkper_" + Date.now() + ".csv";
  
  var file = {
    name: filename,
    content: twoDimensionArrayToCSV_(dataArray)
  }
  return file;
}

function twoDimensionArrayToCSV_(array: any[][]) {
  var content = "";
  for (var i = 0; i < array.length; i++) {
    var line = array[i];
    for (var j = 0; j < line.length; j++) {
      var cell = ""+ line[j];
      var cell = cell.split(";").join("");
      content += cell;
      if (j < (line.length -1)) {
        content += ";";
      }
    }
    if (i < (array.length -1)) {
      content += "\r\n";
    }
  }
  return content;
}
