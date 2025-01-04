class FileUploader {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw error;
    }
  }
}

// مثال على كيفية استخدام المكتبة
const fileInput = document.querySelector('#fileInput');
const h1 = document.querySelector('h1');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const uploader = new FileUploader('/upload'); // تأكد من أن endpoint صحيح

  try {
    h1.textContent = 'File uploading...';
    const fileUrl = await uploader.uploadFile(file, (progress) => {
      h1.textContent = `File uploading... ${progress}%`;
    });
    h1.innerHTML = `File uploaded: <br/><br/><a href="${fileUrl}" target="_blank">${fileUrl}</a>`;
  } catch (error) {
    h1.textContent = `Please try another file: ${error.message}`;
  }
});