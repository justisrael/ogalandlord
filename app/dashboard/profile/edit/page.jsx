"use client";

import React, {useState, useEffect} from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { selectCurrentUser, updateUserThunk, selectUpdateError, selectUpdateLoading, clearUpdateError, setUpdateLoading } from "@/lib/store/slices/user.reducer";
import { useRouter } from "next/navigation";
import { deleteOldAndSaveNew, saveImageToStorage } from "@/lib/firebase/firebase.utils";
import { ToastContainer, toast } from "react-toastify";


const EditProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentUser = useAppSelector(selectCurrentUser);
  const updateError = useAppSelector(selectUpdateError);
  const updateLoading = useAppSelector(selectUpdateLoading);

  const { photoURL, contactName, contactEmail, fullName, phoneNumber, bussinessCert, NIN, email } =
    currentUser;

    const [profilePhoto, setProfilePhoto] = useState({
      url: ""
    });

    const [NINUpload, setNINUpload] = useState(null)
    const [cert, setCert] = useState(null)
    const [phone, setPhone] = useState("")
    const [displayName, setDisplayName] = useState("");
    const [contactEmailEdit, setContactEmail] = useState("");

    const handleImageUpdate = async (e) => {
      try {
        const newFile = e.target.files[0]
        const oldPath = photoURL.fullPath? photoURL.fullPath : ''; // The path of the old image you want to delete
        const imageUrl = URL.createObjectURL(newFile);
    
        // const newImageData = await deleteOldAndSaveNew(oldPath, newFile);
        // console.log('New image data:', newImageData);
        console.log(imageUrl)
        setProfilePhoto({file: newFile, url: imageUrl});
      } catch (error) {
        console.error('Failed to update image:', error);
      }
    };

    

  useEffect(() => {
    if ( photoURL?.url?.trim() !== '') {
      setProfilePhoto(prev => ({...prev,...photoURL, url: photoURL.url}));
    }
  }, [photoURL]);
    

  useEffect(() => {
    if (NIN) {
      setNINUpload({...NIN})
      // console.log(NIN)
    }
  }, [NIN]);

  useEffect(() => {
    if (bussinessCert) {
      setCert({...bussinessCert})
    }
  }, [bussinessCert]);

  useEffect(() => {
    if (phoneNumber) {
      setPhone(phoneNumber)
    }
  }, [phoneNumber]);

  useEffect(() => {
    // if (contactEmail) {
    //   setContactEmail(contactEmail);
    //   return
    // }

    if(!contactEmailEdit){
      if(contactEmail){
        setContactEmail(contactEmail);
      } else{
        setContactEmail(email);

      }
      return
    }
  }, [contactEmail, email, contactEmailEdit]);
  
  useEffect(() => {
    if (contactName) {
      setDisplayName(contactName);
      return
    }

    if(fullName){
      setDisplayName(fullName);
    }
  }, [contactName, fullName]);


  // useEffect(() => {
  //   if (updateError) {
  //     if(updateError === "success"){
  //       toast.success("Profile updated successfully!");

  //       // router.push('/dashboard/profile');
      
  //     } else{

  //       toast.error(updateError);
  //     }
  //   }
  // }, [updateError])

  useEffect(() => {

    const timeOut = setTimeout(() => {
      if(updateError){
        if(updateError === "success"){
          dispatch(clearUpdateError());
          router.push('/dashboard/profile');
        } else{
          dispatch(clearUpdateError());
        }
      }
      dispatch(clearUpdateError());
     
    }, 3000)

    return () => clearTimeout(timeOut)
    
  },[dispatch, router, updateError])

  const handleNinUpload = (e) => {
    setNINUpload(e.target.files[0])
    console.log("file uploaded", e.target.files[0])
  }

  const handleCertUpload = (e) => {
    setCert(e.target.files[0])
    console.log("file uploaded", e.target.files[0])
  }

  const handlePhone = (e) => {
    setPhone(e.target.value)
    console.log(e.target.value)

  }

  const handleContactEmail = (e) => {
    setContactEmail(e.target.value);
    console.log(e.target.value)
  };
  
  const handleDisplayName = (e) => {
    setDisplayName(e.target.value);
    console.log(e.target.value)
  };

  const handleSubmit = async() => {
    console.log("starting")

    if (!NINUpload?.name) {
      toast.error("NIN upload is required.");
      return;
    }
    dispatch(setUpdateLoading(true))

    const nigerianPhoneRegex = /^(080|081|070|071|090|091)\d{8}$/;

    if (!nigerianPhoneRegex.test(phone)) {
      toast.error("Add a valid phone number.");
      return ;
    }

    const oldImage = photoURL?.fullPath

    const newImageData = profilePhoto?.file? await deleteOldAndSaveNew(oldImage, profilePhoto.file) : null;
    const uploadedNIN = NIN?.name? NIN : await saveImageToStorage(NINUpload)
    const uploadedCert = bussinessCert?.name? bussinessCert : await saveImageToStorage(cert)

    
    try{
      const updatedUser = {
        ...currentUser,
        photoURL: newImageData ? newImageData : currentUser.photoURL,
        contactName: displayName ? displayName : currentUser.fullName,
        contactEmail: contactEmailEdit ? contactEmailEdit : currentUser.contactEmail,
        phoneNumber: phone,
        bussinessCert: uploadedCert,
        NIN: uploadedNIN,
        verified: currentUser.verified? currentUser.verified : false,
      };
      console.log(updatedUser)

      dispatch(updateUserThunk(updatedUser))
    } catch(e){
      console.log(e.message)
    }

  }

  return (
    <div className="profile-container-edit">
      <div className="intro">
        <h2>My Profile</h2>
        <p>Your personal Information</p>
      </div>
      <div className="add-img-card">
        {!photoURL ? (
          <div className="profile-avatar"  >
            <img src="/user-icon.svg" alt="" />
          </div>
        ) : (
          <div className="user-profile-button" 
          style={{
            backgroundImage: profilePhoto ? `url(${profilePhoto.url})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          >
            {/* <img className="user-img" src={profilePhoto.url} alt="" /> */}
          </div>
        )}
        {/* <span>Add Photos</span> */}
        <div className="input">
          <label htmlFor="images">
            {false && <span className="spinner"></span>}
            Upload
            <input multiple id="images" type="file" onChange={handleImageUpdate} />
          </label>
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" value={fullName} disabled />
        </div>
        <div className="input-group">
          <label>Display Name</label>
          <input  type="text" onChange={handleDisplayName} value={displayName} />
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label>Phone Number</label>
          <input type="text" onChange={handlePhone}  value={phone} />
        </div>
        <div className="input-group">
          <label>Contact Email</label>
          <input type="text" onChange={handleContactEmail} value={contactEmailEdit} />
        </div>
      </div>

      <div className="input-row">
        <label htmlFor="cert" className="">
          <span>Business Certificate (e.g CAC, SMEDAN)</span>
          <div className="file-input">
           { !cert?.name && <input onChange={handleCertUpload} type="file" id="cert" />}
           { cert?.name && <p>{cert?.name}</p>}
            <span className="file-status">{ cert?.name?  'Uploaded' : "Upload"}</span>
          </div>
        </label>
        <label htmlFor="NIN" className="">
          <span>*National Identification Number (NIN)</span>
          <div className="file-input">
           { !NINUpload?.name && <input onChange={handleNinUpload} type="file" id="NIN"  />}
           { NINUpload?.name && <p>{NINUpload?.name}</p>}
            <span className="file-status">{ NINUpload?.name?  'Uploaded' : "Upload"}</span>
          </div>
        </label>
      </div>

      <div className="action-buttons">
        <button className="cancel-btn" onClick={() => {
          router.push("/dashboard/profile")
        }} >Cancel</button>
        <button className="save-btn" onClick={handleSubmit}  >{ updateLoading? <span className="spinner" ></span> : "Save Changes"}</button>
      </div>
      <ToastContainer />

    </div>
  );
};

export default EditProfile;
