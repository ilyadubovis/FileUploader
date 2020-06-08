using Microsoft.AspNetCore.Http;

namespace FileUploader.Models
{
    public class FileChunk
    {
        public IFormFile Chunk { get; set; }
        public int Index { get; set; }
    }
}
