import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopPets from "../components/TopPets";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopPets />
      <Banner />
    </div>
  );
};

export default Home;
