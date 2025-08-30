"use client"

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { adminEditUsers, fetchUnverifiedUsers, selectUnverfiedUsers } from '@/lib/store/slices/admin.reducer';


const GeneralTraffic = () => {
  const listings = [
    { id: 1, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 2, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 3, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 4, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 5, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 6, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 7, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 8, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 9, owner: 'Eduviere Israel', city: 'Ikeja' },
    { id: 10, owner: 'Eduviere Israel', city: 'Ikeja' },
  ];

  const dispatch = useAppDispatch();
  const unVerifiedUsers = useAppSelector(selectUnverfiedUsers);

    
  useEffect(() => {
    // if(!uploadedListings.length > 0){
      dispatch(fetchUnverifiedUsers())
    // }
  }, []);

  const verifyUser = (user) => {
    const verifiedUser = {
      ...user,
      verified: true
    }
    dispatch(adminEditUsers(verifiedUser))
  }





  return (
    <div className="general-traffic">
      <h2>KYC</h2>
      <p>All Users awaiting verification</p>
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>House Owner</th>
            <th>Email</th>
            <th>Document</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {unVerifiedUsers?.map((user, i) => (
            <tr key={user.id}>
              <td>{i + 1}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>

              <td>
                <a target='_blank' href={user.NIN.url}>View document</a>
              </td>
              <td>
                <button onClick={() => verifyUser(user)} className="verify-button">Verify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralTraffic;
