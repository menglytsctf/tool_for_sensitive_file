// Get DOM elements
const fileInput = document.getElementById('fileInput');
const decryptBtn = document.getElementById('decryptBtn');
const statusDiv = document.getElementById('status');

// Enable the decrypt button only when a file is selected
fileInput.addEventListener('change', () => {
  decryptBtn.disabled = !fileInput.files.length;
  statusDiv.textContent = '';
});

// Handle decryption and download
decryptBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    statusDiv.textContent = 'No file selected.';
    return;
  }

  try {
    statusDiv.textContent = 'Decrypting...';
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    for (let i = 0; i < bytes.length - 1; i += 2) {
      [bytes[i], bytes[i + 1]] = [bytes[i + 1], bytes[i]];
    }

    const key = 'mengly';
    const keyBytes = new TextEncoder().encode(key);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] ^= keyBytes[i % keyBytes.length];
    }

    // Step 3: Create and download the decrypted file
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decrypted_' + file.name; // Prepend "decrypted_" to filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    statusDiv.textContent = 'Decryption complete! File saved.';
  } catch (err) {
    statusDiv.textContent = `Error: ${err.message}`;
  }
});