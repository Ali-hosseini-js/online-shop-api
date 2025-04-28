import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ImagesPipe implements PipeTransform {
  async transform(files: Array<Express.Multer.File>) {
    const sizeValidator = new MaxFileSizeValidator({
      maxSize: 20000000,
    });
    console.log(files);

    const typeValidator = new FileTypeValidator({
      fileType: /(image\/jpeg|image\/png|image\/jpg|image\/webp)/,
    });
    for (const image of files) {
      if (!sizeValidator.isValid(image)) {
        throw new BadRequestException(`${image.originalname} is too large`);
      }

      if (!(await typeValidator.isValid(image))) {
        throw new BadRequestException(`${image.mimetype} is not acceptable`);
      }
    }
    return files;
  }
}
