# FileUploader
Client-server application to upload large files sliced into chunks.

## Building blocks
Back-end: FileUploader service (.NET Core 3.1);\
Front-end: FileUploaderClient (JavaScript/JQuery/AngularJS/Material);

## Description
The client app lets select a file, service URL, and a file chunk size (in bytes).\
Then it slices the file content (BLOB) into chunks of a specified size and sends chunks in iterations (as a part of FormData) to the service via HTTP POST request.\
The service reads a chunk, appends it to the destination file (in the folder <service_content_root>/assets/files) and returns the number of bytes written.\
After each iteration, the client app displays how many bytes have been uploaded.\
In case of an error, the client app displays it.
