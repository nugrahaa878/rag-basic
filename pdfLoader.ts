import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function getChunkDocsFromPDF() {
    try {
        const loader = new PDFLoader('src/document_loaders/H27111115.pdf');
        const docs = await loader.load();

        const texSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 30,
        });

        const chunkedDocs = await texSplitter.splitDocuments(docs);

        return chunkedDocs;
    } catch (error) {
        console.error(error);
        throw new Error("pdf load fails");

    }
}