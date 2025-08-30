"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  saveVideo,
  selectVideos,
  deleteVideo,
  selectPrimaryImage,
  clearPrimaryImage,
  updatePrimaryImage,
  selectVideoLoading,
} from "@/lib/store/slices/listingUpload.reducer";

const VideoInput = () => {
  const dispatch = useAppDispatch();
  const video = useAppSelector(selectVideos);
  const primaryImage = useAppSelector(selectPrimaryImage);
  const loading = useAppSelector(selectVideoLoading);

  const [imageUpload, setImageUpload] = useState(null);

  // useEffect(() => {
  //   console.log(imageUpload)
  // }, [imageUpload])

  const handleImageUpload = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    console.log(file);

    const result = await dispatch(saveVideo(file));


  };

  const handleDeleteImage = (path) => {
    dispatch(deleteVideo(path));
  };

  const handleSetPrimaryImage = (path) => {
    dispatch(updatePrimaryImage(path));

    if (primaryImage === path) {
      dispatch(clearPrimaryImage());
    }
  };

  return (
    <div className="image-input" onClick={() => console.log(loading)} >
      {video && (
        <div className="vid-cont">
          <div className="image">
            <div className="img-div">
              {/* <video
                controls
                autoPlay
                width="100%"
                style={{ borderRadius: "12px" }}
              >
                <source src={video?.url} type="video/mp4" />
              </video> */}
              <video
                src={video?.url}
                controls
                width="100%"
                // style={{ borderRadius: "12px", backgroundColor: "#000" }}
              />
            </div>
            <div className="controls">
              {/* <button onClick={() => handleSetPrimaryImage(image.fullPath)} style={{ backgroundColor:  primaryImage === image.fullPath?  "#000" : '#fff', color: primaryImage === image.fullPath?  "#fff" : "#000" }} >  Primary image</button> */}
              <button
                className="delete"
                onClick={() => handleDeleteImage(video?.fullPath)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {!video && (
        <div className="add-img-card">
          <img src="/add-img.svg" alt="" />
          {/* <span>Add Photos</span> */}
          <div className="input"  >
            <label htmlFor="video">
              {loading && <span className="spinner"></span>}
              Add video
              <input
                id="video"
                accept="video/*"
                type="file"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInput;

