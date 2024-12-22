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
        console.log("companythread-------------",companythread);
        setCompanyThread(companythread);
      }
    } catch (error) { }
  }

  useEffect(() => {
    // Set an interval to fetch company threads periodically
    const intervalId = setInterval(() => {
      getCompanyThread(setCompanyThread);
    }, 5000); // Adjust the interval as needed (e.g., 5000 ms = 5 seconds)

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); //
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
  const groupThreadsByParentId = (threads) => {
    const threadMap = {};
  
    // Create a map of all threads by their IDs
    const allThreads = threads.reduce((map, thread) => {
      // Logging the thread data to check the structure
      console.log('Thread:', thread);
      console.log('Thread ID:', thread.companyThread.id);
      console.log('Parent ID:', thread.companyThread.parentId);
  
      map[thread.companyThread.id] = { ...thread, replies: [] };
      return map;
    }, {});
  
    // Iterate over all threads and organize replies
    threads.forEach((thread) => {
      const { parentId, id } = thread.companyThread; // Access parentId and id from companyThread
  
      // Log parentId and id for debugging
      console.log('Checking thread:', thread.companyThread);
      console.log('parentId:', parentId);
      console.log('id:', id);
  
      if (parentId) {
        // If thread has a parentId, add it as a reply to the parent
        if (allThreads[parentId]) {
          console.log(`Adding thread ${id} as a reply to parent ${parentId}`);
          allThreads[parentId].replies.push(allThreads[id]);
        } else {
          console.warn(`Parent thread with id ${parentId} not found for thread ${id}`);
        }
      }
    });
  
    // Return only the standalone threads (threads with no parentId)
    const standaloneThreads = Object.values(allThreads).filter(
      (thread) => thread.companyThread.parentId === null
    );
  
    // Sort threads by creation date (assuming 'createdAt' is the field you want to sort by)
    standaloneThreads.sort((a, b) => new Date(b.companyThread.createdAt) - new Date(a.companyThread.createdAt));
  
    console.log('Standalone Threads:', standaloneThreads); // Check the final result
  
    return standaloneThreads;
  };
  
  
  
  const groupedThreads = groupThreadsByParentId(companyThread);
  
  console.log("groupedThreads-------", groupedThreads);
  
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
      <AddComment threadData={null} buttonValue={"Post"} addComments={addComments} />
{
  companyThread.length > 0 &&
  <>
   {groupedThreads.map((thread) => (
        <Comment key={thread.companyThread.id} threadData={thread} />
      ))}
  </>

}
     
    </div>
  );
};

export default ThreadPage;
