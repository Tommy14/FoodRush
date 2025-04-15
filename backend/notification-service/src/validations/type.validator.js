export function validateOrderPlaced(data) {
    const errors = {};
  
    if (!data.customerName) errors.customerName = 'Customer name is required';
    if (!data.restaurantName) errors.restaurantName = 'Restaurant name is required';
    if (!data.orderId) errors.orderId = 'Order ID is required';
    // if (!data.estimatedTime) errors.estimatedTime = 'Estimated time is required';
    if (!data.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
  
    return errors;
  }
  
  export function validateOrderDelivered(data) {
    const errors = {};
  
    if (!data.customerName) errors.customerName = 'Customer name is required';
    if (!data.restaurantName) errors.restaurantName = 'Restaurant name is required';
    if (!data.orderId) errors.orderId = 'Order ID is required';
    if (!data.total) errors.total = 'Total amount is required';
    if (!data.paymentMethod) errors.paymentMethod = 'Payment method is required';
    if (!data.orderDateTime) errors.orderDateTime = 'Order date/time is required';
    if (!data.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    if (!data.deliveryPerson) errors.deliveryPerson = 'Delivery person is required';
  
    return errors;
  }
  
  export function validateUserAccountCreated(data) {
    const errors = {};
  
    if (!data.name) errors.name = 'User name is required';
    if (!data.email) errors.email = 'User email is required';
    if (!data.createdAt) errors.createdAt = 'Account creation date is required';
    if (!data.role) errors.role = 'User role is required';
  
    return errors;
  }
  