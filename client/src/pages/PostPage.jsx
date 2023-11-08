import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CommentCard from "../components/CommentCard";
import Header from "../components/Header";

export default function PostPage() {
  const [postData, setPostData] = useState({});
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = require.context("../assets/BG", true);
  const imageList = images.keys().map((image) => images(image));
  const [imageElements, setImageElements] = useState([]);
  const pathname = useLocation().pathname.slice(1);
  const apiGetPostData =
    process.env.REACT_APP_API_LINK + "/postUrl/" + pathname;
  const apiGetCommentData = process.env.REACT_APP_API_LINK + "/allComments/";
  const apiNewCommentPost = process.env.REACT_APP_API_LINK + "/createComment";

  const getPostData = () => {
    fetch(apiGetPostData, {
      method: "get",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostData(data.results);
        getCommentsData(data.results.post_id);
      });
  };

  const getCommentsData = (post_id) => {
    fetch(apiGetCommentData + post_id, {
      method: "get",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.results);
      });
  };

  useEffect(() => {
    getPostData();
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
  }, []);

  const AllComments = () => {
    const arrComments = [];
    for (let i = 0; i < comments.length; i++) {
      arrComments.push(<CommentCard postData={comments[i]} key={i} />);
    }
    return arrComments;
  };

  function handleNewCommentSubmit(event) {
    event.preventDefault();
    if (newComment.trim() !== "") {
      const newCommentData = {
        content: newComment,
        post_id: postData.post_id,
      };
      fetch(apiNewCommentPost, {
        method: "post",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            window.alert(data.errorMessage);
          } else {
            window.location.reload(false);
          }
        });

      setNewComment("");
    }
  }

  return (
    <div>
      <Header />

      <div
        className="bg-repeat bg-[image:var(--image-url)] min-h-screen"
        style={{
          "--image-url": `url(${imageList[currentImageIndex]})`,
        }}
      >
        <div className="p-3 px-10">
          <div className="">
            <div className="border-funny-yellow p-3 px-10 border-8 rounded-lg bg-black">
              <div className="pl-5 text-funny-grey">
                <div className="text-4xl pr-5 pt-5 pb-2 text-funny-red">
                  {postData.title}
                </div>
                <div className="pb-5 text-funny-rose">
                  Posted by: {postData.username}
                </div>

                <div className="text-xl pb-5"> {postData.content}</div>
              </div>
            </div>
          </div>

          <div className="py-10">
            <div className="font-semibold text-xl border-8 p-5 border-funny-yellow rounded-lg bg-black text-funny-red">
              Comment Section
              <div className="pt-5">
                <form onSubmit={handleNewCommentSubmit}>
                  <textarea
                    className="border border-black resize text-black focus:border-funny-blue"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>

                  <div className="pt-5">
                    <button
                      type="submit"
                      className=" text-lg p-2 border hover:bg-funny-green text-funny-grey font-semibold rounded-lg"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="border-8 p-5 border-funny-yellow rounded-lg bg-black text-funny-grey">
            <AllComments />
          </div>
        </div>
      </div>
    </div>
  );
}
