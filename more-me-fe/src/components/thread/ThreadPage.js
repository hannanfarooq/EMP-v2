import React, { useState, useEffect } from "react";
import "./Components/Styles/App.scss";
import Comment from "./Components/Comment";
import AddComment from "./Components/AddComment";
import { Divider, Stack, Typography } from "@mui/material";
import PostsSort from "./Components/PostsSort";
import { GetCompaniesAllThread, markAllThreadsAsViewed } from "src/api";
import { socket } from "src/App";

const ThreadPage = () => {
  const [companyThread, setCompanyThread] = useState([]);
  const [groupedThreads, setGroupedThreads] = useState([]);

  async function getCompanyThread() {
    try {
      const companythread = await GetCompaniesAllThread();
      if (companythread) {
        console.log("Fetched Company Threads:", companythread);
        setCompanyThread(companythread); // Update companyThread
      }
    } catch (error) {
      console.error("Failed to fetch company threads:", error);
    }
  }

  // Group threads by parentId whenever companyThread changes
  useEffect(() => {
    setGroupedThreads(groupThreadsByParentId(companyThread));
  }, [companyThread]); // Dependency array ensures this runs when companyThread changes

  // Fetch threads periodically
  useEffect(() => {
  
    getCompanyThread(); // Initial fetch
   
    
    socket.on('fetchthreads', (data) => {
         if (data) {
       
         
          getCompanyThread();
       
         }
       });
  
  

  
  }, []);

  useEffect(()=>
  {
    markAllThreadsAsViewed();
  },[companyThread])

  const groupThreadsByParentId = (threads) => {
    const getLatestActivity = (thread) => {
      let latest = new Date(thread.companyThread.createdAt).getTime();
      thread.replies.forEach(reply => {
        latest = Math.max(latest, getLatestActivity(reply));
      });
      return latest;
    };

    const allThreads = threads.reduce((map, thread) => {
      map[thread.companyThread.id] = { ...thread, replies: [] };
      return map;
    }, {});

    threads.forEach((thread) => {
      const { parentId, id } = thread.companyThread;
      if (parentId) {
        if (allThreads[parentId]) {
          allThreads[parentId].replies.push(allThreads[id]);
        } else {
          console.warn(`Parent thread with id ${parentId} not found for thread ${id}`);
        }
      }
    });

    const standaloneThreads = Object.values(allThreads).filter(
      (thread) => thread.companyThread.parentId === null
    );

    standaloneThreads.sort((a, b) => {
      const latestA = getLatestActivity(a);
      const latestB = getLatestActivity(b);
      return latestB - latestA; // Descending order
    });

    standaloneThreads.forEach(thread => {
      thread.replies.sort((a, b) => new Date(b.companyThread.createdAt) - new Date(a.companyThread.createdAt));
    });

    return standaloneThreads;
  };
console.log("groupedThreads : ",groupedThreads);
  return (
    <div className="App">
      <AddComment buttonValue={"Post"} />
      {groupedThreads.length > 0 ? (
        groupedThreads.map((thread) => (
          <Comment key={thread.companyThread.id} threadData={thread} />
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          No-threads-available
         
        </Typography>
      )}
    </div>
  );
};

export default ThreadPage;
