function doGet(e) {
  var bookId = e.parameter.bookId;
  
  if (bookId == null) {
    //Handle deprecated param - Will be removed in future
    bookId = e.parameter.ledgerId;
  }
  var query = e.parameter.query;
  
  var book = BkperApp.openById(bookId);    
  var file = createFile_(book, query);
  var textOutput = ContentService.createTextOutput(file.content);
  return textOutput.downloadAsFile(file.name);
}

function createFile_(book, query) {
  var dataArray = new Array();
  var builder = book.createTransactionsDataTable(query);
  
  builder.formatValue(true);
  builder.formatDate(true);
  
  dataArray = builder.build();
  
  var bookName = book.getName();
  var filename = "";
  filename = "bkper_" + Date.now() + ".csv";
  
  var file = new Object();
  file.name = filename;
  file.content = twoDimensionArrayToCSV_(dataArray);
  
  return file;
}

function twoDimensionArrayToCSV_(array) {
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
