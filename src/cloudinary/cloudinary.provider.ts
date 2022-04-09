import { Provider } from '@nestjs/common';
import * as CloudinaryLib from 'cloudinary';

export const Cloudinary = 'lib:cloudinary';

export const CloudinaryProvider: Provider = {
  provide: Cloudinary,
  useFactory: () => {
    return CloudinaryLib.v2.config({
      cloud_name: 'dzkewxe2v',
      api_key: '335177668663129',
      api_secret: 'i-8zhI9fU4BYQXo8v95mH2hNjsk'
    })
  }
}