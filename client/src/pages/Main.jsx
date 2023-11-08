import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = require.context("../assets/BG", true);
  const imageList = images.keys().map((image) => images(image));
  const [imageElements, setImageElements] = useState([]);

  const getAllPosts = () => {
    fetch(process.env.REACT_APP_API_LINK + "/allPosts", {
      method: "get",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data.results);
      });
  };

  useEffect(() => {
    getAllPosts();

    // Preload images
    const preloadedImages = imageList.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
    setImageElements(preloadedImages);

    const imageChangeInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 1000);

    return () => clearInterval(imageChangeInterval);
  }, []); // Empty dependency array to run the effect only once

  const AllPosts = () => {
    const arrPosts = [];
    for (let i = 0; i < allPosts.length; i++) {
      arrPosts.push(<PostCard postData={allPosts[i]} key={i} />);
    }
    return arrPosts;
  };

  return (
    <div>
      <div className="">
        <Header />
      </div>
      <div
        className="bg-repeat bg-[image:var(--image-url)] min-h-screen"
        style={{
          "--image-url": `url(${imageList[currentImageIndex]})`,
        }}
      >
        <AllPosts />
      </div>
    </div>
  );
}
