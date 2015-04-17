function doGet(e) {
  var bookId = e.parameter.bookId;
  
  if (bookId == null) {
    //Handle deprecated param - Will be removed in future
    bookId = e.parameter.ledgerId;
  }
  var query = e.parameter.query;
  
  try {
    var book = BkperApp.openById(bookId);    
    var file = createFile_(book, query);
    var textOutput = ContentService.createTextOutput(file.content);
    return textOutput.downloadAsFile(file.name);
  } catch (error) {
    //If error is caused by user not authorized in the app, start auth flow with BkperApp auth service
    if (!BkperApp.isUserAuthorized()) {
      var continueUri = ScriptApp.getService().getUrl() + "?"+ e.queryString;
      var continueText = "Continue CSV Export";
      var authorizationHtml = BkperApp.getAuthorizationHtml(continueUri, continueText);
      return HtmlService.createHtmlOutput(authorizationHtml).setTitle("Authorize Google Apps");
    } else {
      return HtmlService.createHtmlOutput(error);
    }
  }
}

function createFile_(book, query) {
  var dataArray = new Array();
  var builder = book.createTransactionsDataTable(query);
  
  builder.formatValue(true);
  builder.formatDate(true);
  
  dataArray = builder.build();
  
  var bookName = book.getName();
  var filename = "";
  filename = "bkper_" + normalizeName_(bookName) + ".csv";
  
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

//Normalize the book name to use as filename
function normalizeName_(name) {
  var escapedName =   name.replace(/ /g, '-').replace(/"/g, '').replace(/'/g, '').replace(/\//g, "-").replace(/:/g, '_').replace(/\+/g, '_plus_');
  escapedName = BkperApp.normalizeName(escapedName);
  escapedName = escapedName.replace(/\$/g, 'S');
  return escapedName;
}