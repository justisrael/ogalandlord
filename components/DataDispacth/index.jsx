"use client"

import React, {useEffect} from 'react';
import { selectAllListings, setAllListings } from '@/lib/store/slices/listings.reducer';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';

const DataDispatch = ({data}) => {

  const dispatch = useAppDispatch()
  const allListings = useAppSelector(selectAllListings)

    useEffect(() => {
      dispatch(setAllListings(data))
   
      }, [data, dispatch])
  return (
    <></>
  )
}

export default DataDispatch