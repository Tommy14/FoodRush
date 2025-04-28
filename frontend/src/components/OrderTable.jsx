import { useState, Fragment, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Snackbar, Alert, Box, Typography,
  Tooltip, LinearProgress, Stack, useMediaQuery, useTheme, Button
} from "@mui/material";
import { ExpandMore, ExpandLess, Restaurant, DoneAll, FilterList, History, ClearAll } from "@mui/icons-material";
import { getOrdersByRestaurant, updateOrderStatus } from '../services/orderService';

const statusMap = {
  placed: { value: 25, label: "Placed", color: "#f59e0b" }, // amber
  preparing: { value: 75, label: "Preparing", color: "#8b5cf6" }, // violet
  ready_for_delivery: { value: 100, label: "Ready", color: "#22c55e" }, // green
  delivered: { value: 100, label: "Delivered", color: "#16a34a" } // darker green
};

export default function OrdersTable({ restaurantId, onBack }) {
  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [filterStatus, setFilterStatus] = useState("current");  // 'current' | 'delivered' | null
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAction = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      setSnackbar({ open: true, message: `Order marked as ${newStatus.replace(/_/g, ' ')}`, severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update status', severity: 'error' });
    }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByRestaurant(restaurantId);
        setOrders(data.orders);
      } catch (err) {
        setSnackbar({ open: true, message: 'Could not load orders.', severity: 'error' });
      }
    };
    fetchOrders();
  }, [restaurantId]);

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "current") return ["placed", "preparing", "ready_for_delivery"].includes(order.status);
    if (filterStatus === "delivered") return order.status === "delivered";
    return true;
  });

  return (
    <Box className="flex-1 p-4 sm:p-6 mt-16">
      {/* Header */}
      <Box className="flex items-center justify-between mb-4">
        <Button variant="outlined" onClick={onBack} sx={{ borderColor: "#4caf50", color: "#4caf50", "&:hover": { backgroundColor: "#4caf50", color: "white" } }}>← Back</Button>
        <Typography variant="h5" className="font-semibold text-gray-700">Orders</Typography>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button variant={filterStatus === "current" ? "contained" : "outlined"} startIcon={<FilterList />} sx={{ borderRadius: 3 }} onClick={() => setFilterStatus("current")}>Current Orders</Button>
        <Button variant={filterStatus === "delivered" ? "contained" : "outlined"} startIcon={<History />} sx={{ borderRadius: 3 }} onClick={() => setFilterStatus("delivered")}>Past Orders</Button>
        <Button variant={!filterStatus ? "contained" : "outlined"} startIcon={<ClearAll />} sx={{ borderRadius: 3 }} onClick={() => setFilterStatus(null)}>Clear Filter</Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0fdf4" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }} align="center">Actions</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#166534" }} align="center">Expand</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.map(order => {
              const status = statusMap[order.status] || {};
              return (
                <Fragment key={order._id}>
                  <TableRow sx={{ backgroundColor: "#fff", borderRadius: 3, "&:hover": { backgroundColor: "#f9f9f9" }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <TableCell sx={{ borderBottom: "none" }}><Typography fontWeight="bold">{order.customerEmail}</Typography></TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>{order._id}</TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>LKR {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Box className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold`} style={{ backgroundColor: status.color, color: "white" }}>{status.label}</span>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} align="center">
                      <Stack direction={isMobile ? "column" : "row"} spacing={1} justifyContent="center" alignItems="center">
                        {order.status === "placed" && (
                          <Tooltip title="Start Preparing">
                            <IconButton sx={{ backgroundColor: "#2196f3", color: "white" }} onClick={() => handleAction(order._id, "preparing")}><Restaurant fontSize="small" /></IconButton>
                          </Tooltip>
                        )}
                        {order.status === "preparing" && (
                          <Tooltip title="Mark as Ready">
                            <IconButton sx={{ backgroundColor: "#4caf50", color: "white" }} onClick={() => handleAction(order._id, "ready_for_delivery")}><DoneAll fontSize="small" /></IconButton>
                          </Tooltip>
                        )}
                        {order.status === "ready_for_delivery" && (
                          <Typography variant="body2" color="success.main" fontWeight="bold">Ready</Typography>
                        )}
                        {order.status === "delivered" && (
                          <Typography variant="body2" color="success.main" fontWeight="bold">Delivered</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} align="center">
                      <IconButton onClick={() => toggleExpand(order._id)}>{expandedRow === order._id ? <ExpandLess /> : <ExpandMore />}</IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#f9f9f9" }}>
                      <Collapse in={expandedRow === order._id} timeout="auto" unmountOnExit>
                        <Box margin={2} className="bg-gray-50 rounded-md p-4">
                          <Typography variant="subtitle1" fontWeight="bold">Order Items</Typography>
                          <ul className="list-disc pl-5 text-sm text-gray-700">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item.quantity} x {item.name}</li>
                            ))}
                          </ul>
                          <Typography variant="body2" className="mt-2 text-gray-600">Payment: {order.paymentMethod}</Typography>
                          <Typography variant="body2" className="text-gray-600">Delivery Address: {order.deliveryAddress}</Typography>
                          <Typography variant="body2" className="text-gray-600">Placed At: {new Date(order.placedAt).toLocaleString()}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
