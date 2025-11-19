import path from 'path';
import fs from 'fs/promises';

/**
 * Removes old files from a directory, keeping only the most recent X files
 * Files are sorted by modification time (oldest first), and older files are deleted
 * @param filePath - Directory path containing the files
 * @param X - Number of recent files to keep
 * @throws Error if directory operations fail
 */
export async function removeMoreThan_X(filePath: string, X: number): Promise<void> {
  try {
    // Read all files in directory
    const files = await fs.readdir(filePath);

    if (files.length <= X) {
      console.log(`Directory has ${files.length} files, keeping ${X}. No deletion needed.`);
      return;
    }

    // Get file stats with modification times
    const filesWithStats = await Promise.all(
      files.map(async (file: string) => ({
        file,
        mtime: (await fs.stat(path.join(filePath, file))).mtime.getTime(),
      }))
    );

    // Sort by modification time (oldest first) and select files to delete
    const filesToDelete = filesWithStats
      .sort((a, b) => a.mtime - b.mtime)
      .slice(0, Math.max(0, files.length - X))
      .map((item) => item.file);

    // Delete old files
    await Promise.all(
      filesToDelete.map((file: string) => {
        const fullPath = path.join(filePath, file);
        console.log(`Deleting old file: ${file}`);
        return fs.unlink(fullPath);
      })
    );

    console.log(`Successfully deleted ${filesToDelete.length} old files from ${filePath}`);
  } catch (error: any) {
    console.error('Dosya silme hatası:', error);
    throw new Error(`Eski dosyalar silinemedi: ${error.message}`);
  }
}

export default { removeMoreThan_X };
