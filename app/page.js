'use client'
import { AppBar, Toolbar, Typography, Box, Modal, Stack, TextField, Button} from '@mui/material';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, getDocs, getDoc, query, setDoc, doc, deleteDoc } from 'firebase/firestore';



const Navbar = () => {
  return (
    <AppBar position="static" sx ={{bgcolor:'#1E90FF'}}>
      <Toolbar>
      <Box
          display="flex"
          justifyContent="center"
          width="100%"
        >
        <Typography variant="h6" component="div" sx={{ color: '#FFFFFF' }}> 
          Inventory Management
        </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(true);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Add items
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // Delete items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" sx={{ bgcolor: '#87CEFA'}} >
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexGrow={1}
        
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <Typography variant="h5">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={3}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Button
                variant="outlined"
                sx={{ bgcolor: '#1E90FF', color: '#FFFFFF' }}
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
        >
          Add New Item
        </Button>
        <Box borderRadius="8px"  >
          <Box
            width="800px"
            height="100px"
            bgcolor="#ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="8px"  
          >
            <Typography variant='h2' color="#333" sx={{ fontFamily: 'Arial, sans-serif' }}>
              Inventory Items
            </Typography>
          </Box>        
          <Stack width="800px" height="300px"  overflow="auto" spacing ={0.5} > 
            {inventory.map(({name, quantity}) => (
              <Box
                key={name}
                width="100%"
                minHeight="90px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={3}                
                borderRadius="8px"  
              >
                <Typography variant="h3" color="#333" textAlign="center" sx={{ fontFamily: 'Courier New, monospace', textAlign: 'center' }} >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#333" textAlign="center" display = "flex" flexDirection = "column" sx={{ fontFamily: 'Courier New, monospace'}} >
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={() => {
                    addItem(name);
                  }}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name);
                  }}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
