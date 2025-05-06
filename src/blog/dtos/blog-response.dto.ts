export class BlogResponseDto {
  _id: any;
  title: string;
  url: string;
  image: string;
  category: {
    _id: any;
    title: string;
  };
}
