import * as sharp from 'sharp';
import { mkdirp } from 'mkdirp'; // Note the named import
import * as path from 'path';
import * as fs from 'fs';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { UploadFilesDto } from '../dtos/upload-files.dto';

export const saveImage = async (
  file: Express.Multer.File,
  body: UploadFileDto,
) => {
  const folder = body.folder || '';
  const destination = path.join(process.cwd(), 'files', folder);
  const fileName =
    new Date().toISOString().replace(/[:.]/g, '-') +
    file.originalname.split('.')[0] +
    '.webp';

  // Create directory (using the new mkdirp API)
  await mkdirp(destination + '/main');
  await mkdirp(destination + '/resized');

  const mainImagePath = path.join(destination, 'main', fileName);
  await sharp(file.buffer).webp().toFile(mainImagePath);

  const resizeImagePath = path.join(destination, 'resized', fileName);
  await sharp(file.buffer)
    .webp()
    .resize({ width: body.width || 200, height: body.height || 200 })
    .toFile(resizeImagePath);

  return {
    fileName,
  };
};

export const saveImages = async (
  files: Array<Express.Multer.File>,
  body: UploadFilesDto,
) => {
  const folder = body.folder || '';
  const destination = path.join(process.cwd(), 'files', folder);

  await mkdirp(destination + '/main');
  await mkdirp(destination + '/resized');

  const fileNames: string[] = [];
  for (const file of files) {
    const fileName =
      new Date().toISOString().replace(/[:.]/g, '-') +
      file.originalname.split('.')[0] +
      '.webp';

    const mainImagePath = path.join(destination, 'main', fileName);
    await sharp(file.buffer).webp().toFile(mainImagePath);

    const resizeImagePath = path.join(destination, 'resized', fileName);
    await sharp(file.buffer)
      .webp()
      .resize({ width: body.width || 200, height: body.height || 200 })
      .toFile(resizeImagePath);

    fileNames.push(fileName);
  }

  return {
    fileNames,
  };
};

export const deleteImage = async (fileName: string, folder: string = '') => {
  const imagePath = 'files/' + folder;
  try {
    await fs.promises.unlink(`${imagePath}/main/${fileName}`);
    await fs.promises.unlink(`${imagePath}/resize/${fileName}`);
  } catch (error) {
    console.log(error);
  }
};
