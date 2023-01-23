import { useState, useRef, useEffect } from "react";
import "./index.css";
import Navbar from "../Navbar";
import StarRating from "./rating";
import Card from "./card";
import Comment from "./editor";
import { BiUserCircle } from "react-icons/bi";
import sanityClient from "../../client";

export default function Discussion() {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [count, setCount] = useState(3);
  const [rating, setRating] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const commentRef = useRef();
  const [data, setData] = useState(null);
  const ClickHandler = (e) => {
    e.preventDefault();
    if (name === "" || commentRef === "" || rating === 0) {
      window.alert("Enter the credentials");
    } else {
      fetch(
        `https://kh2kvctg.api.sanity.io/v2021-06-07/data/mutate/production`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer skkHdZTqupKswDvAF8nPWuL5dMVPMFaKTm3VpPvCSEGFu9QQn8yJskr4mJCoBEHr08dXkIIVylHTZ98oZA5hAawMJANrd3vePdRKDMKq3ovHCFkcza7Rx6N60f9Ift3fkACBqwh5shATCH7R42oVCdRWKOA1k8CAM8p6HdNS9lCugxWwPppJ`,
          },
          body: JSON.stringify({
            mutations: [
              {
                create: {
                  name,
                  content: commentRef.current.innerHTML.replace(imageUrl, ""),
                  rating,
                  _type: "Comment",
                },
              },
            ],
          }),
        }
      )
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
      setName("");
      setCount(count + 1);
      commentRef.current.innerHTML = "";
      setImageUrl();
      // const commentAdd = data.unshift({
      //   name,
      //   content: commentRef.current.innerHTML.replace(imageUrl, ""),
      //   rating,
      //   // _type: "Comment",
      // });
      setData([...data, {
        name,
          content: commentRef.current.innerHTML.replace(imageUrl, ""),
          rating,
          _type: "Comment",
      }]);
    }
  };
  const NameChangeHandler = (e) => {
    setName(e.target.value);
  };
  const CommentChangeHandler = (e) => {
    const target = e.currentTarget;
    const value = target.innerText;
    console.log("🚀 ~ file: index.jsx:74 ~ CommentChangeHandler ~ value", value)
    const length = value.length;

    if (length === 0) {
      setImageUrl("");
    }
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    const urlInComment = value.match(urlRegex);
    console.log("🚀 ~ file: index.jsx:83 ~ CommentChangeHandler ~ urlInComment", urlInComment)
    
    if (urlInComment) {
      setImageList((previous)=>[urlInComment])
    }
      // if (value.search(urlRegex) === 1) {
      //   const url = value.replace(urlRegex, function (url) {
      //     return '<a href="' + url + '">' + url + "</a>";
      //   });
      //   commentRef.current.innerText = url;
      // } else {
      //   setImageUrl();
      // }
      setImageUrl(value?.match(urlRegex));
    // setEndOfContenteditable();
  };

  const Delete = (id) => {
    fetch(`https://kh2kvctg.api.sanity.io/v2021-06-07/data/mutate/production`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer skkHdZTqupKswDvAF8nPWuL5dMVPMFaKTm3VpPvCSEGFu9QQn8yJskr4mJCoBEHr08dXkIIVylHTZ98oZA5hAawMJANrd3vePdRKDMKq3ovHCFkcza7Rx6N60f9Ift3fkACBqwh5shATCH7R42oVCdRWKOA1k8CAM8p6HdNS9lCugxWwPppJ`,
      },
      body: JSON.stringify({
        mutations: [
          {
            delete: {
              id: id,
            },
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    let removeData = [...data];
    console.log(data);
    removeData.splice(id, 1);
    setData(removeData);
  };
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "Comment"]{
      _id,
      name,
      content,
      rating,
      hexCode,
    }`
      )
      .then((data) => setData(data))
      .catch(console.error);
  }, []);
  return (
    <>
      <Navbar />
      <div className="discussion">
        <div className="right">
          <div className="discuss">JOB DISQUS</div>

          <form className="comment-form">
            <div className="input-group">
              <div className="comment-name">
                <div className="line"> {count} Comments</div>
                <div className="icon-name">
                  <div className="user-icon">
                    <BiUserCircle />
                  </div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="form-control"
                    value={name}
                    onChange={NameChangeHandler}
                  />
                </div>
              </div>
            </div>
            <div className="star-rating">
              <div className="rating-text">You rated this </div>
              <StarRating onChange={setRating} />
            </div>
            <div className="input-group">
              <div
                type="text"
                className="form-control comment"
                contentEditable="true"
                data-placeholder="Join the discussion...."
                value={comment}
                onInput={CommentChangeHandler}
                ref={commentRef}
              />
              <div className="icon-button">
                <Comment onUrlChange={setImageUrl} commentRef={commentRef} />

                <button className="submit" onClick={ClickHandler}>
                  Comment
                </button>
              </div>
              <div className="only-image">
                <img
                  src={imageList[0]}
                  className={`${
                    imageUrl ? "image-text-editor" : "images-text-editor"
                  }`}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="comment-section">
        <div className="comment-box">
          {data &&
            data.map((dat) => {
              // console.log(dat);
              return (
                <Card
                  key={dat._id}
                  value={dat}
                  onDelete={() => Delete(dat._id)}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
