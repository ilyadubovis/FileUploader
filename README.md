# FileUploader
Client-server application to upload large files sliced into chunks.

## Building blocks
Back-end: .NET Core 3.1;\
Front-end: JavaScript/JQuery/AngularJS/Material;

## Description
The client app lets select a file, service URL, and a file chunk size (in bytes).\
Then it slices the file content (BLOB) into chunks of a selected size and sends chunks in iterations (as a part of FormData) to the service via HTTP POST request.\
The service reads a chunk, appends it to the destination file and returns the number of bytes written.\
After each iteration, the clien displays how many bytes have been uploaded.\
In case of error, the client app displays it.
