import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlogCategory extends Document {
  @Prop()
  title: string;
  @Prop()
  content: string;
  @Prop()
  image: string;
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  url: string;
}

export const blogCategorySchema = SchemaFactory.createForClass(BlogCategory);
