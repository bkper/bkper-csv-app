import { Bkper, Transaction } from "bkper-js";
import { Result } from "./index.js";

export class EventHandlerFileCreated {

    async handleEvent(event: bkper.Event): Promise<Result> {
        if (event.bookId && event.data) {
            const book = await Bkper.getBook(event.bookId);
            if (event.data.object) {
                const fileEventObj: bkper.File = event.data.object;
                if (fileEventObj.id) {
                    const file = await book.getFile(fileEventObj.id);
                    const fileContentBase64 = await file.getContent();
                    if (fileContentBase64) {
                        const fileContentUtf8 = Buffer.from(fileContentBase64, 'base64').toString('utf-8');
                        if (fileContentUtf8) {
                            const lines = fileContentUtf8.split('\n')
                            let transactions: Transaction[] = [];
                            for (let i = 1; i < lines.length; i++) {
                                const line = lines[i];
                                const description = line.split(';').map(e => e.split(',')).join(' ');
                                const transaction = book.newTransaction().setDescription(description);
                                transactions.push(transaction);
                            }
                            await book.batchCreateTransactions(transactions);

                            return { result: `Recorded ${transactions.length} transaction(s).` }
                        }
                    }
                }
            }
        }
        return { result: false };
    }

}