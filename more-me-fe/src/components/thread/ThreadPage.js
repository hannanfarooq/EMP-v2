import React, { useState, useEffect } from "react";
import "./Components/Styles/App.scss";
import Comment from "./Components/Comment";
import AddComment from "./Components/AddComment";
import { Divider, Stack, Typography } from "@mui/material";
import PostsSort from "./Components/PostsSort";
import { GetCompaniesAllThread } from "src/api";

const ThreadPage = () => {
  const [comments, updateComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [companyThread, setCompanyThread] = useState([]);

  async function getCompanyThread(setCompanyThread) {
    try {
      const companythread = await GetCompaniesAllThread();
      if (companythread) {
        setCompanyThread(companythread);
      }
    } catch (error) { }
  }

  useEffect(() => {
    getCompanyThread(setCompanyThread);
  }, [comments?.length]);

  const getData = async () => {
    const res = await fetch("/assets/postsData.json");
    const data = await res.json();
    updateComments(data.comments);
  };

  useEffect(() => {
    localStorage.getItem("comments") !== null
      ? updateComments(JSON.parse(localStorage.getItem("comments")))
      : getData();
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  // update score
  let updateScore = (score, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
          }
        });
      });
    }
    updateComments(updatedComments);
  };

  // add comments
  let addComments = (newComment) => {
    let updatedComments = [...comments, newComment];
    updateComments(updatedComments);
  };

  // add replies
  let updateReplies = (replies, id) => {
    let updatedComments = [...comments];
    updatedComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    updateComments(updatedComments);
  };

  // edit comment
  let editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    updateComments(updatedComments);
  };



  return (
    <div className="App">
      <Stack
        // direction="row"
        // alignItems="center"
        // justifyContent="space-between"
        mb={0}
        className="mr-auto w-full"
      >
        {/* <div className="flex justify-between">
          <Typography variant="h4" gutterBottom>
            Threads
          </Typography>
          <PostsSort />
        </div>
        <Divider className="mt-0 mb-4" sx={{ borderBottomWidth: "3px" }} /> */}
      </Stack>
      <AddComment buttonValue={"Post"} addComments={addComments} />
{
  companyThread.length > 0 &&
  <>
   {companyThread.map((thread) => (
        <Comment key={thread.companyThread.id} threadData={thread} />
      ))}
  </>

}
     
    </div>
  );
};

export default ThreadPage;
