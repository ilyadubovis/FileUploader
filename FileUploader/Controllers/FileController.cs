using System;
using System.IO;
using System.Threading.Tasks;
using FileUploader.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileUploader.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string _fileFolder;
        public FileController(IWebHostEnvironment hostEnvironment)
        {
            if (hostEnvironment != null)
            {
                _fileFolder = Path.Combine(hostEnvironment.ContentRootPath, "assets", "files");
                Directory.CreateDirectory(_fileFolder);
            }
        }

        [HttpPost("Upload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<int>> UploadFileChunk([FromForm] FileChunk fileChunk)
        {
            try
            {
                var filePath = Path.Combine(_fileFolder, fileChunk.Chunk.FileName);
                // if this is the 1st chunk -> delete existing file
                if (fileChunk.Index == 0 && System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
                var buffer = new byte[fileChunk.Chunk.Length];
                var dataSize = await fileChunk.Chunk.OpenReadStream().ReadAsync(buffer);
                using (var stream = System.IO.File.OpenWrite(filePath))
                {
                    stream.Seek(0, SeekOrigin.End);
                    await stream.WriteAsync(buffer, 0, dataSize);
                    await stream.FlushAsync();
                }
                return Ok(dataSize);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
