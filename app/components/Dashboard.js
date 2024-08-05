"use client";

import { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { AuthContext } from "../contexts/AuthContext";
import {
  Box,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Remove, Search, Sort, Clear } from "@mui/icons-material";
import { firestore } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const updateInventory = async () => {
    if (user) {
      const inventoryRef = collection(
        firestore,
        "users",
        user.uid,
        "inventory"
      );
      const invQuery = query(inventoryRef);
      const inventorySnap = await getDocs(invQuery);
      const inv = inventorySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(inv);
      setFilteredInventory(inv);
    }
  };

  const addItem = async (item, newQuantity) => {
    if (user) {
      const inventoryRef = doc(
        collection(firestore, "users", user.uid, "inventory"),
        item
      );
      const inventorySnap = await getDoc(inventoryRef);
      if (inventorySnap.exists()) {
        const { quantity } = inventorySnap.data();
        await setDoc(inventoryRef, {
          name: item,
          quantity: quantity + newQuantity,
        });
      } else {
        await setDoc(inventoryRef, { name: item, quantity: newQuantity });
      }
      await updateInventory();
    }
  };

  const updateItemQuantity = async (item, delta) => {
    if (user) {
      const inventoryRef = doc(
        collection(firestore, "users", user.uid, "inventory"),
        item
      );
      const inventorySnap = await getDoc(inventoryRef);
      if (inventorySnap.exists()) {
        const { quantity } = inventorySnap.data();
        const newQuantity = quantity + delta;
        if (newQuantity <= 0) {
          await deleteDoc(inventoryRef);
        } else {
          await setDoc(inventoryRef, { name: item, quantity: newQuantity });
        }
      }
      await updateInventory();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredInventory(inventory);
  };

  const handleSort = (type) => {
    let sorted;
    switch (type) {
      case "quantityDesc":
        sorted = [...filteredInventory].sort((a, b) => b.quantity - a.quantity);
        break;
      case "quantityAsc":
        sorted = [...filteredInventory].sort((a, b) => a.quantity - b.quantity);
        break;
      case "alphabetical":
        sorted = [...filteredInventory].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      default:
        sorted = filteredInventory;
    }
    setFilteredInventory(sorted);
    setAnchorEl(null);
  };

  useEffect(() => {
    updateInventory();
  }, [user]);

  return (
    <div>
      <Header />
      <Box
        width="100%"
        padding={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Item
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          maxWidth="800px"
          mb={2}
        >
          <Box width="80%" position="relative">
            <TextField
              fullWidth
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              InputProps={{
                style: { height: "56px", paddingRight: "100px" },
              }}
            />
            <Box
              position="absolute"
              right="0"
              top="0"
              height="100%"
              display="flex"
              alignItems="center"
              pr={1}
            >
              {searchTerm && (
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Clear />
                </IconButton>
              )}
              <IconButton
                onClick={handleSearch}
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Search />
              </IconButton>
            </Box>
          </Box>
          <Box width="18%" ml={2}>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={<Sort />}
              style={{ height: "56px" }}
            >
              Sort
            </Button>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSort("quantityDesc")}>
            Quantity (High to Low)
          </MenuItem>
          <MenuItem onClick={() => handleSort("quantityAsc")}>
            Quantity (Low to High)
          </MenuItem>
          <MenuItem onClick={() => handleSort("alphabetical")}>
            Alphabetical
          </MenuItem>
        </Menu>

        <TableContainer
          component={Paper}
          sx={{ maxWidth: 800, maxHeight: 400 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => updateItemQuantity(item.id, 1)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          borderRadius: "4px",
                        },
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      onClick={() => updateItemQuantity(item.id, -1)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          borderRadius: "4px",
                        },
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <Remove />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value, 10))}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, itemQuantity);
                setItemName("");
                setItemQuantity(0);
                handleClose();
              }}
            >
              Add Item
            </Button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}
