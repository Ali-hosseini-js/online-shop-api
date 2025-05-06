export class ProductResponseDto {
  _id: any;
  title: string;
  url: string;
  category: {
    _id: any;
    title: string;
  };
}
