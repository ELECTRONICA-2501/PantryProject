'use client'
import {Box, Typography} from '@mui/material'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'




export default function Home() {
  return(  
    <Box>
      <Typography variant="h1">Inventory Management</Typography>
    </Box>     
  )
}
