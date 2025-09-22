import appointment_img from "./appointment_img.png";
import header_img from "./header_img.jpg";
import group_profiles from "./group_profiles.jpg";
import profile_pic from "./profile_pic.jpg";
import contact_image from "./contact_image.jpg";
import about_image from "./about_image.avif";
import logo from "./logo.png";
import dropdown_icon from "./dropdown_icon.png";
import menu_icon from "./menu_icon.jpg";
import cross_icon from "./cross_icon.jpg";
import chats_icon from "./chats_icon.jpg";
import verified_icon from "./verified_icon.png";
import arrow_icon from "./arrow_icon.jpg";
import info_icon from "./info_icon.jpg";
import upload_icon from "./upload_icon.jpg";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";

// Pet Images
import pet1 from "./pet1.jpg";
import pet2 from "./pet2.jpg";
import pet3 from "./pet3.jpg";
import pet4 from "./pet4.jpg";
import pet5 from "./pet5.jpg";
import pet6 from "./pet6.jpg";
import pet7 from "./pet7.jpg";
import pet8 from "./pet8.jpg";
import pet9 from "./pet9.jpg";
import pet10 from "./pet10.jpg";
import pet11 from "./pet11.jpg";
import pet12 from "./pet12.jpg";
import pet13 from "./pet13.jpg";
import pet14 from "./pet14.jpg";
import pet15 from "./pet15.jpg";

// Pet Category Icons
import Dogs from "./Dogs.jpg";
import Cats from "./Cats.jpg";
import Birds from "./Birds.jpg";
import Rabbits from "./Rabbits.jpg";
import Fish from "./Fish.jpg";
import Others from "./Others.jpg";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  profile_pic,
  contact_image,
  about_image,
  logo,
  dropdown_icon,
  menu_icon,
  cross_icon,
  chats_icon,
  verified_icon,
  arrow_icon,
  info_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
  pet1,
  pet2,
  pet3,
  pet4,
  pet5,
  pet6,
  pet7,
  pet8,
  pet9,
  pet10,
  pet11,
  pet12,
  pet13,
  pet14,
  pet15,
  Dogs,
  Cats,
  Birds,
  Rabbits,
  Fish,
  Others,
};

// Pet Category Data
export const specialityData = [
  {
    speciality: "Dogs",
    image: Dogs,
  },
  {
    speciality: "Cats",
    image: Cats,
  },
  {
    speciality: "Birds",
    image: Birds,
  },
  {
    speciality: "Rabbits",
    image: Rabbits,
  },
  {
    speciality: "Fish",
    image: Fish,
  },
  {
    speciality: "Others",
    image: Others,
  },
];

// Sample Pet Data for Development
export const pets = [
  {
    _id: "pet1",
    name: "Buddy",
    image: pet1,
    breed: "Dogs",
    age: "2 Years",
    gender: "Male",
    about:
      "Buddy is a friendly Golden Retriever who loves playing fetch and going on walks. He is great with children and other pets.",
    fees: 500,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet2",
    name: "Whiskers",
    image: pet2,
    breed: "Cats",
    age: "1 Year",
    gender: "Female",
    about:
      "Whiskers is a gentle Persian cat who loves to cuddle and purr. She is perfect for a quiet home environment.",
    fees: 300,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet3",
    name: "Tweety",
    image: pet3,
    breed: "Birds",
    age: "6 Months",
    gender: "Male",
    about:
      "Tweety is a beautiful canary with a lovely singing voice. He brings joy and music to any home.",
    fees: 200,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet4",
    name: "Snowball",
    image: pet4,
    breed: "Rabbits",
    age: "1 Year",
    gender: "Female",
    about:
      "Snowball is an adorable Holland Lop rabbit who is very gentle and loves fresh vegetables.",
    fees: 400,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet5",
    name: "Goldie",
    image: pet5,
    breed: "Fish",
    age: "3 Months",
    gender: "Unknown",
    about:
      "Goldie is a beautiful goldfish that will be a perfect addition to your aquarium.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet6",
    name: "Max",
    image: pet6,
    breed: "Dogs",
    age: "3 Years",
    gender: "Male",
    about:
      "Max is a loyal German Shepherd who is great with kids and makes an excellent guard dog.",
    fees: 600,
    address: {
      line1: "67th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet7",
    name: "Luna",
    image: pet7,
    breed: "Cats",
    age: "2 Years",
    gender: "Female",
    about:
      "Luna is a playful Siamese cat with beautiful blue eyes who loves interactive toys.",
    fees: 350,
    address: {
      line1: "77th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet8",
    name: "Rio",
    image: pet8,
    breed: "Birds",
    age: "1 Year",
    gender: "Male",
    about:
      "Rio is a colorful parrot who can learn to talk and loves social interaction.",
    fees: 800,
    address: {
      line1: "87th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet9",
    name: "Cocoa",
    image: pet9,
    breed: "Rabbits",
    age: "8 Months",
    gender: "Female",
    about:
      "Cocoa is a sweet Mini Lop rabbit with soft brown fur who loves to hop around.",
    fees: 300,
    address: {
      line1: "97th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
  {
    _id: "pet10",
    name: "Nemo",
    image: pet10,
    breed: "Fish",
    age: "4 Months",
    gender: "Male",
    about:
      "Nemo is an adorable clownfish that is perfect for marine aquarium enthusiasts.",
    fees: 80,
    address: {
      line1: "107th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
    available: true,
  },
];
