BkperApp.setApiKey(PropertiesService.getScriptProperties().getProperty('API_KEY'));

/**
 * Event handler for files created on Books.
 */
function onFileCreated(event: bkper.Event) {
  let book = BkperApp.getBook(event.bookId);
  let fileEventObj: bkper.File = event.data.object
  let file = book.getFile(fileEventObj.id);
  let csv = file.getBlob().getDataAsString();
  let lines = csv.split('\n')
  let transactions: Bkper.Transaction[] = [];
  lines.forEach(line => {
    var description = line.split(';').map(e => e.split(',')).join(' ');
    let transaction = book.newTransaction().setDescription(description);
    transactions.push(transaction)
  })
  book.batchCreateTransactions(transactions);
}
