export interface BestDealsInterface {
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
}

export interface FeaturedInterface {
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
}

export const FeaturedProducts: FeaturedInterface[] = [
  {
    title: 'Drive in Style',
    description:
      'Explore our diverse selection of high-quality cars, from luxurious sedans to powerful SUVs, designed to meet every lifestyle and budget. Discover the perfect ride with advanced features and exceptional performance.',
    image:
      'https://res.cloudinary.com/do88ukbjg/image/upload/v1740432370/Young_Boy_s_Casual_Turn-Down_Collar_Color_Block_Short_Sleeve_Polo_Shirt_With_Front_Zipper-removebg-preview_wljaky.png',
    category: 'cars',
    url: '/products'
  },
  {
    title: 'Unleash the Thrill',
    description: `Rev up your ride with our range of motorcycles, featuring top brands and models for every type of rider. Whether you're a cruiser, sportbike enthusiast, or off-road adventurer, we have the perfect bike for you.`,
    image:
      'https://res.cloudinary.com/do88ukbjg/image/upload/v1740432707/download-removebg-preview_q0vp5t.png',
    category: 'motorcycles',
    url: '/products'
  },
  {
    title: 'Power Up Your Life',
    description:
      'Upgrade your tech with our collection of cutting-edge computers. From high-performance desktops to sleek laptops, find the perfect device to boost your productivity, gaming experience, and creative projects.',
    image:
      'https://res.cloudinary.com/do88ukbjg/image/upload/v1740432370/__BONUS_DROP__A_limited_quantity_of_the_Italia_SPZL_from_the__cp_company_official_x_adidas_Spezial_collaboration_will_be_releasing____Instagram-removebg-preview_lpoheg.png',
    category: 'computers',
    url: '/products'
  },
  {
    title: 'Stay Connected in Style',
    description:
      'Stay connected with our latest smartphones, featuring the newest technology and sleek designs. Whether you need a phone for business, photography, or everyday use, we have the ideal model for you.',
    image:
      'https://res.cloudinary.com/do88ukbjg/image/upload/v1740432370/The_best_things_in_life_are_often_the_least_visible-removebg-preview_se0dgt.png',
    category: 'phones',
    url: '/products'
  }
];
